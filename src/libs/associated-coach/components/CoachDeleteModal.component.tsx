import React from 'react';

import DeleteDialogWithCheck from '#src/components/DeleteDialogWithCheckDEPRECATED.component';

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
      deleteObject={onDeleteCoach}
      idToDelete={coachToDeleteId}
      onClose={onClose}
      trad="coach"
    />
  );
};

export default CoachDeleteModal;
