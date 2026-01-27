import React from 'react';
import uniq from 'lodash/uniq';

import WellhubConfigurationDialog, {
  WellhubConfigurationFormValues,
} from '#src/libs/wellhub/components/WellhubConfigurationDialog';
import WellhubWarningUnlinkDialog from '#src/libs/wellhub/components/WellhubWarningUnlinkDialog';

import type {
  GymAvailabilityResponse,
  WellhubGym,
} from '#src/libs/wellhub/types';
import type { Establishment } from '#src/libs/establishment/types';
import WellhubIcon from '#src/components/icons/WellhubIcon.component';
import PartnershipConfigurationPanel from '#src/libs/partnership/components/PartnershipConfigurationPanel';
import {
  PartnershipIdentifier,
  PartnershipAccount,
} from '#src/libs/partnership/types';
import { mapWellhubGymsToPartnershipAccounts } from '#src/libs/wellhub/mapper';
import WellhubProductAlert from '#src/libs/wellhub/components/WellhubProductAlert';

type Props = {
  establishments: Establishment[];
  offersMissingWellhubProductCount: number;
  wellhubGymAvailabilityError: Error | null;
  wellhubGymAvailabilityLoading: boolean;
  wellhubGyms: WellhubGym[];
  wellhubLoading: boolean;
  checkAvailability: (gymId: number) => void;
  createWellhubGym: (gymId: number, establishmentIds: number[]) => void;
  deleteWellhubGym: (wellhubGymUuid: string) => void;
  getWellhubGymAvailability: (gymId: number) => GymAvailabilityResponse;
  openWellhubProductSelectionDrawer: () => void;
  updateWellhubGym: (
    wellhubGym: WellhubGym,
    establishmentIds: number[],
  ) => void;
};

