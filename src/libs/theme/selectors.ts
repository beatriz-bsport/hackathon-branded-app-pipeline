// @flow

import { RootState } from '../../reducers/index.ts';

const getTheme = (state: RootState) => state.theme.theme;

export default { getTheme };
