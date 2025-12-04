import { MuiIconName } from '#src/components/input/muiIcon/MuiIconNameType';
import { ErrorAndLoading } from '#src/libs/types';

export type CustomShopRedirection = {
  id: string;
  name: string;
  icon: MuiIconName;
  url: string;
  idx: number;
};

export type MobilePopup = {
  id: number;
  name: string;
  image: string;
  link: string;
  date_created: string;
  smartlist_name: string;
};

export type CustomMobilePopup = {
  id: number;
  name: string;
  image: string;
  link: string;
  date_created: string;
};

export type CustomMobilePopupCreateOrEditData = Omit<
  CustomMobilePopup,
  'id' | 'date_created'
>;

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
    byId: Record<string, MobilePopup>;
    allIds: string[];
  } & ErrorAndLoading;
  customAppNavigation: {
    tabNames: CustomAppNavigationTabsNames;
  } & ErrorAndLoading;
};
