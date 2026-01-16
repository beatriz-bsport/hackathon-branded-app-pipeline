import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PartnershipConfigurationPanel from '#src/libs/partnership/components/PartnershipConfigurationPanel';
import {
  PartnershipIdentifier,
  PartnershipVenue,
} from '#src/libs/partnership/types';
import {
  useCreatePartnershipVenue,
  useDeletePartnershipVenue,
  useUpdatePartnershipVenue,
  useGetPartnershipVenues,
  useActivatePartnershipVenue,
} from '#src/libs/partnership/hooks';
import MyClubsLogoIcon from '#src/components/icons/MyClubsLogoIcon.component';
import { Establishment } from '#src/libs/establishment/types';
import PartnershipConfigurationDialog from '#src/libs/partnership/myclubs/components/MyClubsConfigurationDialog';
import { FormValues } from './components/MyClubsConfigurationDialog/MyClubsConfigurationDialog.component';
import { connect } from 'react-redux';
import { snackbarSuccess } from '#src/libs/snackbar/actions';
import { snackbarError } from '#src/actions/snackbar.actions';
import { useTranslation } from 'react-i18next';
import PartnershipWarningDialog from '#src/libs/partnership/components/PartnershipWarningDialog';
import { PartnershipWarningDialogTextProps } from '#src/libs/partnership/components/PartnershipWarningDialog/PartnershipWarningDialog.component';

type Props = {
  establishments: Establishment[];
  myClubsPartnershipId: number;
  showSnackbarSuccess: (message: string) => void;
  showSnackbarError: (message: string) => void;
};

const computeWarningDialogKeys = (
  isEdit: boolean = false,
  isActivate: boolean = false,
): PartnershipWarningDialogTextProps => {
  if (isActivate) {
    return {
      title: 'myclubs.configuration.dialog.activate.title',
      subtitle: 'myclubs.configuration.dialog.activate.subtitle',
      alertContent: 'myclubs.configuration.dialog.activate.content',
      confirmAction: 'myclubs.configuration.dialog.action.reactivate',
      cancelAction: 'myclubs.configuration.dialog.action.cancel',
    };
  }

  return {
    title: isEdit
      ? 'myclubs.configuration.dialog.title.edition'
      : 'myclubs.configuration.dialog.title.deletion',
    subtitle: 'myclubs.configuration.dialog.unlink.title',
    alertContent: 'myclubs.configuration.dialog.unlink.content',
    confirmAction: 'myclubs.configuration.dialog.action.confirm',
    cancelAction: 'myclubs.configuration.dialog.action.cancel',
  };
};

