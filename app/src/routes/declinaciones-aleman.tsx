import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, CheckCircle, GraduationCap, HelpCircle, Lightbulb, Target } from "lucide-react";

const TITLE = "Declinaciones en alemán: Nominativ, Akkusativ, Dativ y Genitiv";
const DESCRIPTION =
  "Guía completa de declinaciones alemanas: artículos, adjetivos y pronombres en Nominativ, Akkusativ, Dativ y Genitiv con tablas y ejemplos.";
const URL = "https://deutsch-gonzalo.onrender.com/declinaciones-aleman";

const CASES = [
  {
    id: "nominativ",
    name: "Nominativ",
    question: "¿Quién o qué?",
    use: "Sujeto de la oración.",
    examples: [
      { de: "Der Mann liest.", es: "El hombre lee." },
      { de: "Die Frau singt.", es: "La mujer canta." },
      { de: "Das Kind spielt.", es: "El niño juega." },
      { de: "Die Kinder lachen.", es: "Los niños ríen." },
    ],
  },
  {
    id: "akkusativ",
    name: "Akkusativ",
    question: "¿A quién o a qué?",
    use: "Objeto directo: la persona o cosa que recibe directamente la acción.",
    examples: [
      { de: "Ich sehe den Mann.", es: "Veo al hombre." },
      { de: "Ich kenne die Frau.", es: "Conozco a la mujer." },
      { de: "Ich habe das Buch.", es: "Tengo el libro." },
      { de: "Ich kaufe die Äpfel.", es: "Compro las manzanas." },
    ],
  },
  {
    id: "dativ",
    name: "Dativ",
    question: "¿A quién o para qué?",
    use: "Objeto indirecto: beneficiario o receptor de la acción; también con ciertas preposiciones y verbos.",
    examples: [
      { de: "Ich gebe dem Mann das Buch.", es: "Le doy el libro al hombre." },
      { de: "Ich helfe der Frau.", es: "Ayudo a la mujer." },
      { de: "Das Spielzeug gehört dem Kind.", es: "El juguete pertenece al niño." },
      { de: "Ich danke den Kindern.", es: "Agradezco a los niños." },
    ],
  },
  {
    id: "genitiv",
    name: "Genitiv",
    question: "¿De quién o de qué?",
    use: "Expresa posesión o pertenencia; también con ciertas preposiciones.",
    examples: [
      { de: "Das Auto des Mannes ist neu.", es: "El coche del hombre es nuevo." },
      { de: "Die Tasche der Frau ist rot.", es: "La bolsa de la mujer es roja." },
      { de: "Die Farbe des Buches ist blau.", es: "El color del libro es azul." },
      { de: "Die Eltern der Kinder kommen.", es: "Los padres de los niños vienen." },
    ],
  },
];

const DEFINITE_ARTICLES = [
  { case: "Nominativ", masc: "der", fem: "die", neut: "das", plural: "die" },
  { case: "Akkusativ", masc: "den", fem: "die", neut: "das", plural: "die" },
  { case: "Dativ", masc: "dem", fem: "der", neut: "dem", plural: "den" },
  { case: "Genitiv", masc: "des", fem: "der", neut: "des", plural: "der" },
];

const INDEFINITE_ARTICLES = [
  { case: "Nominativ", masc: "ein", fem: "eine", neut: "ein", plural: "—" },
  { case: "Akkusativ", masc: "einen", fem: "eine", neut: "ein", plural: "—" },
  { case: "Dativ", masc: "einem", fem: "einer", neut: "einem", plural: "—" },
  { case: "Genitiv", masc: "eines", fem: "einer", neut: "eines", plural: "—" },
];

const TIPS = [
  {
    icon: Target,
    title: "Pregunta primero, declina después",
    text: "Antes de conjugar el artículo, identifica qué función cumple la palabra en la frase: sujeto, objeto directo, objeto indirecto o posesión.",
  },
  {
    icon: Lightbulb,
    title: "Solo el masculino cambia mucho",
    text: "En artículos definidos e indefinidos, solo la forma masculina cambia entre los cuatro casos. Femenino, neutro y plural se mantienen o tienen pocas variantes.",
  },
  {
    icon: BookOpen,
    title: "Memoriza con frases cortas",
    text: "No memorices tablas sueltas. Usa una frase modelo para cada caso y cámbiala poco a poco: «Der Hund schläft» → «Ich sehe den Hund» → «Ich gebe dem Hund Wasser».",
  },
];

const PREPOSITIONS = [
  { case: "Akkusativ", preps: "durch, für, gegen, ohne, um, bis" },
  { case: "Dativ", preps: "mit, nach, zu, von, aus, bei, seit, gegenüber" },
  { case: "Wechselpräpositionen (Akkusativ / Dativ)", preps: "an, auf, hinter, in, neben, über, unter, vor, zwischen" },
  { case: "Genitiv", preps: "trotz, während, wegen, (an)statt" },
];

export const Route = createFileRoute("/declinaciones-aleman")({
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
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": URL,
          },
          about: { "@type": "Thing", name: "Declinaciones del alemán" },
        }),
      },
    ],
  }),
  component: DeclinacionesAleman,
});

