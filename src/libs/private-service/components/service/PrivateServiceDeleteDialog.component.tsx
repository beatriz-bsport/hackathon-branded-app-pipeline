import React, { useCallback } from 'react';

import DeleteDialogWithCheck from '#components/DeleteDialogWithCheck.component';

type Props = {
  privateServiceToDeleteId?: number;
  onClose: () => void;
  deletePrivateService: (id: number) => void;
};

const PrivateServiceDeleteDialog: React.FC<Props> = ({
  privateServiceToDeleteId,
  onClose,
  deletePrivateService,
}) => {
  const onDeletePrivateService = useCallback(
    () => deletePrivateService(privateServiceToDeleteId),
    [deletePrivateService, privateServiceToDeleteId],
  );

  return (
    <DeleteDialogWithCheck
      deleteObject={onDeletePrivateService}
      idToDelete={privateServiceToDeleteId}
      onClose={onClose}
      trad="privateService"
    />
  );
};

export default React.memo(PrivateServiceDeleteDialog);
