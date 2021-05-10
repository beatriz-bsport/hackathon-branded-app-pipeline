import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
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
  CoachPaymentRule,
} from '../../../coach-payment-rules/types';

type Props = {
  t: TFunction,
  allPerformance: Array<CoachPerformance>,
  coachPaymentRulesByKind: Object<CoachPaymentRule[]>,
  value: number,
};
export const CoachPerformanceTabPanel = (props: Props) => {
  const { t } = props;
  if (props.value === COACH_PERFORMANCE_FOR_SESSION) {
    return (
      <CoachPerformanceSessionTable
        {...props}
        coachPaymentRulesList={
          props.coachPaymentRulesByKind[COACH_PAYMENT_RULE_FOR_SESSION]
        }
      />
    );
  }
  if (props.value === COACH_PERFORMANCE_FOR_APPOINTMENT) {
    return (
      <CoachPerformancePrivateServiceTable
        {...props}
        coachPaymentRulesList={
          props.coachPaymentRulesByKind[COACH_PAYMENT_RULE_FOR_APPOINTMENT]
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
          {...props}
          performances={props.allPerformance[COACH_PAYMENT_RULE_FOR_SESSION]}
          coachPaymentRulesList={
            props.coachPaymentRulesByKind[COACH_PAYMENT_RULE_FOR_SESSION]
          }
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
          {...props}
          performances={
            props.allPerformance[COACH_PAYMENT_RULE_FOR_APPOINTMENT]
          }
          coachPaymentRulesList={
            props.coachPaymentRulesByKind[COACH_PAYMENT_RULE_FOR_APPOINTMENT]
          }
        />
      </div>
    );
  }
  return null;
};
export const CoachPerformanceTabs = (props: Props) => {
  const { t, allPerformance } = props;
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div>
      <Tabs
        value={value}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleChange}
        aria-label="disabled tabs example"
      >
        <Tab
          label={`${t('tabs.session')}(${
            allPerformance[COACH_PERFORMANCE_FOR_SESSION]
              ? allPerformance[COACH_PERFORMANCE_FOR_SESSION].length
              : 0
          })`}
          index={COACH_PERFORMANCE_FOR_SESSION}
        />
        <Tab
          label={`${t('tabs.appointment')}(${
            allPerformance[COACH_PERFORMANCE_FOR_APPOINTMENT]
              ? allPerformance[COACH_PERFORMANCE_FOR_APPOINTMENT].length
              : 0
          })`}
          index={COACH_PERFORMANCE_FOR_APPOINTMENT}
        />
        <Tab
          label={`${t('tabs.all')}(${
            (allPerformance[COACH_PERFORMANCE_FOR_APPOINTMENT]
              ? allPerformance[COACH_PERFORMANCE_FOR_APPOINTMENT].length
              : 0) +
            (allPerformance[COACH_PERFORMANCE_FOR_SESSION]
              ? allPerformance[COACH_PERFORMANCE_FOR_SESSION].length
              : 0)
          })`}
          index={COACH_PERFORMANCE_FOR_APPOINTMENT}
        />
      </Tabs>
      <CoachPerformanceTabPanel
        {...props}
        performances={allPerformance[value]}
        value={value}
      />
    </div>
  );
};

export default withTranslation(['paymentRules'])(CoachPerformanceTabs);
