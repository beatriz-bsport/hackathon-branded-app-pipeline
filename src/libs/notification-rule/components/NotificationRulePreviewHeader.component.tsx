// @flow
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab';
import { Divider, Theme, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import FeatureListProvider from '#libs/company/hocs/feature-list-provider.hoc';

type Props = {
  value: 'notification' | 'email';
  onChange: (_: any, value: 'notification' | 'email') => void;
  className?: string;
};

const NotificationRulePreviewHeader = (props: Props) => {
  const { className, value = 'email', onChange = () => {} } = props;

  const { t } = useTranslation('notificationRule');
  const classes = useStyles();

  return (
    <div className={className}>
      <div className={classes.titleWrapper}>
        <Typography variant="h5" className={classes.title}>
          {t('preview.title')}
        </Typography>
        <FeatureListProvider>
          {(featureList) => (
            <>
              {featureList.upsell &&
                featureList.upsell.find(
                  (f) => f.readable_identifier === 'push_notification',
                ) && (
                  <ToggleButtonGroup
                    className={classes.toggle}
                    value={value}
                    onChange={onChange}
                    exclusive
                  >
                    <ToggleButton value="email" aria-label="bold">
                      {t('preview.email')}
                    </ToggleButton>
                    <ToggleButton value="notification" aria-label="italic">
                      {t('preview.notification')}
                    </ToggleButton>
                  </ToggleButtonGroup>
                )}
            </>
          )}
        </FeatureListProvider>
      </div>
      <Divider />
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    fontSize: 25,
    marginBottom: theme.spacing(1),
  },
  titleWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggle: {
    height: theme.spacing(4),
  },
}));

export default NotificationRulePreviewHeader;
