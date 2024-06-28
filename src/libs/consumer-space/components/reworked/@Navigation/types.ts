import React from 'react';

export type NavigationItem = {
  title: string;
  icon?: React.ReactElement;
  goTo?: string;
  isCollapsable?: boolean;
  className?: string;
  isCurrentRoute?: boolean;
  onClick?: () => void;
  rightSlot?: React.ReactElement;
  buildUrl?: (string: any) => string;
};

export type NavigationSection = {
  title?: string;
  isCollapsable?: boolean;
  navigationItems: NavigationItem[];
  hasDivider?: boolean;
  buildUrl?: (string: any) => string;
};

export type NavigationMenu = NavigationSection[];

export type NavigationProps = {
  isBottomDrawerOpen?: boolean;
  isMobile: boolean;
  navigationMenu: NavigationMenu;
  memberName?: string;
  onBottomDrawerClose: () => void;
  buildUrl: (string: any) => string;
};
