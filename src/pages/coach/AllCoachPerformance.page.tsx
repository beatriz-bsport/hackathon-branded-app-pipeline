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

import CoachPerformanceForm from '../../libs/coach-payment-rules/components/performance/CoachPerformanceForm.component';
import CoachPerformanceCachedDataList from '#libs/coach-payment-rules/components/performance/CoachPerformanceCachedDataList.components';
import type { RootState } from '../../reducers';
import { WithHandlerType } from '../../utils/types';
import CoachPerformanceTable from '#libs/coach-payment-rules/components/performance/CoachPerformanceTable.component';

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

type StateProps = WithHandlerType<typeof withStateHandlersSetter> &
  typeof withStateHandlersInit;
type OwnAndConnectedProps = StateProps & ConnectedProps<typeof connector>;
type Props = OwnAndConnectedProps &
  WithHandlerType<typeof mapWithHandlers> &
  WithStyles<typeof styles> &
  WithTranslation;

export class AllCoachPerformancePage extends Component<Props> {
  componentDidMount() {
    this.props.fetchAllCoachPaymentRules();
    this.props.fetchAssociatedCoachesList({ disabled: false });
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
          this.props
            .allAssociatedCoachWithCoachPaymentRuleAndPerformanceFromCahcedData
            ?.length > 50
            ? 2
            : null,
        count:
          this.props
            .allAssociatedCoachWithCoachPaymentRuleAndPerformanceFromCahcedData
            ?.length,
        previous: null,
      });
      this.props.setCoachesPaginated(
        this.props.allAssociatedCoachWithCoachPaymentRuleAndPerformanceFromCahcedData?.reduce(
          (acc, coach, index) => {
            if (acc[Math.floor(index / PAGINATION_PAGE_LENGTH) + 1]) {
              acc[Math.floor(index / PAGINATION_PAGE_LENGTH) + 1].push(
                coach.id,
              );
            } else {
              acc[Math.floor(index / PAGINATION_PAGE_LENGTH) + 1] = [coach.id];
            }
            return acc;
          },
          {},
        ),
      );
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
      this.props.allAssociatedCoaches.reduce((acc, coach, index) => {
        if (acc[Math.floor(index / PAGINATION_PAGE_LENGTH) + 1]) {
          acc[Math.floor(index / PAGINATION_PAGE_LENGTH) + 1].push(coach.id);
        } else {
          acc[Math.floor(index / PAGINATION_PAGE_LENGTH) + 1] = [coach.id];
        }
        return acc;
      }, {}),
    );
    this.props.setCoachPagination({
      page: 1,
      next:
        this.props.allAssociatedCoaches.length < PAGINATION_PAGE_LENGTH
          ? null
          : 1,
      count: this.props.allAssociatedCoaches.length,
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
          .associatedCoachWithCoachPaymentRuleAndPerformanceFromCahcedData;
    } else {
      associatedCoachWithCoachPaymentRuleAndPerformanceSelected =
        this.props.associatedCoachWithCoachPaymentRuleAndPerformance;
    }
    const isInPreviewMode =
      !!this.props.selectedCachedTimestamp &&
      !!this.props
        .associatedCoachWithCoachPaymentRuleAndPerformanceFromCahcedData;

    return (
      <div className={classes.container}>
        <AppBar position="static" color="default" className={classes.bar}>
          <CoachPerformanceForm
            coaches={this.props.allAssociatedCoaches}
            disabled={isInPreviewMode}
            onSubmit={this.props.onSubmit}
            loading={
              this.props.coachLoading ||
              this.props.performanceLoading ||
              this.props.isSubmitLoading
            }
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
    performanceLoading: state.coachPaymentRules.performance.loading,
    allAssociatedCoaches: getActiveCoaches(state),
    associatedCoachWithCoachPaymentRuleAndPerformance: withCoachPerformance(
      getActiveCoachesBulk,
    )(state, coachesPaginated[coachPaginationState.page]),

    coachPaymentRuleGroups: getCoachPaymentRuleGroups(state),
    coachPaymentRuleGroupsDict: state.coachPaymentRules.groups.byId,
    coachPerformanceCachedDataList: getCoachPerformanceCachedDataList(state),
    allAssociatedCoachWithCoachPaymentRuleAndPerformanceFromCahcedData:
      withCachedCoachPerformance(getActiveCoaches)(
        state,
        undefined,
        selectedCachedTimestamp,
      ),
    associatedCoachWithCoachPaymentRuleAndPerformanceFromCahcedData:
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
  onSubmit:
    ({
      fetchBulkCoachSessionPerformanceAction,
      fetchBulkPrivateServicePerformanceAction,
      setFormDates,
      setCoachesPaginated,
      setAssociatedCoachesPaginated,
      setCoachPagination,
      setCoachesFilter,
      setSubmitLoading,
      allAssociatedCoaches,
      coachesFilter,
      coachPaginationState,
      associatedCoachesPaginated,
    }: OwnAndConnectedProps) =>
    async (
      data: {
        dateStart: MomentType;
        dateEnd: MomentType;
        coaches: Array<number>;
      },
      options: OptionCallback,
    ) => {
      const { dateStart, dateEnd, coaches } = data;
      setFormDates({ dateStart: dateStart.unix(), dateEnd: dateEnd.unix() });
      setSubmitLoading(true);
      const start_timestamp = dateStart.unix();
      const end_timestamp = dateEnd.unix();
      if (coaches?.length) {
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
                  allAssociatedCoaches.find(
                    (associated_coach) =>
                      associated_coach_id ===
                      associated_coach.associated_coach_id,
                  ).id,
                );
              } else {
                acc[Math.floor(index / PAGINATION_PAGE_LENGTH) + 1] = [
                  allAssociatedCoaches.find(
                    (associated_coach) =>
                      associated_coach_id ===
                      associated_coach.associated_coach_id,
                  ).id,
                ];
              }
              return acc;
            }, {}),
          );
          const associatedCoachesFilterPaginated = coaches.reduce(
            (acc, associated_coach_id, index) => {
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
            },
            {},
          );
          setAssociatedCoachesPaginated(associatedCoachesFilterPaginated);
          await fetchBulkPrivateServicePerformanceAction(
            {
              associated_coach_ids: associatedCoachesFilterPaginated[1],
              start_timestamp,
              end_timestamp,
            },
            {
              onSuccess: () => {
                fetchBulkCoachSessionPerformanceAction(
                  {
                    associated_coach_ids: associatedCoachesFilterPaginated[1],
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
        } else {
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
        }
      } else if (coachesFilter?.length) {
        setCoachesFilter(null);
        setCoachPagination({
          page: 1,
          next: allAssociatedCoaches.length < PAGINATION_PAGE_LENGTH ? null : 1,
          count: allAssociatedCoaches.length,
          previous: null,
        });
        const allAssociatedCoachesPaginated = allAssociatedCoaches.reduce(
          (acc, coach, index) => {
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
          },
          {},
        );
        setAssociatedCoachesPaginated(allAssociatedCoachesPaginated);
        setCoachesPaginated(
          allAssociatedCoaches.reduce((acc, coach, index) => {
            if (acc[Math.floor(index / PAGINATION_PAGE_LENGTH) + 1]) {
              acc[Math.floor(index / PAGINATION_PAGE_LENGTH) + 1].push(
                coach.id,
              );
            } else {
              acc[Math.floor(index / PAGINATION_PAGE_LENGTH) + 1] = [coach.id];
            }
            return acc;
          }, {}),
        );
        await fetchBulkPrivateServicePerformanceAction(
          {
            associated_coach_ids:
              allAssociatedCoachesPaginated[coachPaginationState.page],
            start_timestamp,
            end_timestamp,
          },
          {
            onSuccess: () => {
              fetchBulkCoachSessionPerformanceAction(
                {
                  associated_coach_ids:
                    allAssociatedCoachesPaginated[coachPaginationState.page],
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
      } else {
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
      }
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
    (params: { disabled: boolean }) => {
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
          setCoachesPaginated(
            coaches.reduce((acc, coach, index) => {
              if (acc[Math.floor(index / PAGINATION_PAGE_LENGTH) + 1]) {
                acc[Math.floor(index / PAGINATION_PAGE_LENGTH) + 1].push(
                  coach.id,
                );
              } else {
                acc[Math.floor(index / PAGINATION_PAGE_LENGTH) + 1] = [
                  coach.id,
                ];
              }
              return acc;
            }, {}),
          );
          const isLastPage = coaches.length <= PAGINATION_PAGE_LENGTH;
          setCoachPagination({
            page: 1,
            count: coaches.length,
            previous: null,
            next: isLastPage ? null : 2,
          });
        },
      });
      options?.onSuccess && options.onSuccess();
    },
  fetchCachedData:
    ({
      fetchBulkCoachSessionPerformanceAction,
      formDates,
      associatedCoachesPaginated,
    }: OwnAndConnectedProps) =>
    (params: { page: number }, options?: OptionCallback) => {
      const ids = associatedCoachesPaginated[params.page];
      fetchBulkCoachSessionPerformanceAction(
        {
          associated_coach_ids: ids,
          start_timestamp: formDates.dateStart,
          end_timestamp: formDates.dateEnd,
          from_cache: true,
        },
        {
          onSuccess: () => {
            if (options && options.onSuccess) options.onSuccess();
          },
          onError: () => {
            if (options && options.onError) options.onError();
          },
        },
      );
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
  withHandlers(mapWithHandlers),
  withTitle(({ t }) => t('titles:coach.allCoachPerformance')),
)(AllCoachPerformancePage);
