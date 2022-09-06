import React, { Component } from 'react';

import { connect, ConnectedProps } from 'react-redux';
import { compose, withState, withHandlers } from 'recompose';
import { WithStyles, withStyles, Theme } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import BackofficeLinearProgress from '../components/navigation/BackofficeLinearProgress.component';
import { WithHandlerType } from '../utils/types';
import { OptionCallback } from '../state/types';
import IsEmptyList from '#components/navigation/IsEmptyList.component';
import BottomActionButtons from '../components/button/BottomActionsButton.component';
import DashboardGraphWrapper from '#libs/dashboard/components/DashboardGraphWrapper.component';
import { prepareGraphPropsForDisplay } from '#libs/dashboard/utils';

import DashboardTabBar from '#libs/dashboard/components/DashboardTabBar.component';
import DashboardGraphFormDrawer from '#libs/dashboard/components/DashboardGraphForm.drawer';
import { TemporalBarChart } from '#components/graph/TemporalBarChart.component';
import { TemporalAreaChart } from '#components/graph/TemporalAreaChart.component';
import { TimeslotGridChart } from '#components/graph/TimeslotGridChart.component';
import PieChart from '#components/graph/PieChart.component';
import QualitativeBarChart from '#components/graph/QualitativeBarChart.component';
import withTitle from '../hocs/with-title.hoc';
import withDatatypeDynamicData, {
  withDatatypeDynamicDataProps,
} from '#libs/datatype-filtering/dynamic-data-hoc';
import {
  fetchDataSourceDashboardGraphMetadata,
  fetchDataSourceDashboardSettings,
  updateDataSourceDashboardSettings,
} from '#libs/dashboard/actions';
import {
  getDataSourceDashboardGraphMetadata,
  getDataSourceDashboardSettings,
  getDataSourceDashboardSettingsTab,
} from '#libs/dashboard/selectors';
import { fetchDataSourceDashboardStatistics } from '#libs/statistics/actions';
import { getDataSourceDashboardTabStatistics } from '#libs/statistics/selectors';

import type { RootState } from '../reducers';
import type {
  DataSourceDashboardGraph,
  DataSourceDashboardTab,
} from '#libs/dashboard/types';

import { getTheme } from '#libs/theme/selectors';

type WithStateProps = {
  t: TFunction;
  currentTabIndex: number;
  setCurrentTabIndex: (n: number) => void;
  resetDialogOpen: boolean;
  setResetDialogOpen: (b: boolean) => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (b: boolean) => void;
  graphToEdit: DataSourceDashboardGraph | null;
  setGraphToEdit: (u: DataSourceDashboardGraph | null) => void;
};

type SettingsAndMetadataConnectedProps = ConnectedProps<
  typeof settingsAndMetadataconnector
>;

type GraphDataConnectedProps = ConnectedProps<typeof graphDataConnector>;

type AllConnectedProps = WithStateProps &
  SettingsAndMetadataConnectedProps &
  GraphDataConnectedProps;

type Props = WithStateProps &
  AllConnectedProps &
  WithHandlerType<typeof mapWithHandlers> &
  WithStyles<typeof styles> &
  withDatatypeDynamicDataProps;

const GRAPH_HEIGHT = 350;

const MAP_GRAPH_TO_CHART_COMPONENT = {
  area: TemporalAreaChart,
  bar: TemporalBarChart,
  timeslots: TimeslotGridChart,
  pie: PieChart,
  qualitativeBar: QualitativeBarChart,
};

