import {
  AUTOMATION_TAB_PATH,
  CAMPAIGN_TAB_PATH,
  PARAMETER_TAB_PATH,
} from "#src/utils/constants";

export type DetailsTabPath =
  | typeof PARAMETER_TAB_PATH
  | typeof CAMPAIGN_TAB_PATH
  | typeof AUTOMATION_TAB_PATH;

type HeaderCallToAction = "campaign" | "automation" | null;

type HeaderTabConfig = {
  showDropdown: boolean;
  callToAction: HeaderCallToAction;
};

const HEADER_ACTIONS_BY_TAB: Record<DetailsTabPath, HeaderTabConfig> = {
  [PARAMETER_TAB_PATH]: {
    showDropdown: false,
    callToAction: null,
  },
  [CAMPAIGN_TAB_PATH]: {
    showDropdown: true,
    callToAction: "campaign",
  },
  [AUTOMATION_TAB_PATH]: {
    showDropdown: true,
    callToAction: "automation",
  },
};

export const getDetailsActiveTabPath = (pathname: string): DetailsTabPath => {
  if (pathname.includes(CAMPAIGN_TAB_PATH)) {
    return CAMPAIGN_TAB_PATH;
  }

  if (pathname.includes(AUTOMATION_TAB_PATH)) {
    return AUTOMATION_TAB_PATH;
  }

  return PARAMETER_TAB_PATH;
};

export const getHeaderTabConfig = (
  activeTabPath: DetailsTabPath,
): HeaderTabConfig => {
  return HEADER_ACTIONS_BY_TAB[activeTabPath];
};
