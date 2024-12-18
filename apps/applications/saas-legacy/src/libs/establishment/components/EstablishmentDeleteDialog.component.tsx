import React from 'react';

import DeleteObjectModal from '#src/libs/delete-object/components/DeleteObjectModal.component';
import { DeleteObjectVariant } from '#src/libs/delete-object/types';

type Props = {
  establishmentId?: number;
  onClose: () => void;
};

export const EstablishmentDeleteDialog = (props: Props) => (
  <DeleteObjectModal
    idToCheckAndDelete={props.establishmentId}
    onClose={props.onClose}
    variant={DeleteObjectVariant.ESTABLISHMENT}
  />
);

export default EstablishmentDeleteDialog;
