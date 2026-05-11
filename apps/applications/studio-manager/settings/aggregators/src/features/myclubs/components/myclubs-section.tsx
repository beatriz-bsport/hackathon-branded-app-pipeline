import { type FC, useCallback, useState } from "react";

import {
  type PartnershipAccount,
  PartnershipIdentifier,
} from "@bsport/api-book";
import { Button } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { toAccountRow } from "#src/features/partnership-aggregator/adapters/account-row";
import { AccountsTable } from "#src/features/partnership-aggregator/components/accounts-table";
import { AggregatorSection } from "#src/features/partnership-aggregator/components/aggregator-section";
import { ConfirmationModal } from "#src/features/partnership-aggregator/components/confirmation-modal";
import { AggregatorLogo } from "#src/features/partnership-aggregator/components/logo";
import { RowActionsMenu } from "#src/features/partnership-aggregator/components/row-actions-menu";
import { useAggregatorAccounts } from "#src/features/partnership-aggregator/hooks/use-aggregator-accounts";
import { useAggregatorEstablishments } from "#src/features/partnership-aggregator/hooks/use-aggregator-establishments";
import { useAggregatorPartnershipId } from "#src/features/partnership-aggregator/hooks/use-aggregator-partnership-id";
import { useDeleteAccount } from "#src/features/partnership-aggregator/hooks/use-delete-account";
import { useReactivateAccount } from "#src/features/partnership-aggregator/hooks/use-reactivate-account";
import { useUpdateAccount } from "#src/features/partnership-aggregator/hooks/use-update-account";
import { useTranslation } from "#src/utils/i18n";

import myClubsLogo from "./assets/my-clubs-logo.png";
import { MyclubsConfigurationModal } from "./myclubs-form/myclubs-configuration-modal";
import { type MyclubsFormSchema } from "./myclubs-form/schema";

type ModalState =
  | { kind: "create" }
  | { kind: "edit"; account: PartnershipAccount }
  | { kind: "delete-warning"; account: PartnershipAccount }
  | { kind: "reactivate-warning"; account: PartnershipAccount }
  | {
      kind: "edit-warning";
      account: PartnershipAccount;
      values: MyclubsFormSchema;
    }
  | null;

