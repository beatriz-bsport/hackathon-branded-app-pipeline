import { type FC, useCallback } from "react";

import { Body, Button } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { toAccountRow } from "../adapters/account-row";
import { useMyclubsAccounts } from "../hooks/use-myclubs-accounts";
import { useMyclubsPartnershipId } from "../hooks/use-myclubs-partnership-id";
import { MyClubsLogo } from "./my-clubs-logo";
import { MyclubsAccountsTable } from "./myclubs-accounts-table";

const MyclubsAccountsSectionContent: FC<{ partnershipId: number }> = ({
  partnershipId,
}) => {
  const { data: accounts } = useMyclubsAccounts(partnershipId);
  const rows = accounts.map(toAccountRow);

  return <MyclubsAccountsTable rows={rows} />;
};

export const MyClubsSection: FC = () => {
  const { t } = useTranslation("common");
  const { data: partnershipId } = useMyclubsPartnershipId();

  const handleOpenCreatePartnerId = useCallback(() => {
    // Issue 1 only adds the header CTA shell; the create flow comes next.
  }, []);

  if (partnershipId == null) {
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
      <MyclubsAccountsSectionContent partnershipId={partnershipId} />
      <Button
        key="button-generate-myclubs-partner-id"
        iconLeft="plus"
        intent="call-to-action"
        color="main"
        size="md"
        label={t("myclubs.actions.generatePartnerId")}
        onClick={handleOpenCreatePartnerId}
      />
    </section>
  );
};
