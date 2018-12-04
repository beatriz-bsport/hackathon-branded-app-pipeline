// @flow

import React from 'react';

import { compose, withProps, withHandlers } from 'recompose';
import { withNamespaces } from 'react-i18next';
import { connect } from 'react-redux';

import type { TFunction } from 'react-i18next';

import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core';

import { computePerformance } from '../../libs/payment-rules/utils';

import mapParamsToProps from '../../hocs/router-params-to-props.hoc';
import { associatedCoachSelector } from '../../state/coaches/selectors';
import {
  paymentRuleSelector,
  paymentRulesSelector,
} from '../../libs/payment-rules/selectors';

import {
  CoachPerformanceForm,
  CoachPerformanceSummary,
} from '../../components';
import CoachPerformanceSessionTable from '../../components/coach/CoachPerformanceSessionTable.component';

import { coach as coachActions } from '../../actions';

import type { Coach } from '../../api/types';

type Props = {
  coach: Coach,
  loading: boolean,
  performance: Array<Object>,
  t: TFunction,
  classes: Object,
  onSubmit: () => void,
};

export function CoachPerformance(props: Props) {
  const {
    classes,
    t,
    loading,
    performance,
    coach,
    onSubmit,
    paymentRules,
    setSessionPaymentRule,
  } = props;

  return (
    <div>
      <Typography variant="h4">{t('title', { name: coach.name })}</Typography>
      <header className={classes.header}>
        <CoachPerformanceForm onSubmit={onSubmit} loading={loading} />
      </header>
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
  header: {
    marginTop: theme.spacing.unit * 2,
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
    onSubmit: ({ associatedCoachId, fetchPerformance }) => (data: Object) => {
      const { dateStart, dateEnd } = data;
      fetchPerformance(associatedCoachId, dateStart.unix(), dateEnd.unix());
    },
  }),
)(CoachPerformance);
