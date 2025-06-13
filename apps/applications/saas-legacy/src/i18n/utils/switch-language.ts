import { applyBroadcastChannelPolyfill } from '@bsport/broadcast-channel-polyfill';
import type { Locale } from '../languages';

applyBroadcastChannelPolyfill();

// Keep these constants in synchronization with `@bsport/i18n` package (/src/constants.ts)
export const LANGUAGE_SWITCHER_CHANNEL = 'bsport:switch-language';
export const LANGUAGE_SWITCHER_ACTION = 'SWITCH_LANGUAGE';

/**
 * Post a message to the language switcher broadcast channel to tell i18n Navigation Sidebar instance
 * to change its language based on the provided languageId
 * @param languageId Language to set in i18n instances
 */
export const switchLanguage = (languageId: Locale) => {
  if (!languageId) return;

  const broadcast = new BroadcastChannel(LANGUAGE_SWITCHER_CHANNEL);
  // Ensure languageId is well formatted, in case typing is bypassed
  let language = languageId.toLowerCase();
  if (language.includes('-')) {
    // Ex : en-US
    const [country, locale] = language.split('-');
    language = `${country}-${locale.toUpperCase()}`;
  }
  broadcast.postMessage({
    action: LANGUAGE_SWITCHER_ACTION,
    payload: language,
  });
  broadcast.close();
};
