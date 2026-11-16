import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Calculator, Headphones, Repeat } from "lucide-react";

const TITLE = "Números en alemán: del 0 al 100 y más, con pronunciación";
const DESCRIPTION =
  "Tabla completa de números en alemán del 0 al 100, decenas, cientos y millones, con pronunciación aproximada, la regla del orden invertido y ejemplos de uso.";
const URL = "https://deutsch-gonzalo.onrender.com/numeros-en-aleman";

type Num = { n: string; de: string; pron: string };

const BASICOS: Num[] = [
  { n: "0", de: "null", pron: "nul" },
  { n: "1", de: "eins", pron: "áins" },
  { n: "2", de: "zwei", pron: "tsvái" },
  { n: "3", de: "drei", pron: "drái" },
  { n: "4", de: "vier", pron: "fíir" },
  { n: "5", de: "fünf", pron: "fünf" },
  { n: "6", de: "sechs", pron: "seks" },
  { n: "7", de: "sieben", pron: "síiben" },
  { n: "8", de: "acht", pron: "ajt" },
  { n: "9", de: "neun", pron: "nóin" },
  { n: "10", de: "zehn", pron: "tséen" },
  { n: "11", de: "elf", pron: "elf" },
  { n: "12", de: "zwölf", pron: "tsvölf" },
];

const ADOLESCENTES: Num[] = [
  { n: "13", de: "dreizehn", pron: "drái-tseen" },
  { n: "14", de: "vierzehn", pron: "fíir-tseen" },
  { n: "15", de: "fünfzehn", pron: "fünf-tseen" },
  { n: "16", de: "sechzehn", pron: "sej-tseen" },
  { n: "17", de: "siebzehn", pron: "síip-tseen" },
  { n: "18", de: "achtzehn", pron: "ajt-tseen" },
  { n: "19", de: "neunzehn", pron: "nóin-tseen" },
];

const DECENAS: Num[] = [
  { n: "20", de: "zwanzig", pron: "tsvántsij" },
  { n: "30", de: "dreißig", pron: "dráisij" },
  { n: "40", de: "vierzig", pron: "fíirtsij" },
  { n: "50", de: "fünfzig", pron: "fünftsij" },
  { n: "60", de: "sechzig", pron: "sejtsij" },
  { n: "70", de: "siebzig", pron: "síiptsij" },
  { n: "80", de: "achtzig", pron: "ájtsij" },
  { n: "90", de: "neunzig", pron: "nóintsij" },
  { n: "100", de: "(ein)hundert", pron: "áin-júndert" },
];

const COMPUESTOS: Num[] = [
  { n: "21", de: "einundzwanzig", pron: "áin-und-tsvántsij" },
  { n: "22", de: "zweiundzwanzig", pron: "tsvái-und-tsvántsij" },
  { n: "27", de: "siebenundzwanzig", pron: "síiben-und-tsvántsij" },
  { n: "35", de: "fünfunddreißig", pron: "fünf-und-dráisij" },
  { n: "48", de: "achtundvierzig", pron: "ajt-und-fíirtsij" },
  { n: "59", de: "neunundfünfzig", pron: "nóin-und-fünftsij" },
  { n: "63", de: "dreiundsechzig", pron: "drái-und-sejtsij" },
  { n: "76", de: "sechsundsiebzig", pron: "seks-und-síiptsij" },
  { n: "84", de: "vierundachtzig", pron: "fíir-und-ájtsij" },
  { n: "99", de: "neunundneunzig", pron: "nóin-und-nóintsij" },
];

const GRANDES: Num[] = [
  { n: "101", de: "hunderteins", pron: "júndert-áins" },
  { n: "200", de: "zweihundert", pron: "tsvái-jundert" },
  { n: "365", de: "dreihundertfünfundsechzig", pron: "drái-jundert-fünf-und-sejtsij" },
  { n: "1.000", de: "(ein)tausend", pron: "áin-táusend" },
  { n: "2.024", de: "zweitausendvierundzwanzig", pron: "tsvái-tausend-fíir-und-tsvántsij" },
  { n: "10.000", de: "zehntausend", pron: "tséen-tausend" },
  { n: "100.000", de: "hunderttausend", pron: "júndert-tausend" },
  { n: "1.000.000", de: "eine Million", pron: "áine mil-ión" },
  { n: "1.000.000.000", de: "eine Milliarde", pron: "áine mil-iárde" },
];

