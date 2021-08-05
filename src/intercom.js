// @flow

const storage = window.localStorage;

const langage = (storage.getItem('i18nextLng') || '').slice(0, 2);

export const openIntercomHelp = (pageName: ?string) => {
  switch (pageName) {
    case 'login':
      window.open(
        `https://intercom.help/bsport-helpcenter/${
          langage || 'fr'
        }/collections/2348822`,
      );
      break;
    default:
      window.open(`https://intercom.help/bsport-helpcenter/${langage || 'fr'}`);
      break;
  }
};
