// @flow

import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import FormField from '../../../components/input/FormField.component';

type Props = {
  date: Object,
  hour: Object,
  onFormFieldChange: (id: string) => (Object) => void,
  t: TFunction,
};

export function DateTimeForm(props: Props) {
  const { t, date, hour, onFormFieldChange } = props;
  return (
    <Grid container direction="column" spacing={8}>
      <Grid item>
        <Typography variant="caption">{t('form.offer.changeDate')}</Typography>
      </Grid>
      <Grid item>
        <Grid container direction="row" spacing={16} alignItems="center">
          <Grid item>
            <FormField id="date" value={date} onChange={onFormFieldChange} />
          </Grid>
          <Grid item>
            <FormField id="hour" value={hour} onChange={onFormFieldChange} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default withNamespaces()(DateTimeForm);
