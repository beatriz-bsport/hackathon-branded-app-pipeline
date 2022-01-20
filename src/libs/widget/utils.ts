import moment from 'moment';

export const getIntercomLink = () =>
  `https://intercom.help/bsport-helpcenter/${moment
    .locale()
    .slice(0, 2)}/articles/4942264`;
