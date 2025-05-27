import type { AuthState } from "./store";

export const selectUserAccess = (state: AuthState) => state.userAccess;
