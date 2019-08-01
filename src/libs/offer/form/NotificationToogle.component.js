// @flow

import React from 'react';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

type Props = {
  notifyConsumers: boolean,
  onNotificationChange: (boolean) => void,
  t: TFunction,
};

export function NotificationToogle(props: Props) {
  return (
    <Grid container direction="row" spacing={16} alignItems="center">
      <Grid item>
        <Switch
          color="primary"
          checked={props.notifyConsumers}
          onChange={(event) => {
            props.onNotificationChange(event.target.checked);
          }}
        />
      </Grid>
      <Grid item>
        <Typography>
          {props.t('form.offer.explainNotificationOnEdit')}
        </Typography>
      </Grid>
    </Grid>
  );
}

export default withNamespaces()(NotificationToogle);
