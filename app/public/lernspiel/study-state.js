const StudyState = {
  normalize(raw) {
    const value = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
    const out = {...value};
    for (const key of ['xp','totalSessions','totalCorrect','totalAnswered','bestStreak']) {
      out[key] = Number.isFinite(value[key]) && value[key] >= 0 ? value[key] : 0;
    }
    for (const key of ['sessions','activeDays','completedLessons','learnedWords']) out[key] = Array.isArray(value[key]) ? value[key] : [];
    for (const key of ['wordStats','lessonScores','lessonPositions']) {
      out[key] = value[key] && typeof value[key] === 'object' && !Array.isArray(value[key]) ? value[key] : {};
    }
    return out;
  },
  dateKey(date = new Date()) {
    return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  },
  summary(data, vocab, lessons) {
    const words = [...new Map(Object.values(vocab).flat().map(w => [w.de,w])).values()];
    const practiced = words.filter(w => {
      const s = data.wordStats[w.de];
      return (s && s.correct+s.wrong > 0) || data.learnedWords.includes(w.de);
    }).length;
    const mastered = words.filter(w => {
      const s = data.wordStats[w.de];
      return s && s.correct >= 5 && s.correct/(s.correct+s.wrong) >= .85;
    }).length;
    const completed = lessons.filter(l => data.completedLessons.includes(l.id)).length;
    const next = lessons.find(l => !data.completedLessons.includes(l.id)) || null;
    return {words:words.length,practiced,mastered,completed,total:lessons.length,next,
      lessonPercent:lessons.length ? Math.round(completed/lessons.length*100) : 0,
      accuracy:data.totalAnswered ? Math.round(data.totalCorrect/data.totalAnswered*100) : null};
  },
  persistRound(data, state, complete = false, now = Date.now()) {
    if (!state.started || state.total === 0) return false;
    const prev = state.persisted || {score:0,correct:0,total:0,complete:false};
    if (prev.total === state.total && prev.score === state.score && (!complete || prev.complete)) return false;
    data.xp += Math.max(0,state.score-prev.score);
    data.totalCorrect += Math.max(0,state.correct-prev.correct);
    data.totalAnswered += Math.max(0,state.total-prev.total);
    data.bestStreak = Math.max(data.bestStreak,state.streak);
    if (complete && !prev.complete) data.totalSessions++;
    if (!state.roundId) state.roundId = `${now}-${Math.random().toString(36).slice(2)}`;
    const entry = {id:state.roundId,date:now,cat:state.mode==='review'?'Repaso':state.cat,
      score:state.score,correct:state.correct,total:state.total,pct:Math.round(state.correct/state.total*100),
      completed:complete || prev.complete};
    data.sessions = [entry,...data.sessions.filter(s => s.id !== state.roundId)].slice(0,50);
    state.persisted = {score:state.score,correct:state.correct,total:state.total,complete:entry.completed};
    return true;
  }
};
