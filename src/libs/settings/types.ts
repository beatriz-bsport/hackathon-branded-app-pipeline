import { MuiIconName } from '#components/input/muiIcon/MuiIconNameType';
import { ErrorAndLoading } from '#libs/types';

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

export type SettingsState = {
  customShopRedirection: {
    byId: Record<string, CustomShopRedirection>;
    allIds: string[];
  } & ErrorAndLoading;
  customMobilePopup: {
    byId: Record<string, CustomMobilePopup>;
    allIds: string[];
  } & ErrorAndLoading;
};
