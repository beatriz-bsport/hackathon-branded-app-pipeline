export const URLS = {
  INDEX: "..",
} as const;

export const LEGACY_URLS = {
  PACK_DETAILS: (packId: number) => `/combo/${packId}`,
  CREATE: "/combo?openForm=true",
} as const;
