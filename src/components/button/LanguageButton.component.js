// @flow
import React, { Component } from 'react';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation } from 'react-i18next';

import i18n, { availableLanguages } from '../../i18n';

import FR_FLAG from '../input/flags/FR.png';
import ES_FLAG from '../input/flags/ES.png';
import NL_FLAG from '../input/flags/NL.png';
import IT_FLAG from '../input/flags/IT.png';
import DE_FLAG from '../input/flags/DE.png';
import EN_FLAG from '../input/flags/EN.png';

type Props = {
  closeMenu: () => void,
  classes: Object,
};

const countryFlag = {
  fr: FR_FLAG,
  de: DE_FLAG,
  en: EN_FLAG,
  nl: NL_FLAG,
  it: IT_FLAG,
  es: ES_FLAG,
};

export class LanguageButton extends Component<Props> {
  handleChange = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  renderMenuItem = (lng) => {
    const { classes } = this.props;
    return (
      <MenuItem key={lng} value={lng}>
        <img className={classes.flag} src={countryFlag[lng]} alt="text" />
        {lng}
      </MenuItem>
    );
  };

  render() {
    const { language } = i18n;
    return (
      <FormControl>
        <Select
          value={language}
          onChange={(e) => {
            this.handleChange(e);
            if (this.props.closeMenu) {
              return this.props.closeMenu();
            }
            return null;
          }}
          name="Language"
        >
          {availableLanguages.map((lng) => this.renderMenuItem(lng.lang))}
        </Select>
      </FormControl>
    );
  }
}

const styles = (theme) => ({
  flag: {
    width: (297 / 210) * 15,
    height: 15,
    marginRight: theme.spacing(1),
  },
});

export default withStyles(styles)(withTranslation()(LanguageButton));
