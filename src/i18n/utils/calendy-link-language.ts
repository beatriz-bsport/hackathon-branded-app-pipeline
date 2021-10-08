const supportedLangu = ['en', 'fr', 'de', 'es', 'it', 'pt', 'nl'];

const langu =
  navigator &&
  navigator.language &&
  supportedLangu.includes(navigator.language.substr(0, 2))
    ? navigator.language.substr(0, 2)
    : 'en';

const getCalendyLinkFromCountry = () => {
  switch (langu) {
    case 'en':
      return 'https://calendly.com/bsport-english/demo';
    case 'fr':
      return 'https://calendly.com/bsport-french/demo';
    case 'de':
      return 'https://calendly.com/bsport-deutsch/demo';
    case 'es':
      return 'https://calendly.com/bsport-espanol/demo';
    case 'it':
      return 'https://calendly.com/bsport-italiano/demo';
    case 'pt':
      return 'https://calendly.com/bsport-portuguese/demo';
    case 'nl':
      return 'https://calendly.com/bsport-emea/demo';

    default:
      return 'https://calendly.com/bsport-english/demo';
  }
};

export default getCalendyLinkFromCountry;
