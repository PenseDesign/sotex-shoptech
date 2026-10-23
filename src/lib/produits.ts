import type { SupabaseClient } from "@supabase/supabase-js";
import type { IconeCategorie } from "../config/shopConfig";
import { urlPhoto } from "./supabase";

export type EtatProduit = "neuf-scelle" | "occasion-grade-a" | "occasion-grade-b" | "reconditionne";
export type StatutProduit = "disponible" | "vendu" | "rupture";

export interface Produit {
  id: string;
  reference: string;
  slug: string;
  nom: string;
  marque: string;
  categorieId: string;
  categorie: string; // slug
  categorieNom: string;
  categorieIcone: IconeCategorie;
  etat: EtatProduit;
  /** Prix cash en FCFA */
  prix: number;
  stock: number;
  statut: StatutProduit;
  visible: boolean;
  dateAjout: string;
  /** URLs complètes, la première est la photo principale */
  images: string[];
  /** Chemins dans le stockage (utilisés par l'admin) */
  imagesChemins: string[];
  resume: string;
  description: string;
  pointsForts: string[];
  caracteristiques: Record<string, string>;
}

export const ETATS: Record<EtatProduit, { libelle: string; classes: string; schema: string }> = {
  "neuf-scelle": { libelle: "Neuf scellé", classes: "bg-emerald-100 text-emerald-900", schema: "https://schema.org/NewCondition" },
  "occasion-grade-a": { libelle: "Occasion d'Europe Grade A", classes: "bg-sky-100 text-sky-900", schema: "https://schema.org/UsedCondition" },
  "occasion-grade-b": { libelle: "Occasion d'Europe Grade B", classes: "bg-amber-100 text-amber-900", schema: "https://schema.org/UsedCondition" },
  reconditionne: { libelle: "Reconditionné", classes: "bg-violet-100 text-violet-900", schema: "https://schema.org/RefurbishedCondition" },
};

export const STATUTS: Record<StatutProduit, string> = {
  disponible: "Disponible",
  vendu: "Vendu",
  rupture: "En rupture",
};

export const SELECTION_PRODUIT = "*, categories(slug, nom, icone)";

interface LigneProduit {
  id: string;
  reference: string;
  slug: string;
  nom: string;
  marque: string;
  categorie_id: string;
  etat: EtatProduit;
  prix: number;
  stock: number;
  statut: StatutProduit;
  visible: boolean;
  date_ajout: string;
  resume: string;
  description: string;
  points_forts: string[] | null;
  caracteristiques: Record<string, string> | null;
  images: string[] | null;
  categories: { slug: string; nom: string; icone: IconeCategorie } | null;
}

export function versProduit(ligne: unknown): Produit {
  const l = ligne as LigneProduit;
  const chemins = l.images ?? [];
  return {
    id: l.id,
    reference: l.reference,
    slug: l.slug,
    nom: l.nom,
    marque: l.marque,
    categorieId: l.categorie_id,
    categorie: l.categories?.slug ?? "",
    categorieNom: l.categories?.nom ?? "",
    categorieIcone: l.categories?.icone ?? "laptop",
    etat: l.etat,
    prix: l.prix,
    stock: l.stock,
    statut: l.statut,
    visible: l.visible,
    dateAjout: l.date_ajout,
    images: chemins.map(urlPhoto),
    imagesChemins: chemins,
    resume: l.resume,
    description: l.description,
    pointsForts: l.points_forts ?? [],
    caracteristiques: l.caracteristiques ?? {},
  };
}

/** Produits visibles au public, du plus récent au plus ancien (client anonyme : jamais les produits masqués). */
export async function chargerProduitsPublics(db: SupabaseClient): Promise<Produit[]> {
  const { data, error } = await db
    .from("produits")
    .select(SELECTION_PRODUIT)
    .eq("visible", true)
    .order("date_ajout", { ascending: false });
  if (error) {
    console.error("Produits illisibles :", error.message);
    return [];
  }
  return (data ?? []).map(versProduit);
}

export async function chargerProduitParSlug(db: SupabaseClient, slug: string): Promise<Produit | null> {
  const { data, error } = await db
    .from("produits")
    .select(SELECTION_PRODUIT)
    .eq("slug", slug)
    .eq("visible", true)
    .maybeSingle();
  if (error) console.error("Produit illisible :", error.message);
  return data ? versProduit(data) : null;
}

export function formaterPrix(montant: number): string {
  const nombre = new Intl.NumberFormat("fr-FR").format(montant).replace(/[\u202f\u00a0]/g, "\u00a0");
  return `${nombre}\u00a0FCFA`;
}

export function disponibilite(p: Produit): { libelle: string; classe: string; enStock: boolean } {
  if (p.statut === "vendu") return { libelle: "Vendu", classe: "text-red-700", enStock: false };
  if (p.statut === "rupture" || p.stock <= 0)
    return { libelle: "Rupture de stock", classe: "text-red-700", enStock: false };
  if (p.stock <= 2)
    return { libelle: `Plus que ${p.stock} en stock à Douala-Yassa`, classe: "text-amber-700", enStock: true };
  return { libelle: "En stock à Douala-Yassa", classe: "text-emerald-700", enStock: true };
}

export function lienWhatsApp(message: string, numero: string): string {
  return `https://wa.me/${numero}?text=${encodeURIComponent(message)}`;
}

/** Message pré-rempli : le gestionnaire sait tout de suite de quel article il s'agit. */
export function messageCommande(p: Produit, urlPage: string, nomBoutique: string): string {
  return [
    `Bonjour ${nomBoutique}, je souhaite commander cet article :`,
    "",
    `Produit : ${p.nom}`,
    `Prix : ${formaterPrix(p.prix)}`,
    `État : ${ETATS[p.etat].libelle}`,
    `Lien : ${urlPage}`,
    "",
    "Est-il toujours disponible ? Merci.",
  ].join("\n");
}
