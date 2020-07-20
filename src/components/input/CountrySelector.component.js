// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

import FR_FLAG from './flags/FR.png';
import ES_FLAG from './flags/ES.png';
import NL_FLAG from './flags/NL.png';
import IT_FLAG from './flags/IT.png';
import BE_FLAG from './flags/BE.png';
import DE_FLAG from './flags/DE.png';

type Props = {};

const countryList = ['FR', 'BE', 'DE', 'IT', 'ES', 'NL'];

const countryFlag = {
  FR: FR_FLAG,
  DE: DE_FLAG,
  BE: BE_FLAG,
  NL: NL_FLAG,
  IT: IT_FLAG,
  ES: ES_FLAG,
};

const countryCurrency = {
  FR: ' (€)',
  DE: ' (€)',
  BE: ' (€)',
  NL: ' (€)',
  IT: ' (€)',
  ES: ' (€)',
};

export const CountrySelector = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['login']);
  return (
    <FormControl className={classes.formControl}>
      {!!props.label && (
        <InputLabel id="demo-simple-select-label">{props.label}</InputLabel>
      )}
      <Select value={props.value} onChange={props.onChange}>
        {countryList.map((c) => (
          <MenuItem key={c} value={c} className={classes.menuItem}>
            <img className={classes.flag} src={countryFlag[c]} />
            {t(`country.${c}`)}
            {!!props.withCurrency && countryCurrency[c]}
          </MenuItem>
        ))}
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

export default CountrySelector;
