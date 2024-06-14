import React from 'react';

export type NavigationItem = {
  title: string;
  icon?: React.ReactElement;
  goTo?: string;
  isCollapsable?: boolean;
  onClick?: () => void;
  rightSlot?: React.ReactElement;
  buildUrl?: (string: any) => string;
};

export type NavigationSection = {
  title?: string;
  isCollapsable?: boolean;
  navigationItems: NavigationItem[];
  buildUrl?: (string: any) => string;
};

export type NavigationMenu = NavigationSection[];

export type NavigationProps = {
  isBottomDrawerOpen?: boolean;
  isMobile: boolean;
  navigationMenu: NavigationMenu;
  buildUrl: (string: any) => string;
};
