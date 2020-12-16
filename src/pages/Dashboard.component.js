// @flow
import React, { Component } from 'react';
import chroma from 'chroma-js';
import { connect } from 'react-redux';
import { compose, withHandlers, withState } from 'recompose';
import { withTranslation } from 'react-i18next';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';

import withStyles from '@material-ui/core/styles/withStyles';
import type { TFunction } from 'react-i18next';

import withTitle from '../hocs/with-title.hoc';
import type { Theme } from '../libs/theme/types.ts';
import DashboardChart from '../components/graph/DashboardChart.component';
import withDashboardGraphs from '../libs/dashboard/hoc/dashboard-graphs-hoc';
import { graphRessources } from '../libs/dashboard/chart-ressources';
import {
  fetchDashboardSettings as fetchDashboardSettingsAction,
  updateDashboardSettings as updateDashboardSettingsAction,
} from '../libs/dashboard/actions';
import { getDashboardGraphs } from '../libs/dashboard/selectors';
import type { Graph, Tab } from '../libs/dashboard/types';
import type { OptionCallback } from '../state/types.ts';

type Props = {
  t: TFunction,
  classes: Object,
  theme: Theme,

  chartFilters: any,
  setChartFilters: (any) => void,

  chartRanges: { [string]: { start: string, end: string } },
  boundActions: { [string]: (identifier: string, params: any) => void },
  data: { [string]: any },
  chartProps: { [string]: any },
  setChartRanges: any,
  fetchStatistics: (graph: Graph) => void,
  setParticularChartFilter: (identifier: string) => (filters: any) => void,
  setParticularRange: (
    identifier: string,
    timeSettings: string,
  ) => (range: any) => void,
  fetchDashboardSettings: (options?: OptionCallback) => void,
  saveAllGraphs: () => void,
  resetSettings: () => void,
  tabList: Array<Tab>,
  settingsId: boolean,
  resetDialogOpen: boolean,
  setResetDialogOpen: (boolean) => void,
  handleSave: (Graph) => () => void,
};

const chartPropsData = (t, theme, graph_nb) => {
  const colorScale = chroma
    .scale([theme.primary_color, theme.secondary_color])
    .mode('lab');

  return {
    chartProps: {
      new_members: {
        title: t('newMembers'),
        height: 350,
        yLabel: t('newMembers'),
        tooltip: true,
        chartOptions: [
          {
            dataKey: 'v',
            caption: t('newMembers'),
            stroke: colorScale(6 / graph_nb),
            fill: colorScale(6 / graph_nb),
          },
        ],
      },
      booking_timeslot: {
        title: t('bookingsWeektimeSlot.title'),
        popoverText: t('bookingsWeektimeSlot.popover'),
        height: 371,
        tooltip: true,
      },
      turnover: {
        title: t('turnover.title'),
        popoverText: t('turnover.popover'),
        height: 420,
        yLabel: t('turnover.caption'),
        tooltip: true,
        chartOptions: [
          {
            dataKey: 'v',
            caption: t('turnover.caption'),
            stroke: colorScale(0),
            fill: colorScale(0),
          },
        ],
      },
      billed_subscriptions: {
        title: t('billedSubscriptions.title'),
        popoverText: t('billedSubscriptions.popover'),
        height: 350,
        yLabel: t('billedSubscriptions.caption'),
        tooltip: true,
        chartOptions: [
          {
            dataKey: 'v',
            caption: t('billedSubscriptions.caption'),
            stroke: colorScale(4 / graph_nb),
            fill: colorScale(4 / graph_nb),
          },
        ],
      },
      booking_qualitative: {
        title: t('bookingSource.title'),
        height: 320,
        tooltip: true,
        legend: true,
        baseColor: colorScale(2 / graph_nb),
        translationKey: 'dashboard:bookingDropdown.source',
      },
      subscription_turnover: {
        title: t('plannedPayment.title'),
        height: 350,
        yLabel: t('plannedPayment.caption'),
        popoverText: t('plannedPayment.popover'),
        tooltip: true,
        chartOptions: [
          {
            dataKey: 'v',
            caption: t('plannedPayment.caption'),
            stroke: colorScale(5 / graph_nb),
            fill: colorScale(5 / graph_nb),
          },
        ],
      },
      invoice_item: {
        title: t('invoiceItems.title'),
        height: 368,
        baseColor: colorScale(3 / graph_nb),
        tooltip: true,
        legend: true,
        isCurrencyFormat: true,
        translationKey: 'dashboard:invoiceItemDropdown.contentType',
      },
    },
  };
};

export class Dashboard extends Component<Props> {
  componentDidMount() {
    const { fetchStatistics, fetchDashboardSettings, tabList } = this.props;
    fetchDashboardSettings({
      onSuccess: () => {
        if (tabList.length > 0) {
          tabList[0].graphs.forEach((graph) => fetchStatistics(graph));
        }
      },
    });
  }

