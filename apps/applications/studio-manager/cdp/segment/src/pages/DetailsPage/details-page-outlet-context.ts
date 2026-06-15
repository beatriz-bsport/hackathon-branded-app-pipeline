import type { Smartlist } from "@bsport/api-cdp/smartlist";

export type DetailsPageOutletContext = {
  smartlistId: string;
  smartlist: Smartlist;
  isParameterDrawerOpen: boolean;
  openParameterDrawer: () => void;
  closeParameterDrawer: () => void;
};
