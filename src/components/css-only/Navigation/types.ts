import type { Props as ButtonProps } from '#Fabrique/ButtonV2';
import type { MarketplaceTabConfig } from '#src/libs/marketplace/types';

export type ButtonData = Pick<
  ButtonProps,
  'color' | 'leftIcon' | 'rightIcon' | 'variant' | 'onClick'
> & {
  isIconButton?: boolean;
  label: string;
};

export type AppBarRightButtons = ButtonData[];

// Temporary here to give indication to the next dev when we'll need to code the marketplace app bar
export type AppBarTabs = {
  // hideAppBar?: boolean;
  // onlyNavigation?: boolean;
  // handleTabChange?: (
  //   event: React.SyntheticEvent<HTMLElement>,
  //   value: number,
  // ) => void;
  // tabSelected?: string;
  tabConfigs?: MarketplaceTabConfig[];
  // theme?: CompanyTheme;
};

export type AppBarProps = {
  isMobile?: boolean;
  logo?: string;
  onClickMenuButton?: () => void;
  rightButtons?: AppBarRightButtons;
  tabs?: AppBarTabs;
  webSiteUrl?: string;
};
