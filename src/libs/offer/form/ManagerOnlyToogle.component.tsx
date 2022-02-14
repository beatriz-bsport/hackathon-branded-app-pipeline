// @flow

import React from 'react';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import { withTranslation, TFunction } from 'react-i18next';

type Props = {
  manager_only: boolean;
  onChange: (manager_only: boolean) => void;
  t: TFunction;
};

export function ManagerOnlyToogle(props: Props) {
  return (
    <Grid container direction="row" spacing={2} alignItems="center">
      <Grid item>
        <Switch
          color="primary"
          checked={!props.manager_only}
          onChange={(event) => {
            props.onChange(!event.target.checked);
          }}
        />
      </Grid>
      <Grid item>
        <Typography>{props.t('form.offer.explainManagerOnly')}</Typography>
      </Grid>
    </Grid>
  );
}

export default withTranslation()(ManagerOnlyToogle);
