import { createSelector } from 'reselect';

import memoize from 'memoize-one';
import { getVideoData } from '../video/selectors';
import { getAllCoachesDict as getCoachData } from '../associated-coach/selectors';
import { RootState } from '../../reducers';
import { Playlist } from './types';
import { Video } from '../video/types';

const getPlaylistListIds = (state: RootState) => state.playlist.list.allIds;
const getPlaylistData = (state: RootState) => state.playlist.byId;

export const getPlaylistList = createSelector(
  [getPlaylistListIds, getPlaylistData],
  (ids, data) => ids.map((id) => data[id]),
);

export const getPlaylist = (state: RootState, id: number) =>
  state.playlist.byId[id];

export const withCoachInVideo = memoize((selector: any) =>
  createSelector(
    [withVideo(selector), getCoachData],
    (playlists: Playlist<Video>, coachData) => {
      const videoWithCoachInPlaylist = (_playlists: Playlist<Video>) => {
        return {
          ..._playlists,
          videos: _playlists.videos
            .filter((v: Video) => !!v)
            .map((v: Video) => ({
              ...v,
              coaches: v.coaches
                .map((c) =>
                  Object.values(coachData).find((coach) =>
                    coach.associatedcoach_set.includes(c),
                  ),
                )
                .filter((c) => !!c),
            })),
        };
      };
      if (Array.isArray(playlists)) {
        return playlists
          .map((pl) => videoWithCoachInPlaylist(pl))
          .filter((pl) => pl.videos.length);
      }

      if (playlists) {
        return videoWithCoachInPlaylist(playlists);
      }

      return null;
    },
  ),
);

export const withVideo = memoize((selector: any) =>
  createSelector([selector, getVideoData], (playlists, videoData) => {
    const videosInPlaylists = (_playlists: Playlist) => {
      return {
        ..._playlists,
        videos: _playlists.videos.map((v) => videoData[v]),
      };
    };

    if (Array.isArray(playlists)) {
      return playlists
        .map((pl) => videosInPlaylists(pl))
        .filter((pl) => pl.videos.length);
    }
    if (playlists) {
      return videosInPlaylists(playlists as any);
    }
    return null;
  }),
);
