// @flow
import React from 'react';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import DeleteDialogWithCheck from '../../../components/DeleteDialogWithCheck.component';

type Props = {
  t: TFunction,
  establishmentId: ?number,
  onClose: () => void,
  canDeleteEstablishmentChecker: (id: number) => Promise<void>,
  deleteEstablishment: () => void,
};

export const EstablishmentDeleteDialog = (props: Props) => (
  <DeleteDialogWithCheck
    idToDelete={props.establishmentId}
    onClose={props.onClose}
    checkCanDeleteObjectAPI={props.canDeleteEstablishmentChecker}
    deleteObject={() => props.deleteEstablishment(props.establishmentId)}
    t={props.t}
  />
);

export default withNamespaces(['establishment'])(EstablishmentDeleteDialog);
