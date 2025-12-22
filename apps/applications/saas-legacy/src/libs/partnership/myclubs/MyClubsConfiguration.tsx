import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PartnershipConfigurationPanel from '#src/libs/partnership/components/PartnershipConfigurationPanel';
import {
  PartnershipIdentifier,
  PartnershipVenue,
} from '#src/libs/partnership/types';
import {
  useCreatePartnershipVenue,
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

type Props = {
  establishments: Establishment[];
  myClubsPartnershipId: number;
  showSnackbarSuccess: (message: string) => void;
  showSnackbarError: (message: string) => void;
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

  const [createdVenue, setCreatedVenue] = useState<PartnershipVenue | null>(
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

  const openConfigurationDialog = useCallback(() => {
    setIsConfigurationDialogOpen(true);
    setCreatedVenue(null);
  }, []);
  const closeConfigurationDialog = useCallback(() => {
    setIsConfigurationDialogOpen(false);
    setCreatedVenue(null);
  }, []);

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
    if (showSnackbarError && createActionState.error) {
      showSnackbarError(
        t('myclubs.configuration.dialog.notification.create.error'),
      );
    }
  }, [createActionState.error, showSnackbarError, t]);

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
        onDeleteVenue={() => alert('Coming soon!')}
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
    </>
  );
};

export default connect(null, {
  showSnackbarSuccess: snackbarSuccess,
  showSnackbarError: snackbarError,
})(React.memo(MyClubsConfiguration));
