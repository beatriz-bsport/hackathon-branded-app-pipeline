// @flow

import React from 'react';

import { compose, withProps, withHandlers } from 'recompose';
import { withNamespaces } from 'react-i18next';
import { connect } from 'react-redux';

import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import type { TFunction } from 'react-i18next';

import { downloadAsCsv } from '../../downloader';
import { computePerformance } from '../../libs/payment-rules/utils';
import type { PaymentRule } from '../../libs/payment-rules/types';

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
  setCoachPaymentRule,
  fetchAssociated,
} from '../../libs/associated-coach/actions';
import withDrawer from '../../hocs/with-drawer.hoc';
import type {
  Coach,
  CoachPerformance as CoachPerformanceType,
} from '../../libs/associated-coach/types';

import CoachPerformanceForm from '../../libs/associated-coach/components/performance/CoachPerformanceForm.component';
import CoachPerformanceSummary from '../../libs/associated-coach/components/performance/CoachPerformanceSummary.component';
import CoachPerformanceSessionTable from '../../libs/associated-coach/components/performance/CoachPerformanceSessionTable.component';
import PaymentRuleSelector from '../../libs/payment-rules/components/PaymentRuleSelector.component';

type CoachPerformanceProps = {
  classes: Object,
  loading: boolean,
  performance: CoachPerformanceType,
  paymentRules: Array<PaymentRule>,
  associatedCoach: Coach,
  setSessionPaymentRule: (PaymentRule) => void,
  setCoachPaymentRule: (coachId: number, paymentRuleId: number) => void,
};
function CoachPerformance(props: CoachPerformanceProps) {
  const { classes, loading, performance, paymentRules } = props;

  return (
    <div className={classes.performanceContainer}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h5">{props.associatedCoach.name}</Typography>
        <div style={{ maxWidth: 280 }}>
          <PaymentRuleSelector
            selected={props.associatedCoach.default_payment_rule_id}
            paymentRules={props.paymentRules}
            onChange={({ value }) => {
              props.setCoachPaymentRule(props.associatedCoach.id, value);
            }}
          />
        </div>
      </div>
      <CoachPerformanceSummary {...performance} />
      <Paper>
        {loading ? <LinearProgress /> : null}
        <CoachPerformanceSessionTable
          sessions={performance.sessions}
          paymentRules={paymentRules}
          setSessionPaymentRule={props.setSessionPaymentRule}
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
  performanceContainer: {
    marginBottom: theme.spacing.unit,
    marginTop: theme.spacing.unit * 4,
  },
  container: {
    marginBottom: theme.spacing.unit * 32,
  },
  generalLoader: {
    marginBottom: theme.spacing.unit,
  },
});

const CoachPerformanceComposed = compose(
  withStyles(styles),
  withNamespaces(['paymentRules']),
  connect((state, props) => {
    return {
      performance: coachPerformanceSelector.getPerformance(
        state,
        props.associatedCoach.associated_coach_id,
      ),
      paymentRule: paymentRuleSelector(
        state,
        props.associatedCoach.default_payment_rule_id,
      ),
      loading: coachPerformanceSelector.isLoading(
        state,
        props.associatedCoach.associated_coach_id,
      ),
    };
  }),
  withProps(({ performance, paymentRule, paymentRules }) => ({
    performance: computePerformance(performance, paymentRules, paymentRule),
  })),
)(CoachPerformance);

type Props = {
  associatedCoachesWithDefaultPaymentRule: Array<Coach>,
  coachLoading: boolean,
  fetchAssociated: () => void,
  loading: boolean,
  classes: Object,
  paymentRules: PaymentRule[],
  setSessionPaymentRule: (PaymentRule) => void,
  setCoachPaymentRule: (coachId: number, paymentRuleId: number) => void,
  t: TFunction,
  allPerformances: () => Array<[Coach, CoachPerformanceType]>,
  onSubmit: {
    associatedCoachesWithDefaultPaymentRule: Array<Coach>,
    fetchPerformance: (
      associatedCoachId: number,
      dateStart: number,
      dateEnd: number,
      options: any,
    ) => void,
  },
};

export class AllCoachPerformance extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchAssociated();
  }

  render() {
    return (
      <div className={this.props.classes.container}>
        <AppBar
          position="static"
          color="default"
          className={this.props.classes.bar}
        >
          <CoachPerformanceForm
            disabled={this.props.coachLoading}
            onSubmit={this.props.onSubmit}
            loading={this.props.loading}
          />
        </AppBar>
        {this.props.coachLoading ? (
          <LinearProgress className={this.props.classes.generalLoader} />
        ) : null}
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            downloadAsCsv(
              [
                this.props.t('coach.performance.coachName'),
                this.props.t('coach.performance.nbOffersTotal'),
                this.props.t('coach.performance.nbBookings'),
                this.props.t('coach.performance.payment'),
              ],
              this.props
                .allPerformances()
                .map((perf) => [
                  perf[0].name,
                  perf[1].nbSessions,
                  perf[1].nbBookings,
                  `${perf[1].total} €`,
                ]),
              'payroll.csv',
            );
          }}
        >
          <AttachFileIcon />
          {this.props.t('common.download')}
        </Button>
        {this.props.associatedCoachesWithDefaultPaymentRule.map((coach) => (
          <CoachPerformanceComposed
            associatedCoach={coach}
            key={coach.id}
            loading={this.props.loading}
            setSessionPaymentRule={(...args) =>
              this.props.setSessionPaymentRule(
                coach.associated_coach_id,
                ...args,
              )
            }
            paymentRules={this.props.paymentRules}
            setCoachPaymentRule={this.props.setCoachPaymentRule}
          />
        ))}
      </div>
    );
  }
}

export default compose(
  withStyles(styles),
  connect(
    (state) => ({
      paymentRules: paymentRulesSelector(state),
      coachLoading: state.coach.loading,
      associatedCoachesWithDefaultPaymentRule: associatedCoachSelector.withPaymentRule(
        state,
      ),
    }),
    {
      setSessionPaymentRule,
      fetchAssociated,
      fetchPerformance: fetchAssociatedCoachPerformance,
      setCoachPaymentRule,
    },
  ),
  connect(
    (state, { paymentRules, associatedCoachesWithDefaultPaymentRule }) => ({
      allPerformances: () =>
        associatedCoachesWithDefaultPaymentRule.map((coach) => [
          coach,
          computePerformance(
            coachPerformanceSelector.getPerformance(
              state,
              coach.associated_coach_id,
            ),
            paymentRules,
            paymentRuleSelector(state, coach.default_payment_rule_id),
          ),
        ]),
    }),
  ),
  withHandlers({
    onSubmit: ({
      associatedCoachesWithDefaultPaymentRule,
      fetchPerformance,
    }) => (data: Object, options) => {
      const { dateStart, dateEnd } = data;
      associatedCoachesWithDefaultPaymentRule.map((coach) =>
        fetchPerformance(
          coach.associated_coach_id,
          dateStart.unix(),
          dateEnd.unix(),
          options,
        ),
      );
    },
  }),
  withNamespaces(),
  withDrawer(({ t }) => t('appbar.title.allCoachPerformance')),
)(AllCoachPerformance);
