import React from 'react';
import { compose } from 'recompose';
import { useTranslation, WithTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';

import {
  COACH_PERFORMANCE_FOR_SESSION,
  COACH_PERFORMANCE_FOR_APPOINTMENT,
} from '@bsport/common/lib/master-data/coach_payment_rule';

import {
  DISSOCIATED_COACH_PAYMENT_RULE,
  DISSOCIATED_COACH_PAYMENT_RULE_GROUP,
} from '#libs/coach-payment-rules/utils';

import CoachPaymentRuleSelectorStyled from '#libs/coach-payment-rules/components/coach-payment-rule-selector/CoachPaymentRuleSelectorStyled.component';
import CoachPerformanceSummaryHeader from './CoachPerformanceSummaryHeader.component';
import CoachPerformanceTabs from './CoachPerformanceTabs.component';

import {
  Coach,
  CoachPerformance as CoachPerformanceType,
} from '#libs/associated-coach/types';
import {
  CoachPaymentRule as CoachPaymentRuleType,
  CoachPaymentRuleGroup,
} from '#libs/coach-payment-rules/types';

type OwnProps = {
  loading: boolean;
  performance: CoachPerformanceType;
  coachPaymentRulesByKind: {
    [kind: number]: Array<{ [id: number]: CoachPaymentRuleType }>;
  };
  coachPaymentRuleGroups: Array<CoachPaymentRuleGroup>;
  coachPaymentRuleGroupsDict: { [groupId: number]: CoachPaymentRuleGroup };
  coach: Coach;
  setSessionCoachPaymentRule: (data: {
    associatedCoachId: number;
    sessionId: number;
    CoachPaymenrRuleId: number;
  }) => void;
  updatePrivateBookingCoachPaymentRule: (data: {
    associatedCoachId: number;
    privateBookingId: number;
    CoachPaymenrRuleId: number;
  }) => void;
  setCoachPaymentRule: (
    coachId: number,
    paymentRuleId: number,
    associatedCoachId: number,
  ) => void;
  setCoachPrivatePaymentRule: (
    coachId: number,
    paymentRuleId: number,
    associatedCoachId: number,
  ) => void;
  setCoachWorkShopPaymentRule: (
    coachId: number,
    paymentRuleId: number,
    associatedCoachId: number,
  ) => void;
  setCoachPaymentRuleGroup: (
    coachId: number,
    coach_payment_rule_group_id: number,
  ) => number;
};
type Props = OwnProps & WithTranslation;
export const CoachPerformanceSynthese = (props: Props) => {
  const { t } = useTranslation('paymentRules');
  const classes = useStyles();
  const {
    coach,
    coachPaymentRuleGroups,
    coachPaymentRulesByKind,
    coachPaymentRuleGroupsDict,
    loading,
    performance,
  } = props;
  return (
    <div className={classes.performanceContainer}>
      <div className={classes.flexBanner}>
        <Typography variant="h5">{props.coach.name}</Typography>

        <div className={classes.selectorContainer}>
          <div className={classes.flexPaymentSelector}>
            <Typography variant="caption">
              {t('paymentRules:select.group')}
            </Typography>
            <CoachPaymentRuleSelectorStyled
              coachPaymentRulesList={coachPaymentRuleGroups}
              selectedRules={[coach.coach_payment_rule_group_id]}
              placeholder={t('paymentRules:select.group')}
              onChange={(item: { value: number; label: string }) => {
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
            <Typography variant="caption">
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
              onChange={(item: { value: number; label: string }) => {
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
            <Typography variant="caption">
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
              onChange={(item: { value: number; label: string }) => {
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
            <Typography variant="caption">
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
              onChange={(item: { value: number; label: string }) => {
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
      <CoachPerformanceSummaryHeader performances={performance} />
      <Paper>
        {loading && performance?.performanceLoading ? <LinearProgress /> : null}
        <CoachPerformanceTabs
          loading={loading}
          coach={coach}
          allPerformance={performance}
          coachPaymentRulesByKind={coachPaymentRulesByKind}
          updatePrivateBookingCoachPaymentRule={(data: {
            associatedCoachId: number;
            privateBookingId: number;
            CoachPaymenrRuleId: number;
          }) => props.updatePrivateBookingCoachPaymentRule(data)}
          setSessionCoachPaymentRule={(data: {
            associatedCoachId: number;
            sessionId: number;
            CoachPaymenrRuleId: number;
          }) => {
            props.setSessionCoachPaymentRule(data);
          }}
        />
      </Paper>
    </div>
  );
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

export default React.memo(
  compose<any, OwnProps>()(CoachPerformanceSynthese),
  (props: Props, NextProps: Props) => {
    if (
      !props.loading &&
      NextProps.loading &&
      !NextProps.performance?.performanceLoading
    ) {
      return true;
    }
    return false;
  },
);
