// @ts-nocheck
import React from 'react';
import Moment, { Moment as MomentType } from 'moment-timezone';
import { connect, ConnectedProps } from 'react-redux';
import { compose, withProps, withHandlers, withStateHandlers } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import TableContainer from '@material-ui/core/TableContainer';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import type { WithStyles } from '@material-ui/styles';
import type { Theme } from '@material-ui/core/styles';
import type { OptionCallback } from '../../state/types';
// @ts-ignore
import mapParamsToProps from '../../hocs/router-params-to-props.hoc';
import { associatedCoachSelector } from '../../libs/associated-coach/selectors';
import {
  CoachPaymentSelector,
  CoachPaymentRuleByKindSelector,
  withCoachPerformance,
} from '../../libs/coach-payment-rules/selectors';
import {
  fetchAllCoachPaymentRules,
  fetchCoachSessionPerformanceAction,
  fetchCoachPrivateServicePerformanceAction,
  setSessionCoachPaymentRule,
  setPrivateBookingCoachPaymentRule as updatePrivateBookingCoachPaymentRule,
  fetchBulkCoachSessionPerformance,
  fetchBulkPrivateServicePerformance,
  exportPdfPerformance,
} from '../../libs/coach-payment-rules/actions';
import { fetchAssociatedCoachesList } from '../../libs/associated-coach/actions';
import withTitle from '../../hocs/with-title.hoc';

import CoachPerformanceDateAndEstablishmentFilter from '#libs/coach-payment-rules/components/performance/filters/CoachPerformanceDateAndEstablishmentFilter.component';
import CoachPerformanceSummaryHeader from '#libs/coach-payment-rules/components/performance/CoachPerformanceSummaryHeader.component';
import CoachPerformanceTabs from '#libs/coach-payment-rules/components/performance/CoachPerformanceTabs.component';
import type { Coach } from '#libs/associated-coach/types';
import type { RootState } from '../../reducers';
import { WithHandlerType } from '../../utils/types';
import { getTheme } from '#libs/theme/selectors';
import {
  fetchEstablishments as fetchEstablishmentsAction,
  fetchAllEstablishmentGroup as fetchAllEstablishmentGroupAction,
} from '#libs/establishment/actions';
import {
  getAllEstablishments,
  getAssociatedEstablishmentGroup,
} from '#libs/establishment/selectors';
import type { CoachwithPerformance } from '#libs/coach-payment-rules/types';

import {
  getFilteredAssociatedCoachWithPerformance,
  getFilteredEstablishments,
  getEstablishmentGroupNames,
  getEstablishmentNames,
} from '#libs/coach-payment-rules/utils';

type OwnProps = {
  associatedCoachId: number;
};

type StateProps = WithHandlerType<typeof withStateHandlersSetter> &
  typeof withStateHandlersInit;

type OwnAndConnectedProps = OwnProps &
  StateProps &
  ConnectedProps<typeof connector>;
type Props = OwnAndConnectedProps &
  WithHandlerType<typeof mapWithHandlers> &
  WithStyles<typeof styles> &
  WithTranslation;
type State = { selectedEstablishments: number[]; selectedLocations: number[] };