const MyClubsConfiguration: React.FC<Props> = ({
  establishments,
  myClubsPartnershipId,
  showSnackbarSuccess,
  showSnackbarError,
}) => {
  const { t } = useTranslation('partnership');

  const [
    { loading: fetchVenuesLoading, value: partnershipVenues },
    fetchPartnershipVenues,
  ] = useGetPartnershipVenues(myClubsPartnershipId);
  const [createActionState, createPartnershipVenue] =
    useCreatePartnershipVenue(myClubsPartnershipId);
  const [deleteActionState, deletePartnershipVenue] =
    useDeletePartnershipVenue();
  const [updateActionState, updatePartnershipVenue] =
    useUpdatePartnershipVenue(myClubsPartnershipId);
  const [activateActionState, activatePartnershipVenue] =
    useActivatePartnershipVenue();

  const [createdVenue, setCreatedVenue] = useState<PartnershipVenue | null>(
    null,
  );
  const [selectedVenueToEdit, setSelectedVenueToEdit] =
    useState<PartnershipVenue | null>(null);
  const [selectedVenueToActivate, setSelectedVenueToActivate] =
    useState<PartnershipVenue | null>(null);

  const warningDialogKeys = useMemo(
    () =>
      computeWarningDialogKeys(
        selectedVenueToEdit !== null,
        selectedVenueToActivate !== null,
      ),
    [selectedVenueToEdit, selectedVenueToActivate],
  );
  useEffect(() => {
    fetchPartnershipVenues();
  }, [myClubsPartnershipId, fetchPartnershipVenues]);

  // The list of establishment IDs linked to the venue being edited
  const selectedEstablishmentIds = useMemo(
    () =>
      selectedVenueToEdit?.establishments.map(
        (establishment) => establishment.id,
      ) || [],
    [selectedVenueToEdit],
  );

  // The list of establishment IDs already linked to other venues
  // These ids will be disabled in the establishment selector
  const establishmentsLinkedIds = useMemo(
    () =>
      partnershipVenues
        ? partnershipVenues.flatMap((venue) =>
            venue.establishments.map((establishment) => establishment.id),
          )
        : [],
    [partnershipVenues],
  );

  /* Configuration Dialog */
  const [isConfigurationDialogOpen, setIsConfigurationDialogOpen] =
    useState(false);

  const openConfigurationDialog = useCallback(() => {
    setIsConfigurationDialogOpen(true);
    setCreatedVenue(null);
  }, []);
  const closeConfigurationDialog = useCallback((reset: boolean = true) => {
    setIsConfigurationDialogOpen(false);
    if (reset) {
      // Material applies a 300ms fade out animation on dialog close
      // Wait before resetting to prevent its style from changing before closing
      setTimeout(() => {
        setSelectedVenueToEdit(null);
        setCreatedVenue(null);
      }, 300);
    }
  }, []);

  /* Warning Dialog */
  const [isWarningDialogOpen, setIsWarningDialogOpen] = useState(false);
  const [warningOnConfirmCallback, setWarningOnConfirmCallback] = useState<
    (() => void) | undefined
  >();
  const [warningOnCancelCallback, setWarningOnCancelCallback] = useState<
    (() => void) | undefined
  >();

  const openWarningDialog = useCallback(
    (onConfirm?: () => void, onCancel?: () => void) => {
      setIsWarningDialogOpen(true);
      setWarningOnConfirmCallback(() => onConfirm);
      setWarningOnCancelCallback(() => onCancel);
    },
    [],
  );

  const closeWarningDialog = useCallback(() => {
    setIsWarningDialogOpen(false);
    setWarningOnConfirmCallback(undefined);
    setWarningOnCancelCallback(undefined);
  }, []);

  /* Action Handlers */

  // DELETE: Remove partnership venue
  const deleteVenue = useCallback(
    async (venue: PartnershipVenue) => {
      await deletePartnershipVenue(venue.id);
      fetchPartnershipVenues();
      showSnackbarSuccess(
        t('myclubs.configuration.dialog.notification.delete.success'),
      );
      closeWarningDialog();
    },
    [
      deletePartnershipVenue,
      fetchPartnershipVenues,
      showSnackbarSuccess,
      closeWarningDialog,
      t,
    ],
  );

  // EDIT: Update partnership venue
  const updateVenue = useCallback(
    async (values: FormValues) => {
      if (!selectedVenueToEdit) return;

      // Check if any establishments were removed
      const removedEstablishments = selectedEstablishmentIds.filter(
        (id) => !values.establishmentIds.includes(id),
      );

      if (removedEstablishments.length > 0) {
        // Show warning dialog for confirmation before removing establishments
        closeConfigurationDialog(false);
        openWarningDialog(
          async () => {
            await updatePartnershipVenue(selectedVenueToEdit.id, values);
            fetchPartnershipVenues();
            showSnackbarSuccess(
              t('myclubs.configuration.dialog.notification.update.success'),
            );
            // Material applies a 300ms fade out animation on dialog close
            // Wait before resetting to prevent its style from changing before closing
            setTimeout(() => setSelectedVenueToEdit(null), 300);
            closeWarningDialog();
          },
          () => {
            // Reopen configuration dialog on cancel
            closeWarningDialog();
            setSelectedVenueToEdit(selectedVenueToEdit);
            openConfigurationDialog();
          },
        );
        return;
      }

      await updatePartnershipVenue(selectedVenueToEdit.id, values);
      closeConfigurationDialog();
      fetchPartnershipVenues();
      showSnackbarSuccess(
        t('myclubs.configuration.dialog.notification.update.success'),
      );
    },
    [
      selectedVenueToEdit,
      selectedEstablishmentIds,
      updatePartnershipVenue,
      closeConfigurationDialog,
      fetchPartnershipVenues,
      showSnackbarSuccess,
      t,
      openWarningDialog,
      closeWarningDialog,
      openConfigurationDialog,
    ],
  );

  // CREATE: Add new partnership venue
  const createVenue = useCallback(
    async (values: FormValues) => {
      const createdValue = await createPartnershipVenue(values);
      if (createdValue) {
        setCreatedVenue(createdValue);
        fetchPartnershipVenues();
        showSnackbarSuccess(
          t('myclubs.configuration.dialog.notification.create.success'),
        );
      }
    },
    [createPartnershipVenue, fetchPartnershipVenues, showSnackbarSuccess, t],
  );

  // ACTIVATE: Activate a disabled partnership venue
  const activateVenue = useCallback(
    async (venue: PartnershipVenue) => {
      await activatePartnershipVenue(venue.id);
      fetchPartnershipVenues();
      showSnackbarSuccess(
        t('myclubs.configuration.dialog.notification.activate.success'),
      );
      closeWarningDialog();
      // Material applies a 300ms fade out animation on dialog close
      // Wait before resetting to prevent its style from changing before closing
      setTimeout(() => setSelectedVenueToActivate(null), 300);
    },
    [
      activatePartnershipVenue,
      fetchPartnershipVenues,
      showSnackbarSuccess,
      closeWarningDialog,
      t,
    ],
  );

  const handleActivateVenue = useCallback(
    (venue: PartnershipVenue) => {
      setSelectedVenueToActivate(venue);
      openWarningDialog(
        () => {
          activateVenue(venue);
        },
        () => {
          closeWarningDialog();
          setSelectedVenueToActivate(null);
        },
      );
    },
    [activateVenue, openWarningDialog, closeWarningDialog],
  );

  const handleDeleteVenue = useCallback(
    (venue: PartnershipVenue) => {
      openWarningDialog(() => deleteVenue(venue));
    },
    [deleteVenue, openWarningDialog],
  );

  const handleEditVenue = useCallback(
    (venue: PartnershipVenue) => {
      setSelectedVenueToEdit(venue);
      openConfigurationDialog();
    },
    [openConfigurationDialog],
  );

  const handleFormSubmit = useCallback(
    async (values: FormValues) => {
      if (selectedVenueToEdit) {
        await updateVenue(values);
      } else {
        await createVenue(values);
      }
    },
    [selectedVenueToEdit, updateVenue, createVenue],
  );

  /* Error management */
  useEffect(() => {
    if (!showSnackbarError) return;

    if (createActionState.error) {
      showSnackbarError(
        t('myclubs.configuration.dialog.notification.create.error'),
      );
    }

    if (deleteActionState.error) {
      showSnackbarError(
        t('myclubs.configuration.dialog.notification.delete.error'),
      );
    }

    if (updateActionState.error) {
      showSnackbarError(
        t('myclubs.configuration.dialog.notification.update.error'),
      );
    }
    if (activateActionState.error) {
      showSnackbarError(
        t('myclubs.configuration.dialog.notification.activate.error'),
      );
    }
  }, [
    createActionState.error,
    deleteActionState.error,
    updateActionState.error,
    activateActionState.error,
    showSnackbarError,
    t,
  ]);

  return (
    <>
      <PartnershipConfigurationPanel
        displayConfig={{
          partnershipIdentifier: PartnershipIdentifier.MYCLUBS,
          icon: <MyClubsLogoIcon />,
          showCopyIdToClipboard: true,
        }}
        loading={fetchVenuesLoading}
        onActivateVenue={handleActivateVenue}
        onAddConnection={openConfigurationDialog}
        onDeleteVenue={handleDeleteVenue}
        onEditVenue={handleEditVenue}
        partnershipVenues={partnershipVenues ?? []}
      />
      <PartnershipConfigurationDialog
        establishmentIds={selectedEstablishmentIds}
        establishmentIdsLinked={establishmentsLinkedIds}
        establishments={establishments}
        externalId={
          createdVenue?.external_id || selectedVenueToEdit?.external_id || ''
        }
        isCreation={selectedVenueToEdit == null}
        isLoading={createActionState.loading || updateActionState.loading}
        isOpen={isConfigurationDialogOpen}
        onClose={closeConfigurationDialog}
        onSubmit={handleFormSubmit}
        partnershipIdentifier={PartnershipIdentifier.MYCLUBS}
      />
      <PartnershipWarningDialog
        dialogType={selectedVenueToActivate ? 'info' : 'error'}
        isOpen={isWarningDialogOpen}
        onCancel={warningOnCancelCallback ?? closeWarningDialog}
        onClose={closeWarningDialog}
        onConfirm={warningOnConfirmCallback}
        textContentKeys={warningDialogKeys}
      />
    </>
  );
};

export default connect(null, {
  showSnackbarSuccess: snackbarSuccess,
  showSnackbarError: snackbarError,
})(React.memo(MyClubsConfiguration));
