// @flow
import React from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import { withNamespaces } from 'react-i18next';

import LEVELS from '@bsport/common/lib/master-data/levels';

import type { Activity } from '../../api/types';

const styles = (theme) => ({
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 200,
  },
});

type Props = {
  classes: Object,
  activities: Array<Activity>,
  label: ?string,
  onChange: (?number) => void,
  helperText: string,
  value: ?number,
};

function formatActivityName(activity: Activity) {
  const { level } = activity;

  return `${activity.name} - ${activity.etablissement.title} - ${
    LEVELS.filter((l) => l.id === level)[0].text
  } - ${activity.coach.name}`;
}

export function ActivityInput(props: Props) {
  const { value, onChange, label, activities, classes, helperText } = props;
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
        {activities.map((a) => (
          <MenuItem key={a.id} value={a.id}>
            {formatActivityName(a)}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
}

export default withStyles(styles)(withNamespaces()(ActivityInput));
