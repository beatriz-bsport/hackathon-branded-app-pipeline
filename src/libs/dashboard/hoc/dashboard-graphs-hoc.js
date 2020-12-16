import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withProps, compose, withStateHandlers, branch } from 'recompose';

import themeSelectors from '../../theme/selectors.ts';

import { graphRessources } from '../chart-ressources';

const withDashboardGraphs = (graphSelector, chartProps) => {
  return (Component) => {
    const enhancedComponent = compose(
      connect(
        (state) => ({
          theme: themeSelectors.getTheme(state),
          tabList: graphSelector(state),
        }),
        null,
      ),
      withProps(({ t, theme, tabList }) =>
        chartProps(t, theme, tabList[0] ? tabList[0].graphs.length : 1),
      ),
      branch(({ tabList }) => tabList.length > 0, withFiltersAndActions),
    )(Component);
    return enhancedComponent;
  };
};

const withFiltersAndActions = (Component) => {
  const enhancedComponent = compose(
    withStateHandlers(
      ({ tabList }) => {
        const chartRanges = {};
        tabList.forEach((tab) => {
          tab.graphs.forEach((graph) => {
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
        });
        return { chartRanges };
      },
      {
        setChartRanges: ({ chartRanges }) => (identifier, range) => {
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
      ({ tabList }) => {
        const chartFilters = {};
        tabList.forEach((tab) => {
          tab.graphs.forEach((graph) => {
            if (graphRessources[graph.ressourceIdentifier].filtersComponent) {
              chartFilters[graph.name] = graph.defaultFilters;
            }
          });
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
      (state, { chartRanges, tabList }) => {
        const data = {};
        tabList.forEach((tab) => {
          tab.graphs.forEach((graph) => {
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
        });
        return { data };
      },
      (dispatch, { tabList }) => {
        const actions = {};
        tabList.forEach((tab) => {
          tab.graphs.forEach((graph) => {
            actions[graph.name] =
              graphRessources[graph.ressourceIdentifier].action;
          });
        });
        const boundActions = bindActionCreators(actions, dispatch);
        return { boundActions };
      },
    ),
  )(Component);
  return enhancedComponent;
};

export default withDashboardGraphs;
