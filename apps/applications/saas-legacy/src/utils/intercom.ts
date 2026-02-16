export const openIntercomConversation = () => {
  try {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log('Intercom conversation opened');
    }
    window.Intercom?.('showNewMessage');
  } catch (e) {
    console.error('Failed to open new Intercom conversation', e);
  }
};

export const closeIntercom = () => {
  try {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log('Intercom conversation closed');
    }
    window.Intercom?.('hide');
  } catch (e) {
    console.error('Failed to close Intercom', e);
  }
};
