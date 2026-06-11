// #src/hooks/booking/use-session-credits.ts
import { useCallback, useMemo } from "react";

import { useCreditFactor } from "@bsport/kaizen-business-components/buyables/credit-factor";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useMemberPasses } from "#src/hooks/booking/fetch/use-member-passes";
import { useRetrievePass } from "#src/hooks/buyables/fetch/use-retrieve-pass";
import { useBookingFlowStore } from "#src/stores/booking-flow/store";

type SessionWithCredits = {
  id: number;
  credit_price: number;
  credit_price_override: number | null;
};

type UseSessionCreditsParams = {
  currentSessionId: number;
  sessions: SessionWithCredits[] | undefined;
};

export const useSessionCredits = ({
  currentSessionId,
  sessions,
}: UseSessionCreditsParams) => {
  const sessionIds = useBookingFlowStore((state) => state.sessionIds);
  const paymentPackId = useBookingFlowStore((state) => state.paymentPackId);
  const consumerPaymentPackId = useBookingFlowStore(
    (state) => state.consumerPaymentPackId,
  );
  const memberId = useBookingFlowStore((state) => state.memberId);
  const keepCredits = useBookingFlowStore((state) => state.keepCredits);

  const companyTheme = dataAccessLayer.useCompanyTheme();
  const { getCreditsDividedValue } = useCreditFactor(
    companyTheme?.pass_credit_factor,
  );

  const { data: selectedNewPass } = useRetrievePass(paymentPackId);

  // memberId is guaranteed to be non-null at this point (defined at first step of the flow)
  const { compatiblePasses } = useMemberPasses({
    memberId: memberId!,
    sessionId: currentSessionId,
  });

  const selectedConsumerPaymentPack = useMemo(() => {
    if (!compatiblePasses) return null;
    return compatiblePasses.results.find(
      (cpp) => cpp.id === consumerPaymentPackId,
    );
  }, [compatiblePasses, consumerPaymentPackId]);

  const isNewPassRoute = paymentPackId !== null && !consumerPaymentPackId;

  const isUnlimited = isNewPassRoute
    ? !!selectedNewPass?.unlimited
    : !!selectedConsumerPaymentPack?.passData.unlimited;

  const availableCredits = isNewPassRoute
    ? getCreditsDividedValue(selectedNewPass?.credits ?? 0)
    : getCreditsDividedValue(
        selectedConsumerPaymentPack?.available_credits ?? 0,
      );

  const getSessionCreditCost = useCallback(
    (session: SessionWithCredits) =>
      getCreditsDividedValue(
        session.credit_price_override ?? session.credit_price,
      ),
    [getCreditsDividedValue],
  );

  const totalCreditsUsed = useMemo(() => {
    if (!sessions || keepCredits || isUnlimited) return 0;
    const total = sessions
      .filter((s) => sessionIds.includes(s.id))
      .reduce((sum, s) => sum + getSessionCreditCost(s), 0);
    return Math.round(total * 10) / 10;
  }, [sessions, sessionIds, getSessionCreditCost, keepCredits, isUnlimited]);

  const remainingCredits =
    Math.round((availableCredits - totalCreditsUsed) * 10) / 10;

  return {
    totalCreditsUsed,
    availableCredits,
    remainingCredits,
    isUnlimited,
    getSessionCreditCost,
  };
};
