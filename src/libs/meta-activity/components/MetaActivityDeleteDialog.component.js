// @flow
import React from 'react';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import DeleteDialogWithCheck from '../../../components/DeleteDialogWithCheck.component';

type Props = {
  t: TFunction,
  metaActivityId: ?number,
  onClose: () => void,
  canDeleteMetaActivityChecker: (id: number) => Promise<void>,
  deleteMetaActivity: () => void,
};

export const MetaActivityDeleteDialog = (props: Props) => (
  <DeleteDialogWithCheck
    idToDelete={props.metaActivityId}
    onClose={props.onClose}
    checkCanDeleteObjectAPI={props.canDeleteMetaActivityChecker}
    deleteObject={() => props.deleteMetaActivity(props.metaActivityId)}
    t={props.t}
  />
);

export default withTranslation(['metaActivity'])(MetaActivityDeleteDialog);
