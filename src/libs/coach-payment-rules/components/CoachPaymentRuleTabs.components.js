import React, { useState } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import {
  COACH_PAYMENT_RULE_FOR_SESSION,
  COACH_PAYMENT_RULE_FOR_APPOINTMENT,
} from '@bsport/common/lib/master-data/coach_payment_rule';
import CoachPaymentRuleTable from './CoachPaymentRuleTable.component';

type Props = {
  t: TFunction,
  items: Object<CoachPaymentRule[]>,
};
const CoachPaymentRuleTabPanel = (props: Props) => {
  return <CoachPaymentRuleTable {...props} />;
};

export const CoachPaymentRuleTabs = (props: Props) => {
  const { t, items } = props;
  const [value, setValue] = useState(COACH_PAYMENT_RULE_FOR_SESSION);

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
      </Tabs>
      <CoachPaymentRuleTabPanel {...props} items={items[value]} />
    </div>
  );
};

export default withTranslation(['paymentRules'])(CoachPaymentRuleTabs);
