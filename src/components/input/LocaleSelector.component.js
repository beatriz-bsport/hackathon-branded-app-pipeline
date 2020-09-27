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
  withCurrency?: boolean,
  onChange: (SyntheticEvent<HTMLElement>) => void,
  value: string,
  label?: string,
};

type Locale = {
  locale: string,
  icon: string,
  currencyCode: string,
  currencyDisplay: string,
};

const localeList: Array<Locale> = [
  {
    locale: 'fr_FR',
    icon: FR_FLAG,
    currencyCode: 'eur',
    currencyDisplay: '€',
  },
  {
    locale: 'de_DE',
    icon: DE_FLAG,
    currencyCode: 'eur',
    currencyDisplay: '€',
  },
  {
    locale: 'de_AT',
    icon: AT_FLAG,
    currencyCode: 'eur',
    currencyDisplay: '€',
  },
  {
    locale: 'fr_BE',
    icon: BE_FLAG,
    currencyCode: 'eur',
    currencyDisplay: '€',
    showLang: true,
  },
  {
    locale: 'nl_BE',
    icon: BE_FLAG,
    currencyCode: 'eur',
    currencyDisplay: '€',
    showLang: true,
  },
  {
    locale: 'en_IE',
    icon: IE_FLAG,
    currencyCode: 'eur',
    currencyDisplay: '€',
  },
  {
    locale: 'nl_NL',
    icon: NL_FLAG,
    currencyCode: 'eur',
    currencyDisplay: '€',
  },
  {
    locale: 'it_IT',
    icon: IT_FLAG,
    currencyCode: 'eur',
    currencyDisplay: '€',
  },
  {
    locale: 'es_ES',
    icon: ES_FLAG,
    currencyCode: 'eur',
    currencyDisplay: '€',
  },
  /*
  {
    locale: 'fr_CH',
    icon: CH_FLAG,
    currencyCode: 'chf',
    currencyDisplay: 'CHF',
  },
  {
    locale: 'de_CH',
    icon: CH_FLAG,
    currencyCode: 'chf',
    currencyDisplay: 'CHF',
  },
  {
    locale: 'it_CH',
    icon: CH_FLAG,
    currencyCode: 'chf',
    currencyDisplay: 'CHF',
  },
  */
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
          const [lang, country] = localeContainer.locale.split('_');
          return (
            <MenuItem
              key={localeContainer.locale}
              value={localeContainer.locale}
              className={classes.menuItem}
            >
              <img
                className={classes.flag}
                alt={localeContainer.locale}
                src={localeContainer.icon}
              />
              {t(`country.${country}`)}
              {localeContainer.showLang && ` - ${t(`language.${lang}`)}`}
              {!!props.withCurrency && ` (${localeContainer.currencyDisplay})`}
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

export default CountrySelector;
