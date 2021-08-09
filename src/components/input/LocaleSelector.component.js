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
import PT_FLAG from './flags/PT.png';
import NL_FLAG from './flags/NL.png';
import IT_FLAG from './flags/IT.png';
import BE_FLAG from './flags/BE.png';
import IE_FLAG from './flags/IE.png';
import DE_FLAG from './flags/DE.png';
import AT_FLAG from './flags/AT.png';
import GB_FLAG from './flags/GB.png';
import MT_FLAG from './flags/MT.png';
import CH_FLAG from './flags/CH.png';
import NO_FLAG from './flags/NO.png';
import FI_FLAG from './flags/FI.png';
import SE_FLAG from './flags/SE.png';
import DK_FLAG from './flags/DK.png';
import LU_FLAG from './flags/LU.png';
import CA_FLAG from './flags/CA.png';
import AE_FLAG from './flags/AE.png';
import US_FLAG from './flags/US.png';

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
    locale: 'en_GB',
    icon: GB_FLAG,
    currencyCode: 'gbp',
    currencyDisplay: ' £',
  },
  {
    locale: 'en_US',
    icon: US_FLAG,
    currencyCode: 'usd',
    currencyDisplay: '$',
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
  {
    locale: 'pt_PT',
    icon: PT_FLAG,
    currencyCode: 'eur',
    currencyDisplay: '€',
  },
  {
    locale: 'it_CH',
    icon: CH_FLAG,
    currencyCode: 'chf',
    currencyDisplay: 'CHF',
    showLang: true,
  },
  {
    locale: 'de_CH',
    icon: CH_FLAG,
    currencyCode: 'chf',
    currencyDisplay: 'CHF',
    showLang: true,
  },
  {
    locale: 'fr_CH',
    icon: CH_FLAG,
    currencyCode: 'chf',
    currencyDisplay: 'CHF',
    showLang: true,
  },
  {
    locale: 'en_MT',
    icon: MT_FLAG,
    currencyCode: 'eur',
    currencyDisplay: '€',
  },
  {
    locale: 'en_FI',
    icon: FI_FLAG,
    currencyCode: 'eur',
    currencyDisplay: '€',
  },
  {
    locale: 'en_NO',
    icon: NO_FLAG,
    currencyCode: 'nok',
    currencyDisplay: 'kr.',
  },
  {
    locale: 'en_SE',
    icon: SE_FLAG,
    currencyCode: 'sek',
    currencyDisplay: 'kr.',
  },
  {
    locale: 'en_DK',
    icon: DK_FLAG,
    currencyCode: 'dkk',
    currencyDisplay: 'kr.',
  },
  {
    locale: 'fr_LU',
    icon: LU_FLAG,
    currencyCode: 'eur',
    currencyDisplay: '€.',
  },
  {
    locale: 'en_CA',
    icon: CA_FLAG,
    currencyCode: 'cad',
    currencyDisplay: '$ C',
    showLang: true,
  },
  {
    locale: 'fr_CA',
    icon: CA_FLAG,
    currencyCode: 'cad',
    currencyDisplay: '$ C',
    showLang: true,
  },
  {
    locale: 'en_AE',
    icon: AE_FLAG,
    currencyCode: 'aed',
    currencyDisplay: 'د.إ',
    showLang: true,
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
