// @flow

import React from 'react';

import { compose, withHandlers, withStateHandlers, withState } from 'recompose';
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
} from '@bsport/common/lib/master-data/coach_payment_rule';
import {
  computePerformanceSynthese,
  DISSOCIATED_COACH_PAYMENT_RULE,
  DISSOCIATED_COACH_PAYMENT_RULE_GROUP,
} from '../../libs/coach-payment-rules/utils';
import { downloadAsCsv } from '../../utils/downloader';
import type {
  CoachPaymentRule as CoachPaymentRuleType,
  CoachPaymentRuleGroup,
} from '../../libs/coach-payment-rules/types';

import { getActiveCoaches } from '../../libs/associated-coach/selectors';
import {
  setCoachPaymentRule,
  setCoachPrivatePaymentRule,
  setCoachWorkshopPaymentRule,
  fetchAssociatedCoachesList,
  setCoachPaymentRuleGroup,
} from '../../libs/associated-coach/actions';
import {
  fetchAllCoachPaymentRules,
  fetchAllCoachPaymentRuleGroups,
  fetchCoachSessionPerformanceAction,
  fetchCoachPrivateServicePerformanceAction,
  setSessionCoachPaymentRule,
  setPrivateBookingCoachPaymentRule as updatePrivateBookingCoachPaymentRule,
} from '../../libs/coach-payment-rules/actions';
import {
  CoachPaymentRulesSelector,
  CoachPaymentRuleByKindSelector,
  getAssociatedCoachSessionPerformance,
  withCoachPerformance,
  getCoachPaymentRuleGroups,
} from '../../libs/coach-payment-rules/selectors';
import withTitle from '../../hocs/with-title.hoc';
import {
  Coach,
  CoachPerformance as CoachPerformanceType,
} from '../../libs/associated-coach/types';

import CoachPerformanceForm from '../../libs/associated-coach/components/performance/CoachPerformanceForm.component';
import CoachPerformanceSummary from '../../libs/associated-coach/components/performance/CoachPerformanceSummary.component';
import CoachPaymentRuleSelectorStyled from '../../libs/coach-payment-rules/components/CoachPaymentRuleSelectorStyled.component';

import CoachPerformanceTabs from '../../libs/associated-coach/components/performance/CoachPerformanceTabs.component';

