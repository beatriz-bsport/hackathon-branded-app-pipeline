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
    idToDelete={props.establishmentId}
    onClose={props.onClose}
    deleteObject={() => props.deleteEstablishment(props.establishmentId)}
    checkCanDeleteObjectAPI={props.canDeleteEstablishmentChecker}
    trad="establishment"
  />
);

export default EstablishmentDeleteDialog;
