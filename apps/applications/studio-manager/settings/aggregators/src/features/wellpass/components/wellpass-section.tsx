import { type FC, useCallback, useState } from "react";

import {
  type PartnershipAccount,
  PartnershipIdentifier,
} from "@bsport/api-book";
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
import { useUpdateAccount } from "#src/features/partnership-aggregator/hooks/use-update-account";
import { useTranslation } from "#src/utils/i18n";

import wellpassLogo from "./assets/wellpass-logo.svg";
import { type WellpassFormSchema } from "./wellpass-form/schema";
import { WellpassConfigurationModal } from "./wellpass-form/wellpass-configuration-modal";

type ModalState =
  | { kind: "edit"; account: PartnershipAccount }
  | {
      kind: "edit-warning";
      account: PartnershipAccount;
      values: WellpassFormSchema;
    }
  | null;

const WellpassAccountsSectionContent: FC<{
  partnershipId: number;
  companyId: number;
}> = ({ partnershipId, companyId }) => {
  const { t } = useTranslation("common");
  const { data: accounts } = useAggregatorAccounts(partnershipId);
  const { data: establishments } = useAggregatorEstablishments(companyId);
  const [modalState, setModalState] = useState<ModalState>(null);

  const updateMutation = useUpdateAccount(partnershipId, "wellpass");

  const handleEdit = useCallback(
    (id: string) => {
      const account = accounts.find((a) => a.id === id);
      if (account) setModalState({ kind: "edit", account });
    },
    [accounts],
  );

  const handleEditSubmit = useCallback(
    (account: PartnershipAccount) => async (values: WellpassFormSchema) => {
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

  return (
    <>
      <AccountsTable
        rows={rows}
        namespace="wellpass"
        renderRowActions={(row) => (
          <RowActionsMenu
            status={row.status}
            namespace="wellpass"
            onEdit={() => handleEdit(row.id)}
          />
        )}
      />
      {modalState?.kind === "edit" && (
        <WellpassConfigurationModal
          isOpen
          onClose={() => setModalState(null)}
          account={modalState.account}
          partnershipId={partnershipId}
          establishments={establishments}
          onEditSubmit={handleEditSubmit(modalState.account)}
          isExternalSubmitting={updateMutation.isPending}
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
          title={t("wellpass.confirm.editWarning.title")}
          description={t("wellpass.confirm.editWarning.description")}
          alert={{
            status: "critical",
            content: t("wellpass.confirm.editWarning.alert"),
          }}
          confirmLabel={t("wellpass.confirm.editWarning.confirm")}
          confirmColor="critical"
          cancelLabel={t("wellpass.confirm.editWarning.cancel")}
          isLoading={updateMutation.isPending}
        />
      )}
    </>
  );
};

export const WellpassSection: FC = () => {
  const { t } = useTranslation("common");
  const { data: partnershipId } = useAggregatorPartnershipId(
    PartnershipIdentifier.WELLPASS,
  );
  const companyId = dataAccessLayer.useCompanyTheme()?.company;

  if (partnershipId == null || companyId == null) {
    return null;
  }

  return (
    <AggregatorSection
      logo={<AggregatorLogo src={wellpassLogo} alt="Wellpass" />}
      subtitle={t("wellpass.section.subtitle")}
    >
      <WellpassAccountsSectionContent
        partnershipId={partnershipId}
        companyId={companyId}
      />
    </AggregatorSection>
  );
};
