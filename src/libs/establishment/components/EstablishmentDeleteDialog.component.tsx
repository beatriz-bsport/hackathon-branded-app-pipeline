import React from 'react';

import { AxiosResponse } from 'axios';
import DeleteDialogWithCheck from '../../../components/DeleteDialogWithCheck.component';

type Props = {
  establishmentId?: number;
  onClose: () => void;
  deleteEstablishment: (id: number) => void;
  canDeleteEstablishmentChecker: (
    id: number,
  ) => Promise<AxiosResponse<{ can_destroy: boolean }>>;
};

export const EstablishmentDeleteDialog = (props: Props) => (
  <DeleteDialogWithCheck
    checkCanDeleteObjectAPI={props.canDeleteEstablishmentChecker}
    deleteObject={() => props.deleteEstablishment(props.establishmentId)}
    idToDelete={props.establishmentId}
    onClose={props.onClose}
    trad="establishment"
  />
);

export default EstablishmentDeleteDialog;
