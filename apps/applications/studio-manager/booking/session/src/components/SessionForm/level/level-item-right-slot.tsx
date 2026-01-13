import { FC } from "react";

import { Button } from "@bsport/kaizen-primitive-core";

import { LevelSelectorProps } from "./level-selector";

export const LevelItemRightSlot: FC<
  { levelId: number } & Pick<
    LevelSelectorProps,
    "openEditLevelModal" | "openDeleteLevelModal"
  >
> = ({ levelId, openEditLevelModal, openDeleteLevelModal }) => {
  return (
    <div className="flex gap-xs">
      <Button
        icon="pencil-02"
        onClick={() => openEditLevelModal(levelId)}
        label="update"
        kind="icon-button"
        size="md"
        intent="default"
        color="main"
      />
      <Button
        icon="trash-01"
        onClick={() => openDeleteLevelModal(levelId)}
        label="delete"
        kind="icon-button"
        size="md"
        intent="default"
        color="main"
      />
    </div>
  );
};
