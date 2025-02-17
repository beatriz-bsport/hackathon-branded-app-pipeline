import mixpanel from 'mixpanel-browser';

import Config from '../../../config';

export const initMixpanel = () => {
  mixpanel.init(Config.REACT_APP_MIXPANEL_TOKEN, {
    debug: process.env.NODE_ENV !== 'production',
    track_pageview: 'url-with-path-and-query-string',
  });
};
