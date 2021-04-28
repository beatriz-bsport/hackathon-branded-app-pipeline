import React from 'react';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { InputLabel, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import { availableLanguages } from '../i18n';

import FR_FLAG from './input/flags/FR.png';
import ES_FLAG from './input/flags/ES.png';
import NL_FLAG from './input/flags/NL.png';
import IT_FLAG from './input/flags/IT.png';
import DE_FLAG from './input/flags/DE.png';
import EN_FLAG from './input/flags/EN.png';
import US_FLAG from './input/flags/US.png';

const countryFlag = {
  fr: FR_FLAG,
  de: DE_FLAG,
  en: EN_FLAG,
  'en-GB': EN_FLAG,
  'en-US': US_FLAG,
  nl: NL_FLAG,
  it: IT_FLAG,
  es: ES_FLAG,
};

interface Props {
  onChange: (lng: string) => void;
  value?: string;
  label?: string;
  none?: string;
}

export const LanguageSelect = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const value = props.value === 'en-US' ? 'en' : props.value;

  return (
    <FormControl className={classes.fullWidth}>
      <InputLabel>
        {props.label ? props.label : t('common.pickALanguage')}
      </InputLabel>
      <Select
        value={value}
        onChange={(e: any) => props.onChange(e.target.value)}
        name="Language"
      >
        {props.none && (
          <MenuItem key="none" value="none">
            {props.none}
          </MenuItem>
        )}

        {availableLanguages.map((item: any) => (
          <MenuItem key={item.lang} value={item.lang}>
            <img
              className={classes.flag}
              src={countryFlag[item.lang]}
              alt="text"
            />
            {item.lang}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const useStyles = makeStyles((theme) => ({
  fullWidth: {
    display: 'flex',
    flex: 1,
  },
  flag: {
    width: (297 / 210) * 15,
    height: 15,
    marginRight: theme.spacing(1),
  },
}));
