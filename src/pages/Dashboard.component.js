// @flow
import React, { Component } from 'react';
// eslint-disable-next-line bsport/no-redux-in-component
import { connect } from 'react-redux';
import {
  compose,
  withProps,
  branch,
  withHandlers,
  withState,
  withStateHandlers,
} from 'recompose';
import { withTranslation, TFunction } from 'react-i18next';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import withStyles from '@material-ui/core/styles/withStyles';
import themeSelectors from '../libs/theme/selectors';

import withTitle from '../hocs/with-title.hoc';
import type { Theme } from '../libs/theme/types';
import DashboardChart from '../components/graph/DashboardChart.component';
import {
  graphRessources,
  getChartPropsData,
} from '../libs/statistics/chart-ressources';
import { getGraphData, getGraphActions } from '../libs/statistics/selectors';
import {
  fetchDashboardSettings as fetchDashboardSettingsAction,
  updateDashboardSettings as updateDashboardSettingsAction,
} from '../libs/dashboard/actions';
import {
  getDashboardConfiguration,
  getDashboardConfigurationTab,
} from '../libs/dashboard/selectors';
import type { Graph } from '../libs/dashboard/types';
import type { OptionCallback } from '../state/types';
import CustomChartForm from '../components/graph/CustomChartForm.component';
import BackofficeLinearProgress from '../components/navigation/BackofficeLinearProgress.component';
import BottomActionButtons from '../components/button/BottomActionsButton.component';
import { quickRanges } from '../libs/dashboard/components/ChartRange.component';

const CUSTOM_TAB = 'main';

type Props = {
  t: TFunction,
  classes: Object,
  theme: Theme,
  loading: boolean,

  chartFilterByIdentifier: any,
  setChartFilters: (any) => void,

  dateRangeByIdentifier: { [string]: { start: string, end: string } },
  graphActionByIdentifier: {
    [string]: (identifier: string, params: any) => void,
  },
  graphDataByIdentifier: { [string]: any },
  chartProps: { [string]: any },
  setChartDateRangeByIdentifier: any,
  fetchStatistics: (graph: Graph) => void,
  setChartFiltersByIdentifier: (identifier: string) => (filters: any) => void,
  setChartDateRangeByIdentifier: (
    identifier: string,
    timeSettings: string,
  ) => (range: any) => void,
  fetchDashboardSettings: (options?: OptionCallback) => void,
  saveAllGraphs: () => void,
  resetSettings: () => void,
  dashboardConfiguration: Array<DashboardTab>,
  settingsId: boolean,
  resetDialogOpen: boolean,
  setResetDialogOpen: (boolean) => void,
  handleSave: (Graph) => () => void,
  chartFormOpen: boolean,
  setChartFormOpen: (boolean) => void,
  addGraph: (string, Graph) => void,
  handleDelete: (Graph) => () => void,
  dashboardTab: ?DashboardTab,

  onSaveGraphByIdentifier: (string) => void,
  onDeleteGraphByIdentifier: (string) => void,
};

const CURRENT_TAB_INDEX = 0;

export class Dashboard extends Component<Props> {
  componentDidMount() {
    const { fetchDashboardSettings, fetchStatistics, dashboardTab } =
      this.props;
    fetchDashboardSettings({
      onSuccess: () => {
        if (dashboardTab && dashboardTab.graphs) {
          dashboardTab.graphs.forEach((graph) => fetchStatistics(graph));
        }
      },
    });
  }

  componentDidUpdate(prevProps: Props) {
    const {
      chartFilterByIdentifier,
      dateRangeByIdentifier,
      fetchStatistics,
      dashboardTab,
    } = this.props;
    const prevGraphsName = ((prevProps.dashboardTab || {}).graphs || []).map(
      (gr) => gr.name,
    );
    if (dashboardTab && dashboardTab.graphs && !!dashboardTab.graphs.length) {
      dashboardTab.graphs.forEach((graph) => {
        if (
          chartFilterByIdentifier[graph.name] !==
          prevProps.chartFilterByIdentifier[graph.name]
        ) {
          fetchStatistics(graph);
        }

        if (
          dateRangeByIdentifier[graph.name] !==
          prevProps.dateRangeByIdentifier[graph.name]
        ) {
          fetchStatistics(graph);
        }

        if (prevGraphsName.indexOf(graph.name) === -1) {
          fetchStatistics(graph);
        }
      });
    }
  }

