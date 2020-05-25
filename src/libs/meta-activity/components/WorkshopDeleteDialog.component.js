// @flow
import React from 'react';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import DeleteDialogWithCheck from '../../../components/DeleteDialogWithCheck.component';

type Props = {
  t: TFunction,
  workshopId: ?number,
  onClose: () => void,
  canDeleteWorkshopChecker: (id: number) => Promise<void>,
  deleteWorkshop: () => void,
};

export const WorkshopDeleteDialog = (props: Props) => (
  <DeleteDialogWithCheck
    idToDelete={props.workshopId}
    onClose={props.onClose}
    checkCanDeleteObjectAPI={props.canDeleteWorkshopChecker}
    deleteObject={() => props.deleteWorkshop(props.workshopId)}
    t={props.t}
  />
);

export default withTranslation(['workshop'])(WorkshopDeleteDialog);
