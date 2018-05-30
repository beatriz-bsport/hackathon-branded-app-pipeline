//@flow
import React, { Component } from 'react';

import { connect } from 'react-redux';
import {
  Button,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  Typography,
} from '@material-ui/core';
import { translate } from 'react-i18next';

import { availableLanguages } from '../i18n/';

export class LanguageButton extends Component {
  handleChange = (event) => {
    const { i18n } = this.props;
    i18n.changeLanguage(event.target.value);
  };

  renderMenuItem = (lng) => {
    return (
      <MenuItem key={lng} value={lng}>
        {lng}
      </MenuItem>
    );
  };

  render() {
    const { t, i18n } = this.props;
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

export default translate()(LanguageButton);
