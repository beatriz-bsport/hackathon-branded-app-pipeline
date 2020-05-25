// @flow
import React, { Component } from 'react';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { withTranslation } from 'react-i18next';

import i18n, { availableLanguages } from '../../i18n';

type props = {
  closeMenu: () => void,
};

export class LanguageButton extends Component<props> {
  handleChange = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  renderMenuItem = (lng) => (
    <MenuItem key={lng} value={lng}>
      {lng}
    </MenuItem>
  );

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

export default withTranslation()(LanguageButton);
