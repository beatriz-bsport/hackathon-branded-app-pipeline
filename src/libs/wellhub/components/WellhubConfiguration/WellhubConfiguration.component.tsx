import React from 'react';

import WellhubConfigurationPanel from '#src/libs/wellhub/components/WellhubConfigurationPanel';
import WellhubConfigurationDialog from '#src/libs/wellhub/components/WellhubConfigurationDialog';

import type { WellhubGym } from '#src/libs/wellhub/types';

type Props = {};

const WellhubConfiguration: React.FC<Props> = () => {
  const [isConfigurationDialogOpen, setIsConfigurationDialogOpen] =
    React.useState(false);

  const [wellhubGymToEdit, setWellhubGymToEdit] =
    React.useState<WellhubGym | null>(null);

  const handleAddWellhubGym = React.useCallback(() => {
    setIsConfigurationDialogOpen(true);
  }, []);

  const handleEditWellhubGym = React.useCallback((wellhubGym: WellhubGym) => {
    setIsConfigurationDialogOpen(true);
    setWellhubGymToEdit(wellhubGym);
  }, []);

  const handleCloseConfigurationDialog = React.useCallback(() => {
    setIsConfigurationDialogOpen(false);
    setWellhubGymToEdit(null);
  }, []);

  return (
    <>
      <WellhubConfigurationPanel
        editWellhubGym={handleEditWellhubGym}
        handleAddUnit={handleAddWellhubGym}
      />
      <WellhubConfigurationDialog
        establishmentIDs={
          wellhubGymToEdit?.establishments?.map(
            (establishment) => establishment?.id,
          ) || []
        }
        isCreation={!wellhubGymToEdit}
        isOpen={isConfigurationDialogOpen}
        onClose={handleCloseConfigurationDialog}
        unitID={wellhubGymToEdit?.gym_id || null}
      />
    </>
  );
};

export default React.memo(WellhubConfiguration);
