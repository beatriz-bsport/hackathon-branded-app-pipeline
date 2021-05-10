// @flow

import React from 'react';

import { compose, withHandlers, withStateHandlers } from 'recompose';
import { withTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import type { TFunction } from 'react-i18next';
import {
  COACH_PERFORMANCE_FOR_SESSION,
  COACH_PERFORMANCE_FOR_APPOINTMENT,
  computePerformanceSynthese,
} from '@bsport/common/lib/master-data/coach_payment_rule';
import { downloadAsCsv } from '../../utils/downloader';
import type { CoachPaymentRule as CoachPaymentRuleType } from '../../libs/coach-payment-rules/types';

import { getCoachWithCoachPaymentRule } from '../../libs/associated-coach/selectors';
import {
  setCoachPaymentRule,
  setCoachPrivatePaymentRule,
  fetchAssociatedCoachesList,
} from '../../libs/associated-coach/actions';
import {
  fetchAllCoachPaymentRules,
  fetchCoachSessionPerformanceAction,
  fetchCoachPrivateServicePerformanceAction,
  setSessionCoachPaymentRule,
} from '../../libs/coach-payment-rules/actions';
import {
  CoachPaymentRulesSelector,
  CoachPaymentRuleByKindSelector,
  getAssociatedCoachSessionPerformance,
  withCoachPerformance,
} from '../../libs/coach-payment-rules/selectors';
import withTitle from '../../hocs/with-title.hoc';
import {
  Coach,
  CoachPerformance as CoachPerformanceType,
} from '../../libs/associated-coach/types';

import CoachPerformanceForm from '../../libs/associated-coach/components/performance/CoachPerformanceForm.component';
import CoachPerformanceSummary from '../../libs/associated-coach/components/performance/CoachPerformanceSummary.component';
import CoachPaymentRuleSelector from '../../libs/coach-payment-rules/components/CoachPaymentRuleSelector.component';
import CoachPerformanceTabs from '../../libs/associated-coach/components/performance/CoachPerformanceTabs.component';

type CoachPerformanceProps = {
  t: TFunction,
  loading: boolean,
  performance: CoachPerformanceType,
  coachPaymentRulesByKind: Object<CoachPaymentRuleType[]>,
  coach: Coach,
  setSessionCoachPaymentRule: (
    associatedCoachId: number,
    sessionId: number,
    CoachPaymenrRuleId: number,
  ) => void,
  setCoachPaymentRule: (coachId: number, paymentRuleId: number) => void,
  setCoachPrivatePaymentRule: (coachId: number, paymentRuleId: number) => void,
};

const useStyles = makeStyles((theme) => ({
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
  },
  generalLoader: {
    marginBottom: theme.spacing(1),
  },
  flexPaymentSelector: {
    display: 'flex',
  },
  ruleType: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(1),
  },
}));
function CoachPerformance(props: CoachPerformanceProps) {
  const { t, loading, performance, coachPaymentRulesByKind, coach } = props;
  const classes = useStyles();
  return (
    <div className={classes.performanceContainer}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h5">{coach.name}</Typography>
        <div style={{ display: 'flex' }}>
          {[
            COACH_PERFORMANCE_FOR_SESSION,
            COACH_PERFORMANCE_FOR_APPOINTMENT,
          ].map((pay_rule_kind) => (
            <div className={classes.flexPaymentSelector}>
              <Typography className={classes.ruleType}>
                {pay_rule_kind === COACH_PERFORMANCE_FOR_SESSION
                  ? t('paymentRules:select.coachPaymentRuleForSessions')
                  : t('paymentRules:select.coachPaymentRuleForPrivateService')}
              </Typography>
              <CoachPaymentRuleSelector
                coachPaymentRulesList={coachPaymentRulesByKind[pay_rule_kind]}
                selected={
                  pay_rule_kind === COACH_PERFORMANCE_FOR_SESSION
                    ? coach.coach_payment_rule_id
                    : coach.private_coach_payment_rule_id
                }
                onChange={({ value }) => {
                  return (
                    (pay_rule_kind === COACH_PERFORMANCE_FOR_SESSION &&
                      props.setCoachPaymentRule(coach.id, value)) ||
                    (pay_rule_kind === COACH_PERFORMANCE_FOR_APPOINTMENT &&
                      props.setCoachPrivatePaymentRule(coach.id, value))
                  );
                }}
              />
            </div>
          ))}
        </div>
      </div>
      <CoachPerformanceSummary performances={performance} />
      <Paper>
        {loading ? <LinearProgress /> : null}
        <CoachPerformanceTabs
          coach={coach}
          allPerformance={performance}
          coachPaymentRulesByKind={coachPaymentRulesByKind}
          setSessionCoachPaymentRule={(...args) =>
            props.setSessionCoachPaymentRule(
              props.coach.associated_coach_id,
              ...args,
            )
          }
        />
      </Paper>
    </div>
  );
}

