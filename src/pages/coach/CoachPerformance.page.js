// @flow

import React from 'react';

import { compose, withProps, withHandlers } from 'recompose';
import { withNamespaces } from 'react-i18next';
import { connect } from 'react-redux';

import type { TFunction } from 'react-i18next';

import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';

import { computePerformance } from '../../libs/payment-rules/utils';
import type { PaymentRule } from '../../libs/payment-rules/types';

import mapParamsToProps from '../../hocs/router-params-to-props.hoc';
import { associatedCoachSelector } from '../../state/coaches/selectors';
import {
  paymentRuleSelector,
  paymentRulesSelector,
} from '../../libs/payment-rules/selectors';

import { coach as coachActions } from '../../actions';
import withDrawer from '../../hocs/with-drawer.hoc';
import type { Coach } from '../../api/types';

import CoachPerformanceForm from '../../libs/associated-coach/performance/CoachPerformanceForm.component';
import CoachPerformanceSummary from '../../libs/associated-coach/performance/CoachPerformanceSummary.component';
import CoachPerformanceSessionTable from '../../libs/associated-coach/performance/CoachPerformanceSessionTable.component';

type Props = {
  coach: Coach,
  loading: boolean,
  performance: Array<Object>,
  t: TFunction,
  classes: Object,
  onSubmit: () => void,
  paymentRules: PaymentRule[],
  setSessionPaymentRule: (PaymentRule) => void,
};

export function CoachPerformance(props: Props) {
  const {
    classes,
    loading,
    performance,
    onSubmit,
    paymentRules,
    setSessionPaymentRule,
  } = props;

  return (
    <div className={classes.container}>
      <AppBar position="static" color="default" className={classes.bar}>
        <CoachPerformanceForm onSubmit={onSubmit} loading={loading} />
      </AppBar>
      <CoachPerformanceSummary {...performance} />
      <Paper>
        {loading ? <LinearProgress /> : null}
        <CoachPerformanceSessionTable
          sessions={performance.sessions}
          paymentRules={paymentRules}
          setSessionPaymentRule={setSessionPaymentRule}
        />
      </Paper>
    </div>
  );
}

const styles = (theme) => ({
  bar: {
    width: `calc(100% + ${theme.spacing.unit * 6}px)`,
    marginTop: -theme.spacing.unit * 2,
    marginRight: -theme.spacing.unit * 3,
    marginLeft: -theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
    padding: theme.spacing.unit * 2,
  },
  container: {
    marginBottom: theme.spacing.unit * 32,
  },
});

export default compose(
  withStyles(styles),
  withNamespaces(['paymentRules']),
  mapParamsToProps(['associatedCoachId']),
  withProps((props) => ({
    associatedCoachId: +props.associatedCoachId,
  })),
  connect(
    (state, props) => {
      const coach = associatedCoachSelector(state, props.associatedCoachId);
      return {
        performance: state.coach.performance.result,
        loading: state.coach.performance.loading,
        paymentRule: paymentRuleSelector(state, coach.default_payment_rule_id),
        paymentRules: paymentRulesSelector(state),
        coach,
      };
    },
    {
      setSessionPaymentRule: coachActions.setSessionPaymentRule,
      fetchPerformance: coachActions.fetchAssociatedCoachPerformance,
    },
  ),
  withProps(({ performance, paymentRule, paymentRules }) => ({
    performance: computePerformance(performance, paymentRules, paymentRule),
  })),
  withHandlers({
    onSubmit: ({ associatedCoachId, fetchPerformance }) => (
      data: Object,
      options,
    ) => {
      const { dateStart, dateEnd } = data;
      fetchPerformance(
        associatedCoachId,
        dateStart.unix(),
        dateEnd.unix(),
        options,
      );
    },
  }),
  withDrawer(({ t, coach }: { t: TFunction, coach: Coach }) =>
    t('title', { name: coach.name }),
  ),
)(CoachPerformance);
