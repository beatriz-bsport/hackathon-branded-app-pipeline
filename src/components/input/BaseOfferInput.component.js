// @flow
import React from 'react';

import {
  withStyles,
  FormControl,
  InputLabel,
  Select,
  Input,
  MenuItem,
  FormHelperText,
} from '@material-ui/core';
import { translate } from 'react-i18next';

import { formatAsDatetime } from '../../datetime';

import type { Offer } from '../../api/types';

const styles = (theme) => ({
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 200,
  },
});

type Props = {
  classes: Object,
  offers: Array<Offer>,
  label: ?string,
  onChange: (?number) => void,
  helperText: string,
  value: ?number,
};

export function BaseOfferInput(props: Props) {
  const { value, onChange, label, offers, classes, helperText } = props;
  return (
    <FormControl className={classes.formControl}>
      <InputLabel shrink={value} htmlFor={`${label}-helper`}>
        {label}
      </InputLabel>
      <Select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        input={<Input name={label} id={`${label}-helper`} />}
      >
        <MenuItem value={null}>
          <em> - </em>
        </MenuItem>
        {offers.map((o) => (
          <MenuItem value={o.id}>{formatAsDatetime(o.date_start)}</MenuItem>
        ))}
      </Select>
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
}

export default withStyles(styles)(translate()(BaseOfferInput));