type CoachPerformanceProps = {
  t: TFunction,
  loading: boolean,
  performance: CoachPerformanceType,
  coachPaymentRulesByKind: {
    [kind: number]: Array<{ [id: number]: CoachPaymentRuleType }>,
  },
  coachPaymentRuleGroups: Array<CoachPaymentRuleGroup>,
  coachPaymentRuleGroupsDict: { [groupId: number]: CoachPaymentRuleGroup },
  coach: Coach,
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
  setCoachPaymentRule: (
    coachId: number,
    paymentRuleId: number,
    associatedCoachId: number,
  ) => void,
  setCoachPrivatePaymentRule: (
    coachId: number,
    paymentRuleId: number,
    associatedCoachId: number,
  ) => void,
  setCoachPaymentRule: (
    coachId: number,
    paymentRuleId: number,
    associatedCoachId: number,
  ) => void,
  setCoachWorkShopPaymentRule: (
    coachId: number,
    paymentRuleId: number,
    associatedCoachId: number,
  ) => void,
  setCoachPrivatePaymentRule: (
    coachId: number,
    paymentRuleId: number,
    associatedCoachId: number,
  ) => void,
  setCoachPaymentRuleGroup: (
    coachId: number,
    coach_payment_rule_group_id: number,
  ) => number,
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
  flexBanner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    flexDirection: 'column',
    width: '300px',
    paddingRight: theme.spacing(1),
    [theme.breakpoints.down('lg')]: {
      width: '200px',
    },
  },
  selectorContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
  },
  ruleType: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(1),
  },
}));
function CoachPerformance(props: CoachPerformanceProps) {
  const {
    t,
    loading,
    performance,
    coachPaymentRulesByKind,
    coach,
    coachPaymentRuleGroups,
    coachPaymentRuleGroupsDict,
  } = props;
  const classes = useStyles();
  return (
    <div className={classes.performanceContainer}>
      <div className={classes.flexBanner}>
        <Typography variant="h5">{coach.name}</Typography>

        <div className={classes.selectorContainer}>
          <div className={classes.flexPaymentSelector}>
            <Typography className={classes.caption} variant="caption">
              {t('paymentRules:select.group')}
            </Typography>
            <CoachPaymentRuleSelectorStyled
              coachPaymentRulesList={coachPaymentRuleGroups}
              selectedRules={[coach.coach_payment_rule_group_id]}
              placeholder={t('paymentRules:select.group')}
              onChange={(item: { value: number, label: string }) => {
                props.setCoachPaymentRuleGroup(
                  coach.id,
                  item ? item.value : DISSOCIATED_COACH_PAYMENT_RULE_GROUP,
                );
              }}
              noMulti
              isClearable
              isGroupSelect
            />
          </div>
          <div className={classes.flexPaymentSelector}>
            <Typography className={classes.caption} variant="caption">
              {t('paymentRules:select.coachPaymentRuleForSessions')}
            </Typography>
            <CoachPaymentRuleSelectorStyled
              coachPaymentRulesList={
                coachPaymentRulesByKind[COACH_PERFORMANCE_FOR_SESSION]
              }
              selectedRules={[
                coach.coach_payment_rule_group_id && coachPaymentRuleGroupsDict
                  ? coachPaymentRuleGroupsDict[
                      coach.coach_payment_rule_group_id
                    ].session_coach_payment_rule
                  : coach.coach_payment_rule_id,
              ]}
              placeholder={t('paymentRules:label')}
              disabled={!!coach.coach_payment_rule_group_id}
              onChange={(item: { value: number, label: string }) => {
                props.setCoachPaymentRule(
                  coach.id,
                  item ? item.value : DISSOCIATED_COACH_PAYMENT_RULE,
                  coach.associated_coach_id,
                );
              }}
              noMulti
              isClearable
            />
          </div>
          <div className={classes.flexPaymentSelector}>
            <Typography className={classes.caption} variant="caption">
              {t('paymentRules:select.coachPaymentRuleForWorkshops')}
            </Typography>

            <CoachPaymentRuleSelectorStyled
              coachPaymentRulesList={
                coachPaymentRulesByKind[COACH_PERFORMANCE_FOR_SESSION]
              }
              selectedRules={[
                coach.coach_payment_rule_group_id && coachPaymentRuleGroupsDict
                  ? coachPaymentRuleGroupsDict[
                      coach.coach_payment_rule_group_id
                    ].workshop_coach_payment_rule
                  : coach.workshop_coach_payment_rule_id,
              ]}
              placeholder={t('paymentRules:label')}
              disabled={!!coach.coach_payment_rule_group_id}
              onChange={(item: { value: number, label: string }) => {
                props.setCoachWorkShopPaymentRule(
                  coach.id,
                  item ? item.value : DISSOCIATED_COACH_PAYMENT_RULE,
                  coach.associated_coach_id,
                );
              }}
              noMulti
              isClearable
            />
          </div>
          <div className={classes.flexPaymentSelector}>
            <Typography className={classes.caption} variant="caption">
              {t('paymentRules:select.coachPaymentRuleForPrivateService')}
            </Typography>

            <CoachPaymentRuleSelectorStyled
              coachPaymentRulesList={
                coachPaymentRulesByKind[COACH_PERFORMANCE_FOR_APPOINTMENT]
              }
              selectedRules={[
                coach.coach_payment_rule_group_id && coachPaymentRuleGroupsDict
                  ? coachPaymentRuleGroupsDict[
                      coach.coach_payment_rule_group_id
                    ].private_service_coach_payment_rule
                  : coach.private_coach_payment_rule_id,
              ]}
              placeholder={t('paymentRules:label')}
              disabled={!!coach.coach_payment_rule_group_id}
              onChange={(item: { value: number, label: string }) => {
                props.setCoachPrivatePaymentRule(
                  coach.id,
                  item ? item.value : DISSOCIATED_COACH_PAYMENT_RULE,
                  coach.associated_coach_id,
                );
              }}
              noMulti
              isClearable
            />
          </div>
        </div>
      </div>
      <CoachPerformanceSummary performances={performance} />
      <Paper>
        {loading ? <LinearProgress /> : null}
        <CoachPerformanceTabs
          loading={props.performance}
          coach={coach}
          allPerformance={performance}
          coachPaymentRulesByKind={coachPaymentRulesByKind}
          updatePrivateBookingCoachPaymentRule={(data) =>
            props.updatePrivateBookingCoachPaymentRule(data)
          }
          setSessionCoachPaymentRule={(data) => {
            props.setSessionCoachPaymentRule(data);
          }}
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
  coachPaymentRulesByKind: {
    [kind: number]: Array<{ [id: number]: CoachPaymentRuleType }>,
  },
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
  setCoachPrivatePaymentRule: (coachId: number, paymentRuleId: number) => void,
  setCoachPaymentRule: (coachId: number, paymentRuleId: number) => void,
  setCoachWorkShopPaymentRule: (coachId: number, paymentRuleId: number) => void,
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
  fetchAllCoachPaymentRuleGroups: () => void,
  coachPaymentRuleGroups: Array<CoachPaymentRuleGroup>,
  setCoachPaymentRuleGroup: (
    coachId: number,
    coach_payment_rule_group_id: number,
  ) => number,
  coachPaymentRuleGroupsDict: { [groupId: number]: CoachPaymentRuleGroup },
};

export class AllCoachPerformance extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchAllCoachPaymentRules();
    this.props.fetchAssociatedCoachesList();
    this.props.fetchAllCoachPaymentRuleGroups();
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
                this.props.t('coach:performance.nbOffersTotal'),
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
              loading={this.props.loading || this.props.performanceLoading}
              setSessionCoachPaymentRule={this.props.setSessionCoachPaymentRule}
              updatePrivateBookingCoachPaymentRule={
                this.props.updatePrivateBookingCoachPaymentRule
              }
              coachPaymentRulesByKind={this.props.coachPaymentRulesByKind}
              setCoachPaymentRule={this.props.setCoachPaymentRule}
              setCoachPrivatePaymentRule={this.props.setCoachPrivatePaymentRule}
              setCoachWorkShopPaymentRule={
                this.props.setCoachWorkShopPaymentRule
              }
              performance={coach.performance}
              coachPaymentRuleGroups={this.props.coachPaymentRuleGroups}
              coachPaymentRuleGroupsDict={this.props.coachPaymentRuleGroupsDict}
              setCoachPaymentRuleGroup={this.props.setCoachPaymentRuleGroup}
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
    overflowX: 'scroll',
  },
  generalLoader: {
    marginBottom: theme.spacing(1),
  },
});
export default compose(
  withStyles(styles),
  withState('formDates', 'setFormDates', {}),
  connect(
    (state) => ({
      coachPaymentRulesList: CoachPaymentRulesSelector(state),
      coachPaymentRulesByKind: CoachPaymentRuleByKindSelector(state),
      coachLoading: state.coach.loading,
      performanceLoading: state.coachPaymentRules.performance.loading,
      associatedCoachWithCoachPaymentRuleAndPerformance: withCoachPerformance(
        getActiveCoaches,
      )(state),
      coachPaymentRuleGroups: getCoachPaymentRuleGroups(state),
      coachPaymentRuleGroupsDict: state.coachPaymentRules.groups.byId,
    }),
    {
      setSessionCoachPaymentRuleAction: setSessionCoachPaymentRule,
      updatePrivateBookingCoachPaymentRuleAction: updatePrivateBookingCoachPaymentRule,
      fetchAssociatedCoachesList,
      fetchCoachSessionPerformance: fetchCoachSessionPerformanceAction,
      fetchCoachPrivateServicePerformance: fetchCoachPrivateServicePerformanceAction,
      setCoachPaymentRuleAction: setCoachPaymentRule,
      setCoachPrivatePaymentRule,
      setCoachWorkshopPaymentRuleAction: setCoachWorkshopPaymentRule,
      fetchAllCoachPaymentRules,
      fetchAllCoachPaymentRuleGroups,
      setCoachPaymentRuleGroupAction: setCoachPaymentRuleGroup,
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
      setFormDates,
    }) => async (data: Object, options) => {
      const { dateStart, dateEnd } = data;
      setFormDates({ dateStart: dateStart.unix(), dateEnd: dateEnd.unix() });
      setPerformanceLoading(true);
      const promises = associatedCoachWithCoachPaymentRuleAndPerformance.map(
        (coach) => {
          return (
            fetchCoachSessionPerformance(
              {
                associatedCoachId: coach.associated_coach_id,
                start_timestamp: dateStart.unix(),
                end_timestamp: dateEnd.unix(),
              },
              options,
            ),
            fetchCoachPrivateServicePerformance(
              {
                associatedCoachId: coach.associated_coach_id,
                start_timestamp: dateStart.unix(),
                end_timestamp: dateEnd.unix(),
              },
              options,
            )
          );
        },
      );
      await Promise.all(promises);
      setPerformanceLoading(false);
    },
  }),
  withHandlers({
    setCoachPaymentRule: ({
      setCoachPaymentRuleAction,
      fetchCoachSessionPerformance,
      setPerformanceLoading,
      formDates,
    }) => (
      coachId: number,
      paymentRuleId: number,
      associatedCoachId: number,
    ) => {
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
  }),
  withHandlers({
    setCoachWorkShopPaymentRule: ({
      setCoachWorkshopPaymentRuleAction,
      fetchCoachSessionPerformance,
      setPerformanceLoading,
      formDates,
    }) => (
      coachId: number,
      paymentRuleId: number,
      associatedCoachId: number,
    ) => {
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
  }),
  withHandlers({
    updatePrivateBookingCoachPaymentRule: ({
      updatePrivateBookingCoachPaymentRuleAction,
      fetchCoachPrivateServicePerformance,
      setPerformanceLoading,
      formDates,
    }) => (
      coachId: number,
      paymentRuleId: number,
      associatedCoachId: number,
    ) => {
      updatePrivateBookingCoachPaymentRuleAction(coachId, paymentRuleId, {
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
  }),
  withHandlers({
    setSessionCoachPaymentRule: ({
      setSessionCoachPaymentRuleAction,
      fetchCoachSessionPerformance,
      formDates,
      setPerformanceLoading,
    }) => (data) => {
      setSessionCoachPaymentRuleAction(data, {
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
  }),
  withHandlers({
    setCoachPaymentRuleGroup: ({ setCoachPaymentRuleGroupAction }) => (
      coachId,
      value,
    ) => {
      setCoachPaymentRuleGroupAction(coachId, value);
    },
  }),
  withHandlers({
    updatePrivateBookingCoachPaymentRule: ({
      updatePrivateBookingCoachPaymentRuleAction,
      fetchCoachPrivateServicePerformance,
      formDates,
      setPerformanceLoading,
    }) => (data) => {
      updatePrivateBookingCoachPaymentRuleAction(data, {
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
  }),
  withTranslation(),
  withTitle(({ t }) => t('titles:coach.allCoachPerformance')),
)(AllCoachPerformance);