const ORDINALES = [
  { n: "1.º", de: "erste", ejemplo: "der erste Tag (el primer día)" },
  { n: "2.º", de: "zweite", ejemplo: "die zweite Woche (la segunda semana)" },
  { n: "3.º", de: "dritte", ejemplo: "das dritte Buch (el tercer libro)" },
  { n: "4.º", de: "vierte", ejemplo: "der vierte Stock (el cuarto piso)" },
  { n: "7.º", de: "siebte", ejemplo: "die siebte Lektion (la séptima lección)" },
  { n: "20.º", de: "zwanzigste", ejemplo: "der zwanzigste Mai (el 20 de mayo)" },
];

const FRASES = [
  { de: "Ich bin dreiunddreißig Jahre alt.", es: "Tengo 33 años." },
  { de: "Das kostet neunzehn Euro fünfzig.", es: "Eso cuesta 19,50 euros." },
  { de: "Meine Nummer ist null-eins-sieben-vier…", es: "Mi número es 0174…" },
  { de: "Wir treffen uns um halb acht.", es: "Nos vemos a las siete y media." },
  { de: "Ich wohne in der Hausnummer sechsundvierzig.", es: "Vivo en el número 46." },
  { de: "Der Zug fährt um vierzehn Uhr zwanzig.", es: "El tren sale a las 14:20." },
];

const TIPS = [
  {
    icon: Repeat,
    titulo: "Del 21 al 99 se dice al revés",
    texto:
      "Primero la unidad, después la decena, unidas por «und»: 21 es «einundzwanzig» (uno-y-veinte). Es el error más común al empezar; practícalo en voz alta hasta que suene automático.",
  },
  {
    icon: Headphones,
    titulo: "Escúchalos, no solo los leas",
    texto:
      "Los números aparecen rápido en precios, horas y teléfonos. Escucharlos a velocidad nativa es lo que te permite entenderlos en una tienda o en una estación.",
  },
  {
    icon: Calculator,
    titulo: "Ojo con «eins» y «ein»",
    texto:
      "Al contar se dice «eins», pero delante de un sustantivo se declina: «ein Buch», «eine Woche», «einen Tag». En números compuestos vuelve a ser «ein»: einundzwanzig.",
  },
];

const TABLAS: { titulo: string; nota: string; filas: Num[] }[] = [
  { titulo: "Números del 0 al 12", nota: "Estos hay que memorizarlos: son la base de todo lo demás.", filas: BASICOS },
  {
    titulo: "Del 13 al 19",
    nota: "Unidad + «zehn». Fíjate en las excepciones sechzehn (sin -s) y siebzehn (sin -en).",
    filas: ADOLESCENTES,
  },
  { titulo: "Las decenas: 20, 30, 40…", nota: "Terminan en -zig, menos «dreißig» que termina en -ßig.", filas: DECENAS },
  {
    titulo: "Números compuestos del 21 al 99",
    nota: "Regla clave: unidad + und + decena, todo escrito en una sola palabra.",
    filas: COMPUESTOS,
  },
  {
    titulo: "Cientos, miles y millones",
    nota: "En alemán el punto separa los miles y la coma los decimales, al contrario que en inglés.",
    filas: GRANDES,
  },
];

export const Route = createFileRoute("/numeros-en-aleman")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: URL },
      { property: "og:image", content: "https://deutsch-gonzalo.onrender.com/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://deutsch-gonzalo.onrender.com/og-image.jpg" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: TITLE,
          description: DESCRIPTION,
          inLanguage: "es",
          datePublished: "2026-08-23",
          dateModified: "2026-08-23",
          author: {
            "@type": "Organization",
            name: "Deutsch Lernspiel",
            url: "https://deutsch-gonzalo.onrender.com/",
          },
          image: {
            "@type": "ImageObject",
            url: "https://deutsch-gonzalo.onrender.com/og-image.jpg",
            width: 1200,
            height: 630,
          },
          mainEntityOfPage: { "@type": "WebPage", "@id": URL },
          about: { "@type": "Thing", name: "Números en alemán" },
        }),
      },
    ],
  }),
  component: NumerosEnAleman,
});

