import React, { Component } from 'react';
import type { Moment as MomentType } from 'moment';
import { connect, ConnectedProps } from 'react-redux';
import { compose, withHandlers, withStateHandlers } from 'recompose';
import AppBar from '@material-ui/core/AppBar';
import Moment from 'moment-timezone';
import { WithStyles, createStyles, withStyles, Theme } from '@material-ui/core';
import { withTranslation, WithTranslation } from 'react-i18next';
import isEqual from 'lodash/isEqual';
import { OptionCallback } from '../../state/types';
import withTitle from '../../hocs/with-title.hoc';
import {
  getActiveCoaches,
  getActiveCoachesBulk,
} from '../../libs/associated-coach/selectors';
import {
  setCoachPaymentRule,
  setCoachPrivatePaymentRule,
  setCoachWorkshopPaymentRule,
  fetchAssociatedCoachesList as fetchAssociatedCoachesListAction,
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

import CoachPerformanceDateFilter from '#libs/coach-payment-rules/components/performance/filters/CoachPerformanceDateFilter.component';
import CoachPerformanceCachedDataList from '#libs/coach-payment-rules/components/performance/CoachPerformanceCachedDataList.components';
import type { RootState } from '../../reducers';
import { WithHandlerType } from '../../utils/types';
import CoachPerformanceTable from '#libs/coach-payment-rules/components/performance/CoachPerformanceTable.component';
import CoachPerformanceAdvancedFilters from '#libs/coach-payment-rules/components/performance/filters/CoachPerformanceAvancedFilters.component';
import type { Coach } from '#libs/associated-coach/types';

const PAGINATION_PAGE_LENGTH = 50;
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
const coachPaginationHelper = (
  associatedCoachList: Array<Coach>,
  is_associated_coach_list: boolean,
) => {
  if (is_associated_coach_list) {
    return associatedCoachList?.reduce((acc, associated_coach_id, index) => {
      if (acc[Math.floor(index / PAGINATION_PAGE_LENGTH) + 1]) {
        acc[Math.floor(index / PAGINATION_PAGE_LENGTH) + 1].push(
          associated_coach_id,
        );
      } else {
        acc[Math.floor(index / PAGINATION_PAGE_LENGTH) + 1] = [
          associated_coach_id,
        ];
      }
      return acc;
    }, {});
  }
  return associatedCoachList?.reduce((acc, coach, index) => {
    if (acc[Math.floor(index / PAGINATION_PAGE_LENGTH) + 1]) {
      acc[Math.floor(index / PAGINATION_PAGE_LENGTH) + 1].push(coach.id);
    } else {
      acc[Math.floor(index / PAGINATION_PAGE_LENGTH) + 1] = [coach.id];
    }
    return acc;
  }, {});
};

type StateProps = WithHandlerType<typeof withStateHandlersSetter> &
  typeof withStateHandlersInit;
type OwnAndConnectedProps = StateProps & ConnectedProps<typeof connector>;
type Props = OwnAndConnectedProps &
  WithHandlerType<typeof mapWithHandlers> &
  WithHandlerType<typeof mapWithCachedDataHandlers> &
  WithStyles<typeof styles> &
  WithTranslation;

export class AllCoachPerformancePage extends Component<Props> {
  componentDidMount() {
    this.props.fetchAllCoachPaymentRules();
    this.props.fetchAssociatedCoachesList(
      { disabled: false },
      {
        onSuccess: () =>
          this.props.fetchCachedData({
            page: 1,
          }),
      },
    );
    this.props.fetchAllCoachPaymentRuleGroups();
    this.props.fetchCoachPerformanceCachedDataAction({ max_range: 10 });
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.coachPaginationState.page !==
        this.props.coachPaginationState.page &&
      !this.props.selectedCachedTimestamp
    ) {
      this.props.fetchCachedData({
        page: this.props.coachPaginationState.page,
      });
    }
    if (
      prevProps.selectedCachedTimestamp !==
        this.props.selectedCachedTimestamp &&
      this.props.selectedCachedTimestamp
    ) {
      this.props.setCoachPagination({
        page: 1,
        next:
          this.props.allActiveAssociatedCoaches?.length > PAGINATION_PAGE_LENGTH
            ? 2
            : null,
        count: this.props.allActiveAssociatedCoaches?.length,
        previous: null,
      });
      this.props.setCoachesPaginated(
        coachPaginationHelper(this.props.allActiveAssociatedCoaches, false),
      );
    }

    if (prevProps.formDates !== this.props.formDates) {
      this.props.fetchCachedData({
        page: this.props.coachPaginationState.page,
      });
    }
  }

  changePage = (page: number) => {
    this.props.setCoachPagination({
      ...this.props.coachPaginationState,
      page,
      next: this.props.coachesPaginated[page + 1] ? page + 1 : null,
      previous: this.props.coachesPaginated[page - 1] ? page - 1 : null,
    });
  };

  leavePreviewMode = () => {
    this.props.setSelectedCachedTimestamp(null);
    this.props.setCoachesPaginated(
      coachPaginationHelper(this.props.allActiveAssociatedCoaches, false),
    );
    this.props.setCoachPagination({
      page: 1,
      next:
        this.props.allActiveAssociatedCoaches.length < PAGINATION_PAGE_LENGTH
          ? null
          : 1,
      count: this.props.allActiveAssociatedCoaches.length,
      previous: null,
    });
    this.props.setCoachesFilter(null);
  };

  render() {
    const { classes } = this.props;
    let associatedCoachWithCoachPaymentRuleAndPerformanceSelected = [];
    if (this.props.selectedCachedTimestamp) {
      associatedCoachWithCoachPaymentRuleAndPerformanceSelected =
        this.props
          .associatedCoachWithCoachPaymentRuleAndPerformanceFromCachedData;
    } else {
      associatedCoachWithCoachPaymentRuleAndPerformanceSelected =
        this.props.associatedCoachWithCoachPaymentRuleAndPerformance;
    }
    const isInPreviewMode =
      !!this.props.selectedCachedTimestamp &&
      !!this.props
        .associatedCoachWithCoachPaymentRuleAndPerformanceFromCachedData;

    return (
      <div className={classes.container}>
        <AppBar position="static" color="default" className={classes.bar}>
          <CoachPerformanceDateFilter
            disabled={isInPreviewMode}
            onSubmit={this.props.onSubmit}
            handleDateFiltersChange={this.props.handleDateFiltersChange}
            loading={
              this.props.coachLoading ||
              this.props.performanceLoading ||
              this.props.isSubmitLoading
            }
            exportExcelPerformance={this.props.exportExcelPerformance}
          />
        </AppBar>

        <CoachPerformanceAdvancedFilters
          coaches={this.props.allActiveAssociatedCoaches}
          disabled={isInPreviewMode}
          onSubmit={this.props.onSubmitFilters}
          loading={
            this.props.coachLoading ||
            this.props.performanceLoading ||
            this.props.isSubmitLoading
          }
          coachPaymentRuleGroupsDict={this.props.coachPaymentRuleGroupsDict}
          coachPaymentRuleGroups={this.props.coachPaymentRuleGroups}
          coachPaymentRulesByKind={this.props.coachPaymentRulesByKind}
        />
        <CoachPerformanceCachedDataList
          cachedDataList={this.props.coachPerformanceCachedDataList}
          selectedCachedTimestamp={this.props.selectedCachedTimestamp}
          setSelectedCachedTimestamp={this.props.setSelectedCachedTimestamp}
          exportExcelPerformance={this.props.exportExcelPerformance}
        />
        <CoachPerformanceTable
          previewMode={isInPreviewMode}
          leavePreviewMode={this.leavePreviewMode}
          associatedCoachWithPerformance={
            associatedCoachWithCoachPaymentRuleAndPerformanceSelected
          }
          coachPaymentRulesByKind={this.props.coachPaymentRulesByKind}
          loading={
            this.props.coachLoading ||
            this.props.performanceLoading ||
            this.props.isSubmitLoading
          }
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
    {
      selectedCachedTimestamp,
      coachesPaginated,
      coachPaginationState,
    }: StateProps,
  ) => ({
    coachPaymentRulesList: CoachPaymentRulesSelector(state),
    coachPaymentRulesByKind: CoachPaymentRuleByKindSelector(state),
    coachLoading: state.coach.loading,
    allActiveAssociatedCoaches: getActiveCoaches(state),
    associatedCoachWithCoachPaymentRuleAndPerformance: withCoachPerformance(
      getActiveCoachesBulk,
    )(state, coachesPaginated[coachPaginationState.page]),

    coachPaymentRuleGroups: getCoachPaymentRuleGroups(state),
    coachPaymentRuleGroupsDict: state.coachPaymentRules.groups.byId,
    coachPerformanceCachedDataList: getCoachPerformanceCachedDataList(state),
    associatedCoachWithCoachPaymentRuleAndPerformanceFromCachedData:
      withCachedCoachPerformance(getActiveCoachesBulk)(
        state,
        coachesPaginated[coachPaginationState.page],
        selectedCachedTimestamp,
      ),
  }),
  {
    setSessionCoachPaymentRuleAction: setSessionCoachPaymentRule,
    updatePrivateBookingCoachPaymentRuleAction:
      updatePrivateBookingCoachPaymentRule,
    fetchAssociatedCoachesList: fetchAssociatedCoachesListAction,
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

const mapWithCachedDataHandlers = {
  fetchCachedData:
    ({
      fetchBulkCoachSessionPerformanceAction,
      fetchBulkPrivateServicePerformanceAction,
      formDates,
      associatedCoachesPaginated,
      setPerformanceLoading,
    }: OwnAndConnectedProps) =>
    async (params: { page: number }, options?: OptionCallback) => {
      const ids = associatedCoachesPaginated[params.page];
      setPerformanceLoading(true);
      await fetchBulkPrivateServicePerformanceAction(
        {
          associated_coach_ids: ids,
          start_timestamp: formDates.dateStart,
          end_timestamp: formDates.dateEnd,
          from_cache: true,
        },
        {
          onSuccess: () => {
            fetchBulkCoachSessionPerformanceAction(
              {
                associated_coach_ids: ids,
                start_timestamp: formDates.dateStart,
                end_timestamp: formDates.dateEnd,
                from_cache: true,
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
};
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
        associated_coaches_id?: Array<number>;
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
  onSubmitFilters:
    ({
      setCoachesPaginated,
      setAssociatedCoachesPaginated,
      setCoachPagination,
      setCoachesFilter,
      setSubmitLoading,
      allActiveAssociatedCoaches,
      coachesFilter,
    }: OwnAndConnectedProps) =>
    (data: { coaches: Array<number> }, options: OptionCallback) => {
      const { coaches } = data;
      setSubmitLoading(true);

      if (!isEqual(coaches, coachesFilter)) {
        setCoachesFilter(coaches);
        setCoachPagination({
          page: 1,
          next: coaches.length < PAGINATION_PAGE_LENGTH ? null : 1,
          count: coaches.length,
          previous: null,
        });

        setCoachesPaginated(
          coaches.reduce((acc, associated_coach_id, index) => {
            if (acc[Math.floor(index / PAGINATION_PAGE_LENGTH) + 1]) {
              acc[Math.floor(index / PAGINATION_PAGE_LENGTH) + 1].push(
                allActiveAssociatedCoaches.find(
                  (associated_coach) =>
                    associated_coach_id ===
                    associated_coach.associated_coach_id,
                ).id,
              );
            } else {
              acc[Math.floor(index / PAGINATION_PAGE_LENGTH) + 1] = [
                allActiveAssociatedCoaches.find(
                  (associated_coach) =>
                    associated_coach_id ===
                    associated_coach.associated_coach_id,
                ).id,
              ];
            }
            return acc;
          }, {}),
        );
        const associatedCoachesFilterPaginated = coachPaginationHelper(
          coaches,
          true,
        );
        setAssociatedCoachesPaginated(associatedCoachesFilterPaginated);
      }
      options?.onSuccess();
      setSubmitLoading(false);
    },
  handleDateFiltersChange:
    ({
      setSubmitLoading,
      fetchBulkPrivateServicePerformanceAction,
      fetchBulkCoachSessionPerformanceAction,
      coachPaginationState,
      associatedCoachesPaginated,
    }: OwnAndConnectedProps) =>
    async (
      data: {
        dateStart: MomentType;
        dateEnd: MomentType;
      },
      options: OptionCallback,
    ) => {
      const { dateStart, dateEnd } = data;
      setSubmitLoading(true);
      const start_timestamp = dateStart.unix();
      const end_timestamp = dateEnd.unix();
      await fetchBulkPrivateServicePerformanceAction(
        {
          associated_coach_ids:
            associatedCoachesPaginated[coachPaginationState.page],
          start_timestamp,
          end_timestamp,
          from_cache: true,
        },
        {
          onSuccess: () => {
            fetchBulkCoachSessionPerformanceAction(
              {
                associated_coach_ids:
                  associatedCoachesPaginated[coachPaginationState.page],
                start_timestamp,
                end_timestamp,
                from_cache: true,
              },
              {
                onSuccess: () => {
                  setSubmitLoading(false);
                  if (options && options.onSuccess) options.onSuccess();
                },
                onError: () => {
                  setSubmitLoading(false);
                  if (options && options.onError) options.onError();
                },
              },
            );
          },
          onError: () => {
            setSubmitLoading(false);
            if (options && options.onError) options.onError();
          },
        },
      );
    },
  onSubmit:
    ({
      fetchBulkCoachSessionPerformanceAction,
      fetchBulkPrivateServicePerformanceAction,
      setFormDates,
      setSubmitLoading,
      coachPaginationState,
      associatedCoachesPaginated,
    }: OwnAndConnectedProps) =>
    async (
      data: {
        dateStart: MomentType;
        dateEnd: MomentType;
      },
      options: OptionCallback,
    ) => {
      const { dateStart, dateEnd } = data;
      setFormDates({ dateStart: dateStart.unix(), dateEnd: dateEnd.unix() });
      setSubmitLoading(true);
      const start_timestamp = dateStart.unix();
      const end_timestamp = dateEnd.unix();
      await fetchBulkPrivateServicePerformanceAction(
        {
          associated_coach_ids:
            associatedCoachesPaginated[coachPaginationState.page],
          start_timestamp,
          end_timestamp,
        },
        {
          onSuccess: () => {
            fetchBulkCoachSessionPerformanceAction(
              {
                associated_coach_ids:
                  associatedCoachesPaginated[coachPaginationState.page],
                start_timestamp,
                end_timestamp,
              },
              {
                onSuccess: () => {
                  setSubmitLoading(false);
                  if (options && options.onSuccess) options.onSuccess();
                },
                onError: () => {
                  setSubmitLoading(false);
                  if (options && options.onError) options.onError();
                },
              },
            );
          },
          onError: () => {
            setSubmitLoading(false);
            if (options && options.onError) options.onError();
          },
        },
      );
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

  fetchAssociatedCoachesList:
    ({
      fetchAssociatedCoachesList,
      setAssociatedCoachesPaginated,
      setCoachesPaginated,
      setCoachPagination,
    }: OwnAndConnectedProps) =>
    (params: { disabled: boolean }, options: OptionCallback) => {
      fetchAssociatedCoachesList(params, {
        onSuccess: (coaches) => {
          setAssociatedCoachesPaginated(
            coaches.reduce((acc, coach, index) => {
              if (acc[Math.floor(index / PAGINATION_PAGE_LENGTH) + 1]) {
                acc[Math.floor(index / PAGINATION_PAGE_LENGTH) + 1].push(
                  coach.associated_coach_id,
                );
              } else {
                acc[Math.floor(index / PAGINATION_PAGE_LENGTH) + 1] = [
                  coach.associated_coach_id,
                ];
              }
              return acc;
            }, {}),
          );

          setCoachesPaginated(coachPaginationHelper(coaches, false));
          const isLastPage = coaches.length <= PAGINATION_PAGE_LENGTH;
          setCoachPagination({
            page: 1,
            count: coaches.length,
            previous: null,
            next: isLastPage ? null : 2,
          });
          if (options?.onSuccess) options.onSuccess();
        },
      });
    },
};

const withStateHandlersInit = {
  formDates: {
    dateStart: Moment().startOf('month').unix(),
    dateEnd: Moment(Moment().startOf('month')).endOf('month').unix(),
  },
  coachPaginationState: {
    page: 1,
    count: 0,
    next: 1,
    previous: null as number,
  },
  coachesPaginated: {} as {
    [page: number]: Array<number>;
  },

  associatedCoachesPaginated: {} as {
    [page: number]: Array<number>;
  },

  selectedCachedTimestamp: null as number,
  performanceLoading: false,
  coachesFilter: null as Array<number>,
  isSubmitLoading: false,
};
const withStateHandlersSetter = {
  setCoachPagination:
    (state: typeof withStateHandlersInit) =>
    (coachPagination: {
      page: number;
      count: number;
      next: number;
      previous: number;
    }) => ({
      ...state,
      coachPaginationState: coachPagination,
    }),
  setCoachesPaginated:
    (state: typeof withStateHandlersInit) =>
    (coachesPaginated: { [page: number]: Array<number> }) => ({
      ...state,
      coachesPaginated,
    }),

  setAssociatedCoachesPaginated:
    (state: typeof withStateHandlersInit) =>
    (
      associatedCoachesPaginated: typeof withStateHandlersInit.associatedCoachesPaginated,
    ) => ({
      ...state,
      associatedCoachesPaginated,
    }),

  setFormDates:
    (state: typeof withStateHandlersInit) =>
    (formDates: typeof withStateHandlersInit.formDates) => ({
      ...state,
      formDates,
    }),
  setSelectedCachedTimestamp:
    (state: typeof withStateHandlersInit) =>
    (
      selectedCachedTimestamp: typeof withStateHandlersInit.selectedCachedTimestamp,
    ) => ({
      ...state,
      selectedCachedTimestamp,
    }),
  setPerformanceLoading:
    (state: typeof withStateHandlersInit) => (loading: boolean) => ({
      ...state,
      performanceLoading: loading,
    }),
  setSubmitLoading:
    (state: typeof withStateHandlersInit) => (isSubmitLoading: boolean) => ({
      ...state,
      isSubmitLoading,
    }),
  setCoachesFilter:
    (state: typeof withStateHandlersInit) =>
    (coachesFilter: typeof withStateHandlersInit.coachesFilter) => ({
      ...state,
      coachesFilter,
    }),
};

export default compose(
  withStyles(styles),
  withTranslation(['coachPerformance', 'coach']),
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
  connector,
  withHandlers(mapWithCachedDataHandlers),
  withHandlers(mapWithHandlers),
  withTitle(({ t }) => t('titles:coach.allCoachPerformance')),
)(AllCoachPerformancePage);
