import { LANGUAGES, type Locale, switchLanguage } from "@bsport/i18n";
import {
  DropdownMenu,
  type DropdownMenuItems,
  Icon,
} from "@bsport/kaizen-primitive-core";

import { i18nInstance, useTranslation } from "#src/utils/i18n";

const useLanguageItems = (): DropdownMenuItems => {
  const { t } = useTranslation("default");

  return [
    {
      id: LANGUAGES.FRENCH,
      label: t("languages.french"),
      iconLeft: "flag-fr",
    },
    {
      id: LANGUAGES.ENGLISH_BRITISH,
      label: t("languages.englishUK"),
      iconLeft: "flag-uk",
    },
    {
      id: LANGUAGES.ENGLISH,
      label: t("languages.englishUS"),
      iconLeft: "flag-us",
    },
    {
      id: LANGUAGES.SPANISH,
      label: t("languages.spanish"),
      iconLeft: "flag-es",
    },
    {
      id: LANGUAGES.DUTCH,
      label: t("languages.dutch"),
      iconLeft: "flag-nl",
    },
    {
      id: LANGUAGES.GERMAN,
      label: t("languages.german"),
      iconLeft: "flag-de",
    },
    {
      id: LANGUAGES.ITALIAN,
      label: t("languages.italian"),
      iconLeft: "flag-it",
    },
    {
      id: LANGUAGES.PORTUGUESE,
      label: t("languages.portuguese"),
      iconLeft: "flag-pt",
    },
    {
      id: LANGUAGES.CZECH,
      label: t("languages.czech"),
      iconLeft: "flag-cz",
    },
  ] as const;
};

/**
 * Default classes for the language dropdown button
 * these are the same as the navigation menu item
 * in the current implementation of navigation menu
 * there isn't any way to customize the items
 * so we use the same classes
 * Slack discussion: https://bsport.slack.com/archives/C07Q30316CS/p1742296111666609
 */
const defaultClasses = [
  "h-xl min-h-xl w-full",
  "rounded-md",
  "p-xs",
  "cursor-pointer",
  "border-none outline-none",
  "transition ease-out duration-long",
  "flex flex-row items-center justify-between",
  "hover:bg-surface-action-default-weak-hovered",
  "focus-visible:bg-surface-action-default-weak-hovered",
  "active:bg-surface-action-default-weak-pressed",
];

const LanguageDropdown = () => {
  const { t } = useTranslation("default");
  const languageItems = useLanguageItems();

  return (
    <DropdownMenu
      className="w-full pl-xs pr-xs mb-md"
      items={languageItems}
      onSelectOption={({ id, setIsPopoverOpened }) => {
        switchLanguage(id as Locale);
        setIsPopoverOpened(false);
      }}
      placement="top-left"
      selectedValues={[i18nInstance.language]}
      target={({ setIsPopoverOpened }) => (
        <button
          className={defaultClasses.join(" ")}
          onClick={() => setIsPopoverOpened(true)}
        >
          <span className="font-size-body-md pl-xs">
            {t("menus.settings.changeLanguage")}
          </span>
          <Icon icon="arrow-right" size="sm" />
        </button>
      )}
    />
  );
};

export default LanguageDropdown;
