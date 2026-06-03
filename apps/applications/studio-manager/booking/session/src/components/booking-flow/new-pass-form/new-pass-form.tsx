import { type FC, useState } from "react";

import { Toggle } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useAvailablePasses } from "#src/hooks/buyables/fetch/use-available-passes";
import { useInfiniteScroll } from "#src/hooks/use-infinite-scroll";
import { setDiscount } from "#src/stores/booking-flow/actions";
import { useBookingFlowStore } from "#src/stores/booking-flow/store";
import { useTranslation } from "#src/utils/i18n";

import { BillingGroupSelector } from "./billing-group-selector";
import { DiscountForm } from "./discount-form";
import { PassSelector } from "./pass-selector";

type NewPassFormProps = {
  sessionId: number;
};

export const NewPassForm: FC<NewPassFormProps> = ({ sessionId }) => {
  const { t } = useTranslation("sessionManagement");

  const companyTheme = dataAccessLayer.useCompanyTheme();
  const companyId = companyTheme?.company;

  const selectedPassId = useBookingFlowStore((state) => state.paymentPackId);
  const discount = useBookingFlowStore((state) => state.discount);

  const [searchQuery, setSearchQuery] = useState("");

  const {
    passes,
    isLoading: passesLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useAvailablePasses({
    companyId,
    sessionId,
    searchQuery,
  });

  const { onScroll: handleMenuScroll } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  const selectedPass = passes.find((p) => p.id === selectedPassId);

  const handleDiscountToggle = (enabled: boolean) => {
    if (enabled) {
      setDiscount({
        enabled: true,
        type: "percentage",
        value: 0,
        reason: "",
      });
    } else {
      setDiscount(null);
    }
  };

  return (
    <div className="flex flex-col gap-md w-full">
      <PassSelector
        handleMenuScroll={handleMenuScroll}
        isLoading={passesLoading}
        passes={passes}
        setSearchQuery={setSearchQuery}
      />
      <div className="flex flex-col gap-md">
        <BillingGroupSelector />

        <Toggle
          id="discount-toggle"
          label={t("bookingFlow.newPass.discountToggleLabel")}
          checked={discount?.enabled ?? false}
          onToggleChange={handleDiscountToggle}
        />

        <DiscountForm selectedPass={selectedPass} />
      </div>
    </div>
  );
};
