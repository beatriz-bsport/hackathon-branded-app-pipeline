import { type FC, useCallback, useId, useMemo, useState } from "react";

import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import { useCreditFactor } from "@bsport/kaizen-business-components/buyables/credit-factor";
import {
  Body,
  Card,
  Checkbox,
  List,
  type ListItemProps,
  Loader,
  SegmentedControl,
  Toggle,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import {
  type RefinedConsumerPaymentPack,
  useMemberPasses,
} from "#src/hooks/booking/fetch/use-member-passes";
import { useFetchMember } from "#src/hooks/member/fetch/use-fetch-member";
import { useFetchSimilarSessions } from "#src/hooks/session-api/fetch/use-fetch-similar-sessions";
import { useRetrieveSession } from "#src/hooks/session-api/fetch/use-retrieve-session";
import {
  setDiscount,
  setKeepCredits,
  setPass,
} from "#src/stores/booking-flow/actions";
import { useBookingFlowStore } from "#src/stores/booking-flow/store";
import { Trans, useTranslation } from "#src/utils/i18n";

import { IncompatibilityChip } from "./incompatibility-chip";
import { MemberCard } from "./member-card";
import { NewPassForm } from "./new-pass-form/new-pass-form";

enum PassTab {
  COMPATIBLE = "compatible",
  INCOMPATIBLE = "incompatible",
  BILL_NEW = "bill_new",
}

type PassSelectionStepProps = {
  sessionId: number;
  isBookMultiSessionsSelected: boolean;
  onSelectBookMultiSessions: (value: boolean) => void;
  isConvertBookingOption: boolean;
};

export const PassSelectionStep: FC<PassSelectionStepProps> = ({
  sessionId,
  isBookMultiSessionsSelected,
  onSelectBookMultiSessions,
  isConvertBookingOption,
}) => {
  const { t, i18n } = useTranslation("sessionManagement");
  const locale = i18n.language;

  const listId = useId();

  const [activeTab, setActiveTab] = useState<string>(PassTab.COMPATIBLE);

  const memberId = useBookingFlowStore((state) => state.memberId);
  const selectedPassId = useBookingFlowStore(
    (state) => state.consumerPaymentPackId,
  );
  const keepCredits = useBookingFlowStore((state) => state.keepCredits);

  const { data: session } = useRetrieveSession(sessionId);

  const { data: similarSessions, isLoading: similarSessionsLoading } =
    useFetchSimilarSessions(sessionId, !session.group);
  // memberId is guaranteed to be non-null at this point (defined at first step of the flow)
  const { compatiblePasses, incompatiblePasses } = useMemberPasses({
    memberId: memberId!,
    sessionId,
  });
  const { data: member, isLoading: memberIsLoading } = useFetchMember({
    memberId: memberId!,
  });

  const formatPassDescription = useCallback(
    (pack: RefinedConsumerPaymentPack) => {
      const validity = t("bookingFlow.passSelection.validity", {
        endDate: formatDateTime(
          pack.ending_date,
          DATETIME_FORMATS.MEDIUM_DATE,
          {
            locale,
          },
        ),
      });
      return validity;
    },
    [locale, t],
  );

  const companyTheme = dataAccessLayer.useCompanyTheme();
  const { getCreditsDividedValue } = useCreditFactor(
    companyTheme?.pass_credit_factor,
  );

  const getRemainingCreditsLabel = useCallback(
    (pack: RefinedConsumerPaymentPack) => {
      const remaining = keepCredits
        ? getCreditsDividedValue(pack.available_credits)
        : Math.max(
            0,
            Math.round(
              (getCreditsDividedValue(pack.available_credits) -
                getCreditsDividedValue(
                  session.credit_price_override ?? session.credit_price,
                )) *
                10,
            ) / 10,
          );
      return t("bookingFlow.passSelection.creditsLeftAfterBooking", {
        availableAfterBooking: remaining,
      });
    },
    [
      keepCredits,
      t,
      getCreditsDividedValue,
      session.credit_price,
      session.credit_price_override,
    ],
  );

  const compatibleItems = useMemo(
    (): ListItemProps[] =>
      compatiblePasses.results.map((pack) => ({
        id: String(pack.id),
        title: pack.passData.name,
        description: formatPassDescription(pack),
        isActive: pack.id === selectedPassId,
        onItemClick: () => {
          setDiscount(null);
          setPass(pack.id);
        },
        customNode: (
          <div className="flex flex-col items-end">
            <Body htmlVariant="span" size="lg">
              {pack.passData.unlimited
                ? t("bookingFlow.passSelection.unlimited")
                : t("bookingFlow.passSelection.credits", {
                    count: getCreditsDividedValue(pack.available_credits),
                  })}
            </Body>
            {!pack.passData.unlimited && (
              <Body size="md" color="weak">
                {getRemainingCreditsLabel(pack)}
              </Body>
            )}
          </div>
        ),
      })),
    [
      compatiblePasses.results,
      selectedPassId,
      formatPassDescription,
      getRemainingCreditsLabel,
      getCreditsDividedValue,
      t,
    ],
  );

  const incompatibleItems = useMemo(
    (): ListItemProps[] =>
      incompatiblePasses.results.map((pack) => ({
        id: String(pack.id),
        title: pack.passData.name,
        description: formatPassDescription(pack),
        disabled: true,
        customNode: (
          <IncompatibilityChip
            consumerPaymentPackId={pack.id}
            sessionId={sessionId}
          />
        ),
      })),
    [incompatiblePasses.results, sessionId, formatPassDescription],
  );

  const passesAreLoading =
    compatiblePasses.isLoading || incompatiblePasses.isLoading;

  const isLoading =
    passesAreLoading || memberIsLoading || similarSessionsLoading;

  if (isLoading) {
    return (
      <div className="flex w-full justify-center">
        <Loader size="xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-lg w-full">
      {member && <MemberCard member={member} />}
      <div className="flex flex-col gap-md w-full">
        <Body size="lg" weight="weak">
          {t("bookingFlow.passSelection.description")}
        </Body>
        <Body size="md" weight="weak">
          <Trans
            // @ts-expect-error - The i18nKey is correct, but the type definition doesn't allow for nested keys
            t={t}
            i18nKey="bookingFlow.passSelection.costInformation"
            ns="sessionManagement"
            components={{ strong: <strong /> }}
            values={{
              count: getCreditsDividedValue(
                session.credit_price_override ?? session.credit_price,
              ),
            }}
          />
        </Body>
        <SegmentedControl
          fullWidth
          id="pass-selection-tabs"
          options={[
            {
              label: t("bookingFlow.passSelection.tabs.compatible"),
              badge: {
                color: "default",
                size: "sm",
                text: String(compatiblePasses.count),
              },
              value: PassTab.COMPATIBLE,
            },
            {
              label: t("bookingFlow.passSelection.tabs.incompatible"),
              badge: {
                color: "default",
                size: "sm",
                text: String(incompatiblePasses.count),
              },
              value: PassTab.INCOMPATIBLE,
            },
            {
              label: t("bookingFlow.passSelection.tabs.billNew"),
              value: PassTab.BILL_NEW,
            },
          ]}
          value={activeTab}
          onChangeValue={setActiveTab}
        />

        {activeTab === PassTab.COMPATIBLE && (
          <>
            <div className="overflow-y-auto ">
              <List
                id={`${listId}-compatible`}
                items={compatibleItems}
                loadingProps={{
                  isLoading,
                  message: t("bookingFlow.passSelection.loading"),
                }}
                emptyStateProps={{
                  isEmpty: !isLoading && compatiblePasses.count === 0,
                  emptyConfig: {
                    title: t("bookingFlow.passSelection.emptyCompatible"),
                  },
                }}
              />
            </div>
            <Toggle
              id="keep-credits-toggle"
              checked={keepCredits}
              label={t("bookingFlow.passSelection.keepCreditsLabel")}
              helperText={t("bookingFlow.passSelection.keepCreditsDescription")}
              onToggleChange={setKeepCredits}
            />
          </>
        )}

        {activeTab === PassTab.INCOMPATIBLE && (
          <List
            id={`${listId}-incompatible`}
            items={incompatibleItems}
            loadingProps={{
              isLoading,
              message: t("bookingFlow.passSelection.loading"),
            }}
            emptyStateProps={{
              isEmpty: !isLoading && incompatiblePasses.count === 0,
              emptyConfig: {
                title: t("bookingFlow.passSelection.emptyIncompatible"),
              },
            }}
          />
        )}

        {activeTab === PassTab.BILL_NEW && (
          <NewPassForm sessionId={sessionId} />
        )}
      </div>
      {!!similarSessions?.length && !isConvertBookingOption && (
        <>
          <Body size="lg">
            {t("bookingFlow.passSelection.moreBookingOptions")}
          </Body>
          <Card
            actionable
            elevated={isBookMultiSessionsSelected}
            selected={isBookMultiSessionsSelected}
            onClick={() =>
              onSelectBookMultiSessions(!isBookMultiSessionsSelected)
            }
          >
            <div className="flex items-center gap-md">
              <Checkbox
                id="book-future-dates-checkbox"
                value={isBookMultiSessionsSelected ? "checked" : "unchecked"}
                onChange={() =>
                  onSelectBookMultiSessions(!isBookMultiSessionsSelected)
                }
              />
              <div className="flex flex-col">
                <Body size="lg">
                  {t("bookingFlow.passSelection.bookFutureDates")}
                </Body>
                <Body size="md" color="weak">
                  {t("bookingFlow.passSelection.bookFutureDatesDescription")}
                </Body>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};
