import type { URLParams } from "@bsport/store-base";

// ----- Models -----

/**
 * Model: Collection (ex-Playlist)
 */
export type Collection = {
  id: number;
  name: string;
  description: string;
  company: number;
  consumer: number;
  cover_main: string;
  videos: number[];
};

// ----- Params -----

export type FetchCollectionsParams = {
  page?: number;
  page_size?: number;
  mine?: boolean;
  company?: number;
} & URLParams;

export type CreateCollectionParams = {
  name: string;
  description?: string;
};

export type UpdateCollectionParams = {
  id: number;
  data: FormData;
};
