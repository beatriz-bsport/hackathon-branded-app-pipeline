import React from 'react';
import { compose } from 'recompose';
import { useTranslation, WithTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';

import {
  COACH_PAYMENT_RULE_FOR_SESSION,
  COACH_PAYMENT_RULE_FOR_APPOINTMENT,
  COACH_PAYMENT_RULE_FOR_GROUP_ACTIVITY,
  COACH_PAYMENT_RULE_FOR_WORKSHOP,
} from '@bsport/common/lib/master-data/coach_payment_rule.js';

import {
  DISSOCIATED_COACH_PAYMENT_RULE,
  DISSOCIATED_COACH_PAYMENT_RULE_GROUP,
} from '#src/libs/coach-payment-rules/constants';

import CoachPaymentRuleSelectorStyled from '#src/libs/coach-payment-rules/components/coach-payment-rule-selector/CoachPaymentRuleSelectorStyled.component';
import CoachPerformanceSummaryHeader from '#src/libs/coach-payment-rules/components/performance/CoachPerformanceSummaryHeader.component';
import CoachPerformanceTabs from '#src/libs/coach-payment-rules/components/performance/CoachPerformanceTabs.component';

import {
  Coach,
  CoachPerformance as CoachPerformanceType,
} from '#src/libs/associated-coach/types';
import {
  CoachPaymentRule as CoachPaymentRuleType,
  CoachPaymentRuleGroup,
} from '#src/libs/coach-payment-rules/types';

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
              isClearable
              isGroupSelect
              noMulti
              // @ts-expect-error
              coachPaymentRulesList={coachPaymentRuleGroups}
              onChange={(item: { value: number; label: string }) => {
                props.setCoachPaymentRuleGroup(
                  coach.id,
                  item ? item.value : DISSOCIATED_COACH_PAYMENT_RULE_GROUP,
                );
              }}
              placeholder={t('paymentRules:select.group')}
              selectedRules={[coach.coach_payment_rule_group_id]}
            />
          </div>
          <div className={classes.flexPaymentSelector}>
            <Typography variant="caption">
              {t('paymentRules:select.coachPaymentRuleForSessions')}
            </Typography>
            <CoachPaymentRuleSelectorStyled
              isClearable
              noMulti
              // @ts-expect-error
              coachPaymentRulesList={coachPaymentRulesByKind[
                COACH_PAYMENT_RULE_FOR_SESSION
              ].concat(
                coachPaymentRulesByKind[COACH_PAYMENT_RULE_FOR_GROUP_ACTIVITY],
              )}
              disabled={!!coach.coach_payment_rule_group_id}
              onChange={(item: { value: number; label: string }) => {
                props.setCoachPaymentRule(
                  coach.id,
                  item ? item.value : DISSOCIATED_COACH_PAYMENT_RULE,
                  coach.associated_coach_id,
                );
              }}
              placeholder={t('paymentRules:label')}
              selectedRules={[
                // @ts-expect-error
                coach.coach_payment_rule_group_id && coachPaymentRuleGroupsDict
                  ? coachPaymentRuleGroupsDict[
                      coach.coach_payment_rule_group_id
                    ].session_coach_payment_rule
                  : coach.coach_payment_rule_id,
              ]}
            />
          </div>
          <div className={classes.flexPaymentSelector}>
            <Typography variant="caption">
              {t('paymentRules:select.coachPaymentRuleForWorkshops')}
            </Typography>

            <CoachPaymentRuleSelectorStyled
              isClearable
              noMulti
              // @ts-expect-error
              coachPaymentRulesList={coachPaymentRulesByKind[
                COACH_PAYMENT_RULE_FOR_SESSION
              ].concat(
                coachPaymentRulesByKind[COACH_PAYMENT_RULE_FOR_WORKSHOP],
              )}
              disabled={!!coach.coach_payment_rule_group_id}
              onChange={(item: { value: number; label: string }) => {
                props.setCoachWorkShopPaymentRule(
                  coach.id,
                  item ? item.value : DISSOCIATED_COACH_PAYMENT_RULE,
                  coach.associated_coach_id,
                );
              }}
              placeholder={t('paymentRules:label')}
              selectedRules={[
                // @ts-expect-error
                coach.coach_payment_rule_group_id && coachPaymentRuleGroupsDict
                  ? coachPaymentRuleGroupsDict[
                      coach.coach_payment_rule_group_id
                    ].workshop_coach_payment_rule
                  : coach.workshop_coach_payment_rule_id,
              ]}
            />
          </div>
          <div className={classes.flexPaymentSelector}>
            <Typography variant="caption">
              {t('paymentRules:select.coachPaymentRuleForPrivateService')}
            </Typography>

            <CoachPaymentRuleSelectorStyled
              isClearable
              noMulti
              // @ts-expect-error
              coachPaymentRulesList={
                coachPaymentRulesByKind[COACH_PAYMENT_RULE_FOR_APPOINTMENT]
              }
              disabled={!!coach.coach_payment_rule_group_id}
              onChange={(item: { value: number; label: string }) => {
                props.setCoachPrivatePaymentRule(
                  coach.id,
                  item ? item.value : DISSOCIATED_COACH_PAYMENT_RULE,
                  coach.associated_coach_id,
                );
              }}
              placeholder={t('paymentRules:label')}
              selectedRules={[
                // @ts-expect-error
                coach.coach_payment_rule_group_id && coachPaymentRuleGroupsDict
                  ? coachPaymentRuleGroupsDict[
                      coach.coach_payment_rule_group_id
                    ].private_service_coach_payment_rule
                  : coach.private_coach_payment_rule_id,
              ]}
            />
          </div>
        </div>
      </div>
      <CoachPerformanceSummaryHeader performances={performance} />
      <Paper>
        {loading && performance?.performanceLoading ? <LinearProgress /> : null}
        <CoachPerformanceTabs
          allPerformance={performance}
          coach={coach}
          // @ts-expect-error
          coachPaymentRulesByKind={coachPaymentRulesByKind}
          loading={loading}
          // @ts-expect-error
          setSessionCoachPaymentRule={(data: {
            associatedCoachId: number;
            sessionId: number;
            CoachPaymenrRuleId: number;
          }) => {
            props.setSessionCoachPaymentRule(data);
          }}
          // @ts-expect-error
          updatePrivateBookingCoachPaymentRule={(data: {
            associatedCoachId: number;
            privateBookingId: number;
            CoachPaymenrRuleId: number;
          }) => props.updatePrivateBookingCoachPaymentRule(data)}
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
