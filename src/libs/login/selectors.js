// @flow
//
import type { State } from '../../state/types';

export const getTempPasswordState = (state: State) => state.login.tempPassword;