const WellhubConfiguration: React.FC<Props> = ({
  establishments,
  offersMissingWellhubProductCount,
  wellhubGymAvailabilityError,
  wellhubGymAvailabilityLoading,
  wellhubGyms,
  wellhubLoading,
  checkAvailability,
  createWellhubGym,
  deleteWellhubGym,
  getWellhubGymAvailability,
  openWellhubProductSelectionDrawer,
  updateWellhubGym,
}) => {
  // --------- WellhubConfigurationPanel ---------

  const [wellhubGymToEdit, setWellhubGymToEdit] =
    React.useState<WellhubGym | null>(null);

  const resetWellhubGymToEdit = React.useCallback(
    /** When the dialog closes, MUI applies a 300ms fade-out transition.
     * To prevent resetting the data before the dialog fully disappears,
     * we add a 300ms timeout for the data reset.
     * This ensures a smooth visual experience. */
    () => setTimeout(() => setWellhubGymToEdit(null), 300),
    [],
  );

  const openConfigurationDialog = React.useCallback(() => {
    setIsConfigurationDialogOpen(true);
    setIsConfigurationDialogInDOM(true);
  }, []);

  const openWarningUnlinkDialog = React.useCallback(() => {
    setIsWarningUnlinkDialogOpen(true);
    setIsWarningUnlinkDialogInDOM(true);
  }, []);

  const [wellhubGymToDelete, setWellhubGymToDelete] =
    React.useState<WellhubGym | null>(null);

  const handleEditWellhubGym = React.useCallback(
    (partnershipAccount: PartnershipAccount) => {
      openConfigurationDialog();
      setWellhubGymToEdit(partnershipAccount.legacyObject as WellhubGym);
    },
    [openConfigurationDialog],
  );

  const handleDeleteWellhubGym = React.useCallback(
    (partnershipAccount: PartnershipAccount) => {
      openWarningUnlinkDialog();
      setWellhubGymToDelete(partnershipAccount.legacyObject as WellhubGym);
    },
    [openWarningUnlinkDialog],
  );

  const wellhubPartnershipAccounts = React.useMemo(
    () => mapWellhubGymsToPartnershipAccounts(wellhubGyms),
    [wellhubGyms],
  );

  // --------- WellhubConfigurationDialog ---------

  const [isConfigurationDialogOpen, setIsConfigurationDialogOpen] =
    React.useState(false);
  const [isConfigurationDialogInDOM, setIsConfigurationDialogInDOM] =
    React.useState(false);

  /** List of establishment IDs linked to the Wellhub gym currently being edited. */
  const establishmentIds = React.useMemo(
    () =>
      wellhubGymToEdit?.establishments?.map(
        (establishment) => establishment?.id,
      ) || [],
    [wellhubGymToEdit?.establishments],
  );

  /** List of establishment IDs that are already linked to Wellhub gyms.
   *
   * This list is computed by iterating through all Wellhub gyms and collecting
   * the IDs of their associated establishments. */
  const establishmentIdsLinked = React.useMemo(
    () =>
      wellhubGyms.reduce<number[]>(
        (acc, currentWellhubGym) =>
          uniq([
            ...acc,
            ...currentWellhubGym.establishments.map((est) => est.id),
          ]),
        [],
      ),
    [wellhubGyms],
  );

  /** List of establishments that are not linked to any Wellhub gym. */
  const establishmentsNotLinked = React.useMemo(
    () =>
      establishments.filter(
        (establishment) => !establishmentIdsLinked.includes(establishment.id),
      ),
    [establishmentIdsLinked, establishments],
  );

  const closeConfigurationDialog = React.useCallback(() => {
    setIsConfigurationDialogOpen(false);
    setTimeout(() => setIsConfigurationDialogInDOM(false), 300);
  }, []);

  const handleCloseConfigurationDialog = React.useCallback(() => {
    closeConfigurationDialog();
    resetWellhubGymToEdit();
  }, [closeConfigurationDialog, resetWellhubGymToEdit]);

  const handleSaveConfiguration = React.useCallback(
    (values: WellhubConfigurationFormValues) => {
      if (wellhubGymToEdit) {
        const isEstablishmentMissing = establishmentIds.some(
          (establishmentId) =>
            !values.establishmentIds.includes(establishmentId),
        );
        if (isEstablishmentMissing) {
          openWarningUnlinkDialog();
          setConfigurationFormValues(values);
        } else {
          const sortedCurrentEstablishmentIds = [...establishmentIds].sort(
            (a, b) => a - b,
          );

          const sortedEditedEstablishmentIds = [
            ...values.establishmentIds,
          ].sort((a, b) => a - b);

          const hasChanged =
            sortedCurrentEstablishmentIds.length !==
              sortedEditedEstablishmentIds.length ||
            !sortedCurrentEstablishmentIds.every(
              (establishmentId, index) =>
                establishmentId === sortedEditedEstablishmentIds[index],
            );

          hasChanged &&
            updateWellhubGym(wellhubGymToEdit, values.establishmentIds);

          handleCloseConfigurationDialog();
        }
      } else {
        createWellhubGym(values.unitId, values.establishmentIds);
        handleCloseConfigurationDialog();
      }
    },
    [
      createWellhubGym,
      establishmentIds,
      handleCloseConfigurationDialog,
      openWarningUnlinkDialog,
      updateWellhubGym,
      wellhubGymToEdit,
    ],
  );

  // --------- WellhubWarningUnlinkDialog ---------

  const [isWarningUnlinkDialogOpen, setIsWarningUnlinkDialogOpen] =
    React.useState(false);
  const [isWarningUnlinkDialogInDOM, setIsWarningUnlinkDialogInDOM] =
    React.useState(false);

  const closeWarningUnlinkDialog = React.useCallback(() => {
    setIsWarningUnlinkDialogOpen(false);
    setTimeout(() => setIsWarningUnlinkDialogInDOM(false), 300);
  }, []);

  const [configurationFormValues, setConfigurationFormValues] =
    React.useState<WellhubConfigurationFormValues | null>(null);

  const handleConfirmUnlinkEstablishment = React.useCallback(() => {
    if (wellhubGymToEdit && configurationFormValues?.establishmentIds) {
      updateWellhubGym(
        wellhubGymToEdit,
        configurationFormValues.establishmentIds,
      );
    }
    if (wellhubGymToDelete) {
      deleteWellhubGym(wellhubGymToDelete.uuid);
    }
    closeWarningUnlinkDialog();
    handleCloseConfigurationDialog();
    setWellhubGymToDelete(null);
  }, [
    closeWarningUnlinkDialog,
    configurationFormValues?.establishmentIds,
    deleteWellhubGym,
    handleCloseConfigurationDialog,
    updateWellhubGym,
    wellhubGymToDelete,
    wellhubGymToEdit,
  ]);

  const handleGoBackToConfigurationDialog = React.useCallback(() => {
    closeWarningUnlinkDialog();
    openConfigurationDialog();
  }, [closeWarningUnlinkDialog, openConfigurationDialog]);

  const handleCloseWarningUnlinkDialog = React.useCallback(() => {
    closeWarningUnlinkDialog();
    handleCloseConfigurationDialog();
    setWellhubGymToDelete(null);
  }, [closeWarningUnlinkDialog, handleCloseConfigurationDialog]);

  return (
    <>
      <PartnershipConfigurationPanel
        addConnectionDisabled={establishmentsNotLinked?.length === 0}
        displayConfig={{
          partnershipIdentifier: PartnershipIdentifier.WELLHUB,
          icon: <WellhubIcon />,
          helperTextKey: 'wellhub.configuration.panel.content.helperText',
        }}
        loading={wellhubLoading}
        onAddConnection={openConfigurationDialog}
        onDeleteAccount={handleDeleteWellhubGym}
        onEditAccount={handleEditWellhubGym}
        partnershipAccounts={wellhubPartnershipAccounts}
        slots={{
          alert: (
            <WellhubProductAlert
              onActionClick={openWellhubProductSelectionDrawer}
              total={offersMissingWellhubProductCount}
            />
          ),
        }}
      />
      {isConfigurationDialogInDOM && (
        <WellhubConfigurationDialog
          checkAvailability={checkAvailability}
          establishmentIds={establishmentIds}
          establishmentIdsLinked={establishmentIdsLinked}
          establishments={establishments}
          getWellhubGymAvailability={getWellhubGymAvailability}
          isCreation={!wellhubGymToEdit}
          isOpen={isConfigurationDialogOpen}
          onClose={handleCloseConfigurationDialog}
          onSubmit={handleSaveConfiguration}
          unitId={wellhubGymToEdit?.gym_id || null}
          wellhubGymAvailabilityError={wellhubGymAvailabilityError}
          wellhubGymAvailabilityLoading={wellhubGymAvailabilityLoading}
        />
      )}
      {isWarningUnlinkDialogInDOM && (
        <WellhubWarningUnlinkDialog
          goBack={handleGoBackToConfigurationDialog}
          isDeletion={!!wellhubGymToDelete && !wellhubGymToEdit}
          isOpen={isWarningUnlinkDialogOpen}
          onClose={handleCloseWarningUnlinkDialog}
          onConfirm={handleConfirmUnlinkEstablishment}
        />
      )}
    </>
  );
};

export default React.memo(WellhubConfiguration);
