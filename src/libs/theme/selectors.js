// @flow

import type { State } from '../../state/types';
import type { Theme } from './types';

const getTheme = (state: State): ?Theme => state.theme.theme;

export default { getTheme };