const MyclubsAccountsSectionContent: FC<{
  partnershipId: number;
  companyId: number;
}> = ({ partnershipId, companyId }) => {
  const { t } = useTranslation("common");
  const { data: accounts } = useAggregatorAccounts(partnershipId);
  const { data: establishments } = useAggregatorEstablishments(companyId);
  const [modalState, setModalState] = useState<ModalState>(null);

  const deleteMutation = useDeleteAccount(partnershipId, "myclubs");
  const updateMutation = useUpdateAccount(partnershipId, "myclubs");
  const reactivateMutation = useReactivateAccount(partnershipId, "myclubs");

  const handleEdit = useCallback(
    (id: string) => {
      const account = accounts.find((a) => a.id === id);
      if (account) setModalState({ kind: "edit", account });
    },
    [accounts],
  );

  const handleDelete = useCallback(
    (id: string) => {
      const account = accounts.find((a) => a.id === id);
      if (account) setModalState({ kind: "delete-warning", account });
    },
    [accounts],
  );

  const handleReactivate = useCallback(
    (id: string) => {
      const account = accounts.find((a) => a.id === id);
      if (account) setModalState({ kind: "reactivate-warning", account });
    },
    [accounts],
  );

  const handleEditSubmit = useCallback(
    (account: PartnershipAccount) => async (values: MyclubsFormSchema) => {
      const hasRemovals = account.establishments.some(
        (e) => !values.establishmentIds.includes(e.id),
      );
      if (hasRemovals) {
        setModalState({ kind: "edit-warning", account, values });
      } else {
        await updateMutation.mutateAsync({
          accountId: account.id,
          establishmentIds: values.establishmentIds,
        });
        setModalState(null);
      }
    },
    [updateMutation],
  );

  const isConfigModalOpen =
    modalState?.kind === "create" || modalState?.kind === "edit";

  const rows = accounts.map(toAccountRow);

  return (
    <>
      <AccountsTable
        rows={rows}
        namespace="myclubs"
        renderRowActions={(row) => (
          <RowActionsMenu
            status={row.status}
            namespace="myclubs"
            onEdit={() => handleEdit(row.id)}
            onDelete={() => handleDelete(row.id)}
            onReactivate={() => handleReactivate(row.id)}
          />
        )}
      />
      <Button
        key="button-generate-myclubs-partner-id"
        iconLeft="plus"
        intent="call-to-action"
        color="main"
        size="md"
        className="ml-auto"
        label={t("myclubs.actions.generatePartnerId")}
        onClick={() => setModalState({ kind: "create" })}
      />
      {isConfigModalOpen && (
        <MyclubsConfigurationModal
          isOpen
          onClose={() => setModalState(null)}
          mode={modalState.kind === "edit" ? "edit" : "create"}
          account={modalState.kind === "edit" ? modalState.account : undefined}
          partnershipId={partnershipId}
          establishments={establishments}
          onEditSubmit={
            modalState.kind === "edit"
              ? handleEditSubmit(modalState.account)
              : undefined
          }
          isExternalSubmitting={updateMutation.isPending}
        />
      )}
      {modalState?.kind === "delete-warning" && (
        <ConfirmationModal
          isOpen
          onClose={() => setModalState(null)}
          onConfirm={() =>
            deleteMutation.mutate(
              { accountId: modalState.account.id },
              { onSettled: () => setModalState(null) },
            )
          }
          title={t("myclubs.confirm.delete.title")}
          description={t("myclubs.confirm.delete.description")}
          alert={{
            status: "critical",
            content: t("myclubs.confirm.delete.alert"),
          }}
          confirmLabel={t("myclubs.confirm.delete.confirm")}
          confirmColor="critical"
          cancelLabel={t("myclubs.confirm.delete.cancel")}
          isLoading={deleteMutation.isPending}
        />
      )}
      {modalState?.kind === "reactivate-warning" && (
        <ConfirmationModal
          isOpen
          onClose={() => setModalState(null)}
          onConfirm={() =>
            reactivateMutation.mutate(
              { accountId: modalState.account.id },
              { onSettled: () => setModalState(null) },
            )
          }
          title={t("myclubs.confirm.reactivate.title")}
          description={t("myclubs.confirm.reactivate.description")}
          alert={{
            status: "warning",
            content: t("myclubs.confirm.reactivate.alert"),
          }}
          confirmLabel={t("myclubs.confirm.reactivate.confirm")}
          confirmColor="main"
          cancelLabel={t("myclubs.confirm.reactivate.cancel")}
          isLoading={reactivateMutation.isPending}
        />
      )}
      {modalState?.kind === "edit-warning" && (
        <ConfirmationModal
          isOpen
          onClose={() => setModalState(null)}
          onConfirm={() =>
            updateMutation.mutate(
              {
                accountId: modalState.account.id,
                establishmentIds: modalState.values.establishmentIds,
              },
              { onSuccess: () => setModalState(null) },
            )
          }
          onCancel={() => setModalState(null)}
          title={t("myclubs.confirm.editWarning.title")}
          description={t("myclubs.confirm.editWarning.description")}
          alert={{
            status: "critical",
            content: t("myclubs.confirm.editWarning.alert"),
          }}
          confirmLabel={t("myclubs.confirm.editWarning.confirm")}
          confirmColor="critical"
          cancelLabel={t("myclubs.confirm.editWarning.cancel")}
          isLoading={updateMutation.isPending}
        />
      )}
    </>
  );
};

export const MyClubsSection: FC = () => {
  const { t } = useTranslation("common");
  const { data: partnershipId } = useAggregatorPartnershipId(
    PartnershipIdentifier.MYCLUBS,
  );
  const companyId = dataAccessLayer.useCompanyTheme()?.company;

  // do not render the myclubs section if the partnership id or company id is not available
  if (partnershipId == null || companyId == null) {
    return null;
  }

  return (
    <AggregatorSection
      logo={<AggregatorLogo src={myClubsLogo} alt="MyClubs" />}
      subtitle={t("myclubs.section.subtitle")}
    >
      <MyclubsAccountsSectionContent
        partnershipId={partnershipId}
        companyId={companyId}
      />
    </AggregatorSection>
  );
};
