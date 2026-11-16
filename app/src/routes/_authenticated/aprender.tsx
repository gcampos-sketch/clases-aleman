import { createFileRoute, redirect } from "@tanstack/react-router";

// La ruta /aprender quedó obsoleta: el juego vive en "/" y el login es opcional.
// Redirigimos a la portada para no romper enlaces antiguos.
export const Route = createFileRoute("/_authenticated/aprender")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});
