/// <reference types="astro/client" />
import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { Boutique } from "./lib/reglages";

declare global {
  namespace App {
    interface Locals {
      boutique: Boutique;
      /** Client anonyme : lecture publique */
      db: SupabaseClient;
      /** Client lié à la session de l'administrateur (routes /admin) */
      supabase: SupabaseClient;
      user: User | null;
    }
  }
}
