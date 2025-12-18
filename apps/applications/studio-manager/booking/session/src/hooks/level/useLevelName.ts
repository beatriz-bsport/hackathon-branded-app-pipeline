import { useTranslation } from "#src/utils/i18n";

export const useLevelName = () => {
  const { t } = useTranslation("sessionCreation");

  const defaultLevelIds = [1, 2, 3, 4, 5] as const;

  const levelTranslationKeys = {
    1: "addSessionModal.steps.configureSession.settings.level.1",
    2: "addSessionModal.steps.configureSession.settings.level.2",
    3: "addSessionModal.steps.configureSession.settings.level.3",
    4: "addSessionModal.steps.configureSession.settings.level.4",
    5: "addSessionModal.steps.configureSession.settings.level.5",
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
