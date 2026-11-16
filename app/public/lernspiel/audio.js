// One playback lifecycle for server audio and the browser's German voice.
const TTS = {
  audio: new Audio(), current: null, queue: [], onSequenceDone: null,
  playing: false, paused: false, generation: 0, cloudEnabled: null,
  speedMode: localStorage.getItem('ttsSpeedMode') || 'normal',
  RATES: { lento: 0.78, normal: 1, nativo: 1.12 },
  cache: new Map(),
  rate() { return this.RATES[this.speedMode] || 1; },
  init() {
    // A sleeping server must never block the browser's own voice indefinitely.
    const controller = new AbortController();
    let timer;
    this.capabilities = Promise.race([
      fetch('/api/tts?capabilities=1', {signal:controller.signal})
        .then(r => r.ok ? r.json() : {enabled:false}).catch(() => ({enabled:false})),
      new Promise(resolve => { timer=setTimeout(() => { controller.abort(); resolve({enabled:false}); },1200); }),
    ]).then(c => { this.cloudEnabled=c.enabled===true; }).finally(() => clearTimeout(timer));
    // Kick off voice discovery before the first click (voices load asynchronously).
    if (window.speechSynthesis) window.speechSynthesis.getVoices();
  },
  setSpeed(mode) {
    if (!this.RATES[mode]) return;
    this.speedMode = mode;
    try { localStorage.setItem('ttsSpeedMode', mode); } catch {}
    this.stop();
    document.querySelectorAll('.rc-speed, .rc-speed-group').forEach(box => {
      box.querySelectorAll('button').forEach(b => b.classList.toggle('active', b.dataset.speed === mode));
    });
  },
  stop() {
    const previous = this.current;
    this.generation++;
    this.current = null; this.queue = []; this.onSequenceDone = null;
    this.playing = false; this.paused = false;
    this.audio.onended = null; this.audio.onerror = null;
    this.audio.pause(); this.audio.removeAttribute('src'); this.audio.load();
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    // Release a button's busy state without advancing a cancelled sequence.
    if (previous?.onEnd) previous.onEnd();
  },
  pause() {
    if (!this.playing || this.paused) return;
    this.paused = true;
    if (this.current?.utterance) window.speechSynthesis.pause();
    else this.audio.pause();
  },
  resume() {
    if (!this.paused) return;
    this.paused = false;
    if (this.current?.utterance) window.speechSynthesis.resume();
    else if (this.current?.engine !== "loading") this.audio.play().catch(() => this.fallbackSpeak(this.current));
  },
  styleFor(text) {
    const words = text.trim().split(/\s+/).length;
    return words <= 3 ? 'word' : words > 25 ? 'passage' : 'sentence';
  },
  ttsUrl(text, rate = this.rate()) {
    return '/api/tts?' + new URLSearchParams({text, rate: String(rate),
      style: this.styleFor(text), speed: this.speedMode, voice: 'ballad'});
  },
  prefetch(text) {
    if (!text || this.cloudEnabled !== true) return;
    const url = this.ttsUrl(text);
    if (this.cache.has(url)) return;
    this.cache.set(url, true);
    if (this.cache.size > 120) this.cache.delete(this.cache.keys().next().value);
    fetch(url, {cache:'force-cache'}).catch(() => {});
  },
  isCurrent(item) { return !!item && this.current === item && item.generation === this.generation; },
  async speakCloud(text, _rate, onEnd) {
    const item = {text, onEnd, generation:this.generation, fallback:false, engine:"loading", rate:_rate === 0.6 ? 0.6 : this.rate()};
    this.current = item; this.playing = true; this.paused = false;
    if (this.cloudEnabled === null) await this.capabilities;
    if (!this.isCurrent(item)) return;
    if (!this.cloudEnabled) { this.fallbackSpeak(item); return; }
    item.engine = 'cloud';
    this.audio.onended = () => this.finish(item);
    this.audio.onerror = () => this.fallbackSpeak(item);
    this.audio.preload = 'auto'; this.audio.src = this.ttsUrl(text, item.rate);
    // The server already synthesizes at the requested speed. Do not apply it twice.
    this.audio.playbackRate = 1;
    try { if (!this.paused) await this.audio.play(); } catch { this.fallbackSpeak(item); }
  },
  fallbackSpeak(item) {
    if (!this.isCurrent(item) || item.fallback) return;
    item.fallback = true; item.engine = "browser";
    this.audio.onended = null; this.audio.onerror = null; this.audio.pause();
    if (!window.speechSynthesis) { this.fail(item); return; }
    // Short utterances avoid Chromium's long-passage speech stalls.
    item.chunks = item.text.match(/[^.!?;\n]+[.!?;]?|[.!?;]/g)?.flatMap(sentence => {
      const words=sentence.trim().split(/\s+/), chunks=[]; let part='';
      for(const word of words) { if(part.length+word.length>180) { chunks.push(part); part=''; } part+=(part?' ':'')+word; }
      if(part) chunks.push(part); return chunks;
    }) || [item.text];
    this.speakBrowserChunk(item);
  },
  speakBrowserChunk(item) {
    if(!this.isCurrent(item)) return;
    const utterance = new SpeechSynthesisUtterance(item.chunks.shift());
    item.utterance = utterance;
    utterance.lang = 'de-DE'; utterance.rate = item.rate; utterance.pitch = 1;
    const voice = getDeVoice();
    if (voice) utterance.voice = voice;
    utterance.onend = () => {
      if(!this.isCurrent(item)) return;
      if(item.chunks.length) this.speakBrowserChunk(item); else this.finish(item);
    };
    utterance.onerror = () => this.fail(item);
    window.speechSynthesis.speak(utterance);
    if (this.paused) window.speechSynthesis.pause();
  },
  finish(item) {
    if (!this.isCurrent(item)) return;
    this.current = null; this.playing = false; this.paused = false;
    if (item.onEnd) item.onEnd();
    if (this.current || this.generation !== item.generation) return;
    if (this.queue.length) {
      const next = this.queue.shift();
      this.speakCloud(next.text, next.rate);
    } else {
      const done = this.onSequenceDone; this.onSequenceDone = null;
      if (done) done();
    }
  },
  fail(item) {
    if (!this.isCurrent(item)) return;
    this.current = null; this.queue = []; this.playing = false; this.paused = false;
    this.onSequenceDone = null;
    if (item.onEnd) item.onEnd();
    let notice = document.getElementById('audioNotice');
    if (!notice) {
      notice = document.createElement('div'); notice.id = 'audioNotice';
      notice.setAttribute('role','alert');
      Object.assign(notice.style,{position:'fixed',bottom:'90px',left:'16px',right:'16px',
        padding:'16px',background:'#292015',color:'#ffe37a',borderRadius:'12px',zIndex:300});
      document.body.appendChild(notice);
    }
    notice.textContent = 'No se pudo reproducir el audio. Comprueba el sonido y que tu navegador tenga una voz alemana instalada; luego vuelve a intentarlo.';
    setTimeout(() => notice.remove(), 10000);
  },
  speak(text, rate, onEnd) { this.stop(); if (text) this.speakCloud(text, rate, onEnd); },
  speakSequence(lines, rate, onDone) {
    this.stop();
    if (!lines?.length) { if (onDone) onDone(); return; }
    this.queue = lines.slice(1).map(text => ({text,rate})); this.onSequenceDone = onDone;
    this.speakCloud(lines[0], rate);
  }
};
TTS.init();
