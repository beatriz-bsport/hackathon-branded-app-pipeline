import { type Dispatch, type FC, type SetStateAction } from "react";

import { Pass } from "@bsport/api-buyables";
import { getCurrencyDisplayWithPrice } from "@bsport/currency";
import { useCreditFactor } from "@bsport/kaizen-business-components/buyables/credit-factor";
import {
  AutocompleteControlled,
  Body,
  Button,
  Chip,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { usePassValidity } from "#src/hooks/booking/format/use-pass-validity";
import { setNewPass } from "#src/stores/booking-flow/actions";
import { getDiscountedPrice } from "#src/stores/booking-flow/get-discounted-price";
import { useBookingFlowStore } from "#src/stores/booking-flow/store";
import { LEGACY_URLS } from "#src/urls";
import { getPassPrice } from "#src/utils/get-pass-price";
import { useTranslation } from "#src/utils/i18n";

export const PassSelector: FC<{
  handleMenuScroll: (event: React.UIEvent<HTMLDivElement>) => void;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  isLoading: boolean;
  passes: Pass[];
}> = ({ isLoading, handleMenuScroll, passes, setSearchQuery }) => {
  const { t } = useTranslation("sessionManagement");
  const isMobile = !useMatchMedia("lg");

  const companyTheme = dataAccessLayer.useCompanyTheme();
  const { getCreditsDividedValue } = useCreditFactor(
    companyTheme?.pass_credit_factor,
  );
  const { formatValidity } = usePassValidity();

  const selectedPassId = useBookingFlowStore((state) => state.paymentPackId);
  const discount = useBookingFlowStore((state) => state.discount);

  const selectedPass = passes.find((pass) => pass.id === selectedPassId);

  const autocompleteItems = passes.map((pass) => {
    const credits = pass.unlimited
      ? t("bookingFlow.newPass.unlimited")
      : t("bookingFlow.newPass.credits", {
          count: getCreditsDividedValue(pass.credits ?? 0),
        });
    const validity = formatValidity(pass);
    const description = validity ? `${credits} · ${validity}` : credits;
    const isUniversal = pass.linked_private_pass != null;
    const price = getCurrencyDisplayWithPrice(getPassPrice(pass));

    return {
      id: String(pass.id),
      label: pass.name,
      description,
      rightSlot: (
        <div className="flex flex-col items-end gap-xs">
          <Body htmlVariant="span" size="md" color="weak">
            {price}
          </Body>
          {isUniversal && (
            <Chip
              color="default"
              type="weak"
              size="lg"
              iconLeft="globe-02"
              label={t("bookingFlow.newPass.universal")}
            />
          )}
        </div>
      ),
    };
  });

  const handlePassChange = (next: string[]) => {
    const id = next[0];
    if (id) {
      setNewPass(Number(id));
    }
  };

  return (
    <div className="flex flex-col gap-xs w-full">
      <div className="flex gap-xs items-end">
        <AutocompleteControlled
          searchMode="remote"
          fullWidth
          value={selectedPassId ? [String(selectedPassId)] : []}
          onChange={handlePassChange}
          items={autocompleteItems}
          textfieldProps={{
            id: "new-pass-search",
            placeholder: t("bookingFlow.newPass.searchPlaceholder"),
            label: t("bookingFlow.newPass.searchPlaceholder"),
          }}
          menuProps={{
            className: "max-h-component-select overflow-y-auto w-full",
            onScroll: handleMenuScroll,
          }}
          loadingProps={{
            isLoading: isLoading,
            message: t("bookingFlow.newPass.loading"),
          }}
          onValueChange={setSearchQuery}
          onClear={() => {
            setSearchQuery("");
            setNewPass(null);
          }}
        />
        {!isMobile && (
          <Button
            color="main"
            intent="default"
            label={t("bookingFlow.newPass.goToPassDetails")}
            size="md"
            kind="icon-button"
            icon="share-03"
            onClick={() => {
              if (!selectedPassId) return;
              window.open(
                LEGACY_URLS.PASS_DETAILS(selectedPassId),
                "_blank",
                "noopener,noreferrer",
              );
            }}
            disabled={!selectedPassId}
          />
        )}
      </div>
      {selectedPass && (
        <Body size="sm" color="weak">
          {discount?.enabled && discount.value > 0 ? (
            <>
              {t("bookingFlow.newPass.price")}{" "}
              <span className="line-through">
                {getCurrencyDisplayWithPrice(getPassPrice(selectedPass))}
              </span>{" "}
              <Body
                htmlVariant="span"
                size="sm"
                color="positive"
                weight="stronger"
              >
                {getCurrencyDisplayWithPrice(
                  getDiscountedPrice(getPassPrice(selectedPass), discount),
                )}
              </Body>
            </>
          ) : (
            t("bookingFlow.newPass.priceIndicator", {
              price: getCurrencyDisplayWithPrice(getPassPrice(selectedPass)),
            })
          )}
        </Body>
      )}
      {isMobile && selectedPassId && (
        <Button
          color="main"
          intent="default"
          label={t("bookingFlow.newPass.goToPassDetails")}
          size="sm"
          iconRight="share-03"
          onClick={() => {
            window.open(
              LEGACY_URLS.PASS_DETAILS(selectedPassId),
              "_blank",
              "noopener,noreferrer",
            );
          }}
        />
      )}
    </div>
  );
};
