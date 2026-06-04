import { type FC } from "react";

import { getCurrencyDisplayWithPrice } from "@bsport/currency";
import { useCreditFactor } from "@bsport/kaizen-business-components/buyables/credit-factor";
import { Body, Divider, Loader, Toggle } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useMemberPasses } from "#src/hooks/booking/fetch/use-member-passes";
import { useRetrievePass } from "#src/hooks/buyables/fetch/use-retrieve-pass";
import { useFetchMember } from "#src/hooks/member/fetch/use-fetch-member";
import { useRetrieveSession } from "#src/hooks/session-api/fetch/use-retrieve-session";
import { setNotifyMember } from "#src/stores/booking-flow/actions";
import { getDiscountedPrice } from "#src/stores/booking-flow/get-discounted-price";
import { useBookingFlowStore } from "#src/stores/booking-flow/store";
import { getPassPrice } from "#src/utils/get-pass-price";
import { useTranslation } from "#src/utils/i18n";

import { MemberCard } from "./member-card";

export const ConfirmationStep: FC<{ sessionId: number }> = ({ sessionId }) => {
  const { t } = useTranslation("sessionManagement");
  const { data: session } = useRetrieveSession(sessionId);

  const companyTheme = dataAccessLayer.useCompanyTheme();
  const { getCreditsDividedValue } = useCreditFactor(
    companyTheme?.pass_credit_factor,
  );

  const memberId = useBookingFlowStore((state) => state.memberId);
  const { data: member, isLoading: memberIsLoading } = useFetchMember({
    memberId: memberId!,
  });

  // Existing pass route
  const selectedConsumerPaymentPackId = useBookingFlowStore(
    (state) => state.consumerPaymentPackId,
  );
  const { compatiblePasses } = useMemberPasses({
    memberId: memberId!,
    sessionId,
  });

  const selectedConsumerPaymentPack = compatiblePasses.results.find(
    (cpp) => cpp.id === selectedConsumerPaymentPackId,
  );

  // New pass route
  const paymentPackId = useBookingFlowStore((state) => state.paymentPackId);
  const discount = useBookingFlowStore((state) => state.discount);

  const { data: selectedNewPass, isLoading: newPassIsLoading } =
    useRetrievePass(paymentPackId);

  const isNewPassRoute =
    paymentPackId !== null && !selectedConsumerPaymentPackId;

  const keepCredits = useBookingFlowStore((state) => state.keepCredits);
  const creditPrice = getCreditsDividedValue(
    session.credit_price_override ?? session.credit_price,
  );

  // Existing pass credit info
  const creditsUsed = t("bookingFlow.confirmation.creditsUsed", {
    count: keepCredits ? 0 : creditPrice,
  });

  // Available credits depend on the route
  const availableCredits = isNewPassRoute
    ? getCreditsDividedValue(selectedNewPass?.credits ?? 0)
    : getCreditsDividedValue(
        selectedConsumerPaymentPack?.available_credits ?? 0,
      );

  const isUnlimited = isNewPassRoute
    ? !!selectedNewPass?.unlimited
    : !!selectedConsumerPaymentPack?.passData.unlimited;

  const creditsRemaining = isUnlimited
    ? t("bookingFlow.confirmation.unlimited")
    : t("bookingFlow.confirmation.creditsRemainingAfterBooking", {
        availableAfterBooking: keepCredits
          ? availableCredits
          : Math.max(0, availableCredits - creditPrice),
      });

  // New pass price info
  const newPassBasePrice = selectedNewPass ? getPassPrice(selectedNewPass) : 0;
  const newPassFinalPrice = getDiscountedPrice(newPassBasePrice, discount);

  const hasDiscount = discount?.enabled && newPassFinalPrice < newPassBasePrice;

  const notifyMember = useBookingFlowStore((state) => state.notifyMember);

  if (
    memberIsLoading ||
    compatiblePasses.isLoading ||
    (isNewPassRoute && newPassIsLoading)
  ) {
    return (
      <div className="flex w-full justify-center">
        <Loader size="xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-lg w-full">
      {member && <MemberCard member={member} />}

      {isNewPassRoute && selectedNewPass ? (
        <div className="flex flex-col gap-xs">
          <Body size="sm" weight="strong" color="weaker">
            {t("bookingFlow.confirmation.newPass").toUpperCase()}
          </Body>
          <div className="flex flex-col gap-2xs">
            <div className="flex gap-xs">
              <Body size="lg" weight="weak" color="default">
                {selectedNewPass.name}
              </Body>
              <span>-</span>
              <div className="flex items-center gap-xs">
                {hasDiscount && (
                  <Body size="lg" color="weak" className="line-through">
                    {getCurrencyDisplayWithPrice(newPassBasePrice)}
                  </Body>
                )}
                <Body
                  size="lg"
                  weight="weak"
                  color={hasDiscount ? "positive" : "default"}
                >
                  {getCurrencyDisplayWithPrice(newPassFinalPrice)}
                </Body>
              </div>
            </div>
            <Body size="md" weight="weak" color="weak">
              {selectedNewPass?.unlimited
                ? creditsRemaining
                : `${creditsUsed} · ${creditsRemaining}`}
            </Body>
          </div>
          <Body size="sm" weight="weak" color="weak">
            {t("bookingFlow.confirmation.paymentDueAfterBooking")}
          </Body>
        </div>
      ) : (
        <div className="flex flex-col gap-xs">
          <Body size="sm" weight="strong" color="weaker">
            {t("bookingFlow.confirmation.pass").toUpperCase()}
          </Body>
          <div className="flex flex-col">
            <Body size="lg" weight="weak" color="default">
              {selectedConsumerPaymentPack?.passData.name}
            </Body>
            <Body size="md" weight="weak" color="weak">
              {selectedConsumerPaymentPack?.passData.unlimited
                ? creditsRemaining
                : `${creditsUsed} · ${creditsRemaining}`}
            </Body>
          </div>
        </div>
      )}

      <Divider weight="extra-thin" orientation="horizontal" />
      <div className="flex flex-col gap-xs">
        <Body size="sm" weight="strong" color="weaker">
          {t("bookingFlow.confirmation.notifications.title").toUpperCase()}
        </Body>
        <Toggle
          label={t("bookingFlow.confirmation.notifications.toggleLabel")}
          checked={notifyMember}
          id="notify-member-toggle"
          onToggleChange={(checked) => setNotifyMember(checked)}
        />
      </div>
    </div>
  );
};
