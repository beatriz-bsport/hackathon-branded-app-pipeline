import { RootState } from '../../reducers';

export const getVideoPlaybackUrlState = (state: RootState) =>
  state.bridge.video.playbackUrl.byId;
