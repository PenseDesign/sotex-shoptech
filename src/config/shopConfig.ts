/**
 * ============================================================
 *  VALEURS PAR DÉFAUT DE LA BOUTIQUE
 *  Ces valeurs servent de repli tant que le gestionnaire n'a pas
 *  enregistré ses propres réglages dans /admin/reglages.
 * ============================================================
 */

export type IconeCategorie = "chromebook" | "tablette" | "laptop" | "accessoire";

export interface CategorieConfig {
  slug: string;
  nom: string;
  description: string;
  icone: IconeCategorie;
}

export interface ModeLivraison {
  titre: string;
  zone: string;
  delai: string;
  detail: string;
  paiement: string;
}

export const boutiqueParDefaut = {
  nom: "Heili Fundation",
  slogan: "Du matériel tech d'Europe, testé et garanti",
  description:
    "Chromebooks, tablettes éducatives et laptops d'occasion importés d'Europe, contrôlés avant la vente. Retrait à Douala-Yassa, livraison partout au Cameroun, paiement après vérification.",

  couleurs: {
    marque: "#1E3A8A",
    marqueFonce: "#142A66",
    accent: "#F5B700",
  },

  whatsapp: {
    /** Format international, sans « + » ni espaces */
    numero: "237600000000",
    numeroAffiche: "+237 6 00 00 00 00",
    messageAccueil: "Bonjour, j'ai une question sur vos appareils.",
  },
  email: "contact@heili-fundation.cm",

  devise: "FCFA",
  garantieJours: 30,

  adresse: {
    ligne1: "Quartier Yassa, sur l'axe lourd Douala – Yaoundé",
    ville: "Douala",
    pays: "Cameroun",
    repere: "Ajoutez ici un repère facile à trouver (station, carrefour, enseigne voisine).",
    lienCarte: "https://www.google.com/maps/search/?api=1&query=Yassa+Douala+Cameroun",
  },

  horaires: [
    { jours: "Lundi – Vendredi", heures: "08h00 – 18h00" },
    { jours: "Samedi", heures: "09h00 – 16h00" },
    { jours: "Dimanche", heures: "Fermé" },
  ],

  categories: [
    {
      slug: "chromebooks",
      nom: "Chromebooks",
      description: "Légers, rapides et parfaits pour l'école et le télétravail.",
      icone: "chromebook",
    },
    {
      slug: "tablettes",
      nom: "Tablettes éducatives",
      description: "Pour apprendre, lire et suivre les cours à distance.",
      icone: "tablette",
    },
    {
      slug: "laptops",
      nom: "Laptops d'occasion",
      description: "Dell, HP, Lenovo : des PC professionnels robustes.",
      icone: "laptop",
    },
    {
      slug: "accessoires",
      nom: "Accessoires",
      description: "Sacs, souris et petits équipements pour bien démarrer.",
      icone: "accessoire",
    },
  ] satisfies CategorieConfig[],

  /** Points affichés dans la carte « Contrôle avant mise en vente » (accueil) */
  controle: [
    { point: "Batterie", resultat: "Santé mesurée" },
    { point: "Écran", resultat: "Aucun point mort" },
    { point: "Clavier et pavé tactile", resultat: "Toutes touches testées" },
    { point: "Stockage", resultat: "État de santé OK" },
    { point: "Wi-Fi, Bluetooth, ports", resultat: "Fonctionnels" },
  ],

  livraison: [
    {
      titre: "Coursier à domicile",
      zone: "Douala",
      delai: "Le jour même ou sous 24 h",
      detail: "Un coursier vous apporte l'appareil à l'adresse de votre choix.",
      paiement: "Vous payez à la livraison, après avoir vérifié l'appareil.",
    },
    {
      titre: "Coursier à domicile",
      zone: "Yaoundé",
      delai: "Sous 24 à 48 h",
      detail: "Livraison à domicile ou en point de rendez-vous convenu.",
      paiement: "Vous payez à la livraison, après avoir vérifié l'appareil.",
    },
    {
      titre: "Agences de voyages partenaires",
      zone: "Autres villes (Bafoussam, Garoua, Bertoua, Kribi…)",
      delai: "Selon l'horaire du prochain départ",
      detail:
        "Envoi par Finexs, Touristique, Général Express ou Buca Voyages. Vous récupérez le colis en agence.",
      paiement: "Le gestionnaire vous explique la procédure sécurisée sur WhatsApp avant tout envoi.",
    },
    {
      titre: "Retrait à la boutique",
      zone: "Douala-Yassa",
      delai: "Sur rendez-vous, aux heures d'ouverture",
      detail: "Venez tester l'appareil sur place avant de décider.",
      paiement: "Vous payez sur place, après vérification.",
    },
  ] satisfies ModeLivraison[],

  faq: [
    {
      question: "Comment fonctionne la livraison ?",
      reponse:
        "À Douala et à Yaoundé, un coursier vous livre à domicile. Pour les autres villes, nous expédions par les agences de voyages partenaires (Finexs, Touristique et autres) et vous retirez le colis en agence. Vous pouvez aussi venir récupérer l'appareil à Douala-Yassa.",
    },
    {
      question: "Quand est-ce que je paie ?",
      reponse:
        "À Douala et à Yaoundé, vous payez au coursier à la livraison, après avoir contrôlé l'appareil. Pour les envois vers les autres villes, le gestionnaire vous explique la procédure sécurisée sur WhatsApp avant tout envoi.",
    },
    {
      question: "Que dois-je vérifier à la réception ?",
      reponse:
        "Allumez l'appareil, regardez l'écran, testez le clavier, le Wi-Fi, les ports et la batterie. Notre livreur vous laisse le temps de tout contrôler. Si l'appareil ne correspond pas à la fiche, vous ne payez pas.",
    },
    {
      question: "Les appareils d'occasion sont-ils vraiment testés ?",
      reponse:
        "Oui. Chaque appareil est contrôlé avant d'arriver en rayon : batterie, écran, clavier, stockage et connectique. L'état (Grade A, Grade B, neuf scellé) est indiqué sur chaque fiche.",
    },
    {
      question: "Y a-t-il une garantie ?",
      reponse:
        "Chaque appareil est garanti 30 jours contre les pannes qui ne sont pas dues à une mauvaise utilisation. Le gestionnaire vous le confirme au moment de la commande.",
    },
    {
      question: "Puis-je voir l'appareil avant d'acheter ?",
      reponse:
        "Oui. Venez à la boutique de Douala-Yassa aux heures d'ouverture. Écrivez-nous d'abord sur WhatsApp pour que l'appareil soit prêt à votre arrivée.",
    },
  ],
};

