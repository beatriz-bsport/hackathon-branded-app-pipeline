import { getAuthToken } from "@bsport/local-storage-auth-token";

import type { AuthState } from "./store";

export const selectUserAccess = (state: AuthState) => state.userAccess;

export const getIsLoggedIn = () => !!getAuthToken();

export const selectTemporaryPassword = (state: AuthState) =>
  state.temporaryPassword;
