import { type FC } from "react";

import { useCreditFactor } from "@bsport/kaizen-business-components/buyables/credit-factor";
import { Body, Divider, Loader, Toggle } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useMemberPasses } from "#src/hooks/booking/fetch/use-member-passes";
import { useFetchMember } from "#src/hooks/member/fetch/use-fetch-member";
import { useRetrieveSession } from "#src/hooks/session-api/fetch/use-retrieve-session";
import { setNotifyMember } from "#src/stores/booking-flow/actions";
import { useBookingFlowStore } from "#src/stores/booking-flow/store";
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

  const selectedPassId = useBookingFlowStore(
    (state) => state.consumerPaymentPackId,
  );
  const { compatiblePasses } = useMemberPasses({
    memberId: memberId!,
    sessionId,
  });
  const selectedPass = compatiblePasses.results.find(
    (cpp) => cpp.id === selectedPassId,
  );

  const keepCredits = useBookingFlowStore((state) => state.keepCredits);
  const creditPrice = getCreditsDividedValue(
    session.credit_price_override ?? session.credit_price,
  );
  const creditsUsed = t("bookingFlow.confirmation.creditsUsed", {
    count: keepCredits ? 0 : creditPrice,
  });
  const passAvailableCredits = getCreditsDividedValue(
    selectedPass?.available_credits ?? 0,
  );
  const creditsRemaining = selectedPass?.passData.unlimited
    ? t("bookingFlow.confirmation.unlimited")
    : t("bookingFlow.confirmation.creditsRemainingAfterBooking", {
        availableAfterBooking: keepCredits
          ? passAvailableCredits
          : Math.max(0, passAvailableCredits - creditPrice),
      });

  const notifyMember = useBookingFlowStore((state) => state.notifyMember);

  if (memberIsLoading || compatiblePasses.isLoading) {
    return (
      <div className="flex w-full justify-center">
        <Loader size="xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-lg w-full">
      {member && <MemberCard member={member} />}
      <div className="flex flex-col gap-xs">
        <Body size="sm" weight="strong" color="weaker">
          {t("bookingFlow.confirmation.pass").toUpperCase()}
        </Body>
        <div className="flex flex-col">
          <Body size="lg" weight="weak" color="default">
            {selectedPass?.passData.name}
          </Body>
          <Body size="md" weight="weak" color="weak">
            {selectedPass?.passData.unlimited
              ? creditsRemaining
              : `${creditsUsed} · ${creditsRemaining}`}
          </Body>
        </div>
      </div>
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
