import i18n from '#src/i18n';
import { getCurrentLanguageIsoCode } from '#src/utils/language';

const withIntercomAction =
  (actionName) =>
  (stuffToExecute) =>
  (...args) => {
    if (window.Intercom) {
      const { language } = i18n;
      const isoLanguage = getCurrentLanguageIsoCode(language);
      window.Intercom('trackEvent', actionName, {
        language_override: isoLanguage,
      });
    }
    return stuffToExecute(...args);
  };

export default withIntercomAction;
