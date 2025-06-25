import { useCallback, useState } from "react";

export const useImportLeadsModal = () => {
  const [openImportLeadsModal, setOpenImportLeadsModal] = useState(false);

  const handleOpenImportLeads = useCallback(() => {
    setOpenImportLeadsModal(true);
  }, []);

  const handleCloseImportLeads = useCallback(() => {
    setOpenImportLeadsModal(false);
  }, []);

  return {
    handleCloseImportLeads,
    handleOpenImportLeads,
    openImportLeadsModal,
  };
};
