import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PartnershipConfigurationPanel from '#src/libs/partnership/components/PartnershipConfigurationPanel';
import {
  PartnershipIdentifier,
  PartnershipVenue,
} from '#src/libs/partnership/types';
import {
  useCreatePartnershipVenue,
  useDeletePartnershipVenue,
  useGetPartnershipVenues,
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

const computeWarningDialogKeys = (): PartnershipWarningDialogTextProps => ({
  title: 'myclubs.configuration.dialog.title.deletion',
  alertTitle: 'myclubs.configuration.dialog.unlink.title',
  alertContent: 'myclubs.configuration.dialog.unlink.content',
  confirmAction: 'myclubs.configuration.dialog.action.confirm',
  cancelAction: 'myclubs.configuration.dialog.action.cancel',
});

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

  const [createdVenue, setCreatedVenue] = useState<PartnershipVenue | null>(
    null,
  );
  const [selectVenue, setSelectedVenue] = useState<PartnershipVenue | null>(
    null,
  );

  const establishmentsLinkedIds = useMemo(
    () =>
      partnershipVenues
        ? partnershipVenues.flatMap((venue) =>
            venue.establishments.map((establishment) => establishment.id),
          )
        : [],
    [partnershipVenues],
  );

  const [isConfigurationDialogOpen, setIsConfigurationDialogOpen] =
    useState(false);
  const [isWarningDialogOpen, setIsWarningDialogOpen] = useState(false);

  const warningDialogKeys = useMemo(computeWarningDialogKeys, []);
  const openConfigurationDialog = useCallback(() => {
    setIsConfigurationDialogOpen(true);
    setCreatedVenue(null);
  }, []);
  const closeConfigurationDialog = useCallback(() => {
    setIsConfigurationDialogOpen(false);
    setCreatedVenue(null);
  }, []);

  const openWarningDialog = useCallback(() => {
    setIsWarningDialogOpen(true);
  }, []);

  const closeWarningDialog = useCallback(() => {
    setIsWarningDialogOpen(false);
  }, []);

  const cancelWarningDialog = useCallback(() => {
    closeWarningDialog();
  }, [closeWarningDialog, openConfigurationDialog]);

  const handleDeleteVenue = useCallback((venue: PartnershipVenue) => {
    setSelectedVenue(venue);
    openWarningDialog();
  }, []);

  const doDeleteVenue = useCallback(async () => {
    if (selectVenue == null) return;
    await deletePartnershipVenue(selectVenue.id);
    setSelectedVenue(null);
    fetchPartnershipVenues();
    showSnackbarSuccess(
      t('myclubs.configuration.dialog.notification.delete.success'),
    );
    closeWarningDialog();
  }, [
    selectVenue,
    deletePartnershipVenue,
    fetchPartnershipVenues,
    showSnackbarSuccess,
    closeWarningDialog,
    t,
  ]);

  const handleFormSubmit = useCallback(
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
  }, [createActionState.error, deleteActionState.error, showSnackbarError, t]);

  useEffect(() => {
    fetchPartnershipVenues();
  }, [myClubsPartnershipId, fetchPartnershipVenues]);

  return (
    <>
      <PartnershipConfigurationPanel
        displayConfig={{
          partnershipIdentifier: PartnershipIdentifier.MYCLUBS,
          icon: <MyClubsLogoIcon />,
          showCopyIdToClipboard: true,
        }}
        loading={fetchVenuesLoading}
        onAddConnection={openConfigurationDialog}
        onDeleteVenue={handleDeleteVenue}
        onEditVenue={() => alert('Coming soon!')}
        partnershipVenues={partnershipVenues ?? []}
      />
      <PartnershipConfigurationDialog
        establishmentIds={[]} /* TODO: update this when edit is implemented */
        establishmentIdsLinked={establishmentsLinkedIds}
        establishments={establishments}
        externalId={createdVenue?.external_id || ''}
        isCreation={true}
        isLoading={createActionState.loading}
        isOpen={isConfigurationDialogOpen}
        onClose={closeConfigurationDialog}
        onSubmit={handleFormSubmit}
        partnershipIdentifier={PartnershipIdentifier.MYCLUBS}
      />
      <PartnershipWarningDialog
        isOpen={isWarningDialogOpen}
        onCancel={cancelWarningDialog}
        onClose={closeWarningDialog}
        onConfirm={doDeleteVenue}
        textContentKeys={warningDialogKeys}
      />
    </>
  );
};

export default connect(null, {
  showSnackbarSuccess: snackbarSuccess,
  showSnackbarError: snackbarError,
})(React.memo(MyClubsConfiguration));
