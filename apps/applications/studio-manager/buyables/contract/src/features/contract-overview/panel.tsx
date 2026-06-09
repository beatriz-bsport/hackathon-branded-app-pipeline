import type { FC } from "react";

import {
  BILLING_INTERVALS,
  type Contract,
} from "@bsport/api-buyables/contract";
import { getCurrencyDisplayWithPrice } from "@bsport/currency";
import { Title } from "@bsport/kaizen-primitive-core";

import { BenefitsCardWithQuery } from "#src/features/benefits-card";
import { useTranslation } from "#src/utils/i18n";

import { PanelItem } from "./panel-item";
import { TagsOverview } from "./tags-overview";

type ContractOverviewPanelProps = {
  contract: Contract;
};

export const ContractOverviewPanel: FC<ContractOverviewPanelProps> = ({
  contract,
}) => {
  const { t } = useTranslation("contract-details");

  const getIntervalTranslation = (recurrence: number) => ({
    [BILLING_INTERVALS.DAY]: `${recurrence} ${t("intervals.day", { count: recurrence })}`,
    [BILLING_INTERVALS.WEEK]: `${recurrence} ${t("intervals.week", { count: recurrence })}`,
    [BILLING_INTERVALS.MONTH]: `${recurrence} ${t("intervals.month", { count: recurrence })}`,
    [BILLING_INTERVALS.YEAR]: `${recurrence} ${t("intervals.year", { count: recurrence })}`,
  });

  const cycleDuration = getIntervalTranslation(contract.recurrence_basis)[
    contract.interval
  ];
  const totalDuration = getIntervalTranslation(
    contract.recurrence_basis * contract.nb_interval,
  )[contract.interval];

  const commitmentPeriod =
    contract.commitment_period_value != null &&
    contract.commitment_period_unit != null
      ? getIntervalTranslation(contract.commitment_period_value)[
          contract.commitment_period_unit
        ]
      : t("overview.panel.noneCommitmentPeriod");

  return (
    <div className="gap-md grid grid-cols-2">
      <Title htmlVariant="h3" weight="strong" className="col-span-2">
        {t("overview.panel.title")}
      </Title>
      <PanelItem title={t("formFields.name.label")} className="col-span-2">
        {contract.name}
      </PanelItem>

      <PanelItem title={t("formFields.recurringAmount.label")}>
        {getCurrencyDisplayWithPrice(contract.recurrent_price)}
      </PanelItem>
      <PanelItem title={t("formFields.duration.label")}>
        {totalDuration}
      </PanelItem>

      <PanelItem title={t("formFields.joinFee.label")}>
        {getCurrencyDisplayWithPrice(contract.flat_fee)}
      </PanelItem>
      <PanelItem title={t("formSections.billingCycle")}>
        {t("intervals.everyInterval", { interval: cycleDuration })}
      </PanelItem>

      <PanelItem title={t("formFields.autoRenewal.label")}>
        {contract.auto_renewal
          ? t("overview.panel.yes")
          : t("overview.panel.no")}
      </PanelItem>
      <PanelItem title={t("formFields.commitmentPeriod.label")}>
        {commitmentPeriod}
      </PanelItem>

      <PanelItem
        title={t("overview.panel.tagsAfterPurchase")}
        className="col-span-2"
      >
        <TagsOverview tags={contract.tags_on_first_billing} />
      </PanelItem>

      <PanelItem title={t("formSections.benefits")} className="col-span-2">
        <BenefitsCardWithQuery
          appointmentPassId={contract.private_pass}
          passId={contract.payment_pack}
        />
      </PanelItem>
    </div>
  );
};
