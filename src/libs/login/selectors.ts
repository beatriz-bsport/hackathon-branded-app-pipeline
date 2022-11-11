import type { State } from '../../state/types';

export const getTempPasswordState = (state: State) => state.login.tempPassword;

export const isPendingEmailConfirmation = (state: State) =>
  state.auth.email_confirmed === false; // initialized at null value
