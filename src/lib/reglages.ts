import type { SupabaseClient } from "@supabase/supabase-js";
import { boutiqueParDefaut, type CategorieConfig, type ModeLivraison } from "../config/shopConfig";

export interface Boutique {
  nom: string;
  slogan: string;
  description: string;
  couleurs: { marque: string; marqueFonce: string; accent: string };
  whatsapp: { numero: string; numeroAffiche: string; messageAccueil: string };
  email: string;
  garantieJours: number;
  adresse: { ligne1: string; ville: string; pays: string; repere: string; lienCarte: string };
  horaires: { jours: string; heures: string }[];
  categories: CategorieConfig[];
  controle: { point: string; resultat: string }[];
  livraison: ModeLivraison[];
  faq: { question: string; reponse: string }[];
}

const COULEUR = /^#[0-9a-fA-F]{6}$/;
const couleur = (v: unknown, defaut: string) => (typeof v === "string" && COULEUR.test(v) ? v : defaut);
const liste = <T>(v: unknown, defaut: T[]): T[] => (Array.isArray(v) ? (v as T[]) : defaut);

/** Lit les réglages en base ; toute valeur absente retombe sur shopConfig.ts (le site ne plante jamais). */
export async function chargerReglages(db: SupabaseClient): Promise<Boutique> {
  const d = boutiqueParDefaut;
  const [reglages, categories] = await Promise.all([
    db.from("reglages").select("*").eq("id", 1).maybeSingle(),
    db.from("categories").select("slug, nom, description, icone").eq("actif", true).order("ordre").order("nom"),
  ]);
  if (reglages.error) console.error("Réglages illisibles :", reglages.error.message);
  if (categories.error) console.error("Catégories illisibles :", categories.error.message);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const l: Record<string, any> = reglages.data ?? {};
  return {
    nom: l.nom ?? d.nom,
    slogan: l.slogan ?? d.slogan,
    description: l.description ?? d.description,
    couleurs: {
      marque: couleur(l.couleur_marque, d.couleurs.marque),
      marqueFonce: couleur(l.couleur_marque_fonce, d.couleurs.marqueFonce),
      accent: couleur(l.couleur_accent, d.couleurs.accent),
    },
    whatsapp: {
      numero: l.whatsapp_numero ?? d.whatsapp.numero,
      numeroAffiche: l.whatsapp_affiche ?? d.whatsapp.numeroAffiche,
      messageAccueil: l.whatsapp_message ?? d.whatsapp.messageAccueil,
    },
    email: l.email ?? d.email,
    garantieJours: l.garantie_jours ?? d.garantieJours,
    adresse: {
      ligne1: l.adresse_ligne1 ?? d.adresse.ligne1,
      ville: l.adresse_ville ?? d.adresse.ville,
      pays: l.adresse_pays ?? d.adresse.pays,
      repere: l.adresse_repere ?? d.adresse.repere,
      lienCarte: l.lien_carte ?? d.adresse.lienCarte,
    },
    horaires: liste(l.horaires, d.horaires),
    categories: categories.error ? d.categories : ((categories.data ?? []) as CategorieConfig[]),
    controle: liste(l.controle, d.controle),
    livraison: liste(l.livraison, d.livraison),
    faq: liste(l.faq, d.faq),
  };
}
