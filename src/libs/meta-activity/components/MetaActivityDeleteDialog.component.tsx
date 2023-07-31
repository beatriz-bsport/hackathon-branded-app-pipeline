// @flow
import React from 'react';

import DeleteDialogWithCheck from '../../../components/DeleteDialogWithCheck.component';

type Props = {
  metaActivityId?: number;
  onClose: () => void;
  canDeleteMetaActivityChecker: (
    id: number,
  ) => Promise<{ data: { can_destroy: boolean } }>;
  deleteMetaActivity: (id: number) => void;
};

export const MetaActivityDeleteDialog = (props: Props) => (
  <DeleteDialogWithCheck
    idToDelete={props.metaActivityId}
    onClose={props.onClose}
    checkCanDeleteObjectAPI={props.canDeleteMetaActivityChecker}
    deleteObject={() => props.deleteMetaActivity(props.metaActivityId)}
    trad="metaActivity"
  />
);

export default MetaActivityDeleteDialog;
