const FEDERATED_APP_CONFIG = {
  // Reserved for the template
  "sm-group-activity": {
    port: 4998,
  },
  // Reserved for the template
  "template-sm-application": {
    port: 4999,
  },
  // Applications
  "sm-navigation-sidebar": {
    port: 5000,
  },
  // Core Data : Range 5100
  "sm-member-list": {
    port: 5101,
  },
  // Buyables : Range 5150
  "sm-giftcard": {
    port: 5151,
  },
  // Financial services : Range 5200
  "sm-invoice": {
    port: 5201,
  },
};

export type APPLICATION = keyof typeof FEDERATED_APP_CONFIG;

/**
 * Returns a specific application's port
 */
export const getAppPort = (app: APPLICATION) => {
  return FEDERATED_APP_CONFIG[app].port;
};

/**
 * Returns a map of federation endpoints usable within apps.
 */
export const getLocalFederationRemotes = () => {
  const remotes: Record<string, string> = {};

  for (const remote of Object.keys(FEDERATED_APP_CONFIG)) {
    const port = FEDERATED_APP_CONFIG[remote as APPLICATION].port;
    const url = `http://localhost:${port}/assets/module.js`;

    remotes[remote as APPLICATION] = url;
  }

  return remotes as Record<APPLICATION, string>;
};

export { getConfig } from "./config";