type Props = {
  associatedCoachWithCoachPaymentRuleAndPerformance: Array<Coach>,
  coachLoading: boolean,
  performanceLoading: boolean,
  fetchAssociatedCoachesList: () => void,
  fetchAllCoachPaymentRules: () => void,
  loading: boolean,
  classes: Object,
  coachPaymentRulesByKind: Object<CoachPaymentRuleType[]>,
  setSessionCoachPaymentRule: (
    associatedCoachId: number,
    sessionId: number,
    CoachPaymenrRuleId: number,
  ) => void,
  setCoachPrivatePaymentRule: (coachId: number, paymentRuleId: number) => void,
  setCoachPaymentRule: (coachId: number, paymentRuleId: number) => void,
  t: TFunction,
  onSubmit: {
    associatedCoachWithCoachPaymentRuleAndPerformance: Array<Coach>,
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
    this.props.fetchAllCoachPaymentRules();
    this.props.fetchAssociatedCoachesList();
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
        {this.props.coachLoading || this.props.performanceLoading ? (
          <LinearProgress className={this.props.classes.generalLoader} />
        ) : null}
        <Button
          variant="contained"
          color="primary"
          disabled={this.props.coachLoading || this.props.performanceLoading}
          onClick={() => {
            downloadAsCsv(
              [
                this.props.t('coach:performance.coachName'),
                this.props.t('coach:performance.payment'),
                this.props.t('coach:performance.bonus'),
                this.props.t('coach:performance.nbBookings'),
                this.props.t('coach:performance.nbConfirmedBookings'),
                this.props.t('coach:performance.nbCancelledBookings'),
              ],
              computePerformanceSynthese(
                this.props.associatedCoachWithCoachPaymentRuleAndPerformance,
              ).map((perf) => [
                perf.name,
                perf.payment,
                perf.bonus,
                perf.nbSessions,
                perf.confirmedBookings,
                perf.cancelledBookings,
              ]),
              'payroll.csv',
            );
          }}
        >
          <AttachFileIcon />
          {this.props.t('coachPerformance:table.downloadAll')}
        </Button>
        {this.props.associatedCoachWithCoachPaymentRuleAndPerformance.map(
          (coach) => (
            <CoachPerformance
              t={this.props.t}
              coach={coach}
              key={coach.id}
              loading={this.props.loading}
              setSessionCoachPaymentRule={this.props.setSessionCoachPaymentRule}
              coachPaymentRulesByKind={this.props.coachPaymentRulesByKind}
              setCoachPaymentRule={this.props.setCoachPaymentRule}
              setCoachPrivatePaymentRule={this.props.setCoachPrivatePaymentRule}
              performance={coach.performance}
            />
          ),
        )}
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
  performanceContainer: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(4),
  },
  container: {
    marginBottom: theme.spacing(32),
  },
  generalLoader: {
    marginBottom: theme.spacing(1),
  },
});
export default compose(
  withStyles(styles),
  connect(
    (state) => ({
      coachPaymentRulesList: CoachPaymentRulesSelector(state),
      coachPaymentRulesByKind: CoachPaymentRuleByKindSelector(state),
      coachLoading: state.coach.loading,
      performanceLoading: state.coachPaymentRules.performance.loading,
      associatedCoachWithCoachPaymentRuleAndPerformance: withCoachPerformance(
        getCoachWithCoachPaymentRule,
      )(state),
    }),
    {
      setSessionCoachPaymentRule,
      fetchAssociatedCoachesList,
      fetchCoachSessionPerformance: fetchCoachSessionPerformanceAction,
      fetchCoachPrivateServicePerformance: fetchCoachPrivateServicePerformanceAction,
      setCoachPaymentRule,
      setCoachPrivatePaymentRule,
      fetchAllCoachPaymentRules,
      getAssociatedCoachSessionPerformance,
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
      associatedCoachWithCoachPaymentRuleAndPerformance,
      fetchCoachSessionPerformance,
      fetchCoachPrivateServicePerformance,
      setPerformanceLoading,
    }) => async (data: Object, options) => {
      const { dateStart, dateEnd } = data;
      setPerformanceLoading(true);
      const promises = associatedCoachWithCoachPaymentRuleAndPerformance.map(
        (coach) => {
          return (
            fetchCoachSessionPerformance(
              coach.associated_coach_id,
              dateStart.unix(),
              dateEnd.unix(),
              options,
            ),
            fetchCoachPrivateServicePerformance(
              coach.associated_coach_id,
              dateStart.unix(),
              dateEnd.unix(),
              options,
            )
          );
        },
      );
      await Promise.all(promises);
      setPerformanceLoading(false);
    },
  }),
  withTranslation(),
  withTitle(({ t }) => t('titles:coach.allCoachPerformance')),
)(AllCoachPerformance);
