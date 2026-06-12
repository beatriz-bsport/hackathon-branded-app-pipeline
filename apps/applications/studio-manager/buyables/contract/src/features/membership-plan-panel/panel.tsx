import { type FC } from "react";

import type { BillingPlan } from "@bsport/api-buyables/billing-plan";
import { getCurrencyDisplayWithPrice } from "@bsport/currency";
import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import { Body, Divider, Link, Toggle } from "@bsport/kaizen-primitive-core";

import { PanelItem } from "#src/components/panel-item";
import { LEGACY_URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

import { MembershipPlanPauseList } from "./pause-list";

type Props = {
  membershipPlan: BillingPlan;
};

const formatShortDate = (date: string) =>
  formatDateTime(date, DATETIME_FORMATS.SHORT_DATE);

export const MembershipPlanDetailsPanel: FC<Props> = ({ membershipPlan }) => {
  const { t } = useTranslation(["membership-plan", "contract-details"]);

  const billingCycles = membershipPlan.has_changed_after_renewal
    ? (membershipPlan.nb_interval_after_auto_renewal ??
      membershipPlan.nb_interval)
    : membershipPlan.nb_interval;

  const commitmentPeriodCount = membershipPlan.commitment_period_value;
  // TODO: move interval translations to a shared common namespace so contract-details and membership-plan don't duplicate them.
  const commitmentIntervalLabel = (
    {
      day: t("intervals.day", {
        ns: "contract-details",
        count: commitmentPeriodCount,
      }),
      week: t("intervals.week", {
        ns: "contract-details",
        count: commitmentPeriodCount,
      }),
      month: t("intervals.month", {
        ns: "contract-details",
        count: commitmentPeriodCount,
      }),
      year: t("intervals.year", {
        ns: "contract-details",
        count: commitmentPeriodCount,
      }),
    } as Record<string, string>
  )[membershipPlan.commitment_period_unit];

  return (
    <div className="flex flex-col gap-sm">
      <PanelItem title={t("panel.details.name")}>
        {membershipPlan.name_without_member_name}
      </PanelItem>

      <div className="grid grid-cols-2 gap-xs">
        <PanelItem title={t("panel.details.recurringPrice")}>
          {getCurrencyDisplayWithPrice(
            parseFloat(membershipPlan.recurrent_price),
          )}
        </PanelItem>
        <PanelItem title={t("panel.details.joinFee")}>
          {getCurrencyDisplayWithPrice(parseFloat(membershipPlan.flat_fee))}
        </PanelItem>
      </div>

      <div className="grid grid-cols-2 items-start gap-xs">
        <PanelItem title={t("panel.details.billingCycles")}>
          {billingCycles}
        </PanelItem>
        <div className="flex flex-col gap-2xs">
          <Body size="sm" color="weak">
            {t("panel.details.autoRenewal")}
          </Body>
          <Toggle
            id="membership-plan-auto-renewal"
            label=""
            aria-label={t("panel.details.autoRenewal")}
            checked={membershipPlan.auto_renewal}
            disabled={!membershipPlan.editable}
            onToggleChange={(_value) => {
              // TODO: wire to the revamped update_renewal endpoint once it leaves the legacy subscription / domain.
              // No local optimistic state until the mutation is available, the toggle reflects server state directly.
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-xs">
        <PanelItem title={t("panel.details.commitmentPeriod")}>
          {membershipPlan.has_mandatory_commitment_period &&
          commitmentIntervalLabel
            ? `${commitmentPeriodCount} ${commitmentIntervalLabel}`
            : "—"}
        </PanelItem>
        <PanelItem title={t("panel.details.remainingPeriod")}>
          {membershipPlan.is_within_commitment_period &&
          membershipPlan.forecasted_expiration_date
            ? t("panel.details.remainingUntil", {
                date: formatShortDate(
                  membershipPlan.forecasted_expiration_date,
                ),
              })
            : "—"}
        </PanelItem>
      </div>

      <PanelItem title={t("panel.details.member")}>
        <Link
          href={LEGACY_URLS.MEMBER_PROFILE(membershipPlan.member)}
          aria-label={t("panel.details.memberProfile")}
          className="flex-row-reverse"
          icon="link-external-02"
          weight="strong"
          target="_blank"
          rel="noopener noreferrer"
        >
          {membershipPlan.memberName}
        </Link>
      </PanelItem>

      <Divider className="my-xs" weight="extra-thin" />

      <MembershipPlanPauseList pauses={membershipPlan.pauses} />

      <Divider className="my-xs" weight="extra-thin" />

      <section className="flex flex-col gap-xs">
        <Body size="md" weight="strong">
          {t("panel.details.notes.title")}
        </Body>

        <Body size="sm" color={membershipPlan.note ? "default" : "weak"}>
          {membershipPlan.note || t("panel.details.notes.empty")}
        </Body>

        {membershipPlan.stop_note && (
          <div className="flex flex-col gap-2xs">
            <Body size="sm" weight="strong">
              {t("panel.details.notes.stopNote")}
            </Body>
            <Body size="sm">{membershipPlan.stop_note}</Body>
          </div>
        )}
      </section>
    </div>
  );
};
