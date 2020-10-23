import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withProps, compose, withStateHandlers } from 'recompose';

import themeSelectors from '../../theme/selectors';

import { graphRessources } from '../chart-ressources';

const withDashboardGraphs = (dashboardGraphs, chartProps) => {
  return (Component) => {
    const enhancedComponent = compose(
      connect(
        (state) => ({ theme: themeSelectors.getTheme(state) }),
        null,
      ),
      withProps(({ t, theme }) => chartProps(t, theme)),
      withStateHandlers(
        () => {
          const chartRanges = {};
          dashboardGraphs.forEach((graph) => {
            if (
              graphRessources[graph.ressourceIdentifier].timeSettings !== 'none'
            ) {
              chartRanges[graph.name] = {
                start: graph.defaultRange.start,
                end: graph.defaultRange.end,
                kind: graph.defaultRange.kind,
              };
            }
          });
          return { chartRanges };
        },
        {
          setchartRanges: ({ chartRanges }) => (identifier, range) => {
            return {
              chartRanges: {
                ...chartRanges,
                [identifier]: range,
              },
            };
          },
        },
      ),
      withStateHandlers(
        () => {
          const chartFilters = {};
          dashboardGraphs.forEach((graph) => {
            if (graphRessources[graph.ressourceIdentifier].filtersComponent) {
              chartFilters[graph.name] = graph.defaultFilters;
            }
          });
          return { chartFilters };
        },
        {
          setChartFilters: ({ chartFilters }) => (identifier, filters) => {
            return {
              chartFilters: {
                ...chartFilters,
                [identifier]: filters,
              },
            };
          },
        },
      ),
      connect(
        (state, { chartRanges }) => {
          const data = {};
          dashboardGraphs.forEach((graph) => {
            const { timeSettings, selector } = graphRessources[
              graph.ressourceIdentifier
            ];
            if (timeSettings !== 'none') {
              data[graph.name] = selector(
                state,
                graph.name,
                chartRanges[graph.name],
              );
            } else {
              data[graph.name] = selector(state, graph.name);
            }
          });
          return { data };
        },
        (dispatch) => {
          const actions = {};
          dashboardGraphs.forEach((graph) => {
            actions[graph.name] =
              graphRessources[graph.ressourceIdentifier].action;
          });
          const boundActions = bindActionCreators(actions, dispatch);
          return { boundActions };
        },
      ),
    )(Component);
    return enhancedComponent;
  };
};

export default withDashboardGraphs;
