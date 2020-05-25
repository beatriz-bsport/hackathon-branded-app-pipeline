import { createSelector } from 'reselect';

import memoize from 'memoize-one';
import { getVideoData } from '../video/selectors';
import { getAllCoachesDict as getCoachData } from '../associated-coach/selectors';

const getPlaylistListIds = (state) => state.playlist.list.allIds;
const getPlaylistData = (state) => state.playlist.byId;

export const getPlaylistList = createSelector(
  [getPlaylistListIds, getPlaylistData],
  (ids, data) => ids.map((id) => data[id]),
);

export const getPlaylist = (state, id) => state.playlist.byId[id];

export const withCoachInVideo = memoize((selector) =>
  createSelector(
    [withVideo(selector), getCoachData],
    (playlists, coachData) => {
      if (Array.isArray(playlists)) {
        return playlists.map((pl) => ({
          ...pl,
          videos: pl.videos
            .filter((v) => !!v)
            .map((v) => ({
              ...v,
              coaches: v.coaches
                .map((c) =>
                  Object.values(coachData).find((coach) =>
                    coach.associatedcoach_set.includes(c),
                  ),
                )
                .filter((c) => !!c),
            })),
        }));
      }
      if (playlists) {
        return {
          ...playlists,
          videos: playlists.videos
            .filter((v) => !!v)
            .map((v) => ({
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
      }
      return null;
    },
  ),
);

export const withVideo = memoize((selector) =>
  createSelector(
    [selector, getVideoData],
    (playlists, videoData) => {
      if (Array.isArray(playlists)) {
        return playlists.map((pl) => ({
          ...pl,
          videos: pl.videos.map((v) => videoData[v]),
        }));
      }
      if (playlists) {
        return {
          ...playlists,
          videos: playlists.videos.map((v) => videoData[v]),
        };
      }
      return null;
    },
  ),
);
