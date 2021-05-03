import React, { Component } from 'react';
import i18n, { setLanguage } from '../../i18n';

import { LanguageSelect } from '../LanguageSelect';

type Props = {
  closeMenu: () => void;
};

export default class LanguageButton extends Component<Props> {
  handleChange = (lang: string) => {
    setLanguage(lang);
    if (this.props.closeMenu) {
      this.props.closeMenu();
    }
  };

  render() {
    const { language } = i18n;
    return <LanguageSelect onChange={this.handleChange} value={language} />;
  }
}
