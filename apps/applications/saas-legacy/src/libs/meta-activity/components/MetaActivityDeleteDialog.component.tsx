import React from 'react';

import DeleteDialogWithCheck from '../../../components/DeleteDialogWithCheckDEPRECATED.component';

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
    checkCanDeleteObjectAPI={props.canDeleteMetaActivityChecker}
    deleteObject={() => props.deleteMetaActivity(props.metaActivityId)}
    idToDelete={props.metaActivityId}
    onClose={props.onClose}
    trad="metaActivity"
  />
);

export default MetaActivityDeleteDialog;
