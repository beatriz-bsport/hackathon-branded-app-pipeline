// @flow

import { processDashboard } from './chart-ressources';
import type { State } from '../../state/types.ts';

export const getDashboardGraphs = (state: State) => {
  if (state.dashboardSettings.data.settings) {
    return processDashboard(state.dashboardSettings.data.settings);
  }
  return [];
};
