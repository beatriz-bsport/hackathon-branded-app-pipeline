import { type FC, useEffect } from "react";

import { Select } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useFetchEstablishmentBillingGroups } from "#src/hooks/establishment-billing-group/fetch/use-fetch-establishment-billing-group";
import { setBillingGroupId } from "#src/stores/booking-flow/actions";
import { useBookingFlowStore } from "#src/stores/booking-flow/store";
import { useTranslation } from "#src/utils/i18n";

export const BillingGroupSelector: FC = () => {
  const { t } = useTranslation("sessionManagement");
  const companyTheme = dataAccessLayer.useCompanyTheme();
  const companyId = companyTheme?.company;

  const billingGroupId = useBookingFlowStore((state) => state.billingGroupId);

  const { data: activeBillingGroups, isLoading: billingGroupsLoading } =
    useFetchEstablishmentBillingGroups({ company: companyId }, ({ results }) =>
      results.filter((billingGroup) => !billingGroup.disabled),
    );

  const billingGroupOptions = (activeBillingGroups ?? []).map(
    (billingGroup) => ({
      id: String(billingGroup.id),
      label: billingGroup.name,
    }),
  );

  const handleBillingGroupChange = (value: string) => {
    const id = value ? Number(value) : null;
    setBillingGroupId(id);
  };

  useEffect(() => {
    if (billingGroupId == null && billingGroupOptions[0]) {
      setBillingGroupId(Number(billingGroupOptions[0].id));
    }
  }, [billingGroupId, billingGroupOptions]);

  if (!activeBillingGroups?.length) return null;
  return (
    <Select
      id="billing-group-select"
      label={t("bookingFlow.newPass.billingGroupLabel")}
      items={billingGroupOptions}
      value={
        billingGroupId ? String(billingGroupId) : billingGroupOptions[0]?.id
      }
      onChange={handleBillingGroupChange}
      loadingProps={{
        isLoading: billingGroupsLoading,
      }}
      required
      fullWidth
    />
  );
};
