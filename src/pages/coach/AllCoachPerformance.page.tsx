import React, { Component } from 'react';
import type { Moment } from 'moment';
import { connect, ConnectedProps } from 'react-redux';
import { compose, withHandlers, withStateHandlers, withState } from 'recompose';
import AppBar from '@material-ui/core/AppBar';

import { WithStyles, createStyles, withStyles, Theme } from '@material-ui/core';
import { withTranslation, WithTranslation } from 'react-i18next';
import { OptionCallback } from '../../state/types';
import withTitle from '../../hocs/with-title.hoc';
import { getActiveCoaches } from '../../libs/associated-coach/selectors';
import {
  setCoachPaymentRule,
  setCoachPrivatePaymentRule,
  setCoachWorkshopPaymentRule,
  fetchAssociatedCoachesList,
  fetchAssociatedCoachesPaginatedList,
  setCoachPaymentRuleGroup,
} from '#libs/associated-coach/actions';

import {
  fetchAllCoachPaymentRules,
  fetchAllCoachPaymentRuleGroups,
  fetchCoachSessionPerformanceAction,
  fetchBulkCoachSessionPerformance,
  fetchCoachPrivateServicePerformanceAction,
  fetchBulkPrivateServicePerformance,
  setSessionCoachPaymentRule,
  setPrivateBookingCoachPaymentRule as updatePrivateBookingCoachPaymentRule,
  exportExcelPerformance,
  fetchCoachPerformanceCachedData,
} from '#libs/coach-payment-rules/actions';

import {
  CoachPaymentRulesSelector,
  CoachPaymentRuleByKindSelector,
  withCoachPerformance,
  withCachedCoachPerformance,
  getCoachPaymentRuleGroups,
  getCoachPerformanceCachedDataList,
} from '#libs/coach-payment-rules/selectors';

import CoachPerformanceForm from '../../libs/coach-payment-rules/components/performance/CoachPerformanceForm.component';
import CoachPerformanceCachedDataList from '#libs/coach-payment-rules/components/performance/CoachPerformanceCachedDataList.components';
import type { RootState } from '../../reducers';
import type { Coach } from '#libs/associated-coach/types';
import { WithHandlerType } from '../../utils/types';
import CoachPerformanceTable from '#libs/coach-payment-rules/components/performance/CoachPerformanceTable.component';

const styles = (theme: Theme) =>
  createStyles({
    bar: {
      width: `calc(100% + ${theme.spacing(6)}px)`,
      marginTop: theme.spacing(-2),
      marginRight: theme.spacing(-3),
      marginLeft: theme.spacing(-3),
      marginBottom: theme.spacing(3),
      padding: theme.spacing(2),
    },
    performanceContainer: {
      marginBottom: theme.spacing(1),
      marginTop: theme.spacing(4),
    },
    container: {
      marginBottom: theme.spacing(32),
      width: '100%',
    },
    generalLoader: {
      marginBottom: theme.spacing(1),
    },
    downLoadButtons: {
      paddingBottom: theme.spacing(2),
    },
  });

type OwnProps = {
  setPerformanceLoading: (loading: boolean) => void;
  setFormDates: ({
    dateStart,
    dateEnd,
  }: {
    dateStart: number;
    dateEnd: number;
  }) => void;
  formDates: { dateStart: number; dateEnd: number };
  setCoachPagination: (coachPagination: {
    page: number;
    count: number;
    next: number;
    previous: number;
  }) => void;
  coachPaginationState: {
    page: number;
    count: number;
    next: number;
    previous: number;
  };
  setActivePageAssociatedCoachIds: (ids: Array<number>) => void;
  activePageAssociatedCoachIds: Array<number>;
  selectedCachedTimestamp: null | number;
  setSelectedCachedTimestamp: (timestamp: null | number) => void;
};

