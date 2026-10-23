// Importe les produits d'exemple dans Supabase (à lancer une seule fois : npm run importer)
import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";

const url = process.env.SUPABASE_URL;
const cle = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !cle) {
  console.error("Renseignez SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY dans le fichier .env");
  process.exit(1);
}

const db = createClient(url, cle, { auth: { persistSession: false } });
const exemples = JSON.parse(
  await readFile(new URL("../supabase/produits-exemple.json", import.meta.url), "utf8"),
);

const { data: categories, error: erreurCategories } = await db.from("categories").select("id, slug");
if (erreurCategories) throw erreurCategories;
const idParSlug = Object.fromEntries(categories.map((c) => [c.slug, c.id]));

const lignes = exemples.map((p) => {
  if (!idParSlug[p.categorie]) throw new Error(`Catégorie inconnue : ${p.categorie}`);
  return {
    reference: p.id,
    slug: p.slug,
    nom: p.nom,
    marque: p.marque,
    categorie_id: idParSlug[p.categorie],
    etat: p.etat,
    prix: p.prix,
    stock: p.stock,
    statut: p.stock > 0 ? "disponible" : "rupture",
    visible: true,
    date_ajout: new Date(p.dateAjout).toISOString(),
    resume: p.resume,
    description: p.description,
    points_forts: p.pointsForts,
    caracteristiques: p.caracteristiques,
    images: [],
  };
});

const { error } = await db.from("produits").upsert(lignes, { onConflict: "slug" });
if (error) throw error;
console.log(`${lignes.length} produits importés.`);
