import { type TFunctionGeneric, instanciateAppI18n } from "@bsport/i18n";

import {
  i18nNamespacePrefix,
  i18nNamespaces,
  inMemoryTranslationsLoader,
} from "#src/i18n";
import type inboxLayoutTranslations from "#src/i18n/source/inbox-layout.json";
import type memberDetailTranslations from "#src/i18n/source/member-detail.json";
import type messageComposerTranslations from "#src/i18n/source/message-composer.json";
import type pageTranslations from "#src/i18n/source/page.json";
import type threadListTranslations from "#src/i18n/source/thread-list.json";
import type threadMessagesTranslations from "#src/i18n/source/thread-messages.json";
import type threadPlaceholderTranslations from "#src/i18n/source/thread-placeholder.json";

type Translations = {
  page: typeof pageTranslations;
  "thread-list": typeof threadListTranslations;
  "thread-messages": typeof threadMessagesTranslations;
  "message-composer": typeof messageComposerTranslations;
  "member-detail": typeof memberDetailTranslations;
  "inbox-layout": typeof inboxLayoutTranslations;
  "thread-placeholder": typeof threadPlaceholderTranslations;
};

export const {
  i18nInstance,
  useTranslation,
  withTranslation,
  getFixedNamespace,
  AppI18nextProvider,
} = instanciateAppI18n<Translations>({
  applicationName: i18nNamespacePrefix,
  namespaces: i18nNamespaces,
  inMemoryTranslationsLoader,
  debug: import.meta.env.DEV,
});

export type TFunction = TFunctionGeneric<Translations>;

export { Trans, LANGUAGES, LOCALES, type Locale } from "@bsport/i18n";
