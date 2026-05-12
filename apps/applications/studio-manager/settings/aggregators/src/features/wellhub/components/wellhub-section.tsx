import { type FC, useCallback, useState } from "react";

import { type PartnershipAccount } from "@bsport/api-book";
import { Alert, Body, Button, Tooltip } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useModal } from "#src/hooks/use-modal";
import { useTranslation } from "#src/utils/i18n";

import { toAccountRow } from "../adapters/account-row";
import { useDeleteWellhubAccount } from "../hooks/use-delete-wellhub-account";
import { useFetchOffersMissingWellhubProduct } from "../hooks/use-fetch-offers-missing-wellhub-product";
import { useReactivateWellhubAccount } from "../hooks/use-reactivate-wellhub-account";
import { useUpdateWellhubAccount } from "../hooks/use-update-wellhub-account";
import { useWellhubAccounts } from "../hooks/use-wellhub-accounts";
import { useWellhubEstablishments } from "../hooks/use-wellhub-establishments";
import { useWellhubPartnershipId } from "../hooks/use-wellhub-partnership-id";
import { WellhubAccountsTable } from "./wellhub-accounts-table";
import { WellhubConfirmationModal } from "./wellhub-confirmation-modal";
import { type WellhubFormSchema } from "./wellhub-form/schema";
import { WellhubConfigurationModal } from "./wellhub-form/wellhub-configuration-modal";
import { WellhubLogo } from "./wellhub-logo";
import { WellhubProductModal } from "./wellhub-product-modal/wellhub-product-modal";

type ModalState =
  | { kind: "create" }
  | { kind: "edit"; account: PartnershipAccount }
  | { kind: "delete-warning"; account: PartnershipAccount }
  | {
      kind: "edit-warning";
      account: PartnershipAccount;
      values: WellhubFormSchema;
    }
  | { kind: "reactivate-warning"; account: PartnershipAccount }
  | null;

const WellhubAccountsSectionContent: FC<{
  partnershipId: number;
  companyId: number;
}> = ({ partnershipId, companyId }) => {
  const { t } = useTranslation("common");
  const { data: accounts } = useWellhubAccounts(partnershipId);
  const { data: establishments } = useWellhubEstablishments(companyId);
  const [modalState, setModalState] = useState<ModalState>(null);
  const {
    isOpen: productModalOpen,
    open: openProductModal,
    close: closeProductModal,
  } = useModal();
  const [wellhubPage, setWellhubPage] = useState(1);

  const handleCloseProductModal = useCallback(() => {
    closeProductModal();
    setWellhubPage(1);
  }, [closeProductModal]);

  const { data: missingOffersData, isLoading: missingOffersLoading } =
    useFetchOffersMissingWellhubProduct(wellhubPage);

  const deleteMutation = useDeleteWellhubAccount(partnershipId);
  const reactivateMutation = useReactivateWellhubAccount(partnershipId);
  const updateMutation = useUpdateWellhubAccount(partnershipId);

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

  const establishmentsNotLinked = establishments.filter(
    (e) => !allLinkedIds.has(e.id),
  );

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
    (account: PartnershipAccount) => async (values: WellhubFormSchema) => {
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

  const rows = accounts.map(toAccountRow);

  const addButton = (
    <Button
      iconLeft="plus"
      intent="call-to-action"
      color="main"
      size="md"
      label={t("wellhub.actions.addConnection")}
      onClick={() => setModalState({ kind: "create" })}
      disabled={establishmentsNotLinked.length === 0}
    />
  );

  return (
    <>
      {missingOffersData && missingOffersData.total_count > 0 && (
        <Alert
          status="default"
          title={t("wellhub.productModal.alert.title")}
          buttonLabel={t("wellhub.productModal.alert.action")}
          onButtonClick={openProductModal}
        >
          <Body htmlVariant="p" size="md" color="default">
            {
              // @ts-expect-error - i18n plural keys not reflected in generated types
              t("wellhub.productModal.alert.message", {
                count: missingOffersData.total_count,
              }) as string
            }
          </Body>
        </Alert>
      )}
      {productModalOpen && (
        <WellhubProductModal
          isOpen={productModalOpen}
          onClose={handleCloseProductModal}
          currentPage={wellhubPage}
          totalPages={missingOffersData?.total_pages ?? 1}
          totalItems={missingOffersData?.total_count ?? 0}
          offers={missingOffersData?.results ?? []}
          isLoading={missingOffersLoading}
          onChangePage={setWellhubPage}
        />
      )}
      <WellhubAccountsTable
        rows={rows}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onReactivate={handleReactivate}
      />
      {establishmentsNotLinked.length === 0 ? (
        <Tooltip label={t("wellhub.actions.addConnectionDisabledHint")}>
          {addButton}
        </Tooltip>
      ) : (
        addButton
      )}
      {(modalState?.kind === "create" || modalState?.kind === "edit") && (
        <WellhubConfigurationModal
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
        <WellhubConfirmationModal
          isOpen
          onClose={() => setModalState(null)}
          onConfirm={() =>
            deleteMutation.mutate(
              { accountId: modalState.account.id },
              { onSettled: () => setModalState(null) },
            )
          }
          title={t("wellhub.confirm.delete.title")}
          description={t("wellhub.confirm.delete.description")}
          alert={{
            status: "critical",
            content: t("wellhub.confirm.delete.alert"),
          }}
          confirmLabel={t("wellhub.confirm.delete.confirm")}
          confirmColor="critical"
          cancelLabel={t("wellhub.confirm.delete.cancel")}
          isLoading={deleteMutation.isPending}
        />
      )}
      {modalState?.kind === "edit-warning" && (
        <WellhubConfirmationModal
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
          title={t("wellhub.confirm.editWarning.title")}
          description={t("wellhub.confirm.editWarning.description")}
          alert={{
            status: "critical",
            content: t("wellhub.confirm.editWarning.alert"),
          }}
          confirmLabel={t("wellhub.confirm.editWarning.confirm")}
          confirmColor="critical"
          cancelLabel={t("wellhub.confirm.editWarning.cancel")}
          isLoading={updateMutation.isPending}
        />
      )}
      {modalState?.kind === "reactivate-warning" && (
        <WellhubConfirmationModal
          isOpen
          onClose={() => setModalState(null)}
          onConfirm={() =>
            reactivateMutation.mutate(
              { accountId: modalState.account.id },
              { onSettled: () => setModalState(null) },
            )
          }
          title={t("wellhub.confirm.reactivate.title")}
          alert={{
            status: "warning",
            content: t("wellhub.confirm.reactivate.alert"),
          }}
          confirmLabel={t("wellhub.confirm.reactivate.confirm")}
          confirmColor="main"
          cancelLabel={t("wellhub.confirm.reactivate.cancel")}
          isLoading={reactivateMutation.isPending}
        />
      )}
    </>
  );
};

export const WellhubSection: FC = () => {
  const { t } = useTranslation("common");
  const { data: partnershipId } = useWellhubPartnershipId();
  const companyId = dataAccessLayer.useCompanyTheme()?.company;

  if (partnershipId == null || companyId == null) {
    return null;
  }

  return (
    <section className="flex flex-col gap-md w-full">
      <div className="flex flex-col gap-xs">
        <div className="h-xl w-auto">
          <WellhubLogo />
        </div>
        <Body color="weak" size="lg" weight="weak">
          {t("wellhub.section.subtitle")}
        </Body>
      </div>
      <WellhubAccountsSectionContent
        partnershipId={partnershipId}
        companyId={companyId}
      />
    </section>
  );
};
