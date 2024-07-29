import React from 'react';

import WellhubConfigurationDialog, {
  WellhubConfigurationFormValues,
} from '#src/libs/wellhub/components/WellhubConfigurationDialog';
import WellhubConfigurationPanel from '#src/libs/wellhub/components/WellhubConfigurationPanel';
import WellhubWarningUnlinkDialog from '#src/libs/wellhub/components/WellhubWarningUnlinkDialog';

import type { WellhubGym } from '#src/libs/wellhub/types';

type Props = {};

const WellhubConfiguration: React.FC<Props> = () => {
  // --------- WellhubConfigurationPanel ---------

  const [wellhubGymToEdit, setWellhubGymToEdit] =
    React.useState<WellhubGym | null>(null);

  const [wellhubGymToDelete, setWellhubGymToDelete] =
    React.useState<WellhubGym | null>(null);

  const handleAddWellhubGym = React.useCallback(() => {
    setIsConfigurationDialogOpen(true);
  }, []);

  const handleEditWellhubGym = React.useCallback((wellhubGym: WellhubGym) => {
    setIsConfigurationDialogOpen(true);
    setWellhubGymToEdit(wellhubGym);
  }, []);

  const handleDeleteWellhubGym = React.useCallback((wellhubGym: WellhubGym) => {
    setIsWarningUnlinkDialogOpen(true);
    setWellhubGymToDelete(wellhubGym);
  }, []);

  // --------- WellhubConfigurationDialog ---------

  const [isConfigurationDialogOpen, setIsConfigurationDialogOpen] =
    React.useState(false);

  const resetWellhubGymToEdit = React.useCallback(
    /** When the dialog closes, MUI applies a 300ms fade-out transition.
     * To prevent resetting the data before the dialog fully disappears,
     * we add a 300ms timeout for the data reset.
     * This ensures a smooth visual experience. */
    () => setTimeout(() => setWellhubGymToEdit(null), 300),
    [],
  );

  const handleCloseConfigurationDialog = React.useCallback(() => {
    setIsConfigurationDialogOpen(false);
    resetWellhubGymToEdit();
  }, [resetWellhubGymToEdit]);

  const handleSaveConfiguration = React.useCallback(
    (values: WellhubConfigurationFormValues) => {
      if (wellhubGymToEdit) {
        setIsWarningUnlinkDialogOpen(true);
        setConfigurationFormValues(values);
      } else {
        setIsConfigurationDialogOpen(false);
      }
    },
    [wellhubGymToEdit],
  );

  const establishmentIds = React.useMemo(
    () =>
      wellhubGymToEdit?.establishments?.map(
        (establishment) => establishment?.id,
      ) || [],
    [wellhubGymToEdit?.establishments],
  );

  // --------- WellhubWarningUnlinkDialog ---------

  const [isWarningUnlinkDialogOpen, setIsWarningUnlinkDialogOpen] =
    React.useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [configurationFormValues, setConfigurationFormValues] =
    React.useState<WellhubConfigurationFormValues | null>(null);

  const handleConfirmUnlinkEstablishment = React.useCallback(() => {
    // Submit configurationFormValues here
    setIsWarningUnlinkDialogOpen(false);
    setIsConfigurationDialogOpen(false);
    resetWellhubGymToEdit();
  }, [resetWellhubGymToEdit]);

  const handleGoBackToConfigurationDialog = React.useCallback(() => {
    setIsWarningUnlinkDialogOpen(false);
    setIsConfigurationDialogOpen(true);
  }, []);

  const handleCloseWarningUnlinkDialog = React.useCallback(() => {
    setIsWarningUnlinkDialogOpen(false);
    resetWellhubGymToEdit();
  }, [resetWellhubGymToEdit]);

  return (
    <>
      <WellhubConfigurationPanel
        deleteWellhubGym={handleDeleteWellhubGym}
        editWellhubGym={handleEditWellhubGym}
        handleAddUnit={handleAddWellhubGym}
      />
      <WellhubConfigurationDialog
        establishmentIds={establishmentIds}
        isCreation={!wellhubGymToEdit}
        isOpen={isConfigurationDialogOpen}
        onClose={handleCloseConfigurationDialog}
        onSubmit={handleSaveConfiguration}
        unitId={wellhubGymToEdit?.gym_id || null}
      />
      <WellhubWarningUnlinkDialog
        goBack={handleGoBackToConfigurationDialog}
        isDeletion={!!wellhubGymToDelete && !wellhubGymToEdit}
        isOpen={isWarningUnlinkDialogOpen}
        onClose={handleCloseWarningUnlinkDialog}
        onConfirm={handleConfirmUnlinkEstablishment}
      />
    </>
  );
};

export default React.memo(WellhubConfiguration);
