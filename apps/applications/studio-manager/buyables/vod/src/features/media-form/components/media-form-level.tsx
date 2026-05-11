import { type FC, useState } from "react";

import { FormField } from "@bsport/form";

import type { MediaFormData } from "../types";
import { CreateLevelModal } from "./level/create-level-modal";
import { DeleteLevelModal } from "./level/delete-level-modal";
import { EditLevelModal } from "./level/edit-level-modal";
import { LevelSelector, type LevelSelectorProps } from "./level/level-selector";

type MediaFormLevelProps = {
  formId: string;
};

export const MediaFormLevel: FC<MediaFormLevelProps> = ({ formId }) => {
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
      <FormField<MediaFormData, "level", LevelSelectorProps>
        name="level"
        mapProps={({ form: { setValue } }) => ({
          onLevelSelect: (levelId: number) => {
            setValue("level", levelId, {
              shouldValidate: true,
              shouldDirty: true,
            });
          },
        })}
      >
        <LevelSelector
          fieldIdPrefix={formId}
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
