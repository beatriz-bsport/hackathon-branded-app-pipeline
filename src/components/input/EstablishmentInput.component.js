// @flow
import React from 'react';

import {
  withStyles,
  FormControl,
  InputLabel,
  Select,
  Input,
  MenuItem,
  ListItemText,
} from '@material-ui/core';
import { translate } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import type { Establishment } from '../../api/types';

const styles = (theme) => ({
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 200,
  },
});

type Props = {
  t: TFunction,
  classes: Object,
  establishments: Array<Establishment>,
  onChange: (?number) => void,
  value: ?number,
};

export function EstablishmentInput(props: Props) {
  const { establishments, value, t, classes, onChange } = props;
  return (
    <FormControl className={classes.formControl}>
      <InputLabel shrink={value} htmlFor="establishment-helper">
        {t('common.establishment')}
      </InputLabel>
      <Select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        input={
          <Input name={t('common.establishment')} id="establishment-helper" />
        }
      >
        <MenuItem value={null}>
          <em> - </em>
        </MenuItem>
        {establishments.map((e) => (
          <MenuItem key={e.id} value={e.id}>
            <ListItemText primary={e.title} secondary={e.location.address} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default withStyles(styles)(translate()(EstablishmentInput));
