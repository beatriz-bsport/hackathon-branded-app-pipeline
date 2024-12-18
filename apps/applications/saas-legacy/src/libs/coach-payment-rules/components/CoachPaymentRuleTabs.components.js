import React, { useState } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { withTranslation, TFunction } from 'react-i18next';
import {
  COACH_PAYMENT_RULE_FOR_SESSION,
  COACH_PAYMENT_RULE_FOR_APPOINTMENT,
  COACH_PAYMENT_RULE_FOR_GROUP_ACTIVITY,
  COACH_PAYMENT_RULE_FOR_WORKSHOP,
} from '@bsport/common/lib/master-data/coach_payment_rule.js';
import CoachPaymentRuleTable from './CoachPaymentRuleTable.component';
import CoachPaymentRuleGroupTable from './CoachPaymentRuleGroupTable.component';
import type { CoachPaymentRule, CoachPaymentRuleGroup } from '../types';

type Props = {
  t: TFunction,
  items: Object<CoachPaymentRule[]>,
  coachPaymentRuleGroups: Array<CoachPaymentRuleGroup>,
  onChangeTab: () => void,
};

const CoachPaymentRuleTabPanel = (props: Props) => {
  return <CoachPaymentRuleTable {...props} />;
};

const COACH_PAYMENT_RULE_GROUP = 4;

export const CoachPaymentRuleTabs = (props: Props) => {
  const { t, items, coachPaymentRuleGroups, onChangeTab } = props;
  const [value, setValue] = useState(COACH_PAYMENT_RULE_FOR_SESSION);
  const handleChange = (event, newValue) => {
    onChangeTab(newValue);
    setValue(newValue);
  };

  const renderTabPanel = () => {
    if (
      value === COACH_PAYMENT_RULE_FOR_SESSION ||
      value === COACH_PAYMENT_RULE_FOR_APPOINTMENT ||
      value === COACH_PAYMENT_RULE_FOR_GROUP_ACTIVITY ||
      value === COACH_PAYMENT_RULE_FOR_WORKSHOP
    ) {
      return <CoachPaymentRuleTabPanel {...props} items={items[value]} />;
    }
    if (value === COACH_PAYMENT_RULE_GROUP) {
      return <CoachPaymentRuleGroupTable {...props} />;
    }
    return null;
  };
  return (
    <div>
      <Tabs
        aria-label="disabled tabs example"
        indicatorColor="primary"
        onChange={handleChange}
        textColor="primary"
        value={value}
      >
        <Tab
          index={COACH_PAYMENT_RULE_FOR_SESSION}
          label={`${t('tabs.session')}(${
            items ? items[COACH_PAYMENT_RULE_FOR_SESSION].length : 0
          })`}
          value={COACH_PAYMENT_RULE_FOR_SESSION}
        />
        <Tab
          index={COACH_PAYMENT_RULE_FOR_GROUP_ACTIVITY}
          label={`${t('tabs.groupActivity')}(${
            items ? items[COACH_PAYMENT_RULE_FOR_GROUP_ACTIVITY]?.length : 0
          })`}
          value={COACH_PAYMENT_RULE_FOR_GROUP_ACTIVITY}
        />
        <Tab
          index={COACH_PAYMENT_RULE_FOR_WORKSHOP}
          label={`${t('tabs.workshop')}(${
            items ? items[COACH_PAYMENT_RULE_FOR_WORKSHOP]?.length : 0
          })`}
          value={COACH_PAYMENT_RULE_FOR_WORKSHOP}
        />
        <Tab
          index={COACH_PAYMENT_RULE_FOR_APPOINTMENT}
          label={`${t('tabs.appointment')}(${
            items ? items[COACH_PAYMENT_RULE_FOR_APPOINTMENT].length : 0
          })`}
          value={COACH_PAYMENT_RULE_FOR_APPOINTMENT}
        />
        <Tab
          index={COACH_PAYMENT_RULE_GROUP}
          label={`${t('tabs.groups')}(${
            coachPaymentRuleGroups ? coachPaymentRuleGroups.length : 0
          })`}
          value={COACH_PAYMENT_RULE_GROUP}
        />
      </Tabs>
      {renderTabPanel()}
    </div>
  );
};

export default withTranslation(['paymentRules'])(CoachPaymentRuleTabs);
