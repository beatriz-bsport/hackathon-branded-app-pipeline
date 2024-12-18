import React from 'react';

export const DrawerContext = React.createContext({
  displayLeftMenu: true,
  hideLeftMenuAction: () => {},
  showLeftMenuAction: () => {},
});

export type DrawerContextValue = {
  displayLeftMenu: boolean;
  hideLeftMenuAction: () => void;
  showLeftMenuAction: () => void;
};

export const PermissionContext = React.createContext(null);
PermissionContext.displayName = 'Permission';
