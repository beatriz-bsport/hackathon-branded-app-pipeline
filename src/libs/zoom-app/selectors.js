// @flow

import { RootState } from '../../reducers';

const getZoomApp = (state: RootState) => state.zoomApp.detail;

export default { getZoomApp };
