// @flow
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
    idToDelete={props.workshopId}
    onClose={props.onClose}
    checkCanDeleteObjectAPI={props.canDeleteWorkshopChecker}
    deleteObject={() => props.deleteWorkshop(props.workshopId)}
    trad="workshop"
  />
);

export default WorkshopDeleteDialog;
