import { VideoKey } from "@/constants/videos";

export type Collection = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  videoKey: VideoKey;
  taxonIds: readonly number[];
  accentLabel: string;
};

export const Collections: readonly Collection[] = [
  {
    slug: "ancient-forests",
    accentLabel: "I — Le silence",
    title: "Le silence\ndes forêts anciennes.",
    subtitle: "Là où l'ombre garde la mémoire des siècles.",
    description:
      "Sous les voûtes des chênes et des hêtres centenaires, le temps ralentit. La forêt ancienne respire à un autre rythme — celui des mousses, des champignons et des oiseaux qui n'ont jamais quitté la pénombre.",
    videoKey: VideoKey.ForestDawn,
    taxonIds: [47651, 56133, 47857, 6053, 42231, 56152],
  },
  {
    slug: "where-water-dances",
    accentLabel: "II — L'eau",
    title: "Là où\nl'eau danse.",
    subtitle: "Rivières, ruisseaux, gouttes accrochées aux fougères.",
    description:
      "L'eau sculpte la pierre, dépose les graines, abrite mille vies discrètes. Suivez son fil et découvrez ceux qui n'existent que là où elle coule.",
    videoKey: VideoKey.MistRiver,
    taxonIds: [49893, 42178, 9518, 5006, 41906, 67314],
  },
  {
    slug: "ground-level",
    accentLabel: "III — Au ras du sol",
    title: "Au ras\ndu sol.",
    subtitle: "Le monde minuscule, juste sous nos pas.",
    description:
      "Penchez-vous. La mousse, les escargots, les vers de terre, les lézards qui dorment au soleil — toute une civilisation qu'on traverse sans la voir.",
    videoKey: VideoKey.MossClose,
    taxonIds: [58598, 36055, 30713, 154, 81598],
  },
  {
    slug: "high-alpine",
    accentLabel: "IV — Les hauteurs",
    title: "Les hauteurs\nnues.",
    subtitle: "Là où l'air se raréfie et la lumière devient minérale.",
    description:
      "Au-dessus de la dernière forêt, la montagne se dépouille. Y vivent ceux qui supportent le froid, le vent, et la solitude des cimes.",
    videoKey: VideoKey.GoldenHour,
    taxonIds: [42408, 5101, 43622, 5181, 42394],
  },
  {
    slug: "pollinators-ballet",
    accentLabel: "V — Le ballet",
    title: "Le ballet\ndes pollinisateurs.",
    subtitle: "Sans eux, presque rien ne fleurit.",
    description:
      "Abeilles, bourdons, papillons, sphinx — les artisans invisibles qui maintiennent les paysages en couleurs et les vergers en fruits.",
    videoKey: VideoKey.Wildflowers,
    taxonIds: [47219, 121507, 81516, 49133, 66097],
  },
  {
    slug: "sky-sentinels",
    accentLabel: "VI — Sentinelles",
    title: "Les sentinelles\ndu ciel.",
    subtitle: "Veilleurs silencieux, du crépuscule à l'aube.",
    description:
      "Faucons, chouettes, milans, aigles — les rapaces lisent le monde d'en-haut, et n'oublient rien de ce qu'ils survolent.",
    videoKey: VideoKey.FernLight,
    taxonIds: [4665, 5212, 6029, 5221, 5114],
  },
];

export const findCollection = (slug: string): Collection | undefined =>
  Collections.find((collection) => collection.slug === slug);
