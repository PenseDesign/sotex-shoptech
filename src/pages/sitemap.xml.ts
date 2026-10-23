import type { APIRoute } from "astro";
import { chargerProduitsPublics } from "../lib/produits";

export const GET: APIRoute = async ({ locals, url }) => {
  const produits = await chargerProduitsPublics(locals.db);
  const pages = ["/", "/boutique", "/contact", ...produits.map((p) => `/produit/${p.slug}`)];
  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    pages.map((p) => `<url><loc>${url.origin}${p}</loc></url>`).join("") +
    `</urlset>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
