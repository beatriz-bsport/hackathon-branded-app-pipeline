import React from 'react';
import type { Moment as MomentType } from 'moment';
import Moment from 'moment-timezone';
import { connect, ConnectedProps } from 'react-redux';
import {
  compose,
  withProps,
  withHandlers,
  withState,
  withStateHandlers,
} from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import AppBar from '@material-ui/core/AppBar';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import { WithStyles, createStyles, withStyles, Theme } from '@material-ui/core';

import { OptionCallback } from '../../state/types';
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
} from '../../libs/coach-payment-rules/actions';
import { fetchAssociatedCoachesList } from '../../libs/associated-coach/actions';
import withTitle from '../../hocs/with-title.hoc';

import CoachPerformanceForm from '#libs/coach-payment-rules/components/performance/filters/CoachPerformanceDateFilter.component';
import CoachPerformanceSummaryHeader from '#libs/coach-payment-rules/components/performance/CoachPerformanceSummaryHeader.component';
import CoachPerformanceTabs from '#libs/coach-payment-rules/components/performance/CoachPerformanceTabs.component';
import { Coach } from '../../libs/associated-coach/types';
import type { RootState } from '../../reducers';
import { WithHandlerType } from '../../utils/types';

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

export class CoachPerformance extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchAllCoachPaymentRules();
    this.props.fetchAssociatedCoachesList({
      associated_coach__in: this.props.associatedCoachId,
    });
  }

  render() {
    const {
      classes,
      loading,
      performanceLoading,
      onSubmit,
      coachPaymentRulesByKind,
      coachWithPerformance,
      handleDateFiltersChange,
    } = this.props;
    return (
      <div className={classes.container}>
        <AppBar position="static" color="default" className={classes.bar}>
          <CoachPerformanceForm
            onSubmit={onSubmit}
            handleDateFiltersChange={handleDateFiltersChange}
            loading={loading || performanceLoading}
            hideExport
          />
        </AppBar>
        {coachWithPerformance && coachPaymentRulesByKind ? (
          <>
            <CoachPerformanceSummaryHeader
              performances={coachWithPerformance.performance}
            />
            <Paper>
              {loading || performanceLoading ? <LinearProgress /> : null}
              <CoachPerformanceTabs
                coachWithPerformance={coachWithPerformance}
                coachPaymentRulesByKind={coachPaymentRulesByKind}
                updatePrivateBookingCoachPaymentRule={(data) =>
                  this.props.updatePrivateBookingCoachPaymentRule(data)
                }
                setSessionCoachPaymentRule={(data) => {
                  this.props.setSessionCoachPaymentRule(data);
                }}
                loading={this.props.loading || this.props.performanceLoading}
                displayLastUpdate
              />
            </Paper>
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
    bar: {
      width: `calc(100% + ${theme.spacing(6)}px)`,
      marginTop: theme.spacing(-2),
      marginRight: theme.spacing(-3),
      marginLeft: theme.spacing(-3),
      marginBottom: theme.spacing(3),
      padding: theme.spacing(2),
    },
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
    ),
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
};
export default compose(
  withStyles(styles),
  withTranslation('paymentRules'),
  mapParamsToProps(['associatedCoachId']),
  withState('formDates', 'setFormDates', {}),
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
