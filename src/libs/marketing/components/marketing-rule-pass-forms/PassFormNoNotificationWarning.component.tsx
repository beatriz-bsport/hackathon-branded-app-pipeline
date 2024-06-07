import React from 'react';

import { Grid, Typography } from '@material-ui/core';
import { NotificationsActive } from '@material-ui/icons';
import { Trans, useTranslation } from 'react-i18next';
import { PassType } from '#src/components/passes/types';
import { useStyles } from './styles';

type Props = {
  passType: PassType;
};

const PassFormNoNotificationsWarning: React.FC<Props> = React.memo(
  ({ passType }: Props) => {
    const { t } = useTranslation([
      'paymentPack',
      'privateService',
      'marketing',
    ]);
    const classes = useStyles();

    const descriptionKey =
      passType === PassType.PAYMENT_PACK
        ? 'paymentPack:form.paymentPack.noNotificationsWarning'
        : 'privateService:privatePass.noNotificationsWarning';

    return (
      <Grid container className={classes.container}>
        <Grid container className={classes.titleContainer}>
          <NotificationsActive className={classes.icon} />
          <Typography variant="h6">
            {t('marketing:notifications.listTitle')}
          </Typography>
        </Grid>
        <Typography color="textPrimary" variant="body2">
          <Trans i18nKey={descriptionKey} />
        </Typography>
      </Grid>
    );
  },
);

export default PassFormNoNotificationsWarning;
