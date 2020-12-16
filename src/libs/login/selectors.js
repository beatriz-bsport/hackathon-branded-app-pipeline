// @flow
//
import type { State } from '../../state/types.ts';

export const getTempPasswordState = (state: State) => state.login.tempPassword;
