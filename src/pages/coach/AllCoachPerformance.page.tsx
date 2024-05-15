import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { compose, withHandlers, withStateHandlers } from 'recompose';
import AppBar from '@material-ui/core/AppBar';
import { WithStyles, createStyles, withStyles, Theme } from '@material-ui/core';
import { withTranslation, WithTranslation } from 'react-i18next';
import isEqual from 'lodash/isEqual';
import { DateTime } from 'luxon';
import { OptionCallback } from '../../state/types';
import withTitle from '../../hocs/with-title.hoc';
import {
  getActiveCoaches,
  getActiveCoachesBulk,
} from '#libs/associated-coach/selectors';
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
  exportPdfPerformance,
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
import { getTheme } from '#libs/theme/selectors';

import {
  fetchEstablishments as fetchEstablishmentsAction,
  fetchAllEstablishmentGroup as fetchAllEstablishmentGroupAction,
} from '#libs/establishment/actions';
import {
  getAllEstablishments,
  getAssociatedEstablishmentGroup,
} from '#libs/establishment/selectors';

import {
  getFilteredEstablishments,
  getEstablishmentGroupNames,
  getEstablishmentNames,
  // @ts-expect-error js file
} from '#libs/coach-payment-rules/utils';
import type { CoachwithPerformance } from '#libs/coach-payment-rules/types';

const PAGINATION_PAGE_LENGTH = 25;
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

type CoachPaginationHelperParams =
  | {
      associatedCoachList: Coach[];
      is_associated_coach_list: false;
    }
  | {
      associatedCoachList: number[];
      is_associated_coach_list: true;
    };

const coachPaginationHelper = ({
  associatedCoachList,
  is_associated_coach_list,
}: CoachPaginationHelperParams) => {
  if (is_associated_coach_list) {
    // typecasting should not be necessary, but somehow compiler fails to infer union type (while editor succeeds)
    return (associatedCoachList as number[])?.reduce<Record<number, number[]>>(
      (acc, coach_id, index) => {
        const nextPageIndex = Math.floor(index / PAGINATION_PAGE_LENGTH) + 1;
        if (acc[nextPageIndex]) {
          acc[nextPageIndex].push(coach_id);
        } else {
          acc[nextPageIndex] = [coach_id];
        }
        return acc;
      },
      {},
    );
  }

  return (associatedCoachList as Coach[])?.reduce<Record<number, number[]>>(
    (acc, coach, index) => {
      const nextPageIndex = Math.floor(index / PAGINATION_PAGE_LENGTH) + 1;
      if (acc[nextPageIndex]) {
        acc[nextPageIndex].push(coach.id);
      } else {
        acc[nextPageIndex] = [coach.id];
      }
      return acc;
    },
    {},
  );
};

type StateProps = WithHandlerType<typeof withStateHandlersSetter> &
  typeof withStateHandlersInit;
type OwnAndConnectedProps = StateProps & ConnectedProps<typeof connector>;
type Props = OwnAndConnectedProps &
  WithHandlerType<typeof mapWithHandlers> &
  WithHandlerType<typeof mapWithCachedDataHandlers> &
  WithStyles<typeof styles> &
  WithTranslation;

type State = {
  startTimestamp: number;
  endTimestamp: number;
  selectedEstablishments: number[];
  selectedLocations: number[];
};

