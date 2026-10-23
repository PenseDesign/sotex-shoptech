import type { APIRoute } from "astro";

const TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const reponse = (corps: object, status = 200) =>
  new Response(JSON.stringify(corps), { status, headers: { "Content-Type": "application/json" } });

export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.user) return reponse({ erreur: "Session expirée, reconnectez-vous." }, 401);

  const formulaire = await request.formData();
  const fichier = formulaire.get("fichier");
  if (!(fichier instanceof File)) return reponse({ erreur: "Aucun fichier reçu." }, 400);

  const extension = TYPES[fichier.type];
  if (!extension) return reponse({ erreur: "Format non accepté (JPG, PNG ou WebP)." }, 415);
  if (fichier.size > 3 * 1024 * 1024) return reponse({ erreur: "Photo trop lourde (3 Mo maximum)." }, 413);

  const chemin = `${new Date().getFullYear()}/${crypto.randomUUID()}.${extension}`;
  const { error } = await locals.supabase.storage
    .from("produits")
    .upload(chemin, fichier, { contentType: fichier.type, cacheControl: "31536000" });
  if (error) return reponse({ erreur: `Envoi impossible : ${error.message}` }, 500);

  return reponse({ chemin });
};
