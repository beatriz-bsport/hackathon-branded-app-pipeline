import { MuiIconName } from '#src/components/input/muiIcon/MuiIconNameType';
import { ErrorAndLoading } from '#src/libs/types';

export type CustomShopRedirection = {
  id: string;
  name: string;
  icon: MuiIconName;
  url: string;
  idx: number;
};

export type CustomMobilePopup = {
  id: number;
  name: string;
  image: string;
  link: string;
  date_created: string;
};

export type CustomAppNavigationTabsNames = {
  bookings: string | null;
  schedule: string | null;
  activities: string | null;
  studio: string | null;
  profile: string | null;
};

export type SettingsState = {
  customShopRedirection: {
    byId: Record<string, CustomShopRedirection>;
    allIds: string[];
  } & ErrorAndLoading;
  customMobilePopup: {
    byId: Record<string, CustomMobilePopup>;
    allIds: string[];
  } & ErrorAndLoading;
  customAppNavigation: {
    tabNames: CustomAppNavigationTabsNames;
  } & ErrorAndLoading;
};
