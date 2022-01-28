// @flow

import React from 'react';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import { withTranslation, TFunction } from 'react-i18next';

type Props = {
  available_on_partnership: boolean,
  onChange: (boolean) => void,
  t: TFunction,
};

export function PartnershipToogle(props: Props) {
  return (
    <Grid container direction="row" spacing={2} alignItems="center">
      <Grid item>
        <Switch
          color="primary"
          checked={props.available_on_partnership}
          onChange={(event) => {
            props.onChange(event.target.checked);
          }}
        />
      </Grid>
      <Grid item>
        <Typography>{props.t('form.offer.explainPartnership')}</Typography>
      </Grid>
    </Grid>
  );
}

export default withTranslation()(PartnershipToogle);
