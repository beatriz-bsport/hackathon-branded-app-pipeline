import Config from '../config';

enum DefaultProfilePictureUrl {
  PRODUCTION = 'https://assets.production.bsport.io/default_profile_picture.svg',
  STAGING = 'https://assets.staging.bsport.io/default_profile_picture.svg',
  DEV = 'https://assets.dev.bsport.io/default_profile_picture.svg',
}

const getDefaultProfilePictureUrl = () => {
  switch (Config.REACT_APP_SENTRY_ENVIRONMENT) {
    case 'production':
      return DefaultProfilePictureUrl.PRODUCTION;
    case 'staging':
      return DefaultProfilePictureUrl.STAGING;
    default:
      return DefaultProfilePictureUrl.DEV;
  }
};

const DEFAULT_PROFILE_PICTURE_URL = getDefaultProfilePictureUrl();

export default DEFAULT_PROFILE_PICTURE_URL;
