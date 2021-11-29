// @flow
import React, { Component } from 'react';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation, TFunction } from 'react-i18next';

import i18n, { availableLanguages } from '../../i18n';

import FR_FLAG from '../input/flags/FR.png';
import ES_FLAG from '../input/flags/ES.png';
import NL_FLAG from '../input/flags/NL.png';
import IT_FLAG from '../input/flags/IT.png';
import DE_FLAG from '../input/flags/DE.png';
import EN_FLAG from '../input/flags/EN.png';
import US_FLAG from '../input/flags/US.png';

type Props = {
  closeMenu: () => void,
  classes: Object,
  t: TFunction,
  handleChange: (any) => void,
  value: string,
  allowNull?: boolean,
};

const countryFlag = {
  fr: FR_FLAG,
  de: DE_FLAG,
  en_GB: EN_FLAG,
  en_US: US_FLAG,
  nl: NL_FLAG,
  it: IT_FLAG,
  es: ES_FLAG,
};

const LanguageSelectBase = (props: Props) => {
  const { classes, value, handleChange, closeMenu, allowNull, t } = props;

  const renderMenuItem = (lng) => {
    return (
      <MenuItem key={lng} value={lng}>
        <img
          className={classes.flag}
          src={countryFlag[lng.replace('-', '_')]}
          alt="text"
        />
        {t(`language.${lng}`)}
      </MenuItem>
    );
  };

  return (
    <FormControl>
      <Select
        labelId="langage-selector"
        value={value}
        onChange={(e) => {
          handleChange(e);
          if (closeMenu) {
            return closeMenu();
          }
          return null;
        }}
        name="Language"
      >
        <MenuItem value="" disabled>
          {t('navigation.pick_a_language')}
        </MenuItem>
        {availableLanguages.map((lng) => renderMenuItem(lng.lang))}
        {!!allowNull && (
          <MenuItem value="none">{t('navigation.automaticLanguage')}</MenuItem>
        )}
      </Select>
    </FormControl>
  );
};

const styles = (theme) => ({
  flag: {
    width: (297 / 210) * 15,
    height: 15,
    marginRight: theme.spacing(1),
  },
});

export const LanguageSelect = withStyles(styles)(
  withTranslation(['consumerSpace'])(LanguageSelectBase),
);

export default class extends Component<any> {
  handleChange = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  render() {
    const { language } = i18n;
    return <LanguageSelect value={language} handleChange={this.handleChange} />;
  }
}
