import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = "deutschA1";

export const Route = createFileRoute("/")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>): { mode?: "signup" | "signin"; next?: string } => {
    const out: { mode?: "signup" | "signin"; next?: string } = {};
    if (search['mode'] === "signup") out.mode = "signup";
    const next = search['next'];
    if (typeof next === "string" && next.startsWith("/") && !next.startsWith("//")) out.next = next;
    return out;
  },
  head: () => ({
    meta: [
      { title: "Aprende alemán jugando — Deutsch Lernspiel" },
      {
        name: "description",
        content:
          "Practica alemán A1 y A2 en español: vocabulario, casos, verbos, audio real y lecturas. Gratis, sin registro; crea cuenta solo si quieres guardar tu avance.",
      },
      { property: "og:title", content: "Aprende alemán jugando — Deutsch Lernspiel" },
      {
        property: "og:description",
        content:
          "Vocabulario, casos alemanes, verbos, dictado con audio real y repaso inteligente. Gratis y en español.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://deutsch-gonzalo.onrender.com/" },
      { property: "og:image", content: "https://deutsch-gonzalo.onrender.com/og-image.jpg" },
      { name: "twitter:image", content: "https://deutsch-gonzalo.onrender.com/og-image.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://deutsch-gonzalo.onrender.com/" }],
  }),
  component: LearnPage,
});

function readLocal(): Record<string, unknown> | null {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function LearnPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const lastSaved = useRef<string>("");
  const remoteUpdatedAt = useRef<number>(0);

  // 1. Si hay sesión, carga perfil + avance de la nube ANTES de que arranque el juego.
  //    Sin sesión, el juego arranca igual con el avance local.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        const user = userData.user;
        if (user) {
          if (!cancelled) {
            setSignedIn(true);
            setEmail(user.email ?? null);
          }

          const [{ data: profile }, { data: progress }] = await Promise.all([
            supabase.from("profiles").select("display_name").eq("id", user.id).maybeSingle(),
            supabase
              .from("learning_progress")
              .select("data, updated_at")
              .eq("user_id", user.id)
              .maybeSingle(),
          ]);

          const remote = (progress?.data ?? null) as Record<string, unknown> | null;
          remoteUpdatedAt.current = progress?.updated_at ? Date.parse(progress.updated_at) : 0;

          let state: Record<string, unknown> | null = null;
          if (remote && Object.keys(remote).length > 0) {
            state = remote;
          } else {
            state = readLocal();
          }

          // Nombre: perfil → nombre del juego → parte antes de la @
          const metaName =
            (user.user_metadata?.['display_name'] as string | undefined) ??
            (user.user_metadata?.['full_name'] as string | undefined);
          const name =
            profile?.display_name?.trim() ||
            metaName?.trim() ||
            (typeof state?.['userName'] === "string" ? (state['userName'] as string).trim() : "") ||
            (user.email ? user.email.split("@")[0]! : "");
          if (!cancelled) setDisplayName(name || null);

          // Sembramos el nombre en el avance para no volver a pedirlo en el onboarding.
          if (name && state && !state['userName']) state['userName'] = name;

          if (state) {
            const serialized = JSON.stringify(state);
            window.localStorage.setItem(STORAGE_KEY, serialized);
            lastSaved.current = serialized;
          } else {
            lastSaved.current = "";
          }
        } else {
          lastSaved.current = window.localStorage.getItem(STORAGE_KEY) ?? "";
        }
      } catch {
        /* si falla la carga remota, arrancamos con el avance local */
      }
      // Siempre arrancamos el juego, haya sesión o no.
      if (!cancelled) setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // 2. Sube los cambios locales a la nube solo si hay sesión.
  useEffect(() => {
    if (!ready || !signedIn) return;

    const push = async () => {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw === lastSaved.current) return;

      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) return;

      // Si el avance en la nube es más nuevo (otro dispositivo), lo traemos en vez de sobrescribir.
      const { data: head } = await supabase
        .from("learning_progress")
        .select("data, updated_at")
        .eq("user_id", user.id)
        .maybeSingle();
      const headAt = head?.updated_at ? Date.parse(head.updated_at) : 0;
      if (headAt > remoteUpdatedAt.current) {
        const remote = (head?.data ?? null) as Record<string, unknown> | null;
        if (remote && Object.keys(remote).length > 0) {
          const serialized = JSON.stringify(remote);
          window.localStorage.setItem(STORAGE_KEY, serialized);
          lastSaved.current = serialized;
          remoteUpdatedAt.current = headAt;
          return;
        }
      }

      // Reset dentro del juego: borró el avance local, hay que limpiar también la nube.
      const parsed = raw ? readLocal() : {};
      if (!parsed) return;

      setSaving(true);
      const { error } = await supabase
        .from("learning_progress")
        .upsert({ user_id: user.id, data: parsed as never }, { onConflict: "user_id" });
      if (!error) {
        lastSaved.current = raw ?? "";
        remoteUpdatedAt.current = Date.now();
      }
      setSaving(false);
    };

    const interval = window.setInterval(push, 8000);
    const onHide = () => void push();
    window.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onHide);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onHide);
      void push();
    };
  }, [ready, signedIn]);

  async function handleSignOut() {
    const parsed = readLocal();
    const { data: userData } = await supabase.auth.getUser();
    if (parsed && userData.user) {
      try {
        await supabase
          .from("learning_progress")
          .upsert({ user_id: userData.user.id, data: parsed as never }, { onConflict: "user_id" });
      } catch {
        /* ignore malformed local state */
      }
    }
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    setSignedIn(false);
    setDisplayName(null);
    setEmail(null);
  }

  return (
    <div className="flex h-[100dvh] flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border gap-3 px-4 py-2.5 lg:px-9 lg:py-3">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            to="/"
            className="ds-focus rounded text-xs font-bold tracking-widest text-primary uppercase transition-opacity hover:opacity-80"
          >
            Deutsch
          </Link>
          <span className="hidden text-xs text-muted-foreground sm:inline">
            {signedIn ? (saving ? "Guardando…" : "Avance sincronizado") : "Avance guardado en este dispositivo"}
          </span>
        </div>
        <div className="flex min-w-0 items-center gap-3">
          {signedIn ? (
            <>
              {displayName && (
                <span
                  className="hidden text-[11px] font-medium text-foreground sm:inline"
                  title={email ?? undefined}
                >
                  Hola, {displayName}
                </span>
              )}
              <button
                type="button"
                onClick={handleSignOut}
                className="ds-focus rounded-lg border border-border px-3 py-1.5 text-[11px] font-semibold text-foreground transition-colors duration-150 hover:bg-accent"
              >
                Salir
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => navigate({ to: "/auth", search: { next: "/" } })}
              className="ds-focus rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground transition-colors duration-150 hover:bg-primary/90"
            >
              Entrar para guardar tu avance
            </button>
          )}
        </div>
      </header>
      <div className="min-h-0 flex-1">
        {ready ? (
          <iframe
            src="/lernspiel/index.html"
            title="Deutsch Lernspiel"
            className="h-full w-full border-0"
            allow="clipboard-write; microphone"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Cargando…
          </div>
        )}
      </div>
    </div>
  );
}
