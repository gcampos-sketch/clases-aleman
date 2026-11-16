import { createFileRoute } from "@tanstack/react-router";

type TtsParams = {
  text: string;
  rate: number;
  voice: string;
  style: "word" | "sentence" | "passage";
  speed: "lento" | "normal" | "nativo";
};

const VOICES = [
  "alloy",
  "ash",
  "ballad",
  "coral",
  "echo",
  "fable",
  "nova",
  "onyx",
  "sage",
  "shimmer",
  "verse",
];

function normalize(input: {
  text?: unknown;
  rate?: unknown;
  voice?: unknown;
  style?: unknown;
  speed?: unknown;
}): TtsParams | null {
  const text = typeof input.text === "string" ? input.text.trim() : "";
  if (!text) return null;

  const rawRate = typeof input.rate === "number" ? input.rate : Number(input.rate);
  const rate = Number.isFinite(rawRate) && rawRate > 0 ? Math.min(Math.max(rawRate, 0.25), 4.0) : 0.85;

  const voice = typeof input.voice === "string" && VOICES.includes(input.voice) ? input.voice : "ballad";
  const style =
    input.style === "word" || input.style === "passage" ? (input.style as TtsParams["style"]) : "sentence";
  const speed =
    input.speed === "lento" || input.speed === "nativo" ? (input.speed as TtsParams["speed"]) : "normal";

  return { text: text.slice(0, 4000), rate, voice, style, speed };
}

function buildInstructions(style: TtsParams["style"], speed: TtsParams["speed"]) {
  const base =
    "Habla como una persona nativa de Alemania (acento estándar de Hochdeutsch), " +
    "con voz cálida, cercana y completamente natural, como en una conversación real grabada. " +
    "Nada de tono robótico ni de locutor de anuncio. " +
    "Usa entonación viva y variada, respiraciones suaves y naturales, micro-pausas reales entre " +
    "grupos de palabras, y ligeras variaciones de ritmo y volumen como haría una persona real. " +
    "Pronuncia con claridad las umlaut (ä, ö, ü), la ß, la 'ch' y la 'r' gutural alemana.";

  const styleHints: Record<TtsParams["style"], string> = {
    word:
      " Es una palabra o frase corta para practicar: dila con calma, muy clara, " +
      "marcando bien el artículo y la sílaba tónica, con un tono amable y alentador de profesor cercano.",
    sentence:
      " Es una frase de práctica: dila con ritmo conversacional relajado, " +
      "como si se lo contaras a un amigo, con una pequeña respiración al inicio.",
    passage:
      " Es una lectura larga: narra con calidez y buen fraseo, respirando entre oraciones, " +
      "bajando la entonación al final de cada idea y variando el ritmo para que no suene monótono.",
  };

  const speedHints: Record<TtsParams["speed"], string> = {
    lento:
      " Habla algo más despacio de lo normal, articulando cada palabra con claridad " +
      "para que un estudiante pueda seguirte, pero sin sonar artificial ni silabeado.",
    normal: " Habla al ritmo natural de una conversación tranquila entre adultos alemanes.",
    nativo:
      " Habla un poquito más rápido que el ritmo normal de una conversación alemana, " +
      "como un nativo en un diálogo cotidiano: fluido, natural y sin forzar la velocidad. " +
      "Mantén micro-pausas reales entre ideas, pero evita pausas largas o ritmo de enseñanza.",
  };

  return base + styleHints[style] + speedHints[speed];
}

async function synthesize(params: TtsParams) {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) {
    return new Response("TTS not configured", { status: 500 });
  }

  const gatewayRes = await fetch("https://ai.gateway.lovable.dev/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-4o-mini-tts",
      input: params.text,
      voice: params.voice,
      instructions: buildInstructions(params.style, params.speed),
      stream_format: "audio",
      response_format: "mp3",
      speed: params.rate,
    }),
  });

  if (!gatewayRes.ok) {
    const err = await gatewayRes.text().catch(() => "");
    console.error(`TTS gateway error ${gatewayRes.status}: ${err}`);
    return new Response(`TTS failed: ${gatewayRes.status} ${err}`, { status: 502 });
  }

  if (!gatewayRes.body) {
    return new Response("TTS produced no audio", { status: 502 });
  }

  // Stream straight through so playback can start before synthesis finishes.
  return new Response(gatewayRes.body, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

export const Route = createFileRoute("/api/tts")({
  server: {
    handlers: {
      // GET lets the <audio> element stream directly (near-instant start) and
      // lets the browser/CDN cache the result.
      GET: async ({ request }) => {
        const url = new URL(request.url);
        if (url.searchParams.has("capabilities")) {
          return Response.json({ enabled: Boolean(process.env["LOVABLE_API_KEY"]) }, {
            headers: { "Cache-Control": "no-store" },
          });
        }
        const params = normalize({
          text: url.searchParams.get("text") ?? "",
          rate: url.searchParams.get("rate") ?? undefined,
          voice: url.searchParams.get("voice") ?? undefined,
          style: url.searchParams.get("style") ?? undefined,
          speed: url.searchParams.get("speed") ?? undefined,
        });
        if (!params) return new Response("Missing text", { status: 400 });
        return synthesize(params);
      },
      POST: async ({ request }) => {
        let body: Record<string, unknown>;
        try {
          body = (await request.json()) as Record<string, unknown>;
        } catch {
          return new Response("Invalid JSON body", { status: 400 });
        }
        const params = normalize(body);
        if (!params) return new Response("Missing text", { status: 400 });
        return synthesize(params);
      },
    },
  },
});
