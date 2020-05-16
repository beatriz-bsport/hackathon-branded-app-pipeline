// @flow

export const openIntercomHelp = (pageName: ?string) => {
  switch (pageName) {
    case 'login':
      window.open(
        'https://intercom.help/bsport-helpcenter/fr/collections/2348822',
      );
      break;
    default:
      window.open('https://intercom.help/bsport-helpcenter/fr');
      break;
  }
};
