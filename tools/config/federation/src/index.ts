const FEDERATED_APP_CONFIG = {
  // Reserved for the template
  "simple-b2b-app": {
    port: 4999,
  },
  // Applications
  "navigation-sidebar": {
    port: 5000,
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

// TODO: getProductionFederationRemotes() which returns actual URLs on our servers
//
// Suggested format:
// https://xxxxx.bsport.io/apps/$APP_NAME/assets/module.js
