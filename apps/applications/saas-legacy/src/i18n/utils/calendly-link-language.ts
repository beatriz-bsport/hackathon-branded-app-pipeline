import Config from '../../config';

const supportedLangu = ['en', 'fr', 'de', 'es', 'it', 'pt', 'nl'];

const langu =
  navigator &&
  navigator.language &&
  supportedLangu.includes(navigator.language.substr(0, 2))
    ? navigator.language.substr(0, 2)
    : 'en';

const getCalendlyLinkFromCountry = (companyName: string | null) => {
  switch (langu) {
    case 'en':
    case 'fr':
    case 'it':
    case 'nl':
    case 'es':
      return `https://pro.bsport.io/${langu}/bookDemo/?utm_content=signin&utm_source=${
        Config.REACT_APP_SENTRY_ENVIRONMENT
      }&utm_medium=referral&utm_campaign=${companyName || 'bsport'}`;
    default:
      return `https://pro.bsport.io/en/bookDemo/?utm_content=signin&utm_source=${
        Config.REACT_APP_SENTRY_ENVIRONMENT
      }&utm_medium=referral&utm_campaign=${companyName || 'bsport'}`;
  }
};

export default getCalendlyLinkFromCountry;
