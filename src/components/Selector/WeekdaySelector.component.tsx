import React from 'react';
import { useTranslation } from 'react-i18next';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import { Theme } from '@material-ui/core';

const weekdays = [
  { value: 0, label: 'monday' },
  { value: 1, label: 'tuesday' },
  { value: 2, label: 'wednesday' },
  { value: 3, label: 'thursday' },
  { value: 4, label: 'friday' },
  { value: 5, label: 'saturday' },
  { value: 6, label: 'sunday' },
];

type Props = {
  text?: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: any;
  disabled?: boolean;
  plural?: boolean;
  lowercase?: boolean;
};

export const WeekdaySelector = (props: Props) => {
  const { t } = useTranslation(['expense']);
  const classes = useStyles();
  const getOption = (text: string) => {
    let newText = t(`form.repeat.weekdays.${text}`);
    if (props.plural) {
      newText = t(`form.repeat.weekdays_pl.${text}`);
    }
    if (props.lowercase) {
      newText = newText.toLowerCase();
    }
    return newText;
  };
  return (
    <div className={classes.flexRow}>
      {props.text && <Typography>{props.text}</Typography>}
      <Select
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        className={classes.marginLeft}
        disabled={props.disabled}
      >
        {weekdays.map((d) => {
          return (
            <MenuItem key={d.label} value={d.value}>
              {getOption(d.label)}
            </MenuItem>
          );
        })}
      </Select>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  marginLeft: {
    marginLeft: theme.spacing(1),
  },
}));

export default WeekdaySelector;
