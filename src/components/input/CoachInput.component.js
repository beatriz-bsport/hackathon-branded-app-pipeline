// @flow
import React from 'react';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';
import MUIAvatar from '@material-ui/core/Avatar';
import withStyles from '@material-ui/core/styles/withStyles';
import FaceIcon from '@material-ui/icons/Face';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import type { Coach } from '../../api/types';

const styles = (theme) => ({
  formControlLarge: {
    minWidth: 200,
    marginRight: theme.spacing(1),
  },
  chip: {
    margin: theme.spacing(1),
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

export default withStyles(styles)(withTranslation()(CoachInput));
