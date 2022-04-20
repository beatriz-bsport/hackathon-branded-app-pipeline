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

import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import withStyles from '@material-ui/core/styles/withStyles';
import DashboardTabNameDialog from '../libs/dashboard/components/DashboardTabNameDialog.component';
import IsEmptyList from '#components/navigation/IsEmptyList.component';
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
import type { Coach } from '#libs/associated-coach/types';
import { getAllCoaches } from '../libs/associated-coach/selectors';
import { fetchAssociatedCoachesList } from '../libs/associated-coach/actions';
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

type Props = {
  t: TFunction,
  classes: Object,
  theme: Theme,
  loading: boolean,

  chartFilterByIdentifier: any,
  setChartFilters: (any) => void,

  coaches: Array<Coach>,
  fetchAssociatedCoachesList: () => void,

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
  addGraph: (graph: any) => void,
  handleDelete: (Graph) => () => void,
  currentTabIndex: number,
  setCurrentTabIndex: (newTab: number) => void,
  dashboardTab: ?DashboardTab,
  addNewTab: (label: string) => void,
  setTabIndexToRename: (tabName: string) => void,
  tabIndexToRename: number | null,
  tabNameDialogOpen: boolean,
  setTabNameDialogOpen: (open: boolean) => void,
  tabNameToRename: string,
  setTabNameToRename: (value: string) => void,
  deleteTab: (tabIndex: number) => void,
  renameTab: (tabName: string, tabIndex: number) => void,

  onSaveGraphByIdentifier: (string) => void,
  onDeleteGraphByIdentifier: (string) => void,
};

