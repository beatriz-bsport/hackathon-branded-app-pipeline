// @flow

import React from 'react';
import i18n from '#src/i18n';
import { getCurrentLanguageIsoCode } from '#src/utils/language';

export default (eventName, secondToTrack) =>
  function (WrappedComponent) {
    return class extends React.Component {
      componentDidMount() {
        const { language } = i18n;
        const isoLanguage = getCurrentLanguageIsoCode(language);

        this.timeoutList = (secondToTrack ?? []).map((second) =>
          setTimeout(() => {
            window.Intercom &&
              window.Intercom(
                'trackEvent',
                'Stay ' + eventName + ' ' + second + 's',
                {
                  pause: second,
                  eventType: 'stay',
                  id: eventName,
                  language_override: isoLanguage,
                },
              );
          }, second * 1000),
        );
      }

      componentWillUnmount() {
        try {
          (this.timeoutList ?? []).map((timeout) => clearTimeout(timeout));
        } catch (err) {
          console.error(err);
        }
      }

      render() {
        return <WrappedComponent {...this.props} />;
      }
    };
  };
