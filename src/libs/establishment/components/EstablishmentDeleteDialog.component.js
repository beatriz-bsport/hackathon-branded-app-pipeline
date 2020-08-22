// @flow
import React from 'react';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import DeleteDialogWithCheck from '../../../components/DeleteDialogWithCheck.component';

type Props = {
  t: TFunction,
  establishmentId: ?number,
  onClose: () => void,
  deleteEstablishment: () => void,
};

export const EstablishmentDeleteDialog = (props: Props) => (
  <DeleteDialogWithCheck
    idToDelete={props.establishmentId}
    onClose={props.onClose}
    deleteObject={() => props.deleteEstablishment(props.establishmentId)}
    t={props.t}
  />
);

export default withTranslation(['establishment'])(EstablishmentDeleteDialog);
