import { RootState } from '../../reducers';

export const getCustomCssConfiguration = (state: RootState) =>
  state.exportableComponents.customCss;
