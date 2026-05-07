import { type FC, useCallback, useState } from "react";

import { type PartnershipAccount } from "@bsport/api-book";
import { Body, Button } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useTranslation } from "#src/utils/i18n";

import { toAccountRow } from "../adapters/account-row";
import { useDeleteMyclubsAccount } from "../hooks/use-delete-myclubs-account";
import { useMyclubsAccounts } from "../hooks/use-myclubs-accounts";
import { useMyclubsEstablishments } from "../hooks/use-myclubs-establishments";
import { useMyclubsPartnershipId } from "../hooks/use-myclubs-partnership-id";
import { useReactivateMyclubsAccount } from "../hooks/use-reactivate-myclubs-account";
import { useUpdateMyclubsAccount } from "../hooks/use-update-myclubs-account";
import { MyClubsLogo } from "./my-clubs-logo";
import { MyclubsAccountsTable } from "./myclubs-accounts-table";
import { MyclubsConfirmationModal } from "./myclubs-confirmation-modal";
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
  const { data: accounts } = useMyclubsAccounts(partnershipId);
  const { data: establishments } = useMyclubsEstablishments(companyId);
  const [modalState, setModalState] = useState<ModalState>(null);

  const deleteMutation = useDeleteMyclubsAccount(partnershipId);
  const updateMutation = useUpdateMyclubsAccount(partnershipId);
  const reactivateMutation = useReactivateMyclubsAccount(partnershipId);

  const allLinkedIds = new Set(
    accounts.flatMap((a) => a.establishments.map((e) => e.id)),
  );

  const disabledEstablishmentIds: Set<number> =
    modalState?.kind === "edit"
      ? new Set(
          [...allLinkedIds].filter(
            (id) => !modalState.account.establishments.some((e) => e.id === id),
          ),
        )
      : allLinkedIds;

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
      <MyclubsAccountsTable
        rows={rows}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onReactivate={handleReactivate}
      />
      <Button
        key="button-generate-myclubs-partner-id"
        iconLeft="plus"
        intent="call-to-action"
        color="main"
        size="md"
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
          disabledEstablishmentIds={disabledEstablishmentIds}
          onEditSubmit={
            modalState.kind === "edit"
              ? handleEditSubmit(modalState.account)
              : undefined
          }
          isExternalSubmitting={updateMutation.isPending}
        />
      )}
      {modalState?.kind === "delete-warning" && (
        <MyclubsConfirmationModal
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
        <MyclubsConfirmationModal
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
        <MyclubsConfirmationModal
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
  const { data: partnershipId } = useMyclubsPartnershipId();
  const companyId = dataAccessLayer.useCompanyTheme()?.company;

  // do not render the myclubs section if the partnership id or company id is not available
  if (partnershipId == null || companyId == null) {
    return null;
  }

  return (
    <section className="flex flex-col gap-md w-full">
      <div className="flex flex-col gap-xs">
        <div className="h-xl w-auto">
          <MyClubsLogo />
        </div>
        <Body color="weak" size="lg" weight="weak">
          {t("myclubs.section.subtitle")}
        </Body>
      </div>
      <MyclubsAccountsSectionContent
        partnershipId={partnershipId}
        companyId={companyId}
      />
    </section>
  );
};
