// @flow
import React from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import { withTranslation } from 'react-i18next';

import { formatAsDatetime } from '../../utils/datetime';

import type { Event } from '../../api/types';

const styles = (theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
});

type Props = {
  classes: Object,
  events: Array<Event>,
  label: ?string,
  onChange: (?number) => void,
  helperText: string,
  value: ?number,
};

export function BaseOfferInput(props: Props) {
  const { value, onChange, label, events, classes, helperText } = props;
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
        {events.map((e) => (
          <MenuItem key={e.id} value={e.id}>
            {formatAsDatetime(e.date_start)}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
}

export default withStyles(styles)(withTranslation()(BaseOfferInput));