export class CoachPerformance extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchAllCoachPaymentRules();
    this.props.fetchAssociatedCoachesList({
      associated_coach__in: this.props.associatedCoachId,
    });
    this.props.fetchEstablishments();
    this.props.companyTheme?.enable_multi_localization &&
      this.props.fetchAllEstablishmentGroup();
  }

  changeDate = (dateStart: number, dateEnd: number) => {
    this.props.setFormDates({ dateStart, dateEnd });
  };

  state: State = { selectedEstablishments: [], selectedLocations: [] };

  setSelectedEstablishmentFilter = (
    selectedEstablishments: number[],
    selectedLocations: number[],
  ) => {
    this.setState({ selectedEstablishments, selectedLocations });
  };

  establishmentsOptions = ([...this.props.establishments] || []).map(
    (establishment) => {
      return { value: establishment?.id, label: establishment?.title };
    },
  );

  establishmentGroupLocationsOptions = (
    [...this.props.establishmentGroupList] || []
  ).map((establishmentGroup) => {
    return { value: establishmentGroup.id, label: establishmentGroup.name };
  });

  getFilteredAssociatedCoachWithPerformance = () => {
    const establishmentIds = getFilteredEstablishments(
      this.state.selectedEstablishments,
      this.state.selectedLocations,
      this.props.establishmentGroupList,
    );
    if (establishmentIds && establishmentIds?.length) {
      return getFilteredAssociatedCoachWithPerformance(
        establishmentIds,
        this.props.coachWithPerformance,
      );
    }
    return this.props.coachWithPerformance;
  };

  handlePdfExportation = (associatedCoachId: number, dataToExport: number) => {
    this.props.handlePdfExportation(
      associatedCoachId,
      dataToExport,
      getFilteredEstablishments(
        this.state.selectedEstablishments,
        this.state.selectedLocations,
        this.props.establishmentGroupList,
      ),
      getEstablishmentGroupNames(
        this.props.establishmentGroupList,
        this.state.selectedLocations,
      ),
      getEstablishmentNames(
        this.props.establishments,
        this.state.selectedEstablishments,
      ),
    );
  };

  render() {
    const {
      classes,
      loading,
      performanceLoading,
      onSubmit,
      coachPaymentRulesByKind,
      coachWithPerformance,
      handleDateFiltersChange,
      companyTheme,
      establishments,
      establishmentsLoading,
      establishmentGroupList,
      establishmentGroupListLoading,
    } = this.props;

    return (
      <div className={classes.container}>
        <CoachPerformanceDateAndEstablishmentFilter
          establishmentGroupList={establishmentGroupList}
          establishmentGroupListLoading={establishmentGroupListLoading}
          establishments={establishments}
          establishmentsLoading={establishmentsLoading}
          handleDateFiltersChange={handleDateFiltersChange}
          isMultiLocalizationEnabled={
            this.props.companyTheme?.enable_multi_localization
          }
          loading={loading || performanceLoading}
          onSubmit={onSubmit}
          selectedEstablishments={this.state.selectedEstablishments}
          selectedLocations={this.state.selectedLocations}
          setSelectedEstablishmentFilter={this.setSelectedEstablishmentFilter}
          updateStateDate={this.changeDate}
        />
        {coachWithPerformance && coachPaymentRulesByKind ? (
          <>
            <CoachPerformanceSummaryHeader
              performances={
                this.getFilteredAssociatedCoachWithPerformance().performance
              }
            />
            <TableContainer component={Paper}>
              {loading || performanceLoading ? <LinearProgress /> : null}
              <CoachPerformanceTabs
                displayLastUpdate
                coachPaymentRulesByKind={coachPaymentRulesByKind}
                coachWithPerformance={this.getFilteredAssociatedCoachWithPerformance()}
                handlePdfExportation={this.handlePdfExportation}
                isMultiLocalizationEnabled={
                  companyTheme?.enable_multi_localization
                }
                loading={this.props.loading || this.props.performanceLoading}
                setSessionCoachPaymentRule={(data) => {
                  this.props.setSessionCoachPaymentRule(data);
                }}
                updatePrivateBookingCoachPaymentRule={(data) =>
                  this.props.updatePrivateBookingCoachPaymentRule(data)
                }
              />
            </TableContainer>
          </>
        ) : (
          <LinearProgress />
        )}
      </div>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
    container: {
      marginBottom: theme.spacing(32),
    },
  });

const withStateHandlersInit = {
  formDates: {
    dateStart: Moment().startOf('month').unix(),
    dateEnd: Moment(Moment().startOf('month')).endOf('month').unix(),
  },

  performanceLoading: false,
};

const withStateHandlersSetter = {
  setPerformanceLoading:
    (state: typeof withStateHandlersInit) => (loading: boolean) => ({
      ...state,
      performanceLoading: loading,
    }),

  setFormDates:
    (state: typeof withStateHandlersInit) =>
    (formDates: typeof withStateHandlersInit.formDates) => ({
      ...state,
      formDates,
    }),
};
const connector = connect(
  (state: RootState, props: OwnProps) => ({
    coachWithPerformance: withCoachPerformance(associatedCoachSelector.get)(
      state,
      props.associatedCoachId,
    ) as CoachwithPerformance,
    loading: state.coachPaymentRules.performance.loading,
    coachPaymentRule: associatedCoachSelector.get(
      state,
      props.associatedCoachId,
    )
      ? CoachPaymentSelector(
          state,
          associatedCoachSelector.get(state, props.associatedCoachId)
            .coach_payment_rule,
        )
      : null,
    coachPaymentRulesByKind: CoachPaymentRuleByKindSelector(state),
    companyTheme: getTheme(state),
    establishments: getAllEstablishments(state),
    establishmentsLoading: state.establishment.loading,
    establishmentGroupList: getAssociatedEstablishmentGroup(state),
    establishmentGroupListLoading:
      state.establishment.establishmentGroup.loading,
  }),
  {
    fetchAllCoachPaymentRules,
    fetchAssociatedCoachesList,
    setSessionCoachPaymentRuleAction: setSessionCoachPaymentRule,
    updatePrivateBookingCoachPaymentRuleAction:
      updatePrivateBookingCoachPaymentRule,
    fetchCoachSessionPerformance: fetchCoachSessionPerformanceAction,
    fetchCoachPrivateServicePerformance:
      fetchCoachPrivateServicePerformanceAction,
    fetchBulkCoachSessionPerformanceAction: fetchBulkCoachSessionPerformance,
    fetchBulkPrivateServicePerformanceAction:
      fetchBulkPrivateServicePerformance,
    exportPdfPerformanceAction: exportPdfPerformance,
    fetchEstablishments: fetchEstablishmentsAction,
    fetchAllEstablishmentGroup: fetchAllEstablishmentGroupAction,
  },
);

