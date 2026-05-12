import { useTranslation } from "#src/utils/i18n";

const DEFAULT_LEVEL_IDS = [1, 2, 3, 4, 5] as const;

const LEVEL_TRANSLATION_KEYS = {
  1: "formFields.level.defaults.1",
  2: "formFields.level.defaults.2",
  3: "formFields.level.defaults.3",
  4: "formFields.level.defaults.4",
  5: "formFields.level.defaults.5",
} as const;

export const useLevelName = () => {
  const { t } = useTranslation("media-form");

  return ({
    levelId,
    levelName,
  }: {
    levelId: number | null | undefined;
    levelName: string | null | undefined;
  }) => {
    if (
      DEFAULT_LEVEL_IDS.includes(levelId as (typeof DEFAULT_LEVEL_IDS)[number])
    ) {
      return t(
        LEVEL_TRANSLATION_KEYS[levelId as keyof typeof LEVEL_TRANSLATION_KEYS],
      );
    }
    return levelName || "";
  };
};
