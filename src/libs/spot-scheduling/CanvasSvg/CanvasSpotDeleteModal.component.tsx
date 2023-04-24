// @ts-nocheck
import React from 'react';

import DeleteDialogWithCheck from '#components/DeleteDialogWithCheck.component';

type Props = {
  spotTypeToDeleteId?: number;
  onClose: () => void;
  deleteSpotType: (id: number) => void;
};

export const CanvasSpotDeleteModal: React.FC<Props> = ({
  spotTypeToDeleteId,
  onClose,
  deleteSpotType,
}) => {
  const onDeleteSpotType = () => deleteSpotType(spotTypeToDeleteId);

  return (
    <DeleteDialogWithCheck
      idToDelete={spotTypeToDeleteId}
      onClose={onClose}
      deleteObject={onDeleteSpotType}
      trad="spotScheduling"
    />
  );
};

export default CanvasSpotDeleteModal;