export class DashboardPage extends Component<Props> {
  componentDidMount() {
    this.props.resetDynamicDataHasBeenLoaded();
    this.props.fetchMetadata();
    this.props.fetchSettings();
    // fetch graph statistics if settings already in store
    if (this.props.dashboardTab?.graphs?.length) {
      this.props.dashboardTab.graphs.forEach((g: DataSourceDashboardGraph) => {
        this.props.fetchGraphStatistics(g);
      });
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { dashboardTab } = this.props;
    const prevGraphUuids = ((prevProps.dashboardTab || {}).graphs || []).map(
      (g: DataSourceDashboardGraph) => g.uuid,
    );

    if (dashboardTab?.graphs?.length) {
      dashboardTab.graphs.forEach((g: DataSourceDashboardGraph) => {
        if (prevGraphUuids.indexOf(g.uuid) === -1) {
          this.props.fetchGraphStatistics(g);
        }
      });
    }
  }

  openDrawer = () => {
    this.props.setIsDrawerOpen(true);
  };

  closeDrawer = () => {
    this.props.setGraphToEdit(null);
    this.props.setIsDrawerOpen(false);
  };

  onSubmitForm = (
    formData: DataSourceDashboardGraph,
    options?: OptionCallback,
  ) => {
    if (this.props.graphToEdit) {
      this.props.updateGraph(formData, options);
      return;
    }
    this.props.addNewgraph(formData, options);
  };

  render() {
    const {
      dashboardSettings,
      dashboardTab,
      classes,
      dashboardSettingsLoading,
      currentTabIndex,
      setCurrentTabIndex,
      deleteTab,
      renameTab,
      addNewTab,
      graphData,
      graphMetadata,
      deleteGraph,
      isDrawerOpen,
      setGraphToEdit,
      t,
    } = this.props;

    // Partial graphs because prepareGraphPropsForDisplay is memoized
    const partialDashboardGraphs =
      dashboardTab?.graphs?.map((graph: DataSourceDashboardGraph) => {
        const {
          uuid,
          title,
          dashboard_graph_identifier,
          graph_family,
          graph_params,
          chart_component,
        } = graph;
        return {
          uuid,
          title,
          dashboard_graph_identifier,
          graph_family,
          graph_params,
          chart_component,
        };
      }) ?? [];

    const graphPropsForDisplay = prepareGraphPropsForDisplay(
      t,
      partialDashboardGraphs,
      graphMetadata ?? [],
    );

    return (
      <>
        {dashboardSettingsLoading && <BackofficeLinearProgress />}
        <div className={classes.container}>
          <DashboardTabBar
            dashboardSettings={dashboardSettings}
            currentTabIndex={currentTabIndex}
            setCurrentTabIndex={setCurrentTabIndex}
            deleteTab={deleteTab}
            addNewTab={addNewTab}
            renameTab={renameTab}
          />

          {dashboardTab?.graphs?.length === 0 && (
            <IsEmptyList
              text={t('noGraphToDisplay')}
              button={t('customChart.addChart')}
              onCreate={this.openDrawer}
              hideBottomActions
            />
          )}

          {dashboardTab?.graphs?.length > 0 && (
            <div className={classes.gridContainer}>
              <Grid
                container
                direction="row"
                justifyContent="space-between"
                spacing={3}
                className={classes.gridRow}
              >
                {dashboardTab.graphs.map((graph: DataSourceDashboardGraph) => {
                  const ChartComponent =
                    MAP_GRAPH_TO_CHART_COMPONENT[graph.chart_component];

                  return (
                    <Grid item xs={12} lg={6} key={graph.uuid}>
                      <DashboardGraphWrapper
                        graph={graph}
                        onEdit={() => {
                          setGraphToEdit(graph);
                          this.openDrawer();
                        }}
                        onDelete={deleteGraph}
                        loadingData={graphData[graph.uuid].loading}
                        loadingSettings={dashboardSettingsLoading}
                        graphHeight={GRAPH_HEIGHT}
                      >
                        <ChartComponent
                          data={graphData[graph.uuid].data}
                          height={GRAPH_HEIGHT}
                          {...graphPropsForDisplay[graph.uuid]}
                          schedule_timerange_begin={
                            this.props.theme.schedule_timerange_begin
                          }
                          schedule_timerange_end={
                            this.props.theme.schedule_timerange_end
                          }
                        />
                      </DashboardGraphWrapper>
                    </Grid>
                  );
                })}
              </Grid>
            </div>
          )}
        </div>
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

        <BottomActionButtons
          onCreateLabel={t('customChart.addChart')}
          resetLabel={t('resetModal.title')}
          onCreate={!dashboardSettingsLoading && this.openDrawer}
          onReset={
            !dashboardSettingsLoading &&
            (() => this.props.setResetDialogOpen(true))
          }
        />

        {isDrawerOpen && (
          <DashboardGraphFormDrawer
            open
            onClose={this.closeDrawer}
            graphMetadata={this.props.graphMetadata}
            handleGetDynamicDataForFilters={
              this.props.handleGetDynamicDataForFilters
            }
            onSubmit={this.onSubmitForm}
            initial={this.props.graphToEdit}
          />
        )}
      </>
    );
  }
}

const settingsAndMetadataconnector = connect(
  (state: RootState, { currentTabIndex }) => ({
    theme: getTheme(state),
    graphMetadata: getDataSourceDashboardGraphMetadata(state),
    dashboardSettings: getDataSourceDashboardSettings(state),
    dashboardTab: getDataSourceDashboardSettingsTab(state, currentTabIndex),
    dashboardSettingsLoading:
      state.dashboardSettings.dataSourceDashboardGraphs.settings.loading,
  }),
  {
    fetchMetadata: fetchDataSourceDashboardGraphMetadata,
    fetchSettings: fetchDataSourceDashboardSettings,
    updateSettings: updateDataSourceDashboardSettings,
    fetchGraphStatistics: fetchDataSourceDashboardStatistics,
  },
);

const graphDataConnector = connect(
  (state: RootState, { dashboardTab }: SettingsAndMetadataConnectedProps) => ({
    graphData: getDataSourceDashboardTabStatistics(state, dashboardTab),
  }),
);

const mapWithHandlers = {
  addNewTab:
    (props: AllConnectedProps) =>
    (tabName: string, options?: OptionCallback) => {
      const newConf = [
        ...props.dashboardSettings,
        { tab_label: tabName, graphs: [] },
      ];
      props.updateSettings(newConf, {
        onSuccess: () => {
          if (options && options.onSuccess) options.onSuccess();
        },
      });
    },
  renameTab:
    (props: AllConnectedProps, options?: OptionCallback) =>
    (newTabName: string, tabIndexToRename: number) => {
      props.updateSettings(
        props.dashboardSettings.map(
          (tab: DataSourceDashboardTab, i: number) => {
            if (i === tabIndexToRename) {
              return { ...tab, tab_label: newTabName };
            }
            return tab;
          },
        ),
        {
          onSuccess: () => {
            if (options && options.onSuccess) options.onSuccess();
          },
        },
      );
    },
  deleteTab: (props: AllConnectedProps) => (tabIndexToDelete: number) => {
    props.updateSettings(
      props.dashboardSettings.filter((_, i: number) => i !== tabIndexToDelete),
      { onSuccess: () => props.setCurrentTabIndex(0) },
    );
  },
  addNewgraph:
    (props: AllConnectedProps) =>
    (graph: DataSourceDashboardGraph, options?: OptionCallback) => {
      const newSettings = props.dashboardSettings.map(
        (tab: DataSourceDashboardTab, i: number) => {
          if (i === props.currentTabIndex) {
            const graphs = [...tab.graphs, graph];
            return { ...tab, graphs };
          }
          return tab;
        },
      );
      props.updateSettings(newSettings, {
        onSuccess: () => {
          props.setGraphToEdit(null);
          props.setIsDrawerOpen(false);
          if (options && options.onSuccess) options.onSuccess();
        },
        onError: () => {
          if (options && options.onError) options.onError();
        },
      });
    },
  deleteGraph:
    (props: AllConnectedProps) => (graphToDelete: DataSourceDashboardGraph) => {
      const newSettings = props.dashboardSettings.map(
        (tab: DataSourceDashboardTab) => {
          return {
            ...tab,
            graphs: tab.graphs.filter(
              (graph) => graph.uuid !== graphToDelete.uuid,
            ),
          };
        },
      );
      props.updateSettings(newSettings);
    },
  updateGraph:
    (props: AllConnectedProps) =>
    (graphToUpdate: DataSourceDashboardGraph, options?: OptionCallback) => {
      const newSettings = props.dashboardSettings.map(
        (tab: DataSourceDashboardTab) => {
          return {
            ...tab,
            graphs: tab.graphs.map((graph) =>
              graph.uuid === graphToUpdate.uuid ? graphToUpdate : graph,
            ),
          };
        },
      );
      props.updateSettings(newSettings, {
        onSuccess: () => {
          props.fetchGraphStatistics(graphToUpdate);
          props.setGraphToEdit(null);
          props.setIsDrawerOpen(false);
          if (options && options.onSuccess) options.onSuccess();
        },
      });
    },
  resetSettings: (props: AllConnectedProps) => () => {
    props.updateSettings([], { onSuccess: () => props.setCurrentTabIndex(0) });
  },
};

const styles = (theme: Theme) => ({
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
  gridContainer: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
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
  withState('resetDialogOpen', 'setResetDialogOpen', false),
  withState('isDrawerOpen', 'setIsDrawerOpen', false),
  withState('graphToEdit', 'setGraphToEdit', null),
  settingsAndMetadataconnector,
  graphDataConnector,
  withDatatypeDynamicData,
  withHandlers(mapWithHandlers),
  withTitle(({ t }: { t: TFunction }) => t('titles:dashboard.dashboard')),
)(DashboardPage);
