import React from 'react';

import { Typography, FormControl, Divider } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import NotificationsIcon from '@material-ui/icons/Notifications';
// @ts-expect-error
import { IntegerField } from '#components/forms';
import { useStyles } from './marketing-rule-form/marketing_rule_form.hooks';

const DAYS = 'days';
const HOURS = 'hours';
const BEFORE = 'before';
const AFTER = 'after';

type Props = {
  periodScale: 'days' | 'hours';
  timeComparator: 'before' | 'after';
  relativeTimeValue: number;
  setFieldValue: (key: string, value: any) => void;
};

const MarketingRuleBasicTypeField = (props: Props) => {
  const { setFieldValue, periodScale, timeComparator, relativeTimeValue } =
    props;
  const classes = useStyles();
  const { t } = useTranslation(['subscription', 'notificationRule']);

  return (
    <div>
      <Divider className={classes.divider} />
      <div className={classes.fieldContainer}>
        <div className={classes.titleContainer}>
          <NotificationsIcon color="action" />
          <Typography variant="h6">
            {t('notificationForm.notificationType.title')}
          </Typography>
        </div>
        <div className={classes.rowContainer}>
          <Typography className={classes.breakSpaces} variant="body2">
            {t('notificationRule:type.sendNotification')}
          </Typography>
          <IntegerField
            className={classes.integerField}
            name="relativeTimeValue"
          />
          <FormControl className={classes.select} variant="outlined">
            <Select
              defaultValue={{
                value: periodScale,
                label: t(`notificationRule:type.${periodScale}`),
              }}
              name="periodScale"
              onChange={(selected) =>
                // @ts-expect-error
                setFieldValue('periodScale', selected.value)
              }
              options={[
                {
                  value: HOURS,
                  label: t('notificationRule:type.hours', {
                    count: relativeTimeValue,
                  }),
                },
                {
                  value: DAYS,
                  label: t('notificationRule:type.days', {
                    count: relativeTimeValue,
                  }),
                },
              ]}
            />
          </FormControl>
          <FormControl className={classes.select} variant="outlined">
            <Select
              defaultValue={{
                value: timeComparator,
                label: t(`notificationForm.notificationType.${timeComparator}`),
              }}
              name="timeComparator"
              onChange={(selected) =>
                // @ts-expect-error
                setFieldValue('timeComparator', selected.value)
              }
              options={[
                {
                  value: BEFORE,
                  label: t('notificationForm.notificationType.before'),
                },
                {
                  value: AFTER,
                  label: t('notificationForm.notificationType.after'),
                },
              ]}
            />
          </FormControl>
          <Typography className={classes.breakSpaces} variant="body2">
            {t('notificationRule:type.bookingConcerned').toLowerCase()}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default MarketingRuleBasicTypeField;
