import { type FC, useMemo } from "react";

import { getCurrencyDisplayWithPrice } from "@bsport/currency";
import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import {
  Body,
  Divider,
  List,
  type ListItemProps,
  Loader,
  Toggle,
} from "@bsport/kaizen-primitive-core";

import { isSpotElement } from "#src/components/spot-selector/spot-canvas/canvas-transformer";
import { composeLabel } from "#src/components/spot-selector/spot-canvas/spot-label";
import { useSpotSelectorData } from "#src/components/spot-selector/spot-selector-modal/use-spot-selector-data";
import { useMemberPasses } from "#src/hooks/booking/fetch/use-member-passes";
import { useSessionCredits } from "#src/hooks/booking/fetch/use-session-credits";
import { useRetrievePass } from "#src/hooks/buyables/fetch/use-retrieve-pass";
import { useFetchMember } from "#src/hooks/member/fetch/use-fetch-member";
import { useFetchSessionsInGroup } from "#src/hooks/session-api/fetch/use-fetch-sessions-in-group";
import { useFetchSimilarSessions } from "#src/hooks/session-api/fetch/use-fetch-similar-sessions";
import { useRetrieveSession } from "#src/hooks/session-api/fetch/use-retrieve-session";
import { setNotifyMember } from "#src/stores/booking-flow/actions";
import { getDiscountedPrice } from "#src/stores/booking-flow/get-discounted-price";
import { useBookingFlowStore } from "#src/stores/booking-flow/store";
import { fetch } from "#src/utils/fetch";
import { getPassPrice } from "#src/utils/get-pass-price";
import { useTranslation } from "#src/utils/i18n";

import { MemberCard } from "./member-card";

type ConfirmationStepProps = {
  sessionId: number;
};

export const ConfirmationStep: FC<ConfirmationStepProps> = ({ sessionId }) => {
  const { t, i18n } = useTranslation("sessionManagement");
  const { data: session } = useRetrieveSession(sessionId);

  const memberId = useBookingFlowStore((state) => state.memberId);
  const { data: member, isLoading: memberIsLoading } = useFetchMember({
    memberId: memberId!,
  });
  const storeSessionIds = useBookingFlowStore((state) => state.sessionIds);

  const isMultiSession = storeSessionIds.length > 1;
  const isSeries = session.group !== null;

  const { data: similarSessions } = useFetchSimilarSessions(
    sessionId,
    isMultiSession && !isSeries,
  );

  const { data: groupSessions } = useFetchSessionsInGroup(
    session.group,
    {
      available: true,
    },
    isMultiSession && isSeries,
  );

  const multiSessions = isSeries ? groupSessions : similarSessions;
  const sessions = isMultiSession ? multiSessions : [session];
  const {
    totalCreditsUsed,
    remainingCredits,
    isUnlimited,
    getSessionCreditCost,
  } = useSessionCredits({
    currentSessionId: sessionId,
    sessions,
  });

  // Existing pass route
  const selectedConsumerPaymentPackId = useBookingFlowStore(
    (state) => state.consumerPaymentPackId,
  );
  // memberId is guaranteed to be non-null at this point (defined at first step of the flow)
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

  const spotIndex = useBookingFlowStore((state) => state.spotIndex);

  // Credit info
  const creditsUsed = t("bookingFlow.confirmation.creditsUsed", {
    count: totalCreditsUsed,
  });

  const creditsRemainingLabel = isUnlimited
    ? t("bookingFlow.confirmation.unlimited")
    : t("bookingFlow.confirmation.creditsRemainingAfterBooking", {
        availableAfterBooking: Math.max(0, remainingCredits),
      });

  // New pass price info
  const newPassBasePrice = selectedNewPass ? getPassPrice(selectedNewPass) : 0;
  const newPassFinalPrice = getDiscountedPrice(newPassBasePrice, discount);

  const hasDiscount = discount?.enabled && newPassFinalPrice < newPassBasePrice;

  const notifyMember = useBookingFlowStore((state) => state.notifyMember);

  // Spot label resolution — the session query is already cached from the
  // spot-selection step so this triggers no extra network request.
  const spotData = useSpotSelectorData({
    sessionId,
    fetch,
    enabled: spotIndex !== null,
  });

  const spotLabel = useMemo(() => {
    if (spotIndex === null || !spotData.roomBlueprint) return null;
    for (const element of spotData.roomBlueprint.canvas.elements ?? []) {
      if (isSpotElement(element) && element.data.index === spotIndex) {
        const spotType = spotData.spotTypes.find(
          (s) => s.id === element.data.spotTypeId,
        );
        return `${spotType?.name ?? ""} ${composeLabel(
          spotType?.prefix,
          element.data.indexType,
          spotIndex,
          spotType?.suffix,
        )}`;
      }
    }
    return String(spotIndex);
  }, [spotIndex, spotData.roomBlueprint, spotData.spotTypes]);

  const sessionsToBookItems = useMemo((): ListItemProps[] => {
    if (!multiSessions) return [];
    return multiSessions
      .filter((session) => storeSessionIds.includes(session.id))
      .map((session) => {
        const startDate = formatDateTime(
          session.date_start,
          DATETIME_FORMATS.MEDIUM_DATE_WITH_WEEKDAY,
          { locale: i18n.language, timeZone: session.timezone_name },
        );
        const startTime = formatDateTime(
          session.date_start,
          DATETIME_FORMATS.TIME_SIMPLE,
          { locale: i18n.language, timeZone: session.timezone_name },
        );
        const creditCost = getSessionCreditCost(session);

        return {
          id: String(session.id),
          title: `${startDate} • ${startTime}`,
          disabled: true,
          customNode: (
            <Body size="md" color="weak">
              {t("bookingFlow.sessionSelection.creditCost", {
                count: creditCost,
              })}
            </Body>
          ),
        };
      });
  }, [multiSessions, storeSessionIds, i18n.language, getSessionCreditCost, t]);

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
    <div className="flex gap-md w-full">
      <div className="flex flex-col gap-lg w-full">
        {member && <MemberCard member={member} />}

        {!isMultiSession && spotLabel !== null && (
          <>
            <div className="flex flex-col gap-xs">
              <Body size="sm" weight="strong" color="weaker">
                {t("bookingFlow.confirmation.sessionDetails").toUpperCase()}
              </Body>
              <Body size="lg" weight="weak" color="default">
                {t("bookingFlow.confirmation.spotLabel", { label: spotLabel })}
              </Body>
            </div>
            <Divider weight="extra-thin" orientation="horizontal" />
          </>
        )}

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
                  ? creditsRemainingLabel
                  : `${creditsUsed} · ${creditsRemainingLabel}`}
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
                  ? creditsRemainingLabel
                  : `${creditsUsed} · ${creditsRemainingLabel}`}
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
      {isMultiSession && sessionsToBookItems.length > 0 && (
        <div className="flex flex-col gap-xs w-full">
          <Body size="sm" weight="strong" color="weaker">
            {t("bookingFlow.confirmation.sessionsToBeBooked", {
              count: sessionsToBookItems.length,
            }).toUpperCase()}
          </Body>
          <div className="max-h-component-modal-max-sm overflow-y-auto">
            <List
              id="confirmation-sessions-list"
              items={sessionsToBookItems}
              isCompact
              className="w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};
