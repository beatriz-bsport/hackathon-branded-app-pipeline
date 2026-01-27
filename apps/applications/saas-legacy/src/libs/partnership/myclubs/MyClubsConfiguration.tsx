import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PartnershipConfigurationPanel from '#src/libs/partnership/components/PartnershipConfigurationPanel';
import {
  PartnershipIdentifier,
  PartnershipAccount,
} from '#src/libs/partnership/types';
import {
  useCreatePartnershipAccount,
  useDeletePartnershipAccount,
  useUpdatePartnershipAccount,
  useGetPartnershipAccounts,
  useActivatePartnershipAccount,
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
    { loading: fetchAccountsLoading, value: partnershipAccounts },
    fetchPartnershipAccounts,
  ] = useGetPartnershipAccounts(myClubsPartnershipId);
  const [createActionState, createPartnershipAccount] =
    useCreatePartnershipAccount(myClubsPartnershipId);
  const [deleteActionState, deletePartnershipAccount] =
    useDeletePartnershipAccount();
  const [updateActionState, updatePartnershipAccount] =
    useUpdatePartnershipAccount(myClubsPartnershipId);
  const [activateActionState, activatePartnershipAccount] =
    useActivatePartnershipAccount();

  const [createdAccount, setCreatedAccount] =
    useState<PartnershipAccount | null>(null);
  const [selectedAccountToEdit, setSelectedAccountToEdit] =
    useState<PartnershipAccount | null>(null);
  const [selectedAccountToActivate, setSelectedAccountToActivate] =
    useState<PartnershipAccount | null>(null);

  const warningDialogKeys = useMemo(
    () =>
      computeWarningDialogKeys(
        selectedAccountToEdit !== null,
        selectedAccountToActivate !== null,
      ),
    [selectedAccountToEdit, selectedAccountToActivate],
  );
  useEffect(() => {
    fetchPartnershipAccounts();
  }, [myClubsPartnershipId, fetchPartnershipAccounts]);

  // The list of establishment IDs linked to the account being edited
  const selectedEstablishmentIds = useMemo(
    () =>
      selectedAccountToEdit?.establishments.map(
        (establishment) => establishment.id,
      ) || [],
    [selectedAccountToEdit],
  );

  // The list of establishment IDs already linked to other accounts
  // These ids will be disabled in the establishment selector
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
    setCreatedAccount(null);
  }, []);
  const closeConfigurationDialog = useCallback((reset: boolean = true) => {
    setIsConfigurationDialogOpen(false);
    if (reset) {
      // Material applies a 300ms fade out animation on dialog close
      // Wait before resetting to prevent its style from changing before closing
      setTimeout(() => {
        setSelectedAccountToEdit(null);
        setCreatedAccount(null);
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

  // DELETE: Remove partnership account
  const deleteAccount = useCallback(
    async (account: PartnershipAccount) => {
      await deletePartnershipAccount(account.id);
      fetchPartnershipAccounts();
      showSnackbarSuccess(
        t('myclubs.configuration.dialog.notification.delete.success'),
      );
      closeWarningDialog();
    },
    [
      deletePartnershipAccount,
      fetchPartnershipAccounts,
      showSnackbarSuccess,
      closeWarningDialog,
      t,
    ],
  );

  // EDIT: Update partnership account
  const updateAccount = useCallback(
    async (values: FormValues) => {
      if (!selectedAccountToEdit) return;

      // Check if any establishments were removed
      const removedEstablishments = selectedEstablishmentIds.filter(
        (id) => !values.establishmentIds.includes(id),
      );

      if (removedEstablishments.length > 0) {
        // Show warning dialog for confirmation before removing establishments
        closeConfigurationDialog(false);
        openWarningDialog(
          async () => {
            await updatePartnershipAccount(selectedAccountToEdit.id, values);
            fetchPartnershipAccounts();
            showSnackbarSuccess(
              t('myclubs.configuration.dialog.notification.update.success'),
            );
            // Material applies a 300ms fade out animation on dialog close
            // Wait before resetting to prevent its style from changing before closing
            setTimeout(() => setSelectedAccountToEdit(null), 300);
            closeWarningDialog();
          },
          () => {
            // Reopen configuration dialog on cancel
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
        t('myclubs.configuration.dialog.notification.update.success'),
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

  // CREATE: Add new partnership account
  const createAccount = useCallback(
    async (values: FormValues) => {
      const createdValue = await createPartnershipAccount(values);
      if (createdValue) {
        setCreatedAccount(createdValue);
        fetchPartnershipAccounts();
        showSnackbarSuccess(
          t('myclubs.configuration.dialog.notification.create.success'),
        );
      }
    },
    [
      createPartnershipAccount,
      fetchPartnershipAccounts,
      showSnackbarSuccess,
      t,
    ],
  );

  // ACTIVATE: Activate a disabled partnership account
  const activateAccount = useCallback(
    async (account: PartnershipAccount) => {
      await activatePartnershipAccount(account.id);
      fetchPartnershipAccounts();
      showSnackbarSuccess(
        t('myclubs.configuration.dialog.notification.activate.success'),
      );
      closeWarningDialog();
      // Material applies a 300ms fade out animation on dialog close
      // Wait before resetting to prevent its style from changing before closing
      setTimeout(() => setSelectedAccountToActivate(null), 300);
    },
    [
      activatePartnershipAccount,
      fetchPartnershipAccounts,
      showSnackbarSuccess,
      closeWarningDialog,
      t,
    ],
  );

  const handleActivateAccount = useCallback(
    (account: PartnershipAccount) => {
      setSelectedAccountToActivate(account);
      openWarningDialog(
        () => {
          activateAccount(account);
        },
        () => {
          closeWarningDialog();
          setSelectedAccountToActivate(null);
        },
      );
    },
    [activateAccount, openWarningDialog, closeWarningDialog],
  );

  const handleDeleteAccount = useCallback(
    (account: PartnershipAccount) => {
      openWarningDialog(() => deleteAccount(account));
    },
    [deleteAccount, openWarningDialog],
  );

  const handleEditAccount = useCallback(
    (account: PartnershipAccount) => {
      setSelectedAccountToEdit(account);
      openConfigurationDialog();
    },
    [openConfigurationDialog],
  );

  const handleFormSubmit = useCallback(
    async (values: FormValues) => {
      if (selectedAccountToEdit) {
        await updateAccount(values);
      } else {
        await createAccount(values);
      }
    },
    [selectedAccountToEdit, updateAccount, createAccount],
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
        loading={fetchAccountsLoading}
        onActivateAccount={handleActivateAccount}
        onAddConnection={openConfigurationDialog}
        onDeleteAccount={handleDeleteAccount}
        onEditAccount={handleEditAccount}
        partnershipAccounts={partnershipAccounts ?? []}
      />
      <PartnershipConfigurationDialog
        establishmentIds={selectedEstablishmentIds}
        establishmentIdsLinked={establishmentsLinkedIds}
        establishments={establishments}
        externalId={
          createdAccount?.external_id ||
          selectedAccountToEdit?.external_id ||
          ''
        }
        isCreation={selectedAccountToEdit == null}
        isLoading={createActionState.loading || updateActionState.loading}
        isOpen={isConfigurationDialogOpen}
        onClose={closeConfigurationDialog}
        onSubmit={handleFormSubmit}
        partnershipIdentifier={PartnershipIdentifier.MYCLUBS}
      />
      <PartnershipWarningDialog
        dialogType={selectedAccountToActivate ? 'info' : 'error'}
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
