export enum TaxonRank {
  Species = "species",
  Genus = "genus",
  Family = "family",
  Order = "order",
  Class = "class",
  Phylum = "phylum",
  Kingdom = "kingdom",
}

export type TaxonPhoto = {
  url: string;
  attribution: string;
};

export type TaxonSummary = {
  id: number;
  name: string;
  preferredCommonName: string | null;
  rank: TaxonRank;
  photo: TaxonPhoto | null;
  iconicTaxonName: string | null;
};

export type Taxon = TaxonSummary & {
  wikipediaUrl: string | null;
  observationsCount: number;
  conservationStatus: string | null;
  ancestors: TaxonSummary[];
  defaultPhotoLarge: string | null;
};
