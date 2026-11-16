import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Headphones, Layers, Target } from "lucide-react";

const TITLE = "Palabras en alemán: 100 básicas con pronunciación y ejemplos";
const DESCRIPTION =
  "Lista de palabras en alemán con su traducción al español, artículo y ejemplos por temas: saludos, personas, comida, casa, tiempo y verbos.";
const URL = "https://deutsch-gonzalo.onrender.com/palabras-en-aleman";

type Word = { de: string; es: string; ejemplo: string };
type Group = { tema: string; nota: string; palabras: Word[] };

const GROUPS: Group[] = [
  {
    tema: "Saludos y frases del día a día",
    nota: "Lo primero que usas al hablar con alguien.",
    palabras: [
      { de: "Hallo", es: "hola", ejemplo: "Hallo, wie geht's?" },
      { de: "Guten Morgen", es: "buenos días", ejemplo: "Guten Morgen, Frau Müller!" },
      { de: "Guten Tag", es: "buen día / buenas tardes", ejemplo: "Guten Tag, ich heiße Ana." },
      { de: "Guten Abend", es: "buenas noches (al llegar)", ejemplo: "Guten Abend, kommen Sie herein." },
      { de: "Tschüss", es: "chao", ejemplo: "Tschüss, bis morgen!" },
      { de: "Auf Wiedersehen", es: "hasta la vista (formal)", ejemplo: "Auf Wiedersehen und danke!" },
      { de: "Bitte", es: "por favor / de nada", ejemplo: "Einen Kaffee, bitte." },
      { de: "Danke", es: "gracias", ejemplo: "Danke für deine Hilfe." },
      { de: "Entschuldigung", es: "perdón / disculpe", ejemplo: "Entschuldigung, wo ist der Bahnhof?" },
      { de: "Ja / Nein", es: "sí / no", ejemplo: "Ja, gern. Nein, danke." },
    ],
  },
  {
    tema: "Personas y familia",
    nota: "Fíjate en el artículo: der (masculino), die (femenino), das (neutro).",
    palabras: [
      { de: "der Mann", es: "el hombre", ejemplo: "Der Mann liest ein Buch." },
      { de: "die Frau", es: "la mujer", ejemplo: "Die Frau arbeitet hier." },
      { de: "das Kind", es: "el niño / la niña", ejemplo: "Das Kind spielt im Garten." },
      { de: "der Freund", es: "el amigo", ejemplo: "Mein Freund wohnt in Berlin." },
      { de: "die Freundin", es: "la amiga", ejemplo: "Ich rufe meine Freundin an." },
      { de: "die Mutter", es: "la madre", ejemplo: "Meine Mutter kocht gut." },
      { de: "der Vater", es: "el padre", ejemplo: "Der Vater fährt Auto." },
      { de: "die Schwester", es: "la hermana", ejemplo: "Ich habe eine Schwester." },
      { de: "der Bruder", es: "el hermano", ejemplo: "Mein Bruder ist Student." },
      { de: "die Familie", es: "la familia", ejemplo: "Die Familie isst zusammen." },
    ],
  },
  {
    tema: "Comida y bebida",
    nota: "Vocabulario para pedir en un café o hacer la compra.",
    palabras: [
      { de: "das Wasser", es: "el agua", ejemplo: "Ich trinke Wasser." },
      { de: "der Kaffee", es: "el café", ejemplo: "Ein Kaffee ohne Zucker, bitte." },
      { de: "das Brot", es: "el pan", ejemplo: "Das Brot ist frisch." },
      { de: "der Käse", es: "el queso", ejemplo: "Ich mag Käse sehr." },
      { de: "das Fleisch", es: "la carne", ejemplo: "Ich esse kein Fleisch." },
      { de: "der Apfel", es: "la manzana", ejemplo: "Der Apfel ist rot." },
      { de: "die Milch", es: "la leche", ejemplo: "Die Milch ist im Kühlschrank." },
      { de: "das Frühstück", es: "el desayuno", ejemplo: "Das Frühstück ist um acht." },
      { de: "das Mittagessen", es: "el almuerzo", ejemplo: "Wir kochen das Mittagessen." },
      { de: "die Rechnung", es: "la cuenta", ejemplo: "Die Rechnung, bitte." },
    ],
  },
  {
    tema: "Casa y ciudad",
    nota: "Palabras que aparecen todo el tiempo con preposiciones de lugar.",
    palabras: [
      { de: "das Haus", es: "la casa", ejemplo: "Das Haus ist groß." },
      { de: "die Wohnung", es: "el departamento", ejemplo: "Meine Wohnung hat zwei Zimmer." },
      { de: "das Zimmer", es: "la habitación", ejemplo: "Das Zimmer ist hell." },
      { de: "die Küche", es: "la cocina", ejemplo: "Ich bin in der Küche." },
      { de: "der Tisch", es: "la mesa", ejemplo: "Das Buch liegt auf dem Tisch." },
      { de: "die Tür", es: "la puerta", ejemplo: "Bitte schließ die Tür." },
      { de: "die Straße", es: "la calle", ejemplo: "Ich wohne in dieser Straße." },
      { de: "der Bahnhof", es: "la estación de tren", ejemplo: "Der Bahnhof ist nah." },
      { de: "die Stadt", es: "la ciudad", ejemplo: "Die Stadt ist sehr schön." },
      { de: "die Arbeit", es: "el trabajo", ejemplo: "Ich fahre zur Arbeit." },
    ],
  },
  {
    tema: "Tiempo y números",
    nota: "Para hablar de horarios, planes y rutinas.",
    palabras: [
      { de: "heute", es: "hoy", ejemplo: "Heute lerne ich Deutsch." },
      { de: "morgen", es: "mañana", ejemplo: "Morgen habe ich frei." },
      { de: "gestern", es: "ayer", ejemplo: "Gestern war ich müde." },
      { de: "immer", es: "siempre", ejemplo: "Ich trinke immer Tee." },
      { de: "nie", es: "nunca", ejemplo: "Er kommt nie zu spät." },
      { de: "die Woche", es: "la semana", ejemplo: "Die Woche war lang." },
      { de: "das Jahr", es: "el año", ejemplo: "Das Jahr beginnt im Januar." },
      { de: "eins, zwei, drei", es: "uno, dos, tres", ejemplo: "Eins, zwei, drei — los!" },
      { de: "zehn", es: "diez", ejemplo: "Ich habe zehn Minuten." },
      { de: "hundert", es: "cien", ejemplo: "Das kostet hundert Euro." },
    ],
  },
  {
    tema: "Verbos esenciales",
    nota: "Con estos verbos ya puedes armar frases completas.",
    palabras: [
      { de: "sein", es: "ser / estar", ejemplo: "Ich bin aus Chile." },
      { de: "haben", es: "tener", ejemplo: "Du hast Zeit." },
      { de: "gehen", es: "ir / caminar", ejemplo: "Wir gehen nach Hause." },
      { de: "kommen", es: "venir", ejemplo: "Sie kommt aus Spanien." },
      { de: "machen", es: "hacer", ejemplo: "Was machst du heute?" },
      { de: "sprechen", es: "hablar", ejemplo: "Ich spreche ein bisschen Deutsch." },
      { de: "lernen", es: "aprender", ejemplo: "Ich lerne jeden Tag." },
      { de: "essen", es: "comer", ejemplo: "Er isst einen Apfel." },
      { de: "trinken", es: "beber", ejemplo: "Wir trinken Wasser." },
      { de: "arbeiten", es: "trabajar", ejemplo: "Sie arbeitet in Berlin." },
    ],
  },
  {
    tema: "Preguntas clave (W-Fragen)",
    nota: "Las palabras interrogativas te sirven en cualquier conversación.",
    palabras: [
      { de: "wer", es: "quién", ejemplo: "Wer ist das?" },
      { de: "was", es: "qué", ejemplo: "Was kostet das?" },
      { de: "wo", es: "dónde", ejemplo: "Wo wohnst du?" },
      { de: "woher", es: "de dónde", ejemplo: "Woher kommst du?" },
      { de: "wohin", es: "a dónde", ejemplo: "Wohin gehst du?" },
      { de: "wann", es: "cuándo", ejemplo: "Wann beginnt der Kurs?" },
      { de: "wie", es: "cómo", ejemplo: "Wie heißt du?" },
      { de: "warum", es: "por qué", ejemplo: "Warum lernst du Deutsch?" },
      { de: "wie viel", es: "cuánto", ejemplo: "Wie viel kostet der Kaffee?" },
      { de: "welcher", es: "cuál / qué (de varios)", ejemplo: "Welcher Zug fährt nach Köln?" },
    ],
  },
  {
    tema: "Adjetivos y opuestos",
    nota: "Aprender los adjetivos en pares hace que se te queden mejor.",
    palabras: [
      { de: "groß / klein", es: "grande / pequeño", ejemplo: "Die Stadt ist groß." },
      { de: "gut / schlecht", es: "bueno / malo", ejemplo: "Das Essen ist gut." },
      { de: "neu / alt", es: "nuevo / viejo", ejemplo: "Mein Handy ist neu." },
      { de: "schnell / langsam", es: "rápido / lento", ejemplo: "Der Zug ist schnell." },
      { de: "teuer / billig", es: "caro / barato", ejemplo: "Das Hotel ist teuer." },
      { de: "warm / kalt", es: "cálido / frío", ejemplo: "Heute ist es kalt." },
      { de: "einfach / schwierig", es: "fácil / difícil", ejemplo: "Deutsch ist nicht schwierig." },
      { de: "schön", es: "bonito", ejemplo: "Das Wetter ist schön." },
      { de: "müde", es: "cansado", ejemplo: "Ich bin sehr müde." },
      { de: "glücklich", es: "feliz", ejemplo: "Sie ist glücklich." },
    ],
  },
  {
    tema: "Casos: la misma palabra cambia",
    nota: "En alemán el artículo cambia según la función de la palabra en la frase.",
    palabras: [
      { de: "der Hund (Nominativ)", es: "el perro (sujeto)", ejemplo: "Der Hund schläft." },
      { de: "den Hund (Akkusativ)", es: "al perro (objeto directo)", ejemplo: "Ich sehe den Hund." },
      { de: "dem Hund (Dativ)", es: "al perro (objeto indirecto)", ejemplo: "Ich gebe dem Hund Wasser." },
      { de: "des Hundes (Genitiv)", es: "del perro (posesión)", ejemplo: "Das ist das Spielzeug des Hundes." },
      { de: "die Frau (Nominativ)", es: "la mujer (sujeto)", ejemplo: "Die Frau liest." },
      { de: "die Frau (Akkusativ)", es: "a la mujer (objeto directo)", ejemplo: "Ich kenne die Frau." },
      { de: "der Frau (Dativ)", es: "a la mujer (objeto indirecto)", ejemplo: "Ich helfe der Frau." },
      { de: "der Frau (Genitiv)", es: "de la mujer", ejemplo: "Das Auto der Frau ist blau." },
      { de: "ein Buch (Akkusativ)", es: "un libro", ejemplo: "Ich lese ein Buch." },
      { de: "einem Kind (Dativ)", es: "a un niño", ejemplo: "Ich schenke einem Kind ein Buch." },
    ],
  },
];