function DeclinacionesAleman() {
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
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Gramática A1 · A2</p>
          <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            Declinaciones en alemán: los 4 casos explicados paso a paso
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground">
            Una de las primeras barreras del alemán es saber por qué el artículo de una palabra cambia dentro de la
            frase. Aquí te explico Nominativ, Akkusativ, Dativ y Genitiv con tablas claras, ejemplos y una forma
            sencilla de practicarlos.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Practicar casos con audio
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#tabla-articulos-definidos"
              className="inline-flex items-center rounded-full border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              Ver las tablas
            </a>
          </div>
        </section>

        <nav aria-label="Casos" className="mb-12 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {CASES.map((c) => (
            <a
              key={c.id}
              href={`#${c.id}`}
              className="rounded-xl border border-border/70 bg-card px-4 py-3 text-sm font-semibold transition hover:border-primary/60"
            >
              {c.name}
            </a>
          ))}
        </nav>

        {CASES.map((c) => (
          <section key={c.id} id={c.id} className="mb-12 scroll-mt-20">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">{c.name}</h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Pregunta clave:</span> {c.question} · {c.use}
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {c.examples.map((ex) => (
                <div key={ex.de} className="rounded-xl border border-border/70 bg-card p-4">
                  <p className="text-base font-semibold text-primary" lang="de">{ex.de}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{ex.es}</p>
                </div>
              ))}
            </div>
          </section>
        ))}

        <section id="tabla-articulos-definidos" className="mb-12 scroll-mt-20">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Artículos definidos por caso</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            La palabra «the» cambia según el género y la función de la palabra en la frase.
          </p>
          <div className="mt-4 overflow-x-auto rounded-xl border border-border/70">
            <table className="w-full min-w-[520px] border-collapse text-sm">
              <thead>
                <tr className="bg-card text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3 font-semibold">Caso</th>
                  <th className="px-4 py-3 font-semibold">Masculino</th>
                  <th className="px-4 py-3 font-semibold">Femenino</th>
                  <th className="px-4 py-3 font-semibold">Neutro</th>
                  <th className="px-4 py-3 font-semibold">Plural</th>
                </tr>
              </thead>
              <tbody>
                {DEFINITE_ARTICLES.map((row) => (
                  <tr key={row.case} className="border-t border-border/60">
                    <td className="px-4 py-3 font-semibold">{row.case}</td>
                    <td className="px-4 py-3" lang="de">{row.masc}</td>
                    <td className="px-4 py-3" lang="de">{row.fem}</td>
                    <td className="px-4 py-3" lang="de">{row.neut}</td>
                    <td className="px-4 py-3" lang="de">{row.plural}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Artículos indefinidos por caso</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Equivalente a «un / una». No existe forma plural propia.
          </p>
          <div className="mt-4 overflow-x-auto rounded-xl border border-border/70">
            <table className="w-full min-w-[520px] border-collapse text-sm">
              <thead>
                <tr className="bg-card text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3 font-semibold">Caso</th>
                  <th className="px-4 py-3 font-semibold">Masculino</th>
                  <th className="px-4 py-3 font-semibold">Femenino</th>
                  <th className="px-4 py-3 font-semibold">Neutro</th>
                  <th className="px-4 py-3 font-semibold">Plural</th>
                </tr>
              </thead>
              <tbody>
                {INDEFINITE_ARTICLES.map((row) => (
                  <tr key={row.case} className="border-t border-border/60">
                    <td className="px-4 py-3 font-semibold">{row.case}</td>
                    <td className="px-4 py-3" lang="de">{row.masc}</td>
                    <td className="px-4 py-3" lang="de">{row.fem}</td>
                    <td className="px-4 py-3" lang="de">{row.neut}</td>
                    <td className="px-4 py-3" lang="de">{row.plural}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Preposiciones que gobiernan cada caso</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Después de ciertas preposiciones el sustantivo que sigue va obligatoriamente en un caso concreto.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {PREPOSITIONS.map((p) => (
              <div key={p.case} className="rounded-xl border border-border/70 bg-card p-5">
                <h3 className="text-sm font-semibold">{p.case}</h3>
                <p className="mt-2 text-sm font-medium text-primary" lang="de">{p.preps}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Cómo dominar las declinaciones sin volverte loco</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {TIPS.map((t) => (
              <article key={t.title} className="rounded-xl border border-border/70 bg-card p-5">
                <t.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                <h3 className="mt-3 text-base font-semibold">{t.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{t.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-primary/30 bg-card p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <HelpCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Practica declinaciones con audio real</h2>
              <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
                En Deutsch Lernspiel hay ejercicios específicos de Nominativ, Akkusativ, Dativ y Genitiv con frases de
                la vida real, dictado con voz real y tres velocidades de audio. Tu avance se guarda para que vuelvas
                justo donde lo dejaste.
              </p>
              <Link
                to="/auth"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                <CheckCircle className="h-4 w-4" />
                Inscríbete gratis y practica
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
