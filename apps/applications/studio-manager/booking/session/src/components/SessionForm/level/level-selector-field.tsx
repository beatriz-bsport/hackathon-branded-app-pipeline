import { FC, useState } from "react";

import { FormField } from "@bsport/form";

import type { SessionCreationFormData } from "#src/stores/session-creation/types";

import { CreateLevelModal } from "./create-level-modal";
import { DeleteLevelModal } from "./delete-level-modal";
import { EditLevelModal } from "./edit-level-modal";
import { LevelSelector, type LevelSelectorProps } from "./level-selector";

export const LevelSelectorField: FC<{ fieldIdPrefix: string }> = ({
  fieldIdPrefix,
}) => {
  const [isCreateLevelModalOpen, setIsCreateLevelModalOpen] = useState(false);

  const [isEditLevelModalOpen, setIsEditLevelModalOpen] = useState(false);

  const [isDeleteLevelModalOpen, setIsDeleteLevelModalOpen] = useState(false);

  const [levelId, setLevelId] = useState<number | null>(null);

  const openEditLevelModal = (id: number) => {
    setLevelId(id);
    setIsEditLevelModalOpen(true);
  };

  const closeEditLevelModal = () => {
    setIsEditLevelModalOpen(false);
    setLevelId(null);
  };

  const openDeleteLevelModal = (id: number) => {
    setLevelId(id);
    setIsDeleteLevelModalOpen(true);
  };

  const closeDeleteLevelModal = () => {
    setIsDeleteLevelModalOpen(false);
    setLevelId(null);
  };

  return (
    <>
      <FormField<SessionCreationFormData, "level", LevelSelectorProps>
        name="level"
        mapProps={({ form: { setValue } }) => ({
          onLevelSelect: (levelId: number) => {
            setValue("level", levelId);
          },
        })}
      >
        <LevelSelector
          fieldIdPrefix={fieldIdPrefix}
          openCreateLevelModal={() => setIsCreateLevelModalOpen(true)}
          openEditLevelModal={openEditLevelModal}
          openDeleteLevelModal={openDeleteLevelModal}
        />
      </FormField>
      <CreateLevelModal
        isOpen={isCreateLevelModalOpen}
        onClose={() => setIsCreateLevelModalOpen(false)}
      />
      <EditLevelModal
        isOpen={isEditLevelModalOpen}
        levelId={levelId}
        onClose={closeEditLevelModal}
        key={levelId}
      />
      <DeleteLevelModal
        isOpen={isDeleteLevelModalOpen}
        levelId={levelId}
        onClose={closeDeleteLevelModal}
      />
    </>
  );
};