  render() {
    const {
      classes,
      dateRangeByIdentifier,
      chartFilterByIdentifier,
      graphDataByIdentifier,
      chartProps,
      dashboardTab,
      t,
      loading,
    } = this.props;
    return (
      <>
        {loading && <BackofficeLinearProgress />}
        {dashboardTab && dashboardTab.graphs && dashboardTab.graphs.length > 0 && (
          <Grid container="row" spacing={3} className={classes.gridRow}>
            {dashboardTab.graphs.map((graph) => {
              const ChartComponent =
                graphRessources[graph.ressourceIdentifier].chartComponents[
                  graph.chart
                ] || (() => null);
              const { timeSettings } =
                graphRessources[graph.ressourceIdentifier];
              return (
                <Grid item xs={12} lg={6} key={graph.name}>
                  <DashboardChart
                    title={graph.title || chartProps[graph.name].title}
                    popoverText={chartProps[graph.name].popoverText}
                    loading={graphDataByIdentifier[graph.name].loading}
                    filtersComponent={
                      graphRessources[graph.ressourceIdentifier]
                        .filtersComponent || (() => null)
                    }
                    filters={chartFilterByIdentifier[graph.name]}
                    setChartFilters={this.props.setChartFiltersByIdentifier(
                      graph.name,
                    )}
                    range={
                      timeSettings !== 'none' &&
                      dateRangeByIdentifier[graph.name]
                    }
                    setDateRange={this.props.setChartDateRangeByIdentifier}
                    timeSettings={timeSettings}
                    onSaveGraph={this.props.onSaveGraphByIdentifier}
                    graphIdentifier={graph.name}
                    onDelete={this.props.onDeleteGraphByIdentifier}
                  >
                    <ChartComponent
                      data={graphDataByIdentifier[graph.name].data}
                      {...chartProps[graph.name]}
                    />
                  </DashboardChart>
                </Grid>
              );
            })}
          </Grid>
        )}

        {dashboardTab && !loading ? (
          <div className={classes.saveButtonContainer}>
            <Button
              className={classes.button}
              variant="contained"
              onClick={() => this.props.setResetDialogOpen(true)}
            >
              {t('resetModal.title')}
            </Button>
          </div>
        ) : null}
        <Dialog open={this.props.resetDialogOpen}>
          <DialogTitle>{t('resetModal.title')}</DialogTitle>
          <DialogContent>{t('resetModal.content')}</DialogContent>
          <DialogActions>
            <Button onClick={() => this.props.setResetDialogOpen(false)}>
              {t('resetModal.cancel')}
            </Button>
            <Button
              color="primary"
              onClick={() => {
                this.props.resetSettings();
                this.props.setResetDialogOpen(false);
              }}
            >
              {t('resetModal.confirm')}
            </Button>
          </DialogActions>
        </Dialog>
        <>
          <div className={classes.saveButtonContainer}>
            <BottomActionButtons
              onCreateLabel={this.props.t('customChart.addChart')}
              onCreate={() => this.props.setChartFormOpen(true)}
            />
          </div>
          <CustomChartForm
            addGraph={(gr) => this.props.addGraph(CUSTOM_TAB, gr)}
            graphRessources={graphRessources}
            formOpen={this.props.chartFormOpen}
            setFormOpen={this.props.setChartFormOpen}
          />
        </>
      </>
    );
  }
}

const styles = (theme) => ({
  gridRow: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
  },
  saveButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(10),
  },
  button: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
});

