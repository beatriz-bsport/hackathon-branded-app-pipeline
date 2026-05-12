import type { FC } from "react";

import { Button } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import type { LevelSelectorProps } from "./level-selector";

export const LevelItemRightSlot: FC<
  { levelId: number } & Pick<
    LevelSelectorProps,
    "openEditLevelModal" | "openDeleteLevelModal"
  >
> = ({ levelId, openEditLevelModal, openDeleteLevelModal }) => {
  const { t } = useTranslation("media-form");

  return (
    <div className="flex gap-xs">
      <Button
        icon="pencil-02"
        onClick={() => openEditLevelModal(levelId)}
        label={t("formFields.level.edit")}
        kind="icon-button"
        size="md"
        intent="default"
        color="main"
      />
      <Button
        icon="trash-01"
        onClick={() => openDeleteLevelModal(levelId)}
        label={t("formFields.level.delete")}
        kind="icon-button"
        size="md"
        intent="default"
        color="main"
      />
    </div>
  );
};
