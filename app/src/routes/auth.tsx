import { createFileRoute, useNavigate, useSearch, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Rocket, Target, Pencil, Headphones, Scale, Shuffle, Layers } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const FEATURES = [
  { icon: Target, title: "Quiz rápido", desc: "Opciones múltiples para reconocer palabras y frases." },
  { icon: Pencil, title: "Escritura activa", desc: "Escribes la respuesta en alemán para recordarla." },
  { icon: Headphones, title: "Dictado con audio", desc: "Escuchas y escribes con voz real en alemán." },
  { icon: Scale, title: "Casos alemanes", desc: "Nominativ, Akkusativ, Dativ y Genitiv explicados." },
  { icon: Shuffle, title: "Conjugación y verbos", desc: "Präsens, Perfekt, Präteritum y verbos modales." },
  { icon: Layers, title: "Tarjetas SRS", desc: "Repaso inteligente que se adapta a tu ritmo." },
];

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): { mode?: "signup" | "signin"; next?: string } => {
    const out: { mode?: "signup" | "signin"; next?: string } = {};
    if (search['mode'] === "signup") out.mode = "signup";
    const next = search['next'];
    // Only same-origin relative paths are allowed as a post-login redirect.
    if (typeof next === "string" && next.startsWith("/") && !next.startsWith("//")) out.next = next;
    return out;
  },
  head: () => ({
    meta: [
      { title: "Entrar o crear cuenta gratis | Deutsch Lernspiel" },
      {
        name: "description",
        content:
          "Crea tu cuenta gratis y practica alemán A1 y A2 en español: vocabulario, casos, verbos y audio real con tu avance guardado.",
      },
      { property: "og:title", content: "Entra y practica alemán gratis | Deutsch Lernspiel" },
      {
        property: "og:description",
        content: "Quiz, dictado con voz real, casos alemanes y repaso inteligente, con tu progreso sincronizado.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://aprenderaleman.app/auth" },
      { property: "og:image", content: "https://aprenderaleman.app/og-image.jpg" },
      { name: "twitter:image", content: "https://aprenderaleman.app/og-image.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://aprenderaleman.app/auth" }],
  }),
  component: AuthPage,
});

function GermanFlagIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <rect width="24" height="8" y="0" fill="#1a1a1a" />
      <rect width="24" height="8" y="8" fill="#DD0000" />
      <rect width="24" height="8" y="16" fill="#FFCE00" />
    </svg>
  );
}

