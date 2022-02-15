import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import {
  COACH_PERFORMANCE_FOR_SESSION,
  COACH_PERFORMANCE_FOR_APPOINTMENT,
  COACH_PAYMENT_RULE_FOR_SESSION,
  COACH_PAYMENT_RULE_FOR_APPOINTMENT,
  COACH_PERFORMANCE_FOR_ALL,
} from '@bsport/common/lib/master-data/coach_payment_rule';
import CoachPerformanceSessionTable from './CoachPerformanceSessionTable.component';
import CoachPerformancePrivateServiceTable from './CoachPerformancePrivateServiceTable.component';
import type {
  CoachPerformance,
  CoachPaymentRuleGroup,
  CoachPaymentRule,
} from '#libs/coach-payment-rules/types';
import type { Coach } from '#libs/associated-coach/types';
import CoachPerformanceRuleSetter from './CoachPerformanceRuleSetter.component';

type CoachPaymentRuleTabPanelActions = {
  setSessionCoachPaymentRule: (params: {
    associatedCoachId: number;
    sessionId: number;
    coachPaymentRuleId: number;
  }) => void;
  updatePrivateBookingCoachPaymentRule: (params: {
    associatedCoachId: number;
    privateBookingId: number;
    coachPaymentRuleId: number;
  }) => void;
};

type TabPanelProps = {
  coachWithPerformance: CoachwithPerformance;
  value: number;
  coachPaymentRulesByKind: { [kind: number]: Array<CoachPaymentRule> };
} & CoachPaymentRuleTabPanelActions;

export const CoachPerformanceTabPanel = (props: TabPanelProps) => {
  const { t } = useTranslation('paymentRules');

  if (props.value === COACH_PERFORMANCE_FOR_SESSION) {
    return (
      <CoachPerformanceSessionTable
        performances={
          props.coachWithPerformance?.performance[
            COACH_PAYMENT_RULE_FOR_SESSION
          ]
        }
        coachPaymentRulesList={
          props.coachPaymentRulesByKind[COACH_PAYMENT_RULE_FOR_SESSION] || []
        }
        coach={props.coachWithPerformance}
        setSessionCoachPaymentRule={props.setSessionCoachPaymentRule}
      />
    );
  }
  if (props.value === COACH_PERFORMANCE_FOR_APPOINTMENT) {
    return (
      <CoachPerformancePrivateServiceTable
        coach={props.coachWithPerformance}
        performances={
          props.coachWithPerformance?.performance[
            COACH_PAYMENT_RULE_FOR_APPOINTMENT
          ]
        }
        coachPaymentRulesList={
          props.coachPaymentRulesByKind[COACH_PAYMENT_RULE_FOR_APPOINTMENT] ||
          []
        }
        updatePrivateBookingCoachPaymentRule={
          props.updatePrivateBookingCoachPaymentRule
        }
      />
    );
  }
  if (props.value === COACH_PERFORMANCE_FOR_ALL) {
    return (
      <div>
        <Chip
          variant="outlined"
          color="primary"
          style={{ position: 'absolute', marginTop: 15, marginLeft: 10 }}
          label={
            <Typography variant="subtitle2">{t('tabs.session')}</Typography>
          }
        />

        <CoachPerformanceSessionTable
          performances={
            props.coachWithPerformance?.performance[
              COACH_PAYMENT_RULE_FOR_SESSION
            ]
          }
          coachPaymentRulesList={
            props.coachPaymentRulesByKind[COACH_PAYMENT_RULE_FOR_SESSION] || []
          }
          coach={props.coachWithPerformance}
          setSessionCoachPaymentRule={props.setSessionCoachPaymentRule}
        />
        <Chip
          variant="outlined"
          color="primary"
          style={{ position: 'absolute', marginTop: 15, marginLeft: 10 }}
          label={
            <Typography variant="subtitle2">{t('tabs.appointment')}</Typography>
          }
        />

        <CoachPerformancePrivateServiceTable
          coach={props.coachWithPerformance}
          performances={
            props.coachWithPerformance?.performance[
              COACH_PAYMENT_RULE_FOR_APPOINTMENT
            ]
          }
          coachPaymentRulesList={
            props.coachPaymentRulesByKind[COACH_PAYMENT_RULE_FOR_APPOINTMENT] ||
            []
          }
          updatePrivateBookingCoachPaymentRule={
            props.updatePrivateBookingCoachPaymentRule
          }
        />
      </div>
    );
  }
  return null;
};

