import React from 'react';

export const Context = React.createContext({
  displayLeftMenu: true,
  hideLeftMenuAction: () => {},
  showLeftMenuAction: () => {},
});

export const PermissionContext = React.createContext(null);
PermissionContext.displayName = 'Permission';