function NumerosEnAleman() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/60">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Link to="/auth" className="text-sm font-semibold tracking-tight">
            Deutsch <span className="text-primary">Lernspiel</span>
          </Link>
          <Link
            to="/auth"
            className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Practicar gratis
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 pb-20">
        <section className="py-12 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Vocabulario A1</p>
          <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            Números en alemán: del 0 al 100 y más allá
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground">
            Aquí tienes todos los números en alemán con su pronunciación aproximada en español, la regla del orden
            invertido del 21 al 99, los ordinales y frases reales con precios, horas y edades para usarlos hoy mismo.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Practicar los números con audio
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#regla"
              className="inline-flex items-center rounded-full border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              Ver la regla del 21 al 99
            </a>
          </div>
        </section>

        {TABLAS.map((t) => (
          <section key={t.titulo} id={slug(t.titulo)} className="mb-12 scroll-mt-20">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{t.titulo}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t.nota}</p>
            <div className="mt-4 overflow-x-auto rounded-xl border border-border/70">
              <table className="w-full min-w-[520px] border-collapse text-sm">
                <thead>
                  <tr className="bg-card text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th scope="col" className="px-4 py-3 font-semibold">Número</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Alemán</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Pronunciación aprox.</th>
                  </tr>
                </thead>
                <tbody>
                  {t.filas.map((f) => (
                    <tr key={f.n + f.de} className="border-t border-border/60">
                      <td className="px-4 py-3 font-mono">{f.n}</td>
                      <td className="px-4 py-3 font-semibold text-primary" lang="de">{f.de}</td>
                      <td className="px-4 py-3 text-muted-foreground">{f.pron}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}

        <section id="regla" className="mb-12 scroll-mt-20 rounded-2xl border border-primary/30 bg-card p-6 sm:p-8">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            La regla del orden invertido (21–99)
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            En alemán se dice primero la unidad y luego la decena, unidas por «und» y escritas en una sola palabra.
            Es como decir «cuatro y veinte» en lugar de «veinticuatro».
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              24 → <span className="font-semibold text-primary" lang="de">vierundzwanzig</span> (vier + und + zwanzig)
            </li>
            <li>
              37 → <span className="font-semibold text-primary" lang="de">siebenunddreißig</span> (sieben + und + dreißig)
            </li>
            <li>
              82 → <span className="font-semibold text-primary" lang="de">zweiundachtzig</span> (zwei + und + achtzig)
            </li>
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">
            Con números de tres cifras se mantiene la lógica: 246 es{" "}
            <span lang="de" className="font-medium text-foreground">zweihundertsechsundvierzig</span> (doscientos +
            seis-y-cuarenta).
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Números ordinales</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Se forman con -te (hasta 19) o -ste (desde 20) y se declinan como adjetivos.
          </p>
          <div className="mt-4 overflow-x-auto rounded-xl border border-border/70">
            <table className="w-full min-w-[520px] border-collapse text-sm">
              <thead>
                <tr className="bg-card text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th scope="col" className="px-4 py-3 font-semibold">Orden</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Alemán</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Ejemplo</th>
                </tr>
              </thead>
              <tbody>
                {ORDINALES.map((o) => (
                  <tr key={o.de} className="border-t border-border/60">
                    <td className="px-4 py-3 font-mono">{o.n}</td>
                    <td className="px-4 py-3 font-semibold text-primary" lang="de">{o.de}</td>
                    <td className="px-4 py-3 text-muted-foreground" lang="de">{o.ejemplo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Frases con números que vas a usar de verdad
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {FRASES.map((f) => (
              <article key={f.de} className="rounded-xl border border-border/70 bg-card p-4">
                <p className="text-sm font-semibold text-primary" lang="de">{f.de}</p>
                <p className="mt-1 text-sm text-muted-foreground">{f.es}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Cómo memorizar los números en alemán</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {TIPS.map((t) => (
              <article key={t.titulo} className="rounded-xl border border-border/70 bg-card p-5">
                <t.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                <h3 className="mt-3 text-base font-semibold">{t.titulo}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{t.texto}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-12 rounded-2xl border border-border/70 bg-card p-6 sm:p-8">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Sigue con más vocabulario y gramática</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/palabras-en-aleman"
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              100 palabras básicas en alemán
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/declinaciones-aleman"
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              Guía de declinaciones alemanas
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-primary/30 bg-card p-6 sm:p-8">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Practica los números escuchándolos a velocidad nativa
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            En Deutsch Lernspiel escuchas cada número a velocidad lenta, normal o nativa, lo escribes al dictado y el
            repaso inteligente te lo devuelve justo antes de que se te olvide. Tu avance queda guardado.
          </p>
          <Link
            to="/auth"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Inscríbete gratis
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </main>
    </div>
  );
}

function slug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
