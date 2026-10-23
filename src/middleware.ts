import { defineMiddleware } from "astro:middleware";
import { creerClientPublic, creerClientSession } from "./lib/supabase";
import { chargerReglages } from "./lib/reglages";

async function estAdministrateur(supabase: ReturnType<typeof creerClientSession>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
  return data ? user : null;
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  context.locals.db = creerClientPublic();
  context.locals.boutique = await chargerReglages(context.locals.db);
  context.locals.user = null;

  if (!pathname.startsWith("/admin")) return next();

  // Zone d'administration : session obligatoire (sauf la page de connexion)
  const supabase = creerClientSession(context.request, context.cookies);
  context.locals.supabase = supabase;
  context.locals.user = await estAdministrateur(supabase);

  const pageConnexion = pathname.replace(/\/$/, "") === "/admin/connexion";
  if (!context.locals.user && !pageConnexion) return context.redirect("/admin/connexion");

  const reponse = await next();
  reponse.headers.set("Cache-Control", "no-store");
  return reponse;
});
