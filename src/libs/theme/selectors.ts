// @flow

import { RootState } from '../../reducers';

const getTheme = (state: RootState) => state.theme.theme;

export default { getTheme };
