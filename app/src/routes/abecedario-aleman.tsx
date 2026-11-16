import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Headphones, Languages, Sparkles } from "lucide-react";

const TITLE = "Abecedario alemán: letras, pronunciación y caracteres especiales";
const DESCRIPTION =
  "Guía completa del abecedario alemán para hispanohablantes: nombre de cada letra, pronunciación aproximada, umlauts (ä, ö, ü) y la letra ß con ejemplos de palabras comunes.";
const URL = "https://deutsch-gonzalo.onrender.com/abecedario-aleman";

type Letter = { letter: string; name: string; pron: string; example: string; meaning: string };

const LETTERS: Letter[] = [
  { letter: "A", name: "a", pron: "a", example: "der Apfel", meaning: "la manzana" },
  { letter: "B", name: "be", pron: "be", example: "das Buch", meaning: "el libro" },
  { letter: "C", name: "ce", pron: "tse", example: "die CD", meaning: "el CD" },
  { letter: "D", name: "de", pron: "de", example: "der Drachen", meaning: "el dragón" },
  { letter: "E", name: "e", pron: "e", example: "das Ei", meaning: "el huevo" },
  { letter: "F", name: "ef", pron: "ef", example: "die Frau", meaning: "la mujer" },
  { letter: "G", name: "ge", pron: "ge", example: "das Geld", meaning: "el dinero" },
  { letter: "H", name: "ha", pron: "ja", example: "das Haus", meaning: "la casa" },
  { letter: "I", name: "i", pron: "i", example: "die Insel", meaning: "la isla" },
  { letter: "J", name: "jot", pron: "yot", example: "das Jahr", meaning: "el año" },
  { letter: "K", name: "ka", pron: "ka", example: "der Kaffee", meaning: "el café" },
  { letter: "L", name: "el", pron: "el", example: "die Lampe", meaning: "la lámpara" },
  { letter: "M", name: "em", pron: "em", example: "der Mann", meaning: "el hombre" },
  { letter: "N", name: "en", pron: "en", example: "die Nacht", meaning: "la noche" },
  { letter: "O", name: "o", pron: "o", example: "die Orange", meaning: "la naranja" },
  { letter: "P", name: "pe", pron: "pe", example: "der Park", meaning: "el parque" },
  { letter: "Q", name: "ku", pron: "ku", example: "die Qualität", meaning: "la calidad" },
  { letter: "R", name: "er", pron: "er (gutural)", example: "der Rotwein", meaning: "el vino tinto" },
  { letter: "S", name: "es", pron: "es", example: "die Sonne", meaning: "el sol" },
  { letter: "T", name: "te", pron: "te", example: "der Tag", meaning: "el día" },
  { letter: "U", name: "u", pron: "u", example: "die Uhr", meaning: "el reloj" },
  { letter: "V", name: "fau", pron: "fau", example: "der Vogel", meaning: "el pájaro" },
  { letter: "W", name: "we", pron: "ve", example: "das Wasser", meaning: "el agua" },
  { letter: "X", name: "iks", pron: "iks", example: "das Xylophon", meaning: "el xilófono" },
  { letter: "Y", name: "üpsilon", pron: "ípsilong", example: "der Yoga", meaning: "el yoga" },
  { letter: "Z", name: "tset", pron: "tset", example: "die Zeitung", meaning: "el periódico" },
];

const SPECIALS = [
  {
    char: "ä",
    name: "a umlaut",
    sound: "Como la «e» de «mes», pero con la boca más abierta.",
    examples: [
      { de: "Äpfel", es: "manzanas" },
      { de: "Mädchen", es: "niña" },
      { de: "Käse", es: "queso" },
      { de: "Bäcker", es: "panadero" },
    ],
  },
  {
    char: "ö",
    name: "o umlaut",
    sound: "Redondea los labios como para decir «o» y pronuncia «e».",
    examples: [
      { de: "schön", es: "bonito" },
      { de: "Köln", es: "Colonia" },
      { de: "mögen", es: "gustar" },
      { de: "fröhlich", es: "alegre" },
    ],
  },
  {
    char: "ü",
    name: "u umlaut",
    sound: "Redondea los labios como para «u» y pronuncia «i».",
    examples: [
      { de: "über", es: "sobre / por encima" },
      { de: "Tür", es: "puerta" },
      { de: "fünf", es: "cinco" },
      { de: "früh", es: "temprano" },
    ],
  },
  {
    char: "ß",
    name: "Eszett / scharfes S",
    sound: "Se pronuncia como «ss» larga, nunca como «z».",
    examples: [
      { de: "Straße", es: "calle" },
      { de: "groß", es: "grande" },
      { de: "Fuß", es: "pie" },
      { de: "heiß", es: "caliente" },
    ],
  },
];

