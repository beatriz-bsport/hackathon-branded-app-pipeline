import {
  getAuthToken,
  removeAuthToken,
} from "@bsport/local-storage-auth-token";

import { BridgeEvents, EventPayload } from "../types";
import { listenOnMessage, postMessageToParent } from "../utils";

const isAuthenticated = () => !!getAuthToken();

export const handleAuthenticationMessages = () => {
  const listener = async (payload: EventPayload) => {
    if (payload.type === BridgeEvents.REQUEST_AUTHENTICATED_STATUS) {
      // TODO: Store the username in the storage to be able to return it here without calling API
      const authenticationResponse = {
        authenticated: isAuthenticated(),
        username: "test",
      };
      postMessageToParent({
        type: BridgeEvents.RESPONSE_AUTHENTICATED_STATUS,
        data: authenticationResponse,
      });
    }

    if (payload.type === BridgeEvents.REQUEST_LOGOUT) {
      removeAuthToken();
    }
  };

  return listenOnMessage(listener);
};
