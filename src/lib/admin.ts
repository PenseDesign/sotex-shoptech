/** Petits utilitaires partagés par les pages /admin. */

export const texte = (f: FormData, nom: string) => String(f.get(nom) ?? "").trim();

export function entier(f: FormData, nom: string): number {
  const n = Number.parseInt(texte(f, nom).replace(/[\s\u00a0\u202f]/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
}

export function slugifier(valeur: string): string {
  return valeur
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** N'autorise que les redirections internes vers /admin (évite les redirections ouvertes). */
export function securiserRetour(valeur: string, defaut: string): string {
  return valeur.startsWith("/admin") && !valeur.startsWith("//") ? valeur : defaut;
}

/** Lit un groupe de lignes répétables (champs `groupe__cle`). Ignore les lignes dont le premier champ est vide. */
export function lireRepeteur(f: FormData, groupe: string, cles: string[]): Record<string, string>[] {
  const colonnes = cles.map((c) => f.getAll(`${groupe}__${c}`).map((v) => String(v).trim()));
  const n = Math.max(0, ...colonnes.map((c) => c.length));
  const lignes: Record<string, string>[] = [];
  for (let i = 0; i < n; i++) {
    const ligne = Object.fromEntries(cles.map((c, j) => [c, colonnes[j][i] ?? ""]));
    if (ligne[cles[0]]) lignes.push(ligne);
  }
  return lignes;
}

export function messageErreur(e: { code?: string; message: string }): string {
  if (e.code === "23505") return "Ce nom, cette adresse ou cette référence existe déjà.";
  if (e.code === "23503") return "Cet élément est encore utilisé ailleurs : déplacez ou supprimez d'abord ce qui en dépend.";
  if (e.code === "42501") return "Action non autorisée pour ce compte.";
  return `Une erreur est survenue : ${e.message}`;
}

/** Chemin de photo valide dans le stockage (ex. 2026/3f2a….jpg). */
export const CHEMIN_PHOTO = /^[A-Za-z0-9_\-/]+\.(jpg|jpeg|png|webp)$/;
