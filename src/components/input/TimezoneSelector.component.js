// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import moment from 'moment-timezone';

const getTimezoneListExtended = (timezoneList, country) => {
  if (country === 'FR') {
    return [
      ...timezoneList,
      moment.tz.zone('Indian/Reunion'),
      moment.tz.zone('America/Martinique'),
    ];
  }
  if (country === 'US') {
    return [...timezoneList, moment.tz.zone('America/Jamaica')];
  }
  return timezoneList;
};

export const TimezoneSelector = (props: Props) => {
  const classes = useStyles();
  const timezoneListExtended = getTimezoneListExtended(
    props.timezoneList,
    props.country,
  );
  return (
    <FormControl className={classes.formControl}>
      {!!props.label && (
        <InputLabel id="timezone-select-label">{props.label}</InputLabel>
      )}
      <Select value={props.value} onChange={props.onChange}>
        {timezoneListExtended.map((tzData) => {
          const { name, offset, abbrs } = tzData;
          let offsetName = '';
          if (offset) {
            offsetName = `UTC${parseInt(offset, 10) <= 0 ? '+' : '-'}${Math.abs(
              parseInt(offset / 60, 10),
            )}`;
          }
          if (abbrs) {
            offsetName = abbrs.join('');
          }
          return (
            <MenuItem key={name} value={name} className={classes.menuItem}>
              {`${name.split('/').slice(1).join(', ')} (${offsetName})`}
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
