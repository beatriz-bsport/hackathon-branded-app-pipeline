import { Body, Chip, Icon } from "@bsport/kaizen-primitive-core";

import { MemberDetailSection } from "#src/features/member-detail/section/member-detail-section";
import type { MemberDetailContactItem } from "#src/features/member-detail/types";
import { useTranslation } from "#src/utils/i18n";

export type MemberDetailAccountProps = {
  contactItems: MemberDetailContactItem[];
  unpaidInvoicesCount: number;
  creditAccountBalanceValue: string;
};

export function MemberDetailAccount({
  contactItems,
  unpaidInvoicesCount,
  creditAccountBalanceValue,
}: MemberDetailAccountProps) {
  const { t } = useTranslation("member-detail");

  return (
    <MemberDetailSection title={t("accountDetails")}>
      <div className="flex flex-col gap-sm">
        <Contact contactItems={contactItems} />
        <Invoices unpaidInvoicesCount={unpaidInvoicesCount} />
        <AccountBalance creditAccountBalanceValue={creditAccountBalanceValue} />
      </div>
    </MemberDetailSection>
  );
}

function Contact({
  contactItems,
}: Pick<MemberDetailAccountProps, "contactItems">) {
  return (
    <div className="flex flex-col gap-xs">
      {contactItems.map((item) => (
        <div key={item.id} className="flex items-center gap-2xs">
          <Icon aria-hidden icon={item.icon} size="sm" />
          <Body size="sm" color="weak" className="truncate">
            {item.value}
          </Body>
          {item.optedIn ? (
            <Icon
              aria-hidden
              icon="check-circle-solid"
              size="sm"
              className="shrink-0 text-onsurface-status-positive-strong"
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}

function Invoices({
  unpaidInvoicesCount,
}: Pick<MemberDetailAccountProps, "unpaidInvoicesCount">) {
  const { t } = useTranslation("member-detail");

  return (
    <div className="flex flex-col gap-2xs">
      <Body size="sm" color="weak">
        {t("invoices")}
      </Body>
      <div>
        {unpaidInvoicesCount > 0 ? (
          <Chip
            type="weak"
            color="critical"
            size="lg"
            label={
              unpaidInvoicesCount === 1
                ? t("unpaidInvoice", { count: unpaidInvoicesCount })
                : t("unpaidInvoices", { count: unpaidInvoicesCount })
            }
          />
        ) : (
          <Chip
            type="weak"
            color="positive"
            size="lg"
            iconLeft="check-circle"
            label={t("invoicesPaid")}
          />
        )}
      </div>
    </div>
  );
}

function AccountBalance({
  creditAccountBalanceValue,
}: Pick<MemberDetailAccountProps, "creditAccountBalanceValue">) {
  const { t } = useTranslation("member-detail");

  return (
    <div className="flex flex-col gap-2xs">
      <Body size="sm" color="weak">
        {t("creditAccountBalance")}
      </Body>
      <Body size="lg" weight="strong">
        {creditAccountBalanceValue}
      </Body>
    </div>
  );
}