const TIPS = [
  {
    icon: Layers,
    titulo: "Aprende la palabra con su artículo",
    texto:
      "No memorices «Tisch», memoriza «der Tisch». El artículo define después los casos y las terminaciones, así que aprenderlo junto ahorra errores más adelante.",
  },
  {
    icon: Headphones,
    titulo: "Escúchala antes de leerla",
    texto:
      "El alemán se pronuncia casi como se escribe, pero sonidos como ü, ö, ch o sch necesitan oído. Escucha la palabra, repítela en voz alta y después escríbela.",
  },
  {
    icon: Target,
    titulo: "Usa la palabra en una frase corta",
    texto:
      "Una palabra suelta se olvida; dentro de una frase se queda. Cambia el sujeto y el tiempo verbal para practicar la misma palabra de varias formas.",
  },
];

export const Route = createFileRoute("/palabras-en-aleman")({
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
          datePublished: "2026-08-20",
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
          about: { "@type": "Thing", name: "Vocabulario de alemán" },
        }),
      },
    ],
  }),
  component: PalabrasEnAleman,
});

function PalabrasEnAleman() {
  const total = GROUPS.reduce((n, g) => n + g.palabras.length, 0);

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
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Vocabulario A1 · A2</p>
          <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            Palabras en alemán: {total} básicas con traducción y ejemplos
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground">
            Estas son las palabras en alemán que más se repiten al empezar: saludos, personas, comida, casa,
            tiempo, verbos, preguntas y adjetivos. Cada una viene con su artículo, su traducción al español y
            una frase de ejemplo para que la uses de inmediato.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Practicar estas palabras con audio
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#tabla-saludos-y-frases-del-dia-a-dia"
              className="inline-flex items-center rounded-full border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              Ir a la lista
            </a>
          </div>
        </section>

        <nav aria-label="Temas" className="mb-12 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {GROUPS.map((g) => (
            <a
              key={g.tema}
              href={`#tabla-${slug(g.tema)}`}
              className="rounded-xl border border-border/70 bg-card px-4 py-3 text-sm font-medium transition hover:border-primary/60"
            >
              {g.tema}
            </a>
          ))}
        </nav>

        {GROUPS.map((g) => (
          <section key={g.tema} id={`tabla-${slug(g.tema)}`} className="mb-12 scroll-mt-20">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{g.tema}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{g.nota}</p>
            <div className="mt-4 overflow-x-auto rounded-xl border border-border/70">
              <table className="w-full min-w-[520px] border-collapse text-sm">
                <thead>
                  <tr className="bg-card text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th scope="col" className="px-4 py-3 font-semibold">Alemán</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Español</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Ejemplo</th>
                  </tr>
                </thead>
                <tbody>
                  {g.palabras.map((w) => (
                    <tr key={w.de} className="border-t border-border/60">
                      <td className="px-4 py-3 font-semibold text-primary" lang="de">{w.de}</td>
                      <td className="px-4 py-3">{w.es}</td>
                      <td className="px-4 py-3 text-muted-foreground" lang="de">{w.ejemplo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}

        <section className="mb-12">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Cómo memorizar palabras en alemán sin aburrirte
          </h2>
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

        <section className="mb-12 rounded-2xl border border-primary/30 bg-card p-6 sm:p-8">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            ¿Por qué cambian los artículos? Las declinaciones alemanas
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            En alemán el artículo de una palabra cambia según su función en la frase. Eso se llama declinación o
            «casos». Entender Nominativ, Akkusativ, Dativ y Genitiv te permite construir frases correctas desde el
            primer día.
          </p>
          <Link
            to="/declinaciones-aleman"
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            Ver la guía de declinaciones
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/numeros-en-aleman"
            className="mt-5 ml-3 inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            Números en alemán del 0 al 100
            <ArrowRight className="h-4 w-4" />
          </Link>

        </section>

        <section className="rounded-2xl border border-primary/30 bg-card p-6 sm:p-8">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Practica estas palabras con audio real
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            En Deutsch Lernspiel escuchas cada palabra a velocidad lenta, normal o nativa, la escribes,
            la usas en frases con Nominativ, Akkusativ, Dativ y Genitiv, y el repaso inteligente te la vuelve a
            mostrar justo antes de que se te olvide. Tu avance queda guardado.
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
