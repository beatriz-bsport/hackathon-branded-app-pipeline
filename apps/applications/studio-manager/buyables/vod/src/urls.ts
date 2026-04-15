const SEGMENTS = {
  COLLECTIONS: "collections",
  MEDIAS: "medias",
} as const;

export const URLS = {
  INDEX: "..",
  COLLECTIONS: SEGMENTS.COLLECTIONS,
  MEDIAS: SEGMENTS.MEDIAS,
} as const;
