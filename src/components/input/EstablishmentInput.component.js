// @flow
import React from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import type { Establishment } from '../../api/types';

const styles = () => ({
  formControl: {
    minWidth: 400,
  },
});

type Props = {
  t: TFunction,
  classes: Object,
  establishments: Array<Establishment>,
  onChange: (establishment: ?number) => void,
  value: ?number,
  noBlank: ?boolean,
  label: ?string,
  required: ?boolean,
};

export function EstablishmentInput(props: Props) {
  const {
    noBlank,
    required,
    establishments,
    value,
    t,
    label,
    classes,
    onChange,
  } = props;
  return (
    <FormControl className={classes.formControl} required={required}>
      <InputLabel shrink={value} htmlFor="establishment-helper">
        {label || t('common.establishment')}
      </InputLabel>
      <Select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        input={
          <Input name={t('common.establishment')} id="establishment-helper" />
        }
      >
        {noBlank ? null : (
          <MenuItem value={null}>
            <em> - </em>
          </MenuItem>
        )}
        {establishments.map((e) => (
          <MenuItem key={e.id} value={e.id}>
            <ListItemText primary={e.title} secondary={e.location.address} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default withStyles(styles)(withTranslation()(EstablishmentInput));