const mapWithHandlers = {
  onSubmit:
    ({
      associatedCoachId,
      fetchCoachSessionPerformance,
      fetchCoachPrivateServicePerformance,
      setFormDates,
      setPerformanceLoading,
    }: OwnAndConnectedProps) =>
    async (
      data: {
        dateStart: MomentType;
        dateEnd: MomentType;
      },
      options?: OptionCallback,
    ) => {
      const { dateStart, dateEnd } = data;
      setFormDates({ dateStart: dateStart.unix(), dateEnd: dateEnd.unix() });
      setPerformanceLoading(true);
      const promises = [
        fetchCoachSessionPerformance(
          {
            associatedCoachId,
            start_timestamp: dateStart.unix(),
            end_timestamp: dateEnd.unix(),
          },
          options,
        ),
        fetchCoachPrivateServicePerformance(
          {
            associatedCoachId,
            start_timestamp: dateStart.unix(),
            end_timestamp: dateEnd.unix(),
          },
          options,
        ),
      ];
      await Promise.all(promises);
      setPerformanceLoading(false);
    },
  handleDateFiltersChange:
    ({
      setPerformanceLoading,
      fetchBulkPrivateServicePerformanceAction,
      fetchBulkCoachSessionPerformanceAction,
      associatedCoachId,
    }: OwnAndConnectedProps) =>
    async (
      data: {
        dateStart: MomentType;
        dateEnd: MomentType;
      },
      options: OptionCallback,
    ) => {
      const { dateStart, dateEnd } = data;
      setPerformanceLoading(true);
      const start_timestamp = dateStart.unix();
      const end_timestamp = dateEnd.unix();
      await fetchBulkPrivateServicePerformanceAction(
        {
          associated_coach_ids: [associatedCoachId],
          start_timestamp,
          end_timestamp,
          from_cache: true,
        },
        {
          onSuccess: () => {
            fetchBulkCoachSessionPerformanceAction(
              {
                associated_coach_ids: [associatedCoachId],
                start_timestamp,
                end_timestamp,
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
  setSessionCoachPaymentRule:
    ({
      setSessionCoachPaymentRuleAction,
      fetchCoachSessionPerformance,
      formDates,
    }: OwnAndConnectedProps) =>
    (params: {
      associatedCoachId: number;
      sessionId: number;
      coachPaymentRuleId: number;
    }) => {
      setSessionCoachPaymentRuleAction(params, {
        onSuccess: (payload) => {
          fetchCoachSessionPerformance({
            associatedCoachId: payload.associatedCoachId,
            start_timestamp: formDates.dateStart,
            end_timestamp: formDates.dateEnd,
            sessionId: payload.sessionId,
          });
        },
      });
    },

  updatePrivateBookingCoachPaymentRule:
    ({
      updatePrivateBookingCoachPaymentRuleAction,
      fetchCoachPrivateServicePerformance,
      formDates,
    }: OwnAndConnectedProps) =>
    (params: {
      associatedCoachId: number;
      privateBookingId: number;
      coachPaymentRuleId: number;
    }) => {
      updatePrivateBookingCoachPaymentRuleAction(params, {
        onSuccess: (payload) => {
          fetchCoachPrivateServicePerformance({
            associatedCoachId: payload.associatedCoachId,
            start_timestamp: formDates.dateStart,
            end_timestamp: formDates.dateEnd,
            privateBookingId: payload.privateBookingId,
          });
        },
      });
    },
  handlePdfExportation:
    ({ exportPdfPerformanceAction, formDates }: OwnAndConnectedProps) =>
    (
      associatedCoachId: number,
      dataToExport: number,
      establishmentFilterIds: number[],
      establismentGroupFilterNames: string[],
      establishmentFilterNames: string[],
    ) => {
      const params = {
        start_timestamp: formDates.dateStart,
        end_timestamp: formDates.dateEnd,
        associated_coaches_in: [associatedCoachId],
        data_to_export: dataToExport,
        establishmentFilterIds,
        establismentGroupFilterNames,
        establishmentFilterNames,
      };
      exportPdfPerformanceAction(params);
    },
};
export default compose(
  withStyles(styles),
  withTranslation('paymentRules'),
  mapParamsToProps(['associatedCoachId']),
  withProps((props: OwnProps) => ({
    associatedCoachId: +props.associatedCoachId,
  })),
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
  connector,
  withHandlers(mapWithHandlers),
  withTitle(({ t, coach }: { t: TFunction; coach: Coach }) =>
    t('titles:coach.coachPerformance', { name: coach ? coach.name : '' }),
  ),
)(CoachPerformance);
