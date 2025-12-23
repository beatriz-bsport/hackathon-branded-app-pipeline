import { useTranslation } from "#src/utils/i18n";

export const useLevelName = () => {
  const { t } = useTranslation("common");

  const defaultLevelIds = [1, 2, 3, 4, 5] as const;

  const levelTranslationKeys = {
    1: "levels.default.1",
    2: "levels.default.2",
    3: "levels.default.3",
    4: "levels.default.4",
    5: "levels.default.5",
  } as const;

  const getLevelName = ({
    levelId,
    levelName,
  }: {
    levelId: number | null | undefined;
    levelName: string | null | undefined;
  }) => {
    if (defaultLevelIds.includes(levelId as (typeof defaultLevelIds)[number])) {
      return t(
        levelTranslationKeys[levelId as keyof typeof levelTranslationKeys],
      );
    }
    return levelName || "";
  };

  return getLevelName;
};
