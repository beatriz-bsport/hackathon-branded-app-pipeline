// @flow
import React, { Component } from 'react';

import { FormControl, Select, MenuItem } from '@material-ui/core';
import { withNamespaces } from 'react-i18next';

import i18n, { availableLanguages } from '../../i18n';

export class LanguageButton extends Component {
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
        <Select value={language} onChange={this.handleChange} name="Language">
          {availableLanguages.map((lng) => this.renderMenuItem(lng.lang))}
        </Select>
      </FormControl>
    );
  }
}

export default withNamespaces()(LanguageButton);
