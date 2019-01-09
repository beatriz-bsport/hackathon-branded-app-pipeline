// @flow
import React from 'react';

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar as MUIAvatar,
  withStyles,
} from '@material-ui/core';
import FaceIcon from '@material-ui/icons/Face';
import { translate } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import type { Coach } from '../../api/types';

const styles = (theme) => ({
  formControlLarge: {
    minWidth: 200,
    marginRight: theme.spacing.unit,
  },
  chip: {
    margin: theme.spacing.unit,
  },
});

type Props = {
  classes: Object,
  t: TFunction,
  disabled: ?boolean,
  required: ?boolean,
  value: ?Coach,
  onChange: (event: Object) => void,
  onDelete: () => void,
  choices: Array<Coach>,
  label: ?string,
  value: ?Object,
  onChange: () => void,
};

const renderCoachItem = (coach, selected, handleDelete) => (
  <MenuItem dense key={coach.id} value={coach.id} wrap="noWrap">
    <Chip
      icon={coach.photo ? <MUIAvatar src={coach.photo} /> : <FaceIcon />}
      label={coach.name}
      onDelete={selected ? handleDelete : null}
    />
  </MenuItem>
);

export function CoachInput(props: Props) {
  const {
    classes,
    required,
    disabled,
    value,
    t,
    onChange,
    choices,
    label,
    onDelete,
  } = props;
  return (
    <FormControl
      className={classes.formControlLarge}
      required={required}
      margin="normal"
      disabled={disabled}
    >
      <InputLabel
        shrink={Boolean(value)}
        htmlFor={`${label || 'coach'}-helper`}
      >
        {label || t(`form.coach.${'coachLabel'}`)}
      </InputLabel>
      <Select value={value} onChange={onChange}>
        {choices.map((elt) => renderCoachItem(elt, elt.id === value, onDelete))}
      </Select>
    </FormControl>
  );
}

export default withStyles(styles)(translate()(CoachInput));
