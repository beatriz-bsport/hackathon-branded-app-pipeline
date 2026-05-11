import { type FC, useCallback, useState } from "react";

import {
  type PartnershipAccount,
  PartnershipIdentifier,
} from "@bsport/api-book";
import { Alert, Body, Button, Tooltip } from "@bsport/kaizen-primitive-core";
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
import { useModal } from "#src/hooks/use-modal";
import { useTranslation } from "#src/utils/i18n";

import { useFetchOffersMissingWellhubProduct } from "../hooks/use-fetch-offers-missing-wellhub-product";
import wellhubLogo from "./assets/wellhub-logo.svg";
import { type WellhubFormSchema } from "./wellhub-form/schema";
import { WellhubConfigurationModal } from "./wellhub-form/wellhub-configuration-modal";
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
  const { data: accounts } = useAggregatorAccounts(partnershipId);
  const { data: establishments } = useAggregatorEstablishments(companyId);
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

  const deleteMutation = useDeleteAccount(partnershipId, "wellhub");
  const reactivateMutation = useReactivateAccount(partnershipId, "wellhub");
  const updateMutation = useUpdateAccount(partnershipId, "wellhub");

  const allLinkedIds = new Set(
    accounts.flatMap((a) => a.establishments.map((e) => e.id)),
  );

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
      className="ml-auto"
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
      <AccountsTable
        rows={rows}
        namespace="wellhub"
        renderRowActions={(row) => (
          <RowActionsMenu
            status={row.status}
            namespace="wellhub"
            onEdit={() => handleEdit(row.id)}
            onDelete={() => handleDelete(row.id)}
            onReactivate={() => handleReactivate(row.id)}
          />
        )}
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
        <ConfirmationModal
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
  const { data: partnershipId } = useAggregatorPartnershipId(
    PartnershipIdentifier.WELLHUB,
  );
  const companyId = dataAccessLayer.useCompanyTheme()?.company;

  if (partnershipId == null || companyId == null) {
    return null;
  }

  return (
    <AggregatorSection
      logo={<AggregatorLogo src={wellhubLogo} alt="Wellhub" />}
      subtitle={t("wellhub.section.subtitle")}
    >
      <WellhubAccountsSectionContent
        partnershipId={partnershipId}
        companyId={companyId}
      />
    </AggregatorSection>
  );
};
