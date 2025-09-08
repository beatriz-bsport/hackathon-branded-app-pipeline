import React, { memo } from "react";

import { Body, Link } from "@bsport/kaizen-primitive-core";

import { LANGUAGES, type Locale, Trans, useTranslation } from "#src/utils/i18n";

const INTERCOM_HELP_CENTER_ZOHO_IMPORT: Record<Locale, string> = {
  [LANGUAGES.ENGLISH]:
    "https://intercom.help/bsport-helpcenter/en/articles/9675215-how-do-i-import-my-leads-from-zoho-crm",
  [LANGUAGES.FRENCH]:
    "https://intercom.help/bsport-helpcenter/fr/articles/9675215-comment-importer-mes-prospects-depuis-zoho-crm",
  [LANGUAGES.SPANISH]:
    "https://intercom.help/bsport-helpcenter/es/articles/9675215-como-puedo-importar-mis-clientes-potenciales-de-zoho-crm",
  [LANGUAGES.DUTCH]:
    "https://intercom.help/bsport-helpcenter/nl/articles/9675215-hoe-importeer-ik-mijn-leads-uit-zoho-crm",
  [LANGUAGES.GERMAN]:
    "https://intercom.help/bsport-helpcenter/de/articles/9675215-wie-kann-ich-meine-leads-aus-zoho-crm-importieren",
  [LANGUAGES.ITALIAN]:
    "https://intercom.help/bsport-helpcenter/it/articles/9675215-come-posso-importare-i-miei-contatti-da-zoho-crm",
  // // Use english documentation when the article does not exist in the current language
  [LANGUAGES.PORTUGUESE]:
    "https://intercom.help/bsport-helpcenter/en/articles/9675215-how-do-i-import-my-leads-from-zoho-crm",
};

export const ImportLeadsModalDescription: React.FC = memo(() => {
  const { t, i18n } = useTranslation("common");

  const languageForIntercomGuide = Object.keys(
    INTERCOM_HELP_CENTER_ZOHO_IMPORT,
  ).includes(i18n.resolvedLanguage ?? "")
    ? (i18n.resolvedLanguage as Locale)
    : LANGUAGES.ENGLISH;

  return (
    <div>
      <Body htmlVariant="p" size="md">
        {t("importLeadsModal.description")}
      </Body>
      <Body htmlVariant="p" size="sm" className="mt-lg">
        <Trans
          i18nKey="importLeadsModal.moreHelpSection"
          components={{
            key: (
              <Link
                isUnderlined
                color="main"
                target="_blank"
                rel="noopener"
                href={
                  INTERCOM_HELP_CENTER_ZOHO_IMPORT[languageForIntercomGuide]
                }
              ></Link>
            ),
          }}
        />
      </Body>
    </div>
  );
});
