import { createClient } from "@supabase/supabase-js";
import { createServerClient, parseCookieHeader } from "@supabase/ssr";
import type { AstroCookies } from "astro";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "astro:env/server";

function verifier() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Variables SUPABASE_URL et SUPABASE_ANON_KEY manquantes (voir README).");
  }
}

/** Client anonyme : lecture publique uniquement (aucune session, aucun cookie). */
export function creerClientPublic() {
  verifier();
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Client lié à la session de l'administrateur (stockée dans des cookies). */
export function creerClientSession(request: Request, cookies: AstroCookies) {
  verifier();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return parseCookieHeader(request.headers.get("Cookie") ?? "").map((c) => ({
          name: c.name,
          value: c.value ?? "",
        }));
      },
      setAll(liste) {
        liste.forEach(({ name, value, options }) => cookies.set(name, value, options));
      },
    },
  });
}

export function urlBasePhotos() {
  return `${SUPABASE_URL}/storage/v1/object/public/produits/`;
}

export function urlPhoto(chemin: string) {
  return urlBasePhotos() + chemin;
}
