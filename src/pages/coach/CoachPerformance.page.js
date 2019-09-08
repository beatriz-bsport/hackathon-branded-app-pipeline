// @flow

import React from 'react';

import { compose, withProps, withHandlers } from 'recompose';
import { withNamespaces } from 'react-i18next';
import { connect } from 'react-redux';

import type { TFunction } from 'react-i18next';

import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import AppBar from '@material-ui/core/AppBar';

import { computePerformance } from '../../libs/payment-rules/utils';
import type { PaymentRule } from '../../libs/payment-rules/types';

import mapParamsToProps from '../../hocs/router-params-to-props.hoc';
import {
  associatedCoachSelector,
  coachPerformanceSelector,
} from '../../libs/associated-coach/selectors';
import {
  paymentRuleSelector,
  paymentRulesSelector,
} from '../../libs/payment-rules/selectors';

import {
  setSessionPaymentRule,
  fetchAssociatedCoachPerformance,
  fetchAssociated,
} from '../../libs/associated-coach/actions';
import withDrawer from '../../hocs/with-drawer.hoc';

import CoachPerformanceForm from '../../libs/associated-coach/components/performance/CoachPerformanceForm.component';
import CoachPerformanceSummary from '../../libs/associated-coach/components/performance/CoachPerformanceSummary.component';
import CoachPerformanceSessionTable from '../../libs/associated-coach/components/performance/CoachPerformanceSessionTable.component';
import type {
  Coach,
  CoachPerformance as CoachPerformanceType,
} from '../../libs/associated-coach/types';

type Props = {
  coach: Coach,
  loading: boolean,
  fetchAssociated: () => void,
  performance: Array<CoachPerformanceType>,
  t: TFunction,
  classes: Object,
  onSubmit: () => void,
  paymentRules: PaymentRule[],
  setSessionPaymentRule: (PaymentRule) => void,
  associatedCoachId: number,
};

export class CoachPerformance extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchAssociated();
  }

  render() {
    const {
      classes,
      loading,
      performance,
      onSubmit,
      paymentRules,
    } = this.props;

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
            setSessionPaymentRule={(...args) =>
              this.props.setSessionPaymentRule(
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
      const coach = associatedCoachSelector.get(state, props.associatedCoachId);
      return {
        performance: coachPerformanceSelector.getPerformance(
          state,
          props.associatedCoachId,
        ),
        loading: coachPerformanceSelector.isLoading(
          state,
          props.associatedCoachId,
        ),
        paymentRule: paymentRuleSelector(state, coach.default_payment_rule_id),
        paymentRules: paymentRulesSelector(state),
        coach,
      };
    },
    {
      fetchAssociated,
      setSessionPaymentRule,
      fetchPerformance: fetchAssociatedCoachPerformance,
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