export default compose(
  withTranslation(['dashboard']),
  withStyles(styles),
  withState('resetDialogOpen', 'setResetDialogOpen', false),
  withState('chartFormOpen', 'setChartFormOpen', false),
  connect(
    (state) => ({
      loading: state.dashboardSettings.loading,
      theme: themeSelectors.getTheme(state),
      dashboardConfiguration: getDashboardConfiguration(state),
      dashboardTab: getDashboardConfigurationTab(state, CURRENT_TAB_INDEX),
    }),
    {
      fetchDashboardSettings: fetchDashboardSettingsAction,
      updateDashboardSettings: updateDashboardSettingsAction,
    },
  ),
  branch(
    // if we have a dashboardTab we initialize our filter/dateRange configurations
    ({ dashboardTab }) => !!dashboardTab && dashboardTab.graphs,
    // we add chartFilterByIdentifier, setChartFilters,
    // dateRangeByIdentifier and setDateRangeByIdentifier
    withStateHandlers(
      ({ dashboardTab }) => {
        const chartFilterByIdentifier = {};
        dashboardTab.graphs.forEach((graph) => {
          if (graphRessources[graph.ressourceIdentifier].filtersComponent) {
            chartFilterByIdentifier[graph.name] = graph.dataFilters;
          }
        });
        const dateRangeByIdentifier = {};
        dashboardTab.graphs.forEach((graph) => {
          if (
            graphRessources[graph.ressourceIdentifier].timeSettings !== 'none'
          ) {
            dateRangeByIdentifier[graph.name] = {
              start: graph.dateRange.start,
              end: graph.dateRange.end,
              kind: graph.dateRange.kind,
            };
          }
        });
        return { dateRangeByIdentifier, chartFilterByIdentifier };
      },
      {
        setChartFilters:
          ({ chartFilterByIdentifier }) =>
          (identifier, filters) => ({
            chartFilterByIdentifier: {
              ...chartFilterByIdentifier,
              [identifier]: filters,
            },
          }),
        setDateRangeByIdentifier:
          ({ dateRangeByIdentifier }) =>
          (identifier, range) => ({
            dateRangeByIdentifier: {
              ...dateRangeByIdentifier,
              [identifier]: range,
            },
          }),
      },
    ),
  ),
  // get chartProps (used to display graphs) from dashboardTab
  withProps(({ t, theme, dashboardTab }) => ({
    chartProps: getChartPropsData(
      t,
      theme,
      (dashboardTab && dashboardTab.graphs) || [],
    ),
  })),
  branch(
    // if we have a dashboardTab we get graph data from store, and actions ready to be dispatched
    ({ dashboardTab }) => !!dashboardTab && dashboardTab.graphs,
    connect(
      (state, props) => ({
        graphDataByIdentifier: getGraphData(
          state,
          props.dashboardTab.graphs,
          props.dateRangeByIdentifier,
          graphRessources,
        ),
      }),
      (dispatch, props) => ({
        graphActionByIdentifier: getGraphActions(
          dispatch,
          props.dashboardTab.graphs,
          graphRessources,
        ),
      }),
    ),
  ),
  withHandlers({
    fetchStatistics:
      ({
        dateRangeByIdentifier,
        chartFilterByIdentifier,
        graphActionByIdentifier,
      }) =>
      (graph: Graph) => {
        const { timeSettings } = graphRessources[graph.ressourceIdentifier];
        const params = {
          ...graph.baseFilters,
          ...chartFilterByIdentifier[graph.name],
        };
        if (timeSettings !== 'none') {
          if (!graph.aggregate) {
            params[
              graphRessources[graph.ressourceIdentifier].dateFiltersName.start
            ] = dateRangeByIdentifier[graph.name].start;
            params[
              graphRessources[graph.ressourceIdentifier].dateFiltersName.end
            ] = dateRangeByIdentifier[graph.name].end;
          }
        }
        graphActionByIdentifier[graph.name](graph.name, params);
      },
    setChartFiltersByIdentifier:
      ({ setChartFilters }) =>
      (identifier: string) => {
        return (filters) => setChartFilters(identifier, filters);
      },
    setChartDateRangeByIdentifier:
      ({ setDateRangeByIdentifier }) =>
      (identifier: string, timeSettings: string, range) => {
        if (timeSettings === 'range') {
          setDateRangeByIdentifier(identifier, range);
        }
      },
    resetSettings:
      ({ updateDashboardSettings }) =>
      () => {
        updateDashboardSettings([]);
      },
    onSaveGraphByIdentifier:
      ({
        updateDashboardSettings,
        dashboardConfiguration,
        chartFilterByIdentifier,
        dateRangeByIdentifier,
      }) =>
      (graphIdentifier: string) =>
        updateDashboardSettings(
          dashboardConfiguration.map((tab) => ({
            ...tab,
            graphs: tab.graphs.map((currentGraph) => {
              if (graphIdentifier === currentGraph.name) {
                return {
                  ...currentGraph,
                  dataFilters: {
                    ...(currentGraph.dataFilters || {}),
                    ...(chartFilterByIdentifier[graphIdentifier] || {}),
                  },
                  dateRange: {
                    ...(currentGraph.dateRange || {}),
                    ...(dateRangeByIdentifier[graphIdentifier] || {}),
                  },
                };
              }
              return currentGraph;
            }),
          })),
        ),
    addGraph:
      ({
        setDateRangeByIdentifier,
        setChartFilters,
        updateDashboardSettings,
        dashboardConfiguration,
      }) =>
      (tab_label, graph) => {
        const all_settings = dashboardConfiguration.map((t) => {
          if (t.tab_label === tab_label) {
            const graphs = [...t.graphs, graph];
            return { ...t, graphs };
          }
          return t;
        });
        if (graph.dateRange.kind === 'custom') {
          setDateRangeByIdentifier(graph.name, graph.dateRange);
        } else {
          const range = quickRanges.filter(
            (item) => item.key === graph.dateRange.kind,
          )[0];
          setDateRangeByIdentifier(graph.name, {
            start: range.start,
            end: range.end,
            kind: graph.dateRange.kind,
          });
        }
        setChartFilters(graph.name, graph.dataFilters);
        updateDashboardSettings(all_settings);
      },
    onDeleteGraphByIdentifier:
      ({ updateDashboardSettings, dashboardConfiguration }) =>
      (graphIdentifier: string) =>
        updateDashboardSettings(
          dashboardConfiguration.map((tab) => ({
            ...tab,
            graphs: tab.graphs.filter((gr) => gr.name !== graphIdentifier),
          })),
        ),
  }),
  withTitle(({ t }: { t: TFunction }) => t('titles:dashboard.dashboard')),
)(Dashboard);
