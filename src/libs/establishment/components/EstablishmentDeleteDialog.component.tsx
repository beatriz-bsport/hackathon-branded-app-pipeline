// @flow
import React from 'react';

import DeleteDialogWithCheck from '../../../components/DeleteDialogWithCheck.component';

type Props = {
  establishmentId?: number;
  onClose: () => void;
  deleteEstablishment: (id: number) => void;
};

export const EstablishmentDeleteDialog = (props: Props) => (
  <DeleteDialogWithCheck
    idToDelete={props.establishmentId}
    onClose={props.onClose}
    deleteObject={() => props.deleteEstablishment(props.establishmentId)}
    trad="establishment"
  />
);

export default EstablishmentDeleteDialog;
