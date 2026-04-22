const INDEX = "..";

const SEGMENTS = {
  COLLECTION: "collection",
  MEDIA: "media",
} as const;

export const URLS = {
  INDEX,
  COLLECTION_DETAILS_SLUG: `${SEGMENTS.COLLECTION}/:collectionId`,
  COLLECTION_DETAILS: (id: number) => `${INDEX}/${SEGMENTS.COLLECTION}/${id}`,
  COLLECTION: SEGMENTS.COLLECTION,
  MEDIA: SEGMENTS.MEDIA,
} as const;
