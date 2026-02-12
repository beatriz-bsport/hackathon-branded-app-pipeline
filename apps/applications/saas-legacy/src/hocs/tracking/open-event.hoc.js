// @flow

import React from 'react';
import i18n from '#src/i18n';
import { getCurrentLanguageIsoCode } from '#src/utils/language';

export default (pageName) =>
  function (WrappedComponent) {
    return class extends React.Component {
      componentDidMount() {
        const { language } = i18n;
        const isoLanguage = getCurrentLanguageIsoCode(language);

        window.Intercom &&
          window.Intercom('trackEvent', 'Open ' + pageName, {
            eventType: 'open',
            id: pageName,
            language_override: isoLanguage,
          });
      }

      render() {
        return <WrappedComponent {...this.props} />;
      }
    };
  };
