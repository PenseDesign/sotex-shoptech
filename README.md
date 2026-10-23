# Boutique marque blanche : Astro + Tailwind + Supabase + Cloudflare

Site catalogue avec espace d'administration (`/admin`). Le gestionnaire gère produits, photos, catégories et réglages sans toucher au code.

## 1. Créer la base (Supabase, 10 minutes)
1. Créez un projet sur supabase.com (région Europe).
2. **SQL Editor > New query** : collez tout `supabase/schema.sql`, puis **Run**.
3. **Authentication > Users > Add user** : e-mail + mot de passe du gestionnaire, cochez *Auto Confirm User*.
4. Dans le SQL Editor, exécutez (avec son e-mail) :
   `insert into public.admins (user_id) select id from auth.users where email = 'gestionnaire@exemple.com';`
5. **Project Settings > API** : notez `Project URL` et la clé `anon public`.

## 2. Lancer en local
```bash
cp .env.example .env       # puis renseignez SUPABASE_URL et SUPABASE_ANON_KEY
npm install
npm run dev                # http://localhost:4321  (admin : /admin)
```

## 3. Importer les 11 produits d'exemple (une seule fois)
Ajoutez `SUPABASE_SERVICE_ROLE_KEY` dans votre `.env` local (clé *service_role*, Project Settings > API), puis :
```bash
npm run importer
```
Cette clé ne doit **jamais** être ajoutée sur Cloudflare ni partagée.

## 4. Mettre en ligne (Cloudflare Pages)
1. Poussez le projet sur GitHub.
2. Cloudflare > Workers & Pages > Create > Pages > Connect to Git.
3. Build command : `npm run build` ; Build output directory : `dist`.
4. Variables d'environnement : `SUPABASE_URL`, `SUPABASE_ANON_KEY` et `NODE_VERSION` = `22`.
5. Si le build affiche « Invalid binding SESSION », ignorez-le : les sessions Astro ne sont pas utilisées (la connexion passe par Supabase).

## Revendre à un nouveau client
Un projet Supabase + un déploiement Cloudflare par client (mêmes fichiers, autres variables d'environnement). Le client personnalise tout dans `/admin/reglages` : nom, couleurs, WhatsApp, adresse, horaires, livraison, FAQ.
`src/config/shopConfig.ts` ne contient que les valeurs de départ.

## Sécurité
- Lecture publique limitée aux produits « visibles » ; modification réservée aux comptes listés dans la table `admins` (règles RLS dans `schema.sql`).
- Les formulaires admin sont protégés contre les envois depuis un autre site (contrôle d'origine d'Astro).
- Seules les clés `anon` sont utilisées par le site.
