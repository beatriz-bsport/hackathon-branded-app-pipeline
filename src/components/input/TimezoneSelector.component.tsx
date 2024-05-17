// @ts-nocheck
import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { EXTRA_TIMEZONES } from '#src/i18n';
import type { getTimezonesForCountry } from '#src/i18n/utils/timezone-country';

type Props = {
  country: string;
  onChange: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  label?: string;
};

export const TimezoneSelector = (props: Props) => {
  const classes = useStyles();
  const timezoneListExtended = getTimezonesForCountry(props.country, true, {
    additionalTimezones: EXTRA_TIMEZONES,
  });
  return (
    <FormControl className={classes.formControl}>
      {!!props.label && (
        <InputLabel id="timezone-select-label">{props.label}</InputLabel>
      )}
      <Select onChange={props.onChange} value={props.value}>
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
            <MenuItem key={name} value={name}>
              {`${name.split('/').slice(1).join(', ')} (${offsetName})`}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
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
