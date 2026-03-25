import React, { useCallback, useEffect, useMemo, useState } from 'react';
// eslint-disable-next-line bsport/no-redux-in-component
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import maxBy from 'lodash/maxBy';
import { DateTime } from 'luxon';

import { Alert } from '@material-ui/lab';

import PartnershipConfigurationPanel from '#src/libs/partnership/components/PartnershipConfigurationPanel';
import PartnershipWarningDialog from '#src/libs/partnership/components/PartnershipWarningDialog';
import { PartnershipWarningDialogTextProps } from '#src/libs/partnership/components/PartnershipWarningDialog/PartnershipWarningDialog.component';
import {
  PartnershipIdentifier,
  PartnershipAccount,
} from '#src/libs/partnership/types';
import {
  useCreateWellhubPartnershipAccount,
  useDeletePartnershipAccount,
  useUpdatePartnershipAccount,
  useGetPartnershipAccounts,
  useActivatePartnershipAccount,
} from '#src/libs/partnership/hooks';

import WellhubIcon from '#src/components/icons/WellhubIcon.component';
import { LinearProgress } from '@material-ui/core';

import WellhubProductAlert from '#src/libs/wellhub/components/WellhubProductAlert';

import { snackbarSuccess } from '#src/libs/snackbar/actions';
import { snackbarError } from '#src/actions/snackbar.actions';

import type { Establishment } from '#src/libs/establishment/types';
import WellhubPartnershipConfigurationDialogComponent, {
  type WellhubPartnershipConfigurationFormValues,
} from '#src/libs/wellhub/components/WellhubPartnershipConfigurationDialog/WellhubPartnershipConfigurationDialog.component';

type Props = {
  establishments: Establishment[];
  wellhubPartnershipId: number | null;
  offersMissingWellhubProductCount: number;
  openWellhubProductSelectionDrawer: () => void;
  showSnackbarSuccess: (message: string) => void;
  showSnackbarError: (message: string) => void;
};

const computeWarningDialogKeys = (
  isEdit: boolean = false,
  isActivate: boolean = false,
): PartnershipWarningDialogTextProps => {
  if (isActivate) {
    return {
      title: 'wellhub.configuration.dialog.activate.title',
      subtitle: 'wellhub.configuration.dialog.activate.subtitle',
      alertContent: 'wellhub.configuration.dialog.activate.content',
      confirmAction: 'wellhub.configuration.dialog.action.reactivate',
      cancelAction: 'wellhub.configuration.dialog.action.cancel',
    };
  }

  return {
    title: isEdit
      ? 'wellhub.configuration.dialog.title.edition'
      : 'wellhub.configuration.dialog.title.deletion',
    subtitle: 'wellhub.configuration.dialog.unlink.title',
    alertContent: 'wellhub.configuration.dialog.unlink.text',
    confirmAction: 'wellhub.configuration.dialog.action.confirm',
    cancelAction: 'wellhub.configuration.dialog.action.cancel',
  };
};

