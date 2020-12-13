// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

/*
 * source :
 * https://github.com/gunjan4455/Flagicons/tree/master/flags
 *
 */
import FR_FLAG from './flags/FR.png';
import ES_FLAG from './flags/ES.png';
import NL_FLAG from './flags/NL.png';
import IT_FLAG from './flags/IT.png';
import BE_FLAG from './flags/BE.png';
import IE_FLAG from './flags/IE.png';
import DE_FLAG from './flags/DE.png';
// import CH_FLAG from './flags/CH.png';
import AT_FLAG from './flags/AT.png';

type Props = {
  onChange: (SyntheticEvent<HTMLElement>) => void,
  value: string,
  label?: string,
};

type Locale = {
  country: string,
  icon: string,
};

const localeList: Array<Locale> = [
  {
    country: 'FR',
    icon: FR_FLAG,
  },
  {
    country: 'DE',
    icon: DE_FLAG,
  },
  {
    country: 'AT',
    icon: AT_FLAG,
  },
  {
    country: 'BE',
    icon: BE_FLAG,
  },
  {
    country: 'IE',
    icon: IE_FLAG,
  },
  {
    country: 'NL',
    icon: NL_FLAG,
  },
  {
    country: 'IT',
    icon: IT_FLAG,
  },
  {
    country: 'ES',
    icon: ES_FLAG,
  },
];

export const CountrySelector = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['login']);
  return (
    <FormControl className={classes.formControl}>
      {!!props.label && (
        <InputLabel id="locale-simple-select-label">{props.label}</InputLabel>
      )}
      <Select value={props.value} onChange={props.onChange}>
        {localeList.map((localeContainer) => {
          return (
            <MenuItem
              key={localeContainer.country}
              value={localeContainer.country}
              className={classes.menuItem}
            >
              <img
                className={classes.flag}
                alt={localeContainer.country}
                src={localeContainer.icon}
              />
              {t(`country.${localeContainer.country}`)}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  menuItem: {
    minWidth: 180,
  },
  flag: {
    width: (297 / 210) * 15,
    height: 15,
    marginRight: theme.spacing(1),
  },
}));

export default CountrySelector;
