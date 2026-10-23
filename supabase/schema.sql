-- =====================================================================
--  À coller dans Supabase > SQL Editor > New query > Run
-- =====================================================================

-- 1. Administrateurs --------------------------------------------------
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);
alter table public.admins enable row level security;
create policy "un admin lit sa propre ligne" on public.admins
  for select to authenticated using (user_id = auth.uid());

create or replace function public.est_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;
revoke all on function public.est_admin() from public;
grant execute on function public.est_admin() to anon, authenticated;

-- 2. Mise à jour automatique de updated_at ------------------------------
create or replace function public.maj_updated_at() returns trigger
language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

-- 3. Catégories ---------------------------------------------------------
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  nom text not null,
  description text not null default '',
  icone text not null default 'laptop' check (icone in ('chromebook','tablette','laptop','accessoire')),
  ordre integer not null default 0,
  actif boolean not null default true
);
alter table public.categories enable row level security;
create policy "lecture categories" on public.categories
  for select using (actif or public.est_admin());
create policy "admin gere categories" on public.categories
  for all to authenticated using (public.est_admin()) with check (public.est_admin());

insert into public.categories (slug, nom, description, icone, ordre) values
  ('chromebooks','Chromebooks','Légers, rapides et parfaits pour l''école et le télétravail.','chromebook',1),
  ('tablettes','Tablettes éducatives','Pour apprendre, lire et suivre les cours à distance.','tablette',2),
  ('laptops','Laptops d''occasion','Dell, HP, Lenovo : des PC professionnels robustes.','laptop',3),
  ('accessoires','Accessoires','Sacs, souris et petits équipements pour bien démarrer.','accessoire',4)
on conflict (slug) do nothing;

-- 4. Produits -----------------------------------------------------------
create table public.produits (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  slug text not null unique,
  nom text not null,
  marque text not null default '',
  categorie_id uuid not null references public.categories (id) on delete restrict,
  etat text not null default 'occasion-grade-a'
    check (etat in ('neuf-scelle','occasion-grade-a','occasion-grade-b','reconditionne')),
  prix integer not null check (prix > 0),
  stock integer not null default 1 check (stock >= 0),
  statut text not null default 'disponible' check (statut in ('disponible','vendu','rupture')),
  visible boolean not null default true,
  resume text not null default '',
  description text not null default '',
  points_forts text[] not null default '{}',
  caracteristiques jsonb not null default '{}'::jsonb,
  images text[] not null default '{}' check (cardinality(images) <= 8),
  date_ajout timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index produits_categorie_idx on public.produits (categorie_id);
create index produits_visible_date_idx on public.produits (visible, date_ajout desc);
create trigger produits_updated_at before update on public.produits
  for each row execute function public.maj_updated_at();

alter table public.produits enable row level security;
create policy "lecture produits" on public.produits
  for select using (visible or public.est_admin());
create policy "admin gere produits" on public.produits
  for all to authenticated using (public.est_admin()) with check (public.est_admin());

-- 5. Réglages de la boutique (une seule ligne) ---------------------------
create table public.reglages (
  id integer primary key default 1 check (id = 1),
  nom text, slogan text, description text,
  couleur_marque text, couleur_marque_fonce text, couleur_accent text,
  whatsapp_numero text, whatsapp_affiche text, whatsapp_message text,
  email text, garantie_jours integer,
  adresse_ligne1 text, adresse_ville text, adresse_pays text, adresse_repere text, lien_carte text,
  horaires jsonb, controle jsonb, livraison jsonb, faq jsonb,
  updated_at timestamptz not null default now()
);
create trigger reglages_updated_at before update on public.reglages
  for each row execute function public.maj_updated_at();
alter table public.reglages enable row level security;
create policy "lecture reglages" on public.reglages for select using (true);
create policy "admin gere reglages" on public.reglages
  for all to authenticated using (public.est_admin()) with check (public.est_admin());
insert into public.reglages (id) values (1) on conflict do nothing;

-- 6. Photos (Storage) -----------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('produits', 'produits', true, 3145728, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

create policy "admin envoie des photos" on storage.objects
  for insert to authenticated with check (bucket_id = 'produits' and public.est_admin());
create policy "admin modifie des photos" on storage.objects
  for update to authenticated using (bucket_id = 'produits' and public.est_admin());
create policy "admin supprime des photos" on storage.objects
  for delete to authenticated using (bucket_id = 'produits' and public.est_admin());

-- 7. PREMIER ADMINISTRATEUR ------------------------------------------------
-- a) Supabase > Authentication > Users > Add user (e-mail + mot de passe, cochez "Auto Confirm User").
-- b) Remplacez l'e-mail ci-dessous, puis exécutez cette ligne seule :
--
-- insert into public.admins (user_id) select id from auth.users where email = 'gestionnaire@exemple.com';
