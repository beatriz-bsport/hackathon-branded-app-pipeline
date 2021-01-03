// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

export const TimezoneSelector = (props: Props) => {
  const classes = useStyles();
  return (
    <FormControl className={classes.formControl}>
      {!!props.label && (
        <InputLabel id="timezone-select-label">{props.label}</InputLabel>
      )}
      <Select value={props.value} onChange={props.onChange}>
        {props.timezoneList.map((tzData) => {
          const { name, offset } = tzData;
          return (
            <MenuItem key={name} value={name} className={classes.menuItem}>
              {`${name.split('/').slice(1).join(', ')} (UTC${
                parseInt(offset, 10) <= 0 ? '+' : '-'
              }${Math.abs(parseInt(offset / 60, 10))})`}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  flag: {
    width: (297 / 210) * 15,
    height: 15,
    marginRight: theme.spacing(1),
  },
}));

export default TimezoneSelector;
