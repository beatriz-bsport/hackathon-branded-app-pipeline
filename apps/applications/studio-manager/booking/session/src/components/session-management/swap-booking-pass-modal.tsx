import { type FC, useCallback, useId, useMemo, useState } from "react";

import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import { useCreditFactor } from "@bsport/kaizen-business-components/buyables/credit-factor";
import {
  Body,
  Chip,
  List,
  type ListItemProps,
  Loader,
  Modal,
  SegmentedControl,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { IncompatibilityChip } from "#src/components/booking-flow/incompatibility-chip";
import { MemberCard } from "#src/components/booking-flow/member-card";
import { useSwapBookingPass } from "#src/hooks/booking/actions/use-swap-booking-pass";
import {
  type RefinedConsumerPaymentPack,
  useMemberPasses,
} from "#src/hooks/booking/fetch/use-member-passes";
import { useFetchMember } from "#src/hooks/member/fetch/use-fetch-member";
import { useRetrieveSession } from "#src/hooks/session-api/fetch/use-retrieve-session";
import { Trans, useTranslation } from "#src/utils/i18n";

enum PassTab {
  COMPATIBLE = "compatible",
  INCOMPATIBLE = "incompatible",
}

type SwapBookingPassModalProps = {
  bookingId: number;
  sessionId: number;
  memberId: number;
  currentConsumerPaymentPackId: number | null;
  isOpen: boolean;
  onClose: () => void;
};

export const SwapBookingPassModal: FC<SwapBookingPassModalProps> = ({
  bookingId,
  sessionId,
  memberId,
  currentConsumerPaymentPackId,
  isOpen,
  onClose,
}) => {
  const { t, i18n } = useTranslation("sessionManagement");
  const locale = i18n.language;
  const listId = useId();

  const [activeTab, setActiveTab] = useState<string>(PassTab.COMPATIBLE);
  const [selectedPassId, setSelectedPassId] = useState<number | null>(
    currentConsumerPaymentPackId,
  );

  const { data: session } = useRetrieveSession(sessionId);
  const { compatiblePasses, incompatiblePasses } = useMemberPasses({
    memberId,
    sessionId,
  });
  const { data: member, isLoading: memberIsLoading } = useFetchMember({
    memberId,
  });

  const swapBookingPass = useSwapBookingPass();

  const handleClose = () => {
    if (swapBookingPass.isPending) return;
    onClose();
  };

  const isUnchanged = selectedPassId === currentConsumerPaymentPackId;

  const companyTheme = dataAccessLayer.useCompanyTheme();
  const { getCreditsDividedValue } = useCreditFactor(
    companyTheme?.pass_credit_factor,
  );

  const formatPassDescription = useCallback(
    (pack: RefinedConsumerPaymentPack) =>
      t("bookingFlow.passSelection.validity", {
        endDate: formatDateTime(
          pack.ending_date,
          DATETIME_FORMATS.MEDIUM_DATE,
          { locale },
        ),
      }),
    [locale, t],
  );

  const compatibleItems = useMemo(
    (): ListItemProps[] =>
      compatiblePasses.results.map((pack) => ({
        id: String(pack.id),
        title: pack.passData.name,
        description: formatPassDescription(pack),
        isActive: pack.id === selectedPassId,
        onItemClick: () => setSelectedPassId(pack.id),
        customNode: (
          <div className="flex flex-col items-end">
            <Body htmlVariant="span" size="lg">
              {pack.passData.unlimited
                ? t("bookingFlow.passSelection.unlimited")
                : t("bookingFlow.passSelection.credits", {
                    count: getCreditsDividedValue(pack.available_credits),
                  })}
            </Body>
            {pack.id === selectedPassId && (
              <Chip
                color="main"
                type="strong"
                size="lg"
                label={t("bookingFlow.passSelection.current")}
              />
            )}
          </div>
        ),
      })),
    [
      compatiblePasses.results,
      selectedPassId,
      formatPassDescription,
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

  const handleConfirm = () => {
    if (selectedPassId === null || isUnchanged) return;

    swapBookingPass.mutate(
      {
        bookingId,
        params: { consumer_payment_pack_id: selectedPassId },
      },
      { onSuccess: onClose },
    );
  };

  return (
    <Modal
      open={isOpen}
      size="md"
      title={t("swapBookingPassModal.title")}
      onClose={handleClose}
      confirmButton={{
        label: t("swapBookingPassModal.confirmButton"),
        onClick: handleConfirm,
        disabled:
          isUnchanged ||
          selectedPassId === null ||
          isLoading ||
          swapBookingPass.isPending,
      }}
      cancelButton={{
        label: t("swapBookingPassModal.cancelButton"),
        onClick: handleClose,
        disabled: isLoading || swapBookingPass.isPending,
      }}
    >
      {isLoading ? (
        <div className="flex w-full justify-center">
          <Loader size="xl" />
        </div>
      ) : (
        <div className="flex flex-col gap-lg w-full">
          {member && <MemberCard member={member} />}
          <div className="flex flex-col gap-md w-full">
            <Body size="lg" weight="weak">
              {t("swapBookingPassModal.description")}
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
              id="swap-pass-tabs"
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
              ]}
              value={activeTab}
              onChangeValue={setActiveTab}
            />

            {activeTab === PassTab.COMPATIBLE && (
              <List
                id={`${listId}-compatible`}
                items={compatibleItems}
                loadingProps={{
                  isLoading: passesAreLoading,
                  message: t("bookingFlow.passSelection.loading"),
                }}
                emptyStateProps={{
                  isEmpty: !passesAreLoading && compatiblePasses.count === 0,
                  emptyConfig: {
                    title: t("bookingFlow.passSelection.emptyCompatible"),
                  },
                }}
              />
            )}

            {activeTab === PassTab.INCOMPATIBLE && (
              <List
                id={`${listId}-incompatible`}
                items={incompatibleItems}
                loadingProps={{
                  isLoading: passesAreLoading,
                  message: t("bookingFlow.passSelection.loading"),
                }}
                emptyStateProps={{
                  isEmpty: !passesAreLoading && incompatiblePasses.count === 0,
                  emptyConfig: {
                    title: t("bookingFlow.passSelection.emptyIncompatible"),
                  },
                }}
              />
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};
