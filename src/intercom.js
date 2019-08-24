// @flow

export const openIntercomHelp = (pageName: ?string) => {
  switch (pageName) {
    case 'login':
      window.open(
        'https://intercom.help/bsport-helpcenter/fr/collections/1904174-difficultes-de-connexion',
      );
      break;
    default:
      window.open('https://intercom.help/bsport-helpcenter/fr');
      break;
  }
};
