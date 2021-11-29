import React, { useState } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { withTranslation, TFunction } from 'react-i18next';
import {
  COACH_PAYMENT_RULE_FOR_SESSION,
  COACH_PAYMENT_RULE_FOR_APPOINTMENT,
} from '@bsport/common/lib/master-data/coach_payment_rule';
import CoachPaymentRuleTable from './CoachPaymentRuleTable.component';
import CoachPaymentRuleGroupTable from './CoachPaymentRuleGroupTable.component';
import type { CoachPaymentRule, CoachPaymentRuleGroup } from '../types';

type Props = {
  t: TFunction,
  items: Object<CoachPaymentRule[]>,
  coachPaymentRuleGroups: Array<CoachPaymentRuleGroup>,
};
const CoachPaymentRuleTabPanel = (props: Props) => {
  return <CoachPaymentRuleTable {...props} />;
};

export const CoachPaymentRuleTabs = (props: Props) => {
  const { t, items, coachPaymentRuleGroups } = props;
  const [value, setValue] = useState(COACH_PAYMENT_RULE_FOR_SESSION);

  const handleChange = (event, newValue) => setValue(newValue);

  const renderTabPanel = () => {
    if (
      value === COACH_PAYMENT_RULE_FOR_SESSION ||
      value === COACH_PAYMENT_RULE_FOR_APPOINTMENT
    ) {
      return <CoachPaymentRuleTabPanel {...props} items={items[value]} />;
    }
    if (value === 2) {
      return <CoachPaymentRuleGroupTable {...props} />;
    }
    return null;
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
            items ? items[COACH_PAYMENT_RULE_FOR_SESSION].length : 0
          })`}
          index={COACH_PAYMENT_RULE_FOR_SESSION}
        />
        <Tab
          label={`${t('tabs.appointment')}(${
            items ? items[COACH_PAYMENT_RULE_FOR_APPOINTMENT].length : 0
          })`}
          index={COACH_PAYMENT_RULE_FOR_APPOINTMENT}
        />
        <Tab
          label={`${t('tabs.groups')}(${
            coachPaymentRuleGroups ? coachPaymentRuleGroups.length : 0
          })`}
          index={2}
        />
      </Tabs>
      {renderTabPanel()}
    </div>
  );
};

export default withTranslation(['paymentRules'])(CoachPaymentRuleTabs);
