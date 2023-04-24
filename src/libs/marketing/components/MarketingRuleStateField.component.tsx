// @ts-nocheck
import React from 'react';

import { Typography, Divider } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import { RadioGroupField } from '#components/forms';

import { useStyles } from './marketing-rule-form/marketing_rule_form.hooks';

type Props = {
  choices: { label: string; value: number | 'valid' | 'cancelled' }[];
};

const MarketingRuleFormStateField = (props: Props) => {
  const { choices } = props;

  const classes = useStyles();
  const { t } = useTranslation(['subscription']);

  return (
    <div>
      <Divider className={classes.divider} />
      <div className={classes.fieldContainer}>
        <div className={classes.titleContainer}>
          <AccessTimeIcon color="action" />
          <Typography variant="h6">
            {t('notificationForm.typeSection.title')}
          </Typography>
        </div>
        <div className={classes.choiceField}>
          <RadioGroupField name="eventType" choices={choices} />
        </div>
      </div>
    </div>
  );
};

export default MarketingRuleFormStateField;