const WellhubConfiguration: React.FC<Props> = ({
  establishments,
  wellhubPartnershipId,
  offersMissingWellhubProductCount,
  openWellhubProductSelectionDrawer,
  showSnackbarSuccess,
  showSnackbarError,
}) => {
  const { t } = useTranslation('partnership');

  const [
    { loading: fetchAccountsLoading, value: partnershipAccounts },
    fetchPartnershipAccounts,
  ] = useGetPartnershipAccounts(wellhubPartnershipId ?? 0);
  const [createActionState, createPartnershipAccount] =
    useCreateWellhubPartnershipAccount(wellhubPartnershipId ?? 0);
  const [deleteActionState, deletePartnershipAccount] =
    useDeletePartnershipAccount();
  const [updateActionState, updatePartnershipAccount] =
    useUpdatePartnershipAccount(wellhubPartnershipId ?? 0);
  const [activateActionState, activatePartnershipAccount] =
    useActivatePartnershipAccount();

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
    if (!wellhubPartnershipId) return;
    fetchPartnershipAccounts();
  }, [wellhubPartnershipId, fetchPartnershipAccounts]);

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

  const establishmentsNotLinked = useMemo(
    () =>
      establishments.filter(
        (establishment) => !establishmentsLinkedIds.includes(establishment.id),
      ),
    [establishmentsLinkedIds, establishments],
  );

  const migratingAccounts = useMemo(() => {
    const now = DateTime.now();
    return (partnershipAccounts ?? []).filter(
      (account) =>
        account.active === true &&
        account.activated_at != null &&
        DateTime.fromISO(account.activated_at) > now,
    );
  }, [partnershipAccounts]);

  const maxMigrationDate = useMemo(() => {
    if (migratingAccounts.length === 0) return null;
    const account = maxBy(migratingAccounts, (a) =>
      a.activated_at ? DateTime.fromISO(a.activated_at).toMillis() : 0,
    );
    return account && account.activated_at
      ? DateTime.fromISO(account.activated_at)
      : null;
  }, [migratingAccounts]);

  const isMigrating = useCallback(
    (account: PartnershipAccount) =>
      migratingAccounts.some((a) => a.id === account.id),
    [migratingAccounts],
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
      // Material applies a 300ms fade out animation on dialog close
      // Wait before resetting to prevent its style from changing before closing
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

  // DELETE: Remove partnership account
  const deleteAccount = useCallback(
    async (account: PartnershipAccount) => {
      await deletePartnershipAccount(account.id);
      fetchPartnershipAccounts();
      showSnackbarSuccess(
        t('wellhub.configuration.dialog.notification.delete.success'),
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
    async (values: WellhubPartnershipConfigurationFormValues) => {
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
              t('wellhub.configuration.dialog.notification.update.success'),
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
        t('wellhub.configuration.dialog.notification.update.success'),
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
    async (values: WellhubPartnershipConfigurationFormValues) => {
      const createdValue = await createPartnershipAccount({
        externalId: values.externalId,
        establishmentIds: values.establishmentIds,
      });
      if (createdValue) {
        fetchPartnershipAccounts();
        showSnackbarSuccess(
          t('wellhub.configuration.dialog.notification.create.success'),
        );
        closeConfigurationDialog();
      }
    },
    [
      createPartnershipAccount,
      fetchPartnershipAccounts,
      showSnackbarSuccess,
      closeConfigurationDialog,
      t,
    ],
  );

  // ACTIVATE: Activate a disabled partnership account
  const activateAccount = useCallback(
    async (account: PartnershipAccount) => {
      await activatePartnershipAccount(account.id);
      fetchPartnershipAccounts();
      showSnackbarSuccess(
        t('wellhub.configuration.dialog.notification.activate.success'),
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
    async (values: WellhubPartnershipConfigurationFormValues) => {
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
        t('wellhub.configuration.dialog.notification.create.error'),
      );
    }

    if (deleteActionState.error) {
      showSnackbarError(
        t('wellhub.configuration.dialog.notification.delete.error'),
      );
    }

    if (updateActionState.error) {
      showSnackbarError(
        t('wellhub.configuration.dialog.notification.update.error'),
      );
    }

    if (activateActionState.error) {
      showSnackbarError(
        t('wellhub.configuration.dialog.notification.activate.error'),
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

  if (!wellhubPartnershipId) return <LinearProgress />;

  return (
    <>
      <PartnershipConfigurationPanel
        addConnectionDisabled={establishmentsNotLinked.length === 0}
        displayConfig={{
          partnershipIdentifier: PartnershipIdentifier.WELLHUB,
          icon: <WellhubIcon />,
          helperTextKey: 'wellhub.configuration.panel.content.helperText',
        }}
        isActionDisabled={isMigrating}
        loading={fetchAccountsLoading}
        onActivateAccount={handleActivateAccount}
        onAddConnection={openConfigurationDialog}
        onDeleteAccount={handleDeleteAccount}
        onEditAccount={handleEditAccount}
        partnershipAccounts={partnershipAccounts ?? []}
        slots={{
          alert: (
            <>
              {maxMigrationDate && (
                <Alert severity="info">
                  {t('wellhub.configuration.migration.banner', {
                    date: maxMigrationDate.toLocaleString(DateTime.DATE_FULL),
                  })}
                </Alert>
              )}
              <WellhubProductAlert
                onActionClick={openWellhubProductSelectionDrawer}
                total={offersMissingWellhubProductCount}
              />
            </>
          ),
        }}
      />
      <WellhubPartnershipConfigurationDialogComponent
        establishmentIds={selectedEstablishmentIds}
        establishmentIdsLinked={establishmentsLinkedIds}
        establishments={establishments}
        externalId={selectedAccountToEdit?.external_id || ''}
        isCreation={selectedAccountToEdit == null}
        isLoading={createActionState.loading || updateActionState.loading}
        isOpen={isConfigurationDialogOpen}
        onClose={closeConfigurationDialog}
        onSubmit={handleFormSubmit}
        partnershipId={wellhubPartnershipId}
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
})(React.memo(WellhubConfiguration));
