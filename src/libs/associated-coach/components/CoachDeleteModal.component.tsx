// @ts-nocheck
import React from 'react';

import DeleteDialogWithCheck from '#components/DeleteDialogWithCheck.component';

type Props = {
  coachToDeleteId?: number;
  onClose: () => void;
  deleteCoach: (id: number) => void;
};

export const CoachDeleteModal: React.FC<Props> = ({
  coachToDeleteId,
  onClose,
  deleteCoach,
}) => {
  const onDeleteCoach = () => deleteCoach(coachToDeleteId);

  return (
    <DeleteDialogWithCheck
      idToDelete={coachToDeleteId}
      onClose={onClose}
      deleteObject={onDeleteCoach}
      trad="coach"
    />
  );
};

export default CoachDeleteModal;