export class AllCoachPerformancePage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      startTimestamp: DateTime.now().startOf('month').toUnixInteger(),
      endTimestamp: DateTime.now().endOf('month').toUnixInteger(),
      selectedEstablishments: [],
      selectedLocations: [],
    };
  }

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
    this.props.fetchEstablishments();

    this.props.companyTheme?.enable_multi_localization &&
      this.props.fetchAllEstablishmentGroup();
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
        coachPaginationHelper({
          associatedCoachList: this.props.allActiveAssociatedCoaches,
          is_associated_coach_list: false,
        }),
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

  setSelectedEstablishmentFilter = (
    selectedEstablishments: number[],
    selectedLocations: number[],
  ) => {
    this.setState({ selectedEstablishments, selectedLocations });
  };

  leavePreviewMode = () => {
    this.props.setSelectedCachedTimestamp(null);
    this.props.setCoachesPaginated(
      coachPaginationHelper({
        associatedCoachList: this.props.allActiveAssociatedCoaches,
        is_associated_coach_list: false,
      }),
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

  changeDate = (dateStart: number, dateEnd: number) => {
    this.setState({ startTimestamp: dateStart, endTimestamp: dateEnd });
  };

  render() {
    const { classes } = this.props;
    let associatedCoachWithCoachPaymentRuleAndPerformanceSelected:
      | Coach
      | CoachwithPerformance[]
      | Omit<CoachwithPerformance, 'performanceLoading'>[] = [];
    if (this.props.selectedCachedTimestamp) {
      associatedCoachWithCoachPaymentRuleAndPerformanceSelected =
        this.props
          .associatedCoachWithCoachPaymentRuleAndPerformanceFromCachedData;
    } else {
      associatedCoachWithCoachPaymentRuleAndPerformanceSelected =
        this.props.associatedCoachWithCoachPaymentRuleAndPerformance;
    }

    const dangerouslyTypeCastedAssociatedCoachWithCoachPaymentRuleAndPerformanceSelected =
      associatedCoachWithCoachPaymentRuleAndPerformanceSelected as
        | CoachwithPerformance[];

    const isInPreviewMode =
      !!this.props.selectedCachedTimestamp &&
      !!this.props
        .associatedCoachWithCoachPaymentRuleAndPerformanceFromCachedData;

    return (
      <div className={classes.container}>
        <AppBar className={classes.bar} color="default" position="static">
          <CoachPerformanceDateFilter
            disabled={isInPreviewMode}
            endTimestamp={this.state.endTimestamp}
            exportExcelPerformance={this.props.exportExcelPerformance}
            handleDateFiltersChange={this.props.handleDateFiltersChange}
            loading={
              this.props.coachLoading ||
              this.props.performanceLoading ||
              this.props.isSubmitLoading
            }
            onSubmit={this.props.onSubmit}
            setSelectedEstablishmentFilter={this.setSelectedEstablishmentFilter}
            startTimestamp={this.state.startTimestamp}
            updateStateDate={this.changeDate}
          />
        </AppBar>

        <CoachPerformanceAdvancedFilters
          coaches={this.props.allActiveAssociatedCoaches}
          coachPaymentRuleGroups={this.props.coachPaymentRuleGroups}
          coachPaymentRulesByKind={this.props.coachPaymentRulesByKind}
          disabled={isInPreviewMode}
          establishmentGroupList={this.props.establishmentGroupList}
          establishmentGroupListLoading={
            this.props.establishmentGroupListLoading
          }
          establishments={this.props.establishments}
          establishmentsLoading={this.props.establishmentsLoading}
          isMultiLocalizationEnabled={
            this.props.companyTheme?.enable_multi_localization
          }
          loading={
            this.props.coachLoading ||
            this.props.performanceLoading ||
            this.props.isSubmitLoading
          }
          onSubmit={this.props.onSubmitFilters}
          selectedEstablishments={this.state.selectedEstablishments}
          selectedLocations={this.state.selectedLocations}
          setSelectedEstablishmentFilter={this.setSelectedEstablishmentFilter}
        />
        <CoachPerformanceCachedDataList
          cachedDataList={this.props.coachPerformanceCachedDataList}
          exportExcelPerformance={this.props.exportExcelPerformance}
          selectedCachedTimestamp={this.props.selectedCachedTimestamp}
          setSelectedCachedTimestamp={this.props.setSelectedCachedTimestamp}
        />
        <CoachPerformanceTable
          associatedCoachWithPerformance={
            dangerouslyTypeCastedAssociatedCoachWithCoachPaymentRuleAndPerformanceSelected
          }
          changePage={this.changePage}
          coachPaymentRuleGroups={this.props.coachPaymentRuleGroups}
          coachPaymentRuleGroupsDict={this.props.coachPaymentRuleGroupsDict}
          coachPaymentRulesByKind={this.props.coachPaymentRulesByKind}
          endTimestamp={this.state.endTimestamp}
          exportPdfPerformance={this.props.exportPdfPerformance}
          isMultiLocalizationEnabled={
            this.props.companyTheme?.enable_multi_localization
          }
          leavePreviewMode={this.leavePreviewMode}
          loading={
            this.props.coachLoading ||
            this.props.performanceLoading ||
            this.props.isSubmitLoading
          }
          pagination={this.props.coachPaginationState}
          previewMode={isInPreviewMode}
          selectedEstablishmentGroupNames={getEstablishmentGroupNames(
            this.props.establishmentGroupList,
            this.state.selectedLocations,
          )}
          selectedEstablishments={getFilteredEstablishments(
            this.state.selectedEstablishments,
            this.state.selectedLocations,
            this.props.establishmentGroupList,
          )}
          selectedEstablishmentsNames={getEstablishmentNames(
            this.props.establishments,
            this.state.selectedEstablishments,
          )}
          setCoachPaymentRule={this.props.setCoachPaymentRule}
          setCoachPaymentRuleGroup={this.props.setCoachPaymentRuleGroup}
          setCoachPrivatePaymentRule={this.props.setCoachPrivatePaymentRule}
          setCoachWorkShopPaymentRule={this.props.setCoachWorkShopPaymentRule}
          setSessionCoachPaymentRule={this.props.setSessionCoachPaymentRule}
          startTimestamp={this.state.startTimestamp}
          updatePrivateBookingCoachPaymentRule={
            this.props.updatePrivateBookingCoachPaymentRule
          }
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
      // @ts-expect-error unexpected coachesPaginated[coachPaginationState.page] prop
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
    companyTheme: getTheme(state),
    establishments: getAllEstablishments(state),
    establishmentsLoading: state.establishment.loading,
    establishmentGroupList: getAssociatedEstablishmentGroup(state),
    establishmentGroupListLoading:
      state.establishment.establishmentGroup.loading,
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
    exportPdfPerformanceAction: exportPdfPerformance,
    fetchEstablishments: fetchEstablishmentsAction,
    fetchAllEstablishmentGroup: fetchAllEstablishmentGroupAction,
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
  exportPdfPerformance:
    ({ exportPdfPerformanceAction }: OwnAndConnectedProps) =>
    (
      params: {
        start_timestamp?: number;
        end_timestamp?: number;
        score_timestamp?: number;
        associated_coaches_in?: Array<number>;
        data_to_export?: number;
        establishmentFilterIds?: number[];
        establismentGroupFilterNames?: string[];
        establishmentFilterNames?: string[];
      },
      options?: OptionCallback,
    ) => {
      exportPdfPerformanceAction(params, {
        onSuccess: () => {
          if (options && options.onSuccess) options.onSuccess();
        },
        onError: () => {
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
          coaches.reduce<Record<number, number[]>>(
            (acc, associated_coach_id, index) => {
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
            },
            {},
          ),
        );
        const associatedCoachesFilterPaginated = coachPaginationHelper({
          associatedCoachList: coaches,
          is_associated_coach_list: true,
        });
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
        dateStart: DateTime;
        dateEnd: DateTime;
      },
      options: OptionCallback,
    ) => {
      const { dateStart, dateEnd } = data;
      setSubmitLoading(true);
      const start_timestamp = dateStart.toUnixInteger();
      const end_timestamp = dateEnd.toUnixInteger();
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
        dateStart: DateTime;
        dateEnd: DateTime;
      },
      options: OptionCallback,
    ) => {
      const { dateStart, dateEnd } = data;
      setFormDates({
        dateStart: dateStart.toUnixInteger(),
        dateEnd: dateEnd.toUnixInteger(),
      });
      setSubmitLoading(true);
      const start_timestamp = dateStart.toUnixInteger();
      const end_timestamp = dateEnd.toUnixInteger();
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
            coaches.reduce<Record<number, number[]>>((acc, coach, index) => {
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
            coachPaginationHelper({
              associatedCoachList: coaches,
              is_associated_coach_list: false,
            }),
          );
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
    dateStart: DateTime.now().startOf('month').toUnixInteger(),
    dateEnd: DateTime.now().endOf('month').toUnixInteger(),
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