  componentDidUpdate(prevProps: Props) {
    const { chartFilters, chartRanges, fetchStatistics, tabList } = this.props;
    if (tabList.length > 0) {
      tabList[0].graphs.forEach((graph) => {
        if (chartFilters[graph.name] !== prevProps.chartFilters[graph.name]) {
          fetchStatistics(graph);
        }

        if (chartRanges[graph.name] !== prevProps.chartRanges[graph.name]) {
          fetchStatistics(graph);
        }
      });
    }
  }

  render() {
    const {
      classes,
      chartRanges,
      chartFilters,
      data,
      chartProps,
      tabList,
      t,
    } = this.props;
    return (
      <>
        {tabList.length > 0 && (
          <Grid container="row" spacing={3} className={classes.gridRow}>
            {tabList[0].graphs.map((graph) => {
              const ChartComponent =
                graphRessources[graph.ressourceIdentifier].chartComponents[
                  graph.chart
                ];
              const { timeSettings } = graphRessources[
                graph.ressourceIdentifier
              ];
              return (
                <Grid item xs={12} lg={6} key={graph.name}>
                  <DashboardChart
                    title={chartProps[graph.name].title}
                    popoverText={chartProps[graph.name].popoverText}
                    loading={data[graph.name].loading}
                    filtersComponent={
                      graphRessources[graph.ressourceIdentifier]
                        .filtersComponent
                    }
                    filters={chartFilters[graph.name]}
                    setChartFilters={this.props.setParticularChartFilter(
                      graph.name,
                    )}
                    range={timeSettings !== 'none' && chartRanges[graph.name]}
                    setRange={this.props.setParticularRange(
                      graph.name,
                      timeSettings,
                    )}
                    timeSettings={timeSettings}
                    save={this.props.handleSave(graph)}
                  >
                    <ChartComponent
                      data={data[graph.name].data}
                      {...chartProps[graph.name]}
                    />
                  </DashboardChart>
                </Grid>
              );
            })}
          </Grid>
        )}

        {tabList.length > 0 ? (
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
  connect(
    null,
    {
      fetchDashboardSettings: fetchDashboardSettingsAction,
      updateDashboardSettings: updateDashboardSettingsAction,
    },
  ),
  withDashboardGraphs(getDashboardGraphs, chartPropsData),
  withHandlers({
    fetchStatistics: ({ chartRanges, chartFilters, boundActions }) => (
      graph: Graph,
    ) => {
      const { timeSettings } = graphRessources[graph.ressourceIdentifier];
      let params = { ...graph.baseFilters, ...chartFilters[graph.name] };
      if (timeSettings !== 'none') {
        params = {
          ...params,
          [graphRessources[graph.ressourceIdentifier].dateFiltersName.start]:
            chartRanges[graph.name].start,
          [graphRessources[graph.ressourceIdentifier].dateFiltersName.end]:
            chartRanges[graph.name].end,
        };
      }
      boundActions[graph.name](graph.name, params);
    },
    setParticularChartFilter: ({ setChartFilters }) => (identifier: string) => {
      return (filters) => setChartFilters(identifier, filters);
    },
    setParticularRange: ({ setChartRanges }) => (
      identifier: string,
      timeSettings: string,
    ) => {
      if (timeSettings === 'range') return (r) => setChartRanges(identifier, r);
      return null;
    },
    resetSettings: ({ updateDashboardSettings }) => () => {
      updateDashboardSettings([]);
    },
    saveOneGraph: ({
      updateDashboardSettings,
      tabList,
      chartFilters,
      chartRanges,
    }) => (graph: Graph) => {
      const newSettings = tabList.map((tab) => {
        const graphs = tab.graphs.map((currentGraph) => {
          if (graph.name === currentGraph.name) {
            let defaultRange = { ...currentGraph.defaultRange };
            let defaultFilters = { ...currentGraph.defaultFilters };
            if (
              Object.prototype.hasOwnProperty.call(chartFilters, graph.name)
            ) {
              defaultFilters = { ...chartFilters[graph.name] };
            }
            if (Object.prototype.hasOwnProperty.call(chartRanges, graph.name)) {
              defaultRange = { ...chartRanges[graph.name] };
            }
            return { ...currentGraph, defaultRange, defaultFilters };
          }
          return currentGraph;
        });
        return { ...tab, graphs };
      });
      updateDashboardSettings(newSettings);
    },
  }),
  withHandlers({
    handleSave: ({ saveOneGraph }) => (graph) => {
      return () => saveOneGraph(graph);
    },
  }),
  withTitle(({ t }: { t: TFunction }) => t('titles:dashboard.dashboard')),
)(Dashboard);
