import { ErrorAndLoading } from '../types';

export type Playlist<V = number> = {
  id: number;
  name: string;
  description: string;
  company: number;
  consumer: number;
  cover_main: string;
  videos: V[];
};

export type PlaylistState = ErrorAndLoading & {
  byId: { [key: string]: Playlist };
  list: {
    page: number;
    nextPage: number;
    allIds: number[];
  };
  createOrUpdate: ErrorAndLoading;
};
