// @flow

import React from 'react';

import { compose, withProps, withHandlers } from 'recompose';
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
  fetchAssociatedCoachesList: () => void,
  performances: Array<CoachPerformanceType>,
  classes: Object,
  onSubmit: () => void,
  setSessionCoachPaymentRule: (
    associatedCoachId: number,
    sessionId: number,
    CoachPaymenrRuleId: number,
  ) => void,
  updatePrivateBookingCoachPaymentRule: (
    associatedCoachId: number,
    privateBookingId: number,
    CoachPaymenrRuleId: number,
  ) => void,
  associatedCoachId: number,
  fetchAllCoachPaymentRules: () => void,
  coach: Coach,
  coachPaymentRulesByKind: Object<CoachPaymentRuleType[]>,
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
      performances,
      onSubmit,
      coachPaymentRulesByKind,
      coach,
    } = this.props;
    return (
      <div className={classes.container}>
        <AppBar position="static" color="default" className={classes.bar}>
          <CoachPerformanceForm onSubmit={onSubmit} loading={loading} />
        </AppBar>
        <CoachPerformanceSummary performances={performances} />
        <Paper>
          {loading ? <LinearProgress /> : null}
          <CoachPerformanceTabs
            coach={coach}
            allPerformance={performances}
            coachPaymentRulesByKind={coachPaymentRulesByKind}
            updatePrivateBookingCoachPaymentRule={(...args) =>
              this.props.updatePrivateBookingCoachPaymentRule(
                this.props.associatedCoachId,
                ...args,
              )
            }
            setSessionCoachPaymentRule={(...args) =>
              this.props.setSessionCoachPaymentRule(
                this.props.associatedCoachId,
                ...args,
              )
            }
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
      setSessionCoachPaymentRule,
      updatePrivateBookingCoachPaymentRule,
      fetchCoachSessionPerformance: fetchCoachSessionPerformanceAction,
      fetchCoachPrivateServicePerformance: fetchCoachPrivateServicePerformanceAction,
    },
  ),
  withHandlers({
    onSubmit: ({
      associatedCoachId,
      fetchCoachSessionPerformance,
      fetchCoachPrivateServicePerformance,
    }) => (data: Object, options) => {
      const { dateStart, dateEnd } = data;
      fetchCoachSessionPerformance(
        associatedCoachId,
        dateStart.unix(),
        dateEnd.unix(),
        options,
      );
      fetchCoachPrivateServicePerformance(
        associatedCoachId,
        dateStart.unix(),
        dateEnd.unix(),
        options,
      );
    },
  }),
  withTitle(({ t, coach }: { t: TFunction, coach: Coach }) =>
    t('titles:coach.coachPerformance', { name: coach ? coach.name : '' }),
  ),
)(CoachPerformance);
