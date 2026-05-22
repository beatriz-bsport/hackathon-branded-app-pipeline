import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import PartnershipConfigurationPanel from '#src/libs/partnership/components/PartnershipConfigurationPanel';
import PartnershipWarningDialog from '#src/libs/partnership/components/PartnershipWarningDialog';
import { PartnershipWarningDialogTextProps } from '#src/libs/partnership/components/PartnershipWarningDialog/PartnershipWarningDialog.component';
import {
  PartnershipIdentifier,
  PartnershipAccount,
} from '#src/libs/partnership/types';
import {
  useGetPartnershipAccounts,
  useUpdatePartnershipAccount,
} from '#src/libs/partnership/hooks';
import { snackbarSuccess } from '#src/libs/snackbar/actions';
import { snackbarError } from '#src/actions/snackbar.actions';

import type { Establishment } from '#src/libs/establishment/types';
import WellpassConfigurationDialog, {
  type WellpassConfigurationFormValues,
} from './components/WellpassConfigurationDialog/WellpassConfigurationDialog.component';
import { Typography } from '@material-ui/core';

type Props = {
  establishments: Establishment[];
  wellpassPartnershipId: number;
  showSnackbarSuccess: (message: string) => void;
  showSnackbarError: (message: string) => void;
};

const computeWarningDialogKeys = (): PartnershipWarningDialogTextProps => ({
  title: 'wellpass.configuration.dialog.title.edition',
  subtitle: 'wellpass.configuration.dialog.unlink.title',
  alertContent: 'wellpass.configuration.dialog.unlink.content',
  confirmAction: 'wellpass.configuration.dialog.action.confirm',
  cancelAction: 'wellpass.configuration.dialog.action.cancel',
});

const WellpassTitle = () => <Typography variant="h4">WELLPASS</Typography>;

const WellpassConfiguration: React.FC<Props> = ({
  establishments,
  wellpassPartnershipId,
  showSnackbarSuccess,
  showSnackbarError,
}) => {
  const { t } = useTranslation('partnership');

  const [
    { loading: fetchAccountsLoading, value: partnershipAccounts },
    fetchPartnershipAccounts,
  ] = useGetPartnershipAccounts(wellpassPartnershipId);
  const [updateActionState, updatePartnershipAccount] =
    useUpdatePartnershipAccount(wellpassPartnershipId);

  const [selectedAccountToEdit, setSelectedAccountToEdit] =
    useState<PartnershipAccount | null>(null);

  useEffect(() => {
    fetchPartnershipAccounts();
  }, [wellpassPartnershipId, fetchPartnershipAccounts]);

  const selectedEstablishmentIds = useMemo(
    () =>
      selectedAccountToEdit?.establishments.map(
        (establishment) => establishment.id,
      ) || [],
    [selectedAccountToEdit],
  );

  const establishmentsLinkedIds = useMemo(
    () =>
      partnershipAccounts
        ? partnershipAccounts.flatMap((account) =>
            account.establishments.map((establishment) => establishment.id),
          )
        : [],
    [partnershipAccounts],
  );

  /* Configuration Dialog */
  const [isConfigurationDialogOpen, setIsConfigurationDialogOpen] =
    useState(false);

  const openConfigurationDialog = useCallback(() => {
    setIsConfigurationDialogOpen(true);
  }, []);

  const closeConfigurationDialog = useCallback((reset: boolean = true) => {
    setIsConfigurationDialogOpen(false);
    if (reset) {
      setTimeout(() => setSelectedAccountToEdit(null), 300);
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

  // EDIT: Update partnership account venues
  const updateAccount = useCallback(
    async (values: WellpassConfigurationFormValues) => {
      if (!selectedAccountToEdit) return;

      const removedEstablishments = selectedEstablishmentIds.filter(
        (id) => !values.establishmentIds.includes(id),
      );

      if (removedEstablishments.length > 0) {
        closeConfigurationDialog(false);
        openWarningDialog(
          async () => {
            await updatePartnershipAccount(selectedAccountToEdit.id, values);
            fetchPartnershipAccounts();
            showSnackbarSuccess(
              t('wellpass.configuration.dialog.notification.update.success'),
            );
            setTimeout(() => setSelectedAccountToEdit(null), 300);
            closeWarningDialog();
          },
          () => {
            closeWarningDialog();
            setSelectedAccountToEdit(selectedAccountToEdit);
            openConfigurationDialog();
          },
        );
        return;
      }

      await updatePartnershipAccount(selectedAccountToEdit.id, values);
      closeConfigurationDialog();
      fetchPartnershipAccounts();
      showSnackbarSuccess(
        t('wellpass.configuration.dialog.notification.update.success'),
      );
    },
    [
      selectedAccountToEdit,
      selectedEstablishmentIds,
      updatePartnershipAccount,
      closeConfigurationDialog,
      fetchPartnershipAccounts,
      showSnackbarSuccess,
      t,
      openWarningDialog,
      closeWarningDialog,
      openConfigurationDialog,
    ],
  );

  const handleEditAccount = useCallback(
    (account: PartnershipAccount) => {
      setSelectedAccountToEdit(account);
      openConfigurationDialog();
    },
    [openConfigurationDialog],
  );

  /* Error management */
  useEffect(() => {
    if (!showSnackbarError) return;

    if (updateActionState.error) {
      showSnackbarError(
        t('wellpass.configuration.dialog.notification.update.error'),
      );
    }
  }, [updateActionState.error, showSnackbarError, t]);

  return (
    <>
      <PartnershipConfigurationPanel
        displayConfig={{
          partnershipIdentifier: PartnershipIdentifier.WELLPASS,
          icon: <WellpassTitle />,
          showCopyIdToClipboard: true,
        }}
        loading={fetchAccountsLoading}
        onEditAccount={handleEditAccount}
        partnershipAccounts={partnershipAccounts ?? []}
      />
      <WellpassConfigurationDialog
        establishmentIds={selectedEstablishmentIds}
        establishmentIdsLinked={establishmentsLinkedIds}
        establishments={establishments}
        externalId={selectedAccountToEdit?.external_id || ''}
        isLoading={updateActionState.loading}
        isOpen={isConfigurationDialogOpen}
        onClose={closeConfigurationDialog}
        onSubmit={updateAccount}
      />
      <PartnershipWarningDialog
        dialogType="error"
        isOpen={isWarningDialogOpen}
        onCancel={warningOnCancelCallback ?? closeWarningDialog}
        onClose={closeWarningDialog}
        onConfirm={warningOnConfirmCallback}
        textContentKeys={computeWarningDialogKeys()}
      />
    </>
  );
};

export default connect(null, {
  showSnackbarSuccess: snackbarSuccess,
  showSnackbarError: snackbarError,
})(React.memo(WellpassConfiguration));
