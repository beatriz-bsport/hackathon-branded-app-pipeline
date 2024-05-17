import React from 'react';

import DeleteDialogWithCheck from '../../../components/DeleteDialogWithCheck.component';

type Props = {
  workshopId?: number;
  onClose: () => void;
  canDeleteWorkshopChecker: (
    id: number,
  ) => Promise<{ data: { can_destroy: boolean } }>;
  deleteWorkshop: (id: number) => void;
};

export const WorkshopDeleteDialog = (props: Props) => (
  <DeleteDialogWithCheck
    checkCanDeleteObjectAPI={props.canDeleteWorkshopChecker}
    deleteObject={() => props.deleteWorkshop(props.workshopId)}
    idToDelete={props.workshopId}
    onClose={props.onClose}
    trad="workshop"
  />
);

export default WorkshopDeleteDialog;
