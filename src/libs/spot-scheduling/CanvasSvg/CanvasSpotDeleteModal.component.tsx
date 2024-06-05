import React from 'react';

import DeleteDialogWithCheck from '#src/components/DeleteDialogWithCheck.component';

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
      deleteObject={onDeleteSpotType}
      idToDelete={spotTypeToDeleteId}
      onClose={onClose}
      trad="spotScheduling"
    />
  );
};

export default CanvasSpotDeleteModal;