type OwnAndConnectedProps = OwnProps & ConnectedProps<typeof connector>;
type Props = OwnProps &
  OwnAndConnectedProps &
  WithHandlerType<typeof mapWithHandlers> &
  WithStyles<typeof styles> &
  WithTranslation;

export class AllCoachPerformancePage extends Component<Props> {
  componentDidMount() {
    this.props.fetchAllCoachPaymentRules();
    this.props.fetchAssociatedCoachesPaginatedList({ page: 1 });
    this.props.fetchAllCoachPaymentRuleGroups();
    this.props.fetchCoachPerformanceCachedDataAction({ max_range: 10 });
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.coachPaginationState.page !==
      this.props.coachPaginationState.page
    ) {
      this.props.fetchAssociatedCoachesPaginatedList({
        page: this.props.coachPaginationState.page,
      });
    }
  }

  changePage = (page: number) => {
    this.props.setCoachPagination({
      ...this.props.coachPaginationState,
      page,
    });
  };

  leavePreviewMode = () => this.props.setSelectedCachedTimestamp(null);

  render() {
    const { classes } = this.props;
    const associatedCoachWithCoachPaymentRuleAndPerformanceSelected = this.props
      .selectedCachedTimestamp
      ? this.props.associatedCoachWithCoachPaymentRuleAndPerformanceFromCahcedData.filter(
          (assCoachWithPerf: Coach) =>
            this.props.activePageAssociatedCoachIds.includes(
              assCoachWithPerf.associated_coach_id,
            ),
        )
      : this.props.associatedCoachWithCoachPaymentRuleAndPerformance.filter(
          (assCoachWithPerf: Coach) =>
            this.props.activePageAssociatedCoachIds.includes(
              assCoachWithPerf.associated_coach_id,
            ),
        );

    return (
      <div className={classes.container}>
        <AppBar position="static" color="default" className={classes.bar}>
          <CoachPerformanceForm
            disabled={this.props.coachLoading}
            onSubmit={this.props.onSubmit}
            loading={this.props.coachLoading || this.props.performanceLoading}
            exportExcelPerformance={this.props.exportExcelPerformance}
          />
        </AppBar>

        <CoachPerformanceCachedDataList
          cachedDataList={this.props.coachPerformanceCachedDataList}
          selectedCachedTimestamp={this.props.selectedCachedTimestamp}
          setSelectedCachedTimestamp={this.props.setSelectedCachedTimestamp}
          exportExcelPerformance={this.props.exportExcelPerformance}
        />
        <CoachPerformanceTable
          previewMode={
            !!this.props.selectedCachedTimestamp &&
            !!this.props
              .associatedCoachWithCoachPaymentRuleAndPerformanceFromCahcedData
          }
          leavePreviewMode={this.leavePreviewMode}
          associatedCoachWithPerformance={
            associatedCoachWithCoachPaymentRuleAndPerformanceSelected
          }
          coachPaymentRulesByKind={this.props.coachPaymentRulesByKind}
          loading={this.props.coachLoading || this.props.performanceLoading}
          setSessionCoachPaymentRule={this.props.setSessionCoachPaymentRule}
          updatePrivateBookingCoachPaymentRule={
            this.props.updatePrivateBookingCoachPaymentRule
          }
          setCoachPaymentRule={this.props.setCoachPaymentRule}
          setCoachPrivatePaymentRule={this.props.setCoachPrivatePaymentRule}
          setCoachWorkShopPaymentRule={this.props.setCoachWorkShopPaymentRule}
          coachPaymentRuleGroups={this.props.coachPaymentRuleGroups}
          coachPaymentRuleGroupsDict={this.props.coachPaymentRuleGroupsDict}
          setCoachPaymentRuleGroup={this.props.setCoachPaymentRuleGroup}
          pagination={this.props.coachPaginationState}
          changePage={this.changePage}
        />
      </div>
    );
  }
}

