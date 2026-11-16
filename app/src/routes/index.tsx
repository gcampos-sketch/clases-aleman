import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { BrandLoader } from "@/components/brand-loader";
import { supabase } from "@/integrations/supabase/client";

import { ProgressSync, type SyncStatus, type Progress, parseProgress } from "@/lib/progress-sync";

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


export function LearnPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("checking");
  const [iframeVersion, setIframeVersion] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [frameLoaded, setFrameLoaded] = useState(false);
  const syncRef = useRef<ProgressSync | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        const user = userData.user;
        if (!user || cancelled) return;
        setSignedIn(true);
        setEmail(user.email ?? null);
        const coordinator = new ProgressSync({
          userId: user.id,
          storage: window.localStorage,
          onStatus: status => { if (!cancelled) setSyncStatus(status); },
          onRemote: () => { if (!cancelled) { setFrameLoaded(false); setIframeVersion(v => v + 1); } },
          store: {
            read: async () => {
              const { data, error } = await supabase.from("learning_progress")
                .select("data, updated_at").eq("user_id", user.id).maybeSingle();
              if (error) throw error;
              return data ? { data: parseProgress(JSON.stringify(data.data)), updated_at: data.updated_at } : null;
            },
            write: async (progress: Progress, revision: string | null) => {
              // Compare-and-set: a stale computer cannot overwrite a newer cloud revision.
              const values = { user_id: user.id, data: progress as never };
              const result = revision
                ? await supabase.from("learning_progress").update({ data: progress as never })
                    .eq("user_id", user.id).eq("updated_at", revision).select("data, updated_at").maybeSingle()
                : await supabase.from("learning_progress").insert(values).select("data, updated_at").single();
              if (result.error?.code === "23505") return null;
              if (result.error) throw result.error;
              return result.data ? {
                data: parseProgress(JSON.stringify(result.data.data)), updated_at: result.data.updated_at,
              } : null;
            },
          },
        });
        syncRef.current = coordinator;
        const { data: profile } = await supabase.from("profiles")
          .select("display_name").eq("id", user.id).maybeSingle();
        if (!cancelled) setDisplayName(profile?.display_name?.trim() || user.email?.split("@")[0] || null);
        await coordinator.initialize();
      } catch {
        if (!cancelled) setSyncStatus("error");
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => { cancelled = true; syncRef.current = null; };
  }, []);

  useEffect(() => {
    if (!ready || !signedIn) return;
    let debounce: number | undefined;
    const sync = () => { void syncRef.current?.sync(); };
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY && event.key !== null) return;
      syncRef.current?.markDirty();
      window.clearTimeout(debounce);
      debounce = window.setTimeout(sync, 350);
    };
    const onVisibility = () => sync();
    const interval = window.setInterval(sync, 5000);
    window.addEventListener("storage", onStorage);
    window.addEventListener("online", sync);
    window.addEventListener("focus", sync);
    document.addEventListener("visibilitychange", onVisibility);
    sync(); // Upload guest progress immediately when the cloud account is empty.
    return () => {
      window.clearInterval(interval); window.clearTimeout(debounce);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("online", sync);
      window.removeEventListener("focus", sync);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [ready, signedIn]);

  async function handleSignOut() {
    setLeaving(true);
    // Keep the session and local copy if the final save fails or needs a conflict choice.
    const saved = await syncRef.current?.sync();
    if (!saved) { setLeaving(false); return; }
    await queryClient.cancelQueries(); queryClient.clear();
    const { error } = await supabase.auth.signOut();
    if (error) { setSyncStatus("error"); setLeaving(false); return; }
    syncRef.current = null;
    setSignedIn(false); setDisplayName(null); setEmail(null); setLeaving(false);
  }

  const syncLabel = {
    checking: "Comprobando el avance…",
    pending: "Cambios pendientes de guardar",
    saving: "Guardando en tu cuenta…",
    saved: "Avance confirmado en la nube",
    error: "No se pudo sincronizar · copia local conservada",
    conflict: "Hay avances distintos en dos computadores",
  }[syncStatus];

  return (
    <div className="flex h-[100dvh] flex-col bg-background">
      <header className="flex flex-wrap items-center justify-between border-b border-border gap-3 px-4 py-2.5 lg:px-9 lg:py-3">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            to="/"
            className="ds-focus rounded text-xs font-bold tracking-widest text-primary uppercase transition-opacity hover:opacity-80"
          >
            <span className="flex items-center gap-2 normal-case tracking-normal"><img src="/favicon.svg" alt="" width="24" height="24" />Deutsch</span>
          </Link>
          <span className="text-xs text-muted-foreground" role="status" aria-live="polite">
            {signedIn ? syncLabel : "Avance guardado solo en este dispositivo"}
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
                onClick={() => void syncRef.current?.sync()}
                disabled={syncStatus === "saving" || leaving}
                className="ds-focus rounded-lg border border-border px-3 py-1.5 text-xs disabled:opacity-50"
              >
                Guardar ahora
              </button>
              <button
                type="button"
                disabled={leaving}
                onClick={handleSignOut}
                className="ds-focus rounded-lg border border-border px-3 py-1.5 text-[11px] font-semibold text-foreground transition-colors duration-150 hover:bg-accent"
              >
                {leaving ? "Guardando…" : "Salir"}
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
      {signedIn && syncStatus === "conflict" && (
        <div className="flex flex-wrap items-center gap-3 border-b border-border bg-card px-4 py-3 text-sm" role="alert">
          <span>Hay cambios en este computador y en la nube. Conservamos una copia antes de cambiar el avance.</span>
          <button className="ds-focus rounded border border-border px-3 py-2" onClick={() => void syncRef.current?.resolve("remote")}>Cargar avance de la nube</button>
          <button className="ds-focus rounded bg-primary px-3 py-2 text-primary-foreground" onClick={() => void syncRef.current?.resolve("local")}>Guardar el de este computador</button>
        </div>
      )}
      <div className="relative min-h-0 flex-1">
        {(!ready || !frameLoaded) && <div className="absolute inset-0 z-10"><BrandLoader label={ready ? "Abriendo tus lecciones…" : "Recuperando tu avance…"} /></div>}
        {ready ? (
          <iframe
            key={iframeVersion}
            src={`/lernspiel/index.html?v=${import.meta.env["VITE_LEARNING_REVISION"] || "dev"}`}
            title="Deutsch Lernspiel"
            onLoad={() => setFrameLoaded(true)}
            className="h-full w-full border-0"
            allow="clipboard-write; microphone"
          />
        ) : (
          null
        )}
      </div>
    </div>
  );
}