export function AuthPage() {
  const navigate = useNavigate();
  const { mode: initialMode, next } = useSearch({ strict: false }) as {
    mode?: "signup" | "signin";
    next?: string;
  };
  const [mode, setMode] = useState<"signin" | "signup">(initialMode ?? "signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const go = () => {
      if (next) {
        window.location.replace(next);
        return;
      }
      navigate({ to: "/", replace: true });
    };
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) go();
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) go();
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate, next]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: next ? window.location.origin + next : window.location.origin,
            data: { display_name: name || email.split("@")[0] },
          },
        });
        if (signUpError) throw signUpError;
        if (!data.session) {
          const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
          if (signInError) throw signInError;
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Algo salió mal. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-[100dvh] bg-background lg:grid-cols-2">
      {/* Columna del formulario */}
      <div className="flex items-center justify-center px-6 py-14">
        <div className="w-full max-w-sm">
          <Link
            to="/"
            className="ds-focus inline-block text-xs font-bold tracking-[0.2em] text-primary uppercase"
          >
            Deutsch Lernspiel
          </Link>

          <h1 className="mt-10 text-3xl font-bold tracking-tight text-foreground">
            Aprende alemán jugando
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Vocabulario, casos, verbos, dictado con voz real y lecturas A1–A2 en español.
          </p>
          <p className="mt-4 text-sm font-semibold text-foreground">
            {mode === "signin"
              ? "Entra y sigue donde quedaste con tu avance guardado."
              : "Crea tu cuenta gratis: en 10 segundos empiezas a practicar."}
          </p>

          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setError(null);
            }}
            className="ds-focus mt-8 flex h-12 w-full items-center justify-center gap-3 rounded-full bg-primary text-sm font-bold text-primary-foreground transition-colors duration-150 hover:bg-primary/90"
          >
            {mode === "signup" ? "Crea tu cuenta gratis" : "Empieza gratis en 10 segundos"}
          </button>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label htmlFor="name" className="mb-1.5 block text-xs font-semibold text-foreground">
                  Tu nombre <span className="font-normal text-muted-foreground">(opcional)</span>
                </label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="ds-focus h-12 w-full rounded-full border border-border bg-card px-5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  placeholder="Gonzalo"
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="ds-focus h-12 w-full rounded-full border border-border bg-card px-5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-xs font-semibold text-foreground">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="ds-focus h-12 w-full rounded-full border border-border bg-card px-5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="ds-focus h-12 w-full rounded-full bg-primary text-sm font-bold text-primary-foreground transition-colors duration-150 hover:bg-primary/90 disabled:opacity-60"
            >
              {loading ? "Un momento…" : "Continuar"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signin" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin");
                setError(null);
              }}
              className="ds-focus font-semibold text-foreground underline underline-offset-4"
            >
              {mode === "signin" ? "Crea tu cuenta" : "Inicia sesión"}
            </button>
          </p>
        </div>
      </div>

      {/* Panel derecho: vitrina de métodos de práctica */}
      <aside className="relative hidden overflow-hidden lg:block">
        <div className="absolute inset-4 overflow-hidden rounded-3xl bg-[#0f0f10]">
          <div className="auth-glow auth-glow-a" />
          <div className="auth-glow auth-glow-b" />
          <div className="auth-glow auth-glow-c" />

          <div className="relative flex h-full flex-col justify-between p-10">
            <div className="flex items-center justify-between">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold tracking-wider text-primary uppercase backdrop-blur-sm">
                Nuevo enfoque
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20">
                <Rocket className="h-5 w-5 text-primary" />
              </div>
            </div>

            <div className="space-y-6">
              <div className="auth-fade-in-up auth-delay-1">
                <p className="text-3xl font-black leading-[1.1] tracking-tight text-white">
                  Práctica diaria, no listas para memorizar.
                </p>
                <p className="mt-2 text-sm font-medium text-white/60">
                  Audio real, casos gramaticales y repaso inteligente en sesiones de 5 minutos.
                </p>
              </div>

              <div className="auth-feature-grid">
                {FEATURES.map((f, i) => (
                  <div
                    key={f.title}
                    className={`auth-feature-card auth-fade-in-up auth-delay-${i + 2}`}
                  >
                    <div className="auth-feature-icon">
                      <f.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white">{f.title}</p>
                      <p className="text-xs leading-snug text-white/60">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="auth-fade-in-up auth-delay-8">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                      3
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Lecciones nuevas esta semana</p>
                      <p className="text-xs text-white/60">Caso genitivo, narrativas y más audio real.</p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setError(null);
                }}
                className="auth-fade-in-up auth-delay-9 group flex w-full items-center justify-end gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:pr-6"
              >
                <ArrowLeft className="h-6 w-6 text-primary transition-transform duration-300 group-hover:-translate-x-2" />
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-medium uppercase tracking-widest text-white/40">Empieza ahora</span>
                  <span className="text-xl font-extrabold leading-none tracking-tight text-primary transition-colors duration-300 group-hover:text-white">
                    Inscríbete gratis
                  </span>
                </div>
              </button>

              <Link
                to="/palabras-en-aleman"
                className="auth-fade-in-up auth-delay-9 block text-right text-xs text-white/50 underline-offset-4 transition hover:text-white hover:underline"
              >
                Ver 100 palabras en alemán con ejemplos
              </Link>

              <Link
                to="/numeros-en-aleman"
                className="auth-fade-in-up auth-delay-9 block text-right text-xs text-white/50 underline-offset-4 transition hover:text-white hover:underline"
              >
                Números en alemán del 0 al 100
              </Link>

              <Link
                to="/abecedario-aleman"
                className="auth-fade-in-up auth-delay-9 block text-right text-xs text-white/50 underline-offset-4 transition hover:text-white hover:underline"
              >
                Abecedario alemán con pronunciación
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </main>
  );
}
