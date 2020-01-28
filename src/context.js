import React from 'react';

export const Context = React.createContext({
  displayLeftMenu: true,
  hideLeftMenuAction: () => {},
  showLeftMenuAction: () => {},
});