export class Dashboard extends Component<Props> {
  componentDidMount() {
    const { fetchDashboardSettings, fetchStatistics, dashboardTab } =
      this.props;
    this.props.fetchAssociatedCoachesList();
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
      coaches,
      dateRangeByIdentifier,
      chartFilterByIdentifier,
      graphDataByIdentifier,
      chartProps,
      dashboardTab,
      currentTabIndex,
      dashboardConfiguration,
      t,
      loading,
    } = this.props;
    return (
      <>
        {loading && <BackofficeLinearProgress />}
        {(dashboardConfiguration || []).length > 0 && (
          <div className={classes.container}>
            <AppBar position="static" color="default">
              <Tabs
                variant="scrollable"
                value={currentTabIndex}
                onChange={(e, newValue) => {
                  if (newValue === 'addTab') {
                    this.props.setTabNameDialogOpen(true);
                    return;
                  }
                  this.props.setCurrentTabIndex(newValue);
                }}
              >
                {(dashboardConfiguration || []).map((tab, i) => (
                  <Tab
                    wrapped
                    className={classes.tab}
                    label={
                      <div className={classes.tabLabelContainer}>
                        <div className={classes.tabLabelTitle}>
                          {tab.tab_label === 'main'
                            ? t('navigation:backofficeMenu.dashboard')
                            : tab.tab_label}
                        </div>
                        <div className={classes.tabLabelIcons}>
                          <Tooltip title={t('ordering:category.popover.edit')}>
                            <IconButton
                              className={classes.iconButton}
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                this.props.setTabIndexToRename(i);
                                this.props.setTabNameToRename(
                                  tab.tab_label === 'main'
                                    ? t('navigation:backofficeMenu.dashboard')
                                    : tab.tab_label,
                                );
                                this.props.setTabNameDialogOpen(true);
                              }}
                            >
                              <EditIcon
                                fontSize="small"
                                color="primary"
                                classes={{ fontSizeSmall: classes.smallIcon }}
                              />
                            </IconButton>
                          </Tooltip>

                          {dashboardConfiguration &&
                            dashboardConfiguration.length > 1 && (
                              <Tooltip
                                title={t('ordering:category.popover.delete')}
                              >
                                <IconButton
                                  className={classes.iconButton}
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    this.props.deleteTab(i);
                                  }}
                                  disabled={
                                    dashboardConfiguration &&
                                    dashboardConfiguration.length === 1
                                  }
                                >
                                  <DeleteIcon
                                    fontSize="small"
                                    color="error"
                                    classes={{
                                      fontSizeSmall: classes.smallIcon,
                                    }}
                                  />
                                </IconButton>
                              </Tooltip>
                            )}
                        </div>
                      </div>
                    }
                    value={i}
                    key={`tab-${i}`}
                  />
                ))}
                <Tab
                  label={
                    <Tooltip title={t('tabNameDialog.titleAdd')}>
                      <IconButton>
                        <AddIcon />
                      </IconButton>
                    </Tooltip>
                  }
                  value="addTab"
                  classes={{ root: classes.addTabButton }}
                />
              </Tabs>
            </AppBar>
          </div>
        )}
        {/* Display empty list message if no graph to display if tab */}
        {dashboardTab &&
          dashboardTab.graphs.filter(
            (g) => g.ressourceIdentifier !== 'qualitativeInvoiceItem',
          ).length === 0 && (
            <IsEmptyList
              text={t('noGraphToDisplay')}
              button={t('customChart.addChart')}
              onCreate={() => this.props.setChartFormOpen(true)}
              hideBottomActions
            />
          )}
        {dashboardTab && dashboardTab.graphs && dashboardTab.graphs.length > 0 && (
          <Grid container="row" spacing={3} className={classes.gridRow}>
            {dashboardTab.graphs
              .filter((g) => g.ressourceIdentifier !== 'qualitativeInvoiceItem')
              .map((graph) => {
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
                      coaches={coaches}
                    >
                      <ChartComponent
                        data={graphDataByIdentifier[graph.name].data}
                        {...chartProps[graph.name]}
                        schedule_timerange_begin={
                          this.props.theme.schedule_timerange_begin
                        }
                        schedule_timerange_end={
                          this.props.theme.schedule_timerange_end
                        }
                      />
                    </DashboardChart>
                  </Grid>
                );
              })}
          </Grid>
        )}

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
        {this.props.tabNameDialogOpen && (
          <DashboardTabNameDialog
            tabIndexToRename={this.props.tabIndexToRename}
            initialValue={this.props.tabNameToRename}
            addNewTab={this.props.addNewTab}
            renameTab={this.props.renameTab}
            onClose={() => {
              this.props.setTabIndexToRename(null);
              this.props.setTabNameToRename('');
              this.props.setTabNameDialogOpen(false);
            }}
          />
        )}
        <>
          <BottomActionButtons
            onCreateLabel={t('customChart.addChart')}
            resetLabel={t('resetModal.title')}
            onCreate={() => this.props.setChartFormOpen(true)}
            onReset={() => this.props.setResetDialogOpen(true)}
          />
          <CustomChartForm
            addGraph={(gr) => this.props.addGraph(gr)}
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
  smallIcon: {
    fontSize: '14px',
  },
  iconButton: {
    opacity: '0',
  },
  tab: {
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
      '& $iconButton': {
        opacity: '1',
      },
    },
  },
  addTabButton: {
    minWidth: 'unset',
    width: '50px',
  },
  tabLabelContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    textAlign: 'center',
    position: 'relative',
  },
  tabLabelTitle: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    paddingLeft: theme.spacing(6),
    paddingRight: theme.spacing(6),
  },
  tabLabelIcons: {
    position: 'absolute',
    right: '2px',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  container: {
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(-3),
    width: '100vw',
    [theme.breakpoints.up('md')]: {
      marginLeft: theme.spacing(-3),
      width: 'auto',
      marginRight: theme.spacing(-3),
      marginTop: theme.spacing(-2),
    },
  },
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
  withState('currentTabIndex', 'setCurrentTabIndex', 0),
  withState('menuAnchorEl', 'setMenuAnchorEl', null),
  withState('resetDialogOpen', 'setResetDialogOpen', false),
  withState('tabNameDialogOpen', 'setTabNameDialogOpen', false),
  withState('tabIndexToRename', 'setTabIndexToRename', null),
  withState('tabNameToRename', 'setTabNameToRename', ''),
  withState('chartFormOpen', 'setChartFormOpen', false),
  connect(
    (state, { currentTabIndex }) => ({
      loading: state.dashboardSettings.loading,
      theme: themeSelectors.getTheme(state),
      dashboardConfiguration: getDashboardConfiguration(state),
      coaches: getAllCoaches(state),
      dashboardTab: getDashboardConfigurationTab(state, currentTabIndex),
    }),
    {
      fetchDashboardSettings: fetchDashboardSettingsAction,
      updateDashboardSettings: updateDashboardSettingsAction,
      fetchAssociatedCoachesList,
    },
  ),
  branch(
    // if we have at least a tab with a graph, we initialize our filter/dateRange configurations
    ({ dashboardConfiguration }) => {
      return (
        (dashboardConfiguration || []).length &&
        dashboardConfiguration[0].graphs.length
      );
    },

    // we add chartFilterByIdentifier, setChartFilters,
    // dateRangeByIdentifier and setDateRangeByIdentifier
    withStateHandlers(
      ({ dashboardConfiguration }) => {
        const chartFilterByIdentifier = {};

        dashboardConfiguration.forEach((tab) => {
          tab.graphs.forEach((graph) => {
            if (graphRessources[graph.ressourceIdentifier].filtersComponent) {
              chartFilterByIdentifier[graph.name] = graph.dataFilters;
            }
          });
        });

        const dateRangeByIdentifier = {};

        dashboardConfiguration.forEach((tab) => {
          tab.graphs.forEach((graph) => {
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
  withProps(({ t, theme, dashboardConfiguration }) => ({
    chartProps: getChartPropsData(
      t,
      theme,
      dashboardConfiguration.reduce(
        (graphList, tab) => [...graphList, ...tab.graphs],
        [],
      ),
    ),
  })),
  branch(
    // if we have at least a tab with a graph, we get graph data from store, and actions ready to be dispatched
    ({ dashboardConfiguration }) =>
      (dashboardConfiguration || []).length &&
      dashboardConfiguration[0].graphs.length,
    connect(
      (state, props) => ({
        graphDataByIdentifier: getGraphData(
          state,
          props.dashboardConfiguration.reduce(
            (graphList, tab) => [...graphList, ...tab.graphs],
            [],
          ),
          props.dateRangeByIdentifier,
          graphRessources,
        ),
      }),
      (dispatch, props) => ({
        graphActionByIdentifier: getGraphActions(
          dispatch,
          props.dashboardConfiguration.reduce(
            (graphList, tab) => [...graphList, ...tab.graphs],
            [],
          ),
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
      (identifier: string) =>
      (filters) =>
        setChartFilters(identifier, filters),
    setChartDateRangeByIdentifier:
      ({ setDateRangeByIdentifier }) =>
      (identifier: string, timeSettings: string, range) => {
        if (timeSettings === 'range') {
          setDateRangeByIdentifier(identifier, range);
        }
      },
    resetSettings:
      ({ updateDashboardSettings, setCurrentTabIndex }) =>
      () => {
        updateDashboardSettings([], { onSuccess: () => setCurrentTabIndex(0) });
      },
    onSaveGraphByIdentifier:
      ({
        updateDashboardSettings,
        dashboardConfiguration,
        chartFilterByIdentifier,
        dateRangeByIdentifier,
        currentTabIndex,
      }) =>
      (graphIdentifier: string) =>
        updateDashboardSettings(
          dashboardConfiguration.map((tab, i) => {
            if (i === currentTabIndex) {
              return {
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
              };
            }
            return tab;
          }),
        ),
    addGraph:
      ({
        setDateRangeByIdentifier,
        setChartFilters,
        updateDashboardSettings,
        dashboardConfiguration,
        currentTabIndex,
      }) =>
      (graph) => {
        const all_settings = dashboardConfiguration.map((t, i) => {
          if (i === currentTabIndex) {
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
      ({ updateDashboardSettings, dashboardConfiguration, currentTabIndex }) =>
      (graphIdentifier: string) =>
        updateDashboardSettings(
          dashboardConfiguration.map((tab, i) => {
            if (i === currentTabIndex) {
              return {
                ...tab,
                graphs: tab.graphs.filter((gr) => gr.name !== graphIdentifier),
              };
            }
            return tab;
          }),
        ),
    addNewTab:
      ({
        updateDashboardSettings,
        dashboardConfiguration,
        setTabNameDialogOpen,
      }) =>
      (tabName) => {
        const newConf = [
          ...dashboardConfiguration,
          { tab_label: tabName, graphs: [] },
        ];
        updateDashboardSettings(newConf, {
          onSuccess: () => {
            setTabNameDialogOpen(false);
          },
        });
      },
    renameTab:
      ({
        updateDashboardSettings,
        dashboardConfiguration,
        setTabNameDialogOpen,
        setTabIndexToRename,
        setTabNameToRename,
      }) =>
      (newTabName, tabIndexToRename) => {
        updateDashboardSettings(
          dashboardConfiguration.map((tab, i) => {
            if (i === tabIndexToRename) {
              return { ...tab, tab_label: newTabName };
            }
            return tab;
          }),
          {
            onSuccess: () => {
              setTabNameToRename('');
              setTabIndexToRename(null);
              setTabNameDialogOpen(false);
            },
          },
        );
      },
    deleteTab:
      ({
        updateDashboardSettings,
        dashboardConfiguration,
        setCurrentTabIndex,
      }) =>
      (tabIndexToDelete) => {
        updateDashboardSettings(
          dashboardConfiguration.filter((tab, i) => i !== tabIndexToDelete),
          { onSuccess: () => setCurrentTabIndex(0) },
        );
      },
  }),
  withTitle(({ t }: { t: TFunction }) => t('titles:dashboard.dashboard')),
)(Dashboard);
