import { type FC } from "react";

import { PartnershipIdentifier } from "@bsport/api-book";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { toAccountRow } from "#src/features/partnership-aggregator/adapters/account-row";
import { AccountsTable } from "#src/features/partnership-aggregator/components/accounts-table";
import { AggregatorSection } from "#src/features/partnership-aggregator/components/aggregator-section";
import { AggregatorLogo } from "#src/features/partnership-aggregator/components/logo";
import { RowActionsMenu } from "#src/features/partnership-aggregator/components/row-actions-menu";
import { useAggregatorAccounts } from "#src/features/partnership-aggregator/hooks/use-aggregator-accounts";
import { useAggregatorPartnershipId } from "#src/features/partnership-aggregator/hooks/use-aggregator-partnership-id";
import { useTranslation } from "#src/utils/i18n";

import uscLogo from "./assets/usc-logo.png";

const UscAccountsSectionContent: FC<{ partnershipId: number }> = ({
  partnershipId,
}) => {
  const { data: accounts } = useAggregatorAccounts(partnershipId);
  const rows = accounts.map(toAccountRow);

  return (
    <AccountsTable
      rows={rows}
      namespace="usc"
      readOnly
      renderRowActions={() => <RowActionsMenu namespace="usc" readOnly />}
    />
  );
};

export const UscSection: FC = () => {
  const { t } = useTranslation("common");
  const { data: partnershipId } = useAggregatorPartnershipId(
    PartnershipIdentifier.USC,
  );
  const companyId = dataAccessLayer.useCompanyTheme()?.company;

  if (partnershipId == null || companyId == null) {
    return null;
  }

  return (
    <AggregatorSection
      logo={<AggregatorLogo src={uscLogo} alt="Urban Sports Club" />}
      subtitle={t("usc.section.subtitle")}
    >
      <UscAccountsSectionContent partnershipId={partnershipId} />
    </AggregatorSection>
  );
};
