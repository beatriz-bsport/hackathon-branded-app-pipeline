// @flow

import React from 'react';

import {
  compose,
  withProps,
  withHandlers,
  withState,
  withStateHandlers,
} from 'recompose';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import type { TFunction } from 'react-i18next';

import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import AppBar from '@material-ui/core/AppBar';

import mapParamsToProps from '../../hocs/router-params-to-props.hoc';
import { associatedCoachSelector } from '../../libs/associated-coach/selectors';
import {
  CoachPaymentSelector,
  CoachPaymentRuleByKindSelector,
  getAssociatedCoachPerformances,
} from '../../libs/coach-payment-rules/selectors';
import {
  fetchAllCoachPaymentRules,
  fetchCoachSessionPerformanceAction,
  fetchCoachPrivateServicePerformanceAction,
  setSessionCoachPaymentRule,
  setPrivateBookingCoachPaymentRule as updatePrivateBookingCoachPaymentRule,
} from '../../libs/coach-payment-rules/actions';
import { fetchAssociatedCoachesList } from '../../libs/associated-coach/actions';
import withTitle from '../../hocs/with-title.hoc';

import CoachPerformanceForm from '../../libs/associated-coach/components/performance/CoachPerformanceForm.component';
import CoachPerformanceSummary from '../../libs/associated-coach/components/performance/CoachPerformanceSummary.component';
import CoachPerformanceTabs from '../../libs/associated-coach/components/performance/CoachPerformanceTabs.component';
import type { Coach } from '../../libs/associated-coach/types';
import type {
  CoachPaymentRule as CoachPaymentRuleType,
  CoachPerformance as CoachPerformanceType,
} from '../../libs/coach-payment-rules/types';

type Props = {
  loading: boolean,
  performanceLoading: boolean,
  fetchAssociatedCoachesList: () => void,
  performances: Array<CoachPerformanceType>,
  classes: Object,
  onSubmit: () => void,
  setSessionCoachPaymentRule: (data: {
    associatedCoachId: number,
    sessionId: number,
    CoachPaymenrRuleId: number,
  }) => void,
  updatePrivateBookingCoachPaymentRule: (data: {
    associatedCoachId: number,
    privateBookingId: number,
    CoachPaymenrRuleId: number,
  }) => void,
  fetchAllCoachPaymentRules: () => void,
  coach: Coach,
  coachPaymentRulesByKind: { [kind: number]: Array<CoachPaymentRuleType> },
};

export class CoachPerformance extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchAllCoachPaymentRules();
    this.props.fetchAssociatedCoachesList();
  }

  render() {
    const {
      classes,
      loading,
      performanceLoading,
      performances,
      onSubmit,
      coachPaymentRulesByKind,
      coach,
    } = this.props;
    return (
      <div className={classes.container}>
        <AppBar position="static" color="default" className={classes.bar}>
          <CoachPerformanceForm
            onSubmit={onSubmit}
            loading={loading || performanceLoading}
          />
        </AppBar>
        <CoachPerformanceSummary performances={performances} />
        <Paper>
          {loading || performanceLoading ? <LinearProgress /> : null}
          <CoachPerformanceTabs
            coach={coach}
            allPerformance={performances}
            coachPaymentRulesByKind={coachPaymentRulesByKind}
            updatePrivateBookingCoachPaymentRule={(data) =>
              this.props.updatePrivateBookingCoachPaymentRule(data)
            }
            setSessionCoachPaymentRule={(data) => {
              this.props.setSessionCoachPaymentRule(data);
            }}
          />
        </Paper>
      </div>
    );
  }
}

const styles = (theme) => ({
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

export default compose(
  withStyles(styles),
  withTranslation(['paymentRules']),
  mapParamsToProps(['associatedCoachId']),
  withState('formDates', 'setFormDates', {}),
  withProps((props) => ({
    associatedCoachId: +props.associatedCoachId,
  })),
  connect(
    (state, props) => ({
      coach: associatedCoachSelector.get(state, props.associatedCoachId),
      performances: getAssociatedCoachPerformances(
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
      updatePrivateBookingCoachPaymentRuleAction: updatePrivateBookingCoachPaymentRule,
      fetchCoachSessionPerformance: fetchCoachSessionPerformanceAction,
      fetchCoachPrivateServicePerformance: fetchCoachPrivateServicePerformanceAction,
    },
  ),
  withStateHandlers(
    { performanceLoading: false },
    {
      setPerformanceLoading: () => (loading) => ({
        performanceLoading: loading,
      }),
    },
  ),
  withHandlers({
    onSubmit: ({
      associatedCoachId,
      fetchCoachSessionPerformance,
      fetchCoachPrivateServicePerformance,
      setFormDates,
      setPerformanceLoading,
    }) => async (data: Object, options) => {
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
  }),
  withHandlers({
    setSessionCoachPaymentRule: ({
      setSessionCoachPaymentRuleAction,
      fetchCoachSessionPerformance,
      formDates,
    }) => (data) => {
      setSessionCoachPaymentRuleAction(data, {
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
  }),
  withHandlers({
    updatePrivateBookingCoachPaymentRule: ({
      updatePrivateBookingCoachPaymentRuleAction,
      fetchCoachPrivateServicePerformance,
      formDates,
    }) => (data) => {
      updatePrivateBookingCoachPaymentRuleAction(data, {
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
  }),
  withTitle(({ t, coach }: { t: TFunction, coach: Coach }) =>
    t('titles:coach.coachPerformance', { name: coach ? coach.name : '' }),
  ),
)(CoachPerformance);
