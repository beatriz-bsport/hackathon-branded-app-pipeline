import { useCallback, useState } from "react";

import { fetchTemporaryPasswordAction } from "@bsport/store-auth";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

const _fetchTemporaryPassword = fetchTemporaryPasswordAction.bind(null, fetch);

export const useTemporaryPasswordDialog = () => {
  const [openDialog, setOpenDialog] = useState(false);

  const [{ isLoading }, fetchTemporaryPassword] = useAsync({
    asyncFn: _fetchTemporaryPassword,
  });

  const handleOpenTemporaryPasswordDialog = useCallback(() => {
    fetchTemporaryPassword();
    setOpenDialog(true);
  }, [fetchTemporaryPassword]);

  const handleCloseTemporaryPasswordDialog = useCallback(() => {
    setOpenDialog(false);
  }, []);

  return {
    isLoadingTemporaryPassword: isLoading,
    isTemporaryPasswordDialogOpen: openDialog,
    handleOpenTemporaryPasswordDialog,
    handleCloseTemporaryPasswordDialog,
  };
};
