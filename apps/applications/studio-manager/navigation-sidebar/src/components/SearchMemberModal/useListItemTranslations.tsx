import { useTranslation } from "#src/utils/i18n";

export const useListItemTranslations = () => {
  const { t } = useTranslation("features");

  return {
    toastEmailCopied: t("searchMembers.copyToClipboard.toasts.emailCopied"),
    toastPhoneCopied: t(
      "searchMembers.copyToClipboard.toasts.phoneNumberCopied",
    ),
    tagsTooltip: t("searchMembers.tagsTooltip"),
  };
};
