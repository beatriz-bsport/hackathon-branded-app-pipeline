// @flow

import { createSelector } from 'reselect';
import type { State } from '../../state/types';
import type { RootState } from '../../reducers';
import { replaceDates } from './utils';

const _getDashboardSettings = (state: State) =>
  state.dashboardSettings.data.settings;

export const getDashboardConfiguration = createSelector(
  _getDashboardSettings,
  (settings) => {
    if (settings && settings.length) {
      return settings.map((dashboardTab) => ({
        ...dashboardTab,
        graphs: replaceDates(dashboardTab.graphs),
      }));
    }
    return [];
  },
);

export const getDashboardConfigurationTab = createSelector(
  [getDashboardConfiguration, (state, tabIndex) => tabIndex],
  (tabConfigurationList, tabIndex) => {
    if (
      tabConfigurationList &&
      tabConfigurationList.length >= tabIndex + 1 &&
      tabConfigurationList[tabIndex]
    ) {
      return tabConfigurationList[tabIndex];
    }
    return null;
  },
);

// ---------------------------------------------
export const getDataSourceDashboardGraphMetadata = (state: RootState) =>
  state.dashboardSettings.dataSourceDashboardGraphs.metadata.results;

export const getDataSourceDashboardSettings = (state: RootState) =>
  state.dashboardSettings.dataSourceDashboardGraphs.settings.results;

export const getDataSourceDashboardSettingsTab = createSelector(
  [getDataSourceDashboardSettings, (state, tabIndex) => tabIndex],
  (dataSourceDashboardSettings, tabIndex) => {
    if (
      dataSourceDashboardSettings?.length >= tabIndex + 1 &&
      dataSourceDashboardSettings[tabIndex]
    ) {
      return dataSourceDashboardSettings[tabIndex];
    }
    return {};
  },
);