const TIPS = [
  {
    icon: Headphones,
    title: "Escucha antes de leer",
    text: "El alemán se pronuncia casi como se escribe, pero la R, CH, Ü, Ö y Z necesitan oído. Escucha el nombre de la letra y repítelo en voz alta.",
  },
  {
    icon: Languages,
    title: "No confundas W con V",
    text: "La W alemana suena como la V española: «Wasser» se dice «vaser». La V alemana suena como F: «Vogel» se dice «fogel».",
  },
  {
    icon: Sparkles,
    title: "Aprende los umlauts desde el primer día",
    text: "Ä, Ö y Ü no son decoraciones: cambian el significado de las palabras. Practícalos con frases cortas para que tu oído los reconozca.",
  },
];

export const Route = createFileRoute("/abecedario-aleman")({
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
          datePublished: "2026-08-24",
          dateModified: "2026-08-24",
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
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": URL,
          },
          about: { "@type": "Thing", name: "Abecedario alemán" },
        }),
      },
    ],
  }),
  component: AbecedarioAleman,
});

function AbecedarioAleman() {
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
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Fundamentos A1</p>
          <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            Abecedario alemán: letras, pronunciación y caracteres especiales
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground">
            El alemán usa el alfabeto latino con 26 letras estándar y cuatro caracteres adicionales: ä, ö, ü y ß.
            Aquí tienes el nombre de cada letra, una pronunciación aproximada para hispanohablantes y palabras de
            ejemplo para empezar a leer y escuchar desde el primer día.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Practicar el abecedario con audio
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#tabla-letras"
              className="inline-flex items-center rounded-full border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              Ver la tabla completa
            </a>
          </div>
        </section>

        <section id="tabla-letras" className="mb-12 scroll-mt-20">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Las 26 letras del abecedario alemán</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Fíjate sobre todo en J, R, V, W, Y y Z: son las que más se diferencian del español.
          </p>
          <div className="mt-4 overflow-x-auto rounded-xl border border-border/70">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="bg-card text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th scope="col" className="px-4 py-3 font-semibold">Letra</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Nombre en alemán</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Pronunciación aprox.</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Ejemplo</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Significado</th>
                </tr>
              </thead>
              <tbody>
                {LETTERS.map((l) => (
                  <tr key={l.letter} className="border-t border-border/60">
                    <td className="px-4 py-3 text-lg font-bold text-primary" lang="de">{l.letter}</td>
                    <td className="px-4 py-3 font-semibold" lang="de">{l.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{l.pron}</td>
                    <td className="px-4 py-3 font-medium" lang="de">{l.example}</td>
                    <td className="px-4 py-3 text-muted-foreground">{l.meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Caracteres especiales: ä, ö, ü y ß</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Estas letras no son opcionales: cambian la pronunciación y, a veces, el significado de la palabra.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {SPECIALS.map((s) => (
              <article key={s.char} className="rounded-xl border border-border/70 bg-card p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl font-bold text-primary" lang="de">
                    {s.char}
                  </span>
                  <div>
                    <h3 className="text-base font-semibold">{s.name}</h3>
                    <p className="text-sm text-muted-foreground">{s.sound}</p>
                  </div>
                </div>
                <ul className="mt-4 space-y-1.5 text-sm">
                  {s.examples.map((ex) => (
                    <li key={ex.de} className="flex justify-between gap-4">
                      <span className="font-medium text-primary" lang="de">{ex.de}</span>
                      <span className="text-muted-foreground">{ex.es}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-12 rounded-2xl border border-primary/30 bg-card p-6 sm:p-8">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Trucos de pronunciación para hispanohablantes</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {TIPS.map((t) => (
              <article key={t.title} className="rounded-xl border border-border/70 bg-background/50 p-5">
                <t.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                <h3 className="mt-3 text-base font-semibold">{t.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{t.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-12 rounded-2xl border border-border/70 bg-card p-6 sm:p-8">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Sigue aprendiendo alemán paso a paso</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/palabras-en-aleman"
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              100 palabras básicas en alemán
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/numeros-en-aleman"
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              Números en alemán del 0 al 100
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
            Practica el abecedario alemán con audio real
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            En Deutsch Lernspiel escuchas cada letra y palabra a velocidad lenta, normal o nativa, y repasas con
            ejercicios interactivos diseñados para hispanohablantes. Tu avance se guarda para que sigas donde lo dejaste.
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
