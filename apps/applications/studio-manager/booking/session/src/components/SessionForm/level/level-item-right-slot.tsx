import { FC } from "react";

import { Button } from "@bsport/kaizen-primitive-core";

export const LevelItemRightSlot: FC<{
  levelId: number;
  openEditLevelModal: (levelId: number) => void;
}> = ({ levelId, openEditLevelModal }) => {
  return (
    <Button
      icon="pencil-02"
      onClick={() => openEditLevelModal(levelId)}
      label="update"
      kind="icon-button"
      size="md"
      intent="default"
      color="main"
    />
  );
};