const connector = connect(
  (
    state: RootState,
    { selectedCachedTimestamp }: { selectedCachedTimestamp: number },
  ) => ({
    coachPaymentRulesList: CoachPaymentRulesSelector(state),
    coachPaymentRulesByKind: CoachPaymentRuleByKindSelector(state),
    coachLoading: state.coach.loading,
    performanceLoading: state.coachPaymentRules.performance.loading,
    associatedCoachWithCoachPaymentRuleAndPerformance:
      withCoachPerformance(getActiveCoaches)(state),
    coachPaymentRuleGroups: getCoachPaymentRuleGroups(state),
    coachPaymentRuleGroupsDict: state.coachPaymentRules.groups.byId,
    coachPerformanceCachedDataList: getCoachPerformanceCachedDataList(state),
    associatedCoachWithCoachPaymentRuleAndPerformanceFromCahcedData:
      withCachedCoachPerformance(getActiveCoaches)(
        state,
        selectedCachedTimestamp,
      ),
  }),
  {
    setSessionCoachPaymentRuleAction: setSessionCoachPaymentRule,
    updatePrivateBookingCoachPaymentRuleAction:
      updatePrivateBookingCoachPaymentRule,
    fetchAssociatedCoachesList,
    fetchAssociatedCoachesPaginatedListAction:
      fetchAssociatedCoachesPaginatedList,
    fetchCoachSessionPerformance: fetchCoachSessionPerformanceAction,
    fetchBulkCoachSessionPerformanceAction: fetchBulkCoachSessionPerformance,
    fetchBulkPrivateServicePerformanceAction:
      fetchBulkPrivateServicePerformance,
    fetchCoachPrivateServicePerformance:
      fetchCoachPrivateServicePerformanceAction,
    setCoachPaymentRuleAction: setCoachPaymentRule,
    setCoachPrivatePaymentRuleAction: setCoachPrivatePaymentRule,
    setCoachWorkshopPaymentRuleAction: setCoachWorkshopPaymentRule,
    fetchAllCoachPaymentRules,
    fetchAllCoachPaymentRuleGroups,
    setCoachPaymentRuleGroupAction: setCoachPaymentRuleGroup,
    exportExcelPerformanceAction: exportExcelPerformance,
    fetchCoachPerformanceCachedDataAction: fetchCoachPerformanceCachedData,
  },
);
const mapWithHandlers = {
  exportExcelPerformance:
    ({
      exportExcelPerformanceAction,
      fetchCoachPerformanceCachedDataAction,
    }: OwnAndConnectedProps) =>
    (
      params: {
        start_timestamp?: number;
        end_timestamp?: number;
        score_timestamp?: number;
      },
      options?: OptionCallback & {
        closeInitialDialog: () => void;
        backgroundDialog?: {
          message: string;
          title: string;
        };
      },
    ) => {
      exportExcelPerformanceAction(params, {
        closeInitialDialog: options?.closeInitialDialog,
        backgroundDialog: options?.backgroundDialog,
        onSuccess: () => {
          fetchCoachPerformanceCachedDataAction({ max_range: 10 });
          if (options && options.onSuccess) options.onSuccess();
        },
        onError: () => {
          fetchCoachPerformanceCachedDataAction({ max_range: 10 });
          if (options && options.onError) options.onError();
        },
      });
    },
  onSubmit:
    ({
      activePageAssociatedCoachIds,
      fetchBulkCoachSessionPerformanceAction,
      fetchBulkPrivateServicePerformanceAction,
      setPerformanceLoading,
      setFormDates,
    }: OwnAndConnectedProps) =>
    async (
      data: { dateStart: Moment; dateEnd: Moment },
      options: OptionCallback,
    ) => {
      const { dateStart, dateEnd } = data;
      setFormDates({ dateStart: dateStart.unix(), dateEnd: dateEnd.unix() });
      setPerformanceLoading(true);
      const start_timestamp = dateStart.unix();
      const end_timestamp = dateEnd.unix();
      await fetchBulkPrivateServicePerformanceAction(
        {
          associated_coach_ids: activePageAssociatedCoachIds,
          start_timestamp,
          end_timestamp,
        },
        {
          onSuccess: () => {
            fetchBulkCoachSessionPerformanceAction(
              {
                associated_coach_ids: activePageAssociatedCoachIds,
                start_timestamp,
                end_timestamp,
              },
              {
                onSuccess: () => {
                  setPerformanceLoading(false);
                  if (options && options.onSuccess) options.onSuccess();
                },
                onError: () => {
                  setPerformanceLoading(false);
                  if (options && options.onError) options.onError();
                },
              },
            );
          },
          onError: () => {
            setPerformanceLoading(false);
            if (options && options.onError) options.onError();
          },
        },
      );
    },
  onSubmitForAll:
    ({
      activePageAssociatedCoachIds,
      fetchBulkCoachSessionPerformanceAction,
      fetchBulkPrivateServicePerformanceAction,
      setPerformanceLoading,
      setFormDates,
    }: OwnAndConnectedProps) =>
    async (data: { dateStart: Moment; dateEnd: Moment }) => {
      const { dateStart, dateEnd } = data;
      setFormDates({ dateStart: dateStart.unix(), dateEnd: dateEnd.unix() });
      setPerformanceLoading(true);
      await fetchBulkPrivateServicePerformanceAction({
        associated_coach_ids: activePageAssociatedCoachIds,
        start_timestamp: dateStart.unix(),
        end_timestamp: dateEnd.unix(),
      });
      await fetchBulkCoachSessionPerformanceAction({
        associated_coach_ids: activePageAssociatedCoachIds,
        start_timestamp: dateStart.unix(),
        end_timestamp: dateEnd.unix(),
      });

      setPerformanceLoading(false);
    },
  setCoachPaymentRule:
    ({
      setCoachPaymentRuleAction,
      fetchCoachSessionPerformance,
      setPerformanceLoading,
      formDates,
    }: OwnAndConnectedProps) =>
    (coachId: number, paymentRuleId: number, associatedCoachId: number) => {
      setCoachPaymentRuleAction(coachId, paymentRuleId, {
        onSuccess: async () => {
          setPerformanceLoading(true);
          const promises = [
            fetchCoachSessionPerformance({
              associatedCoachId,
              start_timestamp: formDates.dateStart,
              end_timestamp: formDates.dateEnd,
            }),
          ];
          await Promise.all(promises);
          setPerformanceLoading(false);
        },
      });
    },

  setCoachPrivatePaymentRule:
    ({
      setCoachPrivatePaymentRuleAction,
      fetchCoachPrivateServicePerformance,
      setPerformanceLoading,
      formDates,
    }: OwnAndConnectedProps) =>
    (coachId: number, paymentRuleId: number, associatedCoachId: number) => {
      setCoachPrivatePaymentRuleAction(coachId, paymentRuleId, {
        onSuccess: async () => {
          setPerformanceLoading(true);
          const promises = [
            fetchCoachPrivateServicePerformance({
              associatedCoachId,
              start_timestamp: formDates.dateStart,
              end_timestamp: formDates.dateEnd,
            }),
          ];
          await Promise.all(promises);
          setPerformanceLoading(false);
        },
      });
    },
  setCoachWorkShopPaymentRule:
    ({
      setCoachWorkshopPaymentRuleAction,
      fetchCoachSessionPerformance,
      setPerformanceLoading,
      formDates,
    }: OwnAndConnectedProps) =>
    (coachId: number, paymentRuleId: number, associatedCoachId: number) => {
      setCoachWorkshopPaymentRuleAction(coachId, paymentRuleId, {
        onSuccess: async () => {
          setPerformanceLoading(true);
          const promises = [
            fetchCoachSessionPerformance({
              associatedCoachId,
              start_timestamp: formDates.dateStart,
              end_timestamp: formDates.dateEnd,
            }),
          ];
          await Promise.all(promises);
          setPerformanceLoading(false);
        },
      });
    },
  updatePrivateBookingCoachPaymentRule:
    ({
      updatePrivateBookingCoachPaymentRuleAction,
      fetchCoachPrivateServicePerformance,
      setPerformanceLoading,
      formDates,
    }: OwnAndConnectedProps) =>
    (params: {
      associatedCoachId: number;
      privateBookingId: number;
      coachPaymentRuleId: number;
    }) => {
      updatePrivateBookingCoachPaymentRuleAction(params, {
        onSuccess: async (payload) => {
          setPerformanceLoading(true);
          const promises = [
            fetchCoachPrivateServicePerformance({
              associatedCoachId: payload.associatedCoachId,
              start_timestamp: formDates.dateStart,
              end_timestamp: formDates.dateEnd,
              privateBookingId: payload.privateBookingId,
            }),
          ];
          await Promise.all(promises);
          setPerformanceLoading(false);
        },
      });
    },
  setSessionCoachPaymentRule:
    ({
      setSessionCoachPaymentRuleAction,
      fetchCoachSessionPerformance,
      formDates,
      setPerformanceLoading,
    }: OwnAndConnectedProps) =>
    (params: {
      associatedCoachId: number;
      sessionId: number;
      coachPaymentRuleId: number;
    }) => {
      setSessionCoachPaymentRuleAction(params, {
        onSuccess: async (payload) => {
          setPerformanceLoading(true);
          const promises = [
            fetchCoachSessionPerformance({
              associatedCoachId: payload.associatedCoachId,
              start_timestamp: formDates.dateStart,
              end_timestamp: formDates.dateEnd,
              sessionId: payload.sessionId,
            }),
          ];
          await Promise.all(promises);
          setPerformanceLoading(false);
        },
      });
    },
  setCoachPaymentRuleGroup:
    ({ setCoachPaymentRuleGroupAction }: OwnAndConnectedProps) =>
    (coachId: number, value: number) => {
      setCoachPaymentRuleGroupAction(coachId, value);
    },
  fetchAssociatedCoachesPaginatedList:
    ({
      fetchAssociatedCoachesPaginatedListAction,
      setCoachPagination,
      setActivePageAssociatedCoachIds,
    }: OwnAndConnectedProps) =>
    (params: { page: number }) => {
      fetchAssociatedCoachesPaginatedListAction(params, {
        onSuccess: (payload) => {
          setCoachPagination({
            page: params.page,
            next: payload.next_page,
            previous: params.page - 1,
            count: payload.count,
          });
          setActivePageAssociatedCoachIds(
            payload.results?.map((ass) => ass.associated_coach_id),
          );
        },
      });
    },
};

export default compose(
  withStyles(styles),
  withState('formDates', 'setFormDates', {}),
  withState('selectedCachedTimestamp', 'setSelectedCachedTimestamp', null),
  withTranslation(['coachPerformance', 'coach']),
  connector,
  withStateHandlers(
    {
      performanceLoading: false,
    },
    {
      setPerformanceLoading: () => (loading: boolean) => ({
        performanceLoading: loading,
      }),
    },
  ),
  withStateHandlers(
    {
      coachPaginationState: {
        page: 1,
        count: 0,
        next: 2,
        previous: null,
      },
      activePageAssociatedCoachIds: [],
    },
    {
      setCoachPagination:
        (state) =>
        (coachPagination: {
          page: number;
          count: number;
          next: number;
          previous: number;
        }) => ({
          ...state,
          coachPaginationState: coachPagination,
        }),
      setActivePageAssociatedCoachIds: (state) => (ids: Array<number>) => ({
        ...state,
        activePageAssociatedCoachIds: ids,
      }),
    },
  ),
  withHandlers(mapWithHandlers),
  withTitle(({ t }) => t('titles:coach.allCoachPerformance')),
)(AllCoachPerformancePage);
