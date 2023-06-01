import { createSelector } from 'reselect';
import { RootState } from '../../reducers';

export const getCustomCssConfiguration = (state: RootState) =>
  state.exportableComponents.customCss;

export const getCustomCssConfigurationLoading = (state: RootState) =>
  state.exportableComponents.loading;

export const getCustomCssForComponent = createSelector(
  [
    getCustomCssConfiguration,
    (_: RootState, componentId: string) => componentId,
  ],
  (customCss, id) =>
    customCss.components_css
      ? customCss.components_css?.[id] ?? null
      : undefined,
);
