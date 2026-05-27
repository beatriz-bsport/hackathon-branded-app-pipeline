import { type FC, useCallback, useId, useMemo, useState } from "react";

import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import { useCreditFactor } from "@bsport/kaizen-business-components/buyables/credit-factor";
import {
  Avatar,
  Body,
  Card,
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
import { useFetchMember } from "#src/hooks/member/fetch/use-fetch-member.js";
import { useRetrieveSession } from "#src/hooks/session-api/fetch/use-retrieve-session.js";
import { setKeepCredits, setPass } from "#src/stores/booking-flow/actions";
import { useBookingFlowStore } from "#src/stores/booking-flow/store";
import { useTranslation } from "#src/utils/i18n";

import { IncompatibilityChip } from "./incompatibility-chip";

enum PassTab {
  COMPATIBLE = "compatible",
  INCOMPATIBLE = "incompatible",
  BILL_NEW = "bill_new",
}

type PassSelectionStepProps = {
  sessionId: number;
};

export const PassSelectionStep: FC<PassSelectionStepProps> = ({
  sessionId,
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
            getCreditsDividedValue(pack.available_credits) -
              getCreditsDividedValue(
                session.credit_price_override ?? session.credit_price,
              ),
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
        onItemClick: () => setPass(pack.id),
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

  const isLoading = passesAreLoading || memberIsLoading;

  if (isLoading) {
    return (
      <div className="flex w-full justify-center">
        <Loader size="xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-md w-full">
      {member && (
        // TODO: Create a variant of Card without padding and use it here instead of overriding with CSS
        <Card className="bg-surface-page-navigation border-none">
          <div className="flex items-center gap-sm">
            <Avatar src={member.photo} shape="round" size="md" />
            <div className="flex flex-col">
              <Body size="lg">{member.name}</Body>
              <Body size="md" color="weak">
                {member.email}
              </Body>
            </div>
          </div>
        </Card>
      )}
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
        <div className="flex h-component-modal-max-sm items-center justify-center">
          <Body htmlVariant="p" size="lg" color="weak">
            {t("bookingFlow.passSelection.billNewPlaceholder")}
          </Body>
        </div>
      )}
    </div>
  );
};