type CoachPaymentRuleTabsActions = {
  setSessionCoachPaymentRule: (params: {
    associatedCoachId: number;
    sessionId: number;
    coachPaymentRuleId: number;
  }) => void;
  updatePrivateBookingCoachPaymentRule: (params: {
    associatedCoachId: number;
    privateBookingId: number;
    coachPaymentRuleId: number;
  }) => void;
  setCoachPaymentRuleGroup: (
    coachId: number,
    coach_payment_rule_group_id: number,
    associated_coach_id: number,
  ) => number;
  setCoachPaymentRule: (
    coachId: number,
    coach_payment_rule_id: number,
    associated_coach_id: number,
  ) => void;
  setCoachPrivatePaymentRule: (
    coachId: number,
    coach_payment_rule_id: number,
    associated_coach_id: number,
  ) => void;
  setCoachWorkShopPaymentRule: (
    coachId: number,
    coach_payment_rule_id: number,
    associated_coach_id: number,
  ) => void;
};

type CoachPaymentRuleObjects = {
  coachPaymentRulesByKind: { [kind: number]: Array<CoachPaymentRule> };
  coachPaymentRuleGroups: Array<CoachPaymentRuleGroup>;
  coachPaymentRuleGroupsDict: { [groupId: number]: CoachPaymentRuleGroup };
};
type CoachwithPerformance = Coach & {
  performanceLoading: boolean;
  performance: {
    [COACH_PERFORMANCE_FOR_SESSION]: Array<CoachPerformance>;
    [COACH_PERFORMANCE_FOR_APPOINTMENT]: Array<CoachPerformance>;
  };
};
type TabProps = {
  coachWithPerformance: CoachwithPerformance;
  hideRuleSetter?: boolean;
} & CoachPaymentRuleTabsActions &
  CoachPaymentRuleObjects;
export const CoachPerformanceTabs = (props: TabProps) => {
  const { performance } = props.coachWithPerformance;
  const { t } = useTranslation('paymentRules');
  const [value, setValue] = useState<0 | 1 | 2>(0);

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newValue: 0 | 1 | 2,
  ) => {
    setValue(newValue);
  };
  return (
    <div>
      <Tabs
        value={value}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleChange}
      >
        <Tab
          label={`${t('tabs.session')}(${
            performance[COACH_PERFORMANCE_FOR_SESSION]
              ? performance[COACH_PERFORMANCE_FOR_SESSION].length
              : 0
          })`}
          value={COACH_PERFORMANCE_FOR_SESSION}
        />
        <Tab
          label={`${t('tabs.appointment')}(${
            performance[COACH_PERFORMANCE_FOR_APPOINTMENT]
              ? performance[COACH_PERFORMANCE_FOR_APPOINTMENT].length
              : 0
          })`}
          value={COACH_PERFORMANCE_FOR_APPOINTMENT}
        />
        <Tab
          label={`${t('tabs.all')}(${
            (performance[COACH_PERFORMANCE_FOR_APPOINTMENT]
              ? performance[COACH_PERFORMANCE_FOR_APPOINTMENT].length
              : 0) +
            (performance[COACH_PERFORMANCE_FOR_SESSION]
              ? performance[COACH_PERFORMANCE_FOR_SESSION].length
              : 0)
          })`}
          value={COACH_PERFORMANCE_FOR_ALL}
        />
      </Tabs>
      {!props.hideRuleSetter && (
        <CoachPerformanceRuleSetter
          coach={props.coachWithPerformance}
          coachPaymentRulesByKind={props.coachPaymentRulesByKind}
          coachPaymentRuleGroups={props.coachPaymentRuleGroups}
          coachPaymentRuleGroupsDict={props.coachPaymentRuleGroupsDict}
          setCoachPaymentRule={props.setCoachPaymentRule}
          setCoachPaymentRuleGroup={props.setCoachPaymentRuleGroup}
          setCoachPrivatePaymentRule={props.setCoachPrivatePaymentRule}
          setCoachWorkShopPaymentRule={props.setCoachWorkShopPaymentRule}
        />
      )}
      <CoachPerformanceTabPanel
        value={value}
        coachWithPerformance={props.coachWithPerformance}
        coachPaymentRulesByKind={props.coachPaymentRulesByKind}
        setSessionCoachPaymentRule={props.setSessionCoachPaymentRule}
        updatePrivateBookingCoachPaymentRule={
          props.updatePrivateBookingCoachPaymentRule
        }
      />
    </div>
  );
};

export default CoachPerformanceTabs;
