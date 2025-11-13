export const openIntercomConversation = () => {
  try {
    window.Intercom?.('showNewMessage');
  } catch (e) {
    console.error('Failed to open new Intercom conversation', e);
  }
};

export const closeIntercom = () => {
  try {
    window.Intercom?.('hide');
  } catch (e) {
    console.error('Failed to close Intercom', e);
  }
};
