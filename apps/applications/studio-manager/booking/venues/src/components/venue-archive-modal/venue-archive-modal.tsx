import { useQuery } from "@tanstack/react-query";
import { type FC } from "react";

import {
  type CheckDeleteEstablishmentData,
  type Establishment,
  checkDeleteEstablishmentQueryOptions,
} from "@bsport/api-book";
import { Alert, Body, Loader, Modal } from "@bsport/kaizen-primitive-core";

import { useArchiveVenue } from "#src/hooks/api/use-archive-venue";
import { fetch } from "#src/utils/fetch";
import { type NamespacedTFunction, useTranslation } from "#src/utils/i18n";

type ModalMessage = { key: string; label: string };

// Blocking reasons: venue cannot be archived until resolved by the user
const getErrorMessages = (
  data: CheckDeleteEstablishmentData,
  t: NamespacedTFunction<"venues-list">,
): ModalMessage[] => {
  const messages: ModalMessage[] = [];

  if (data.has_upcoming_offers) {
    messages.push({
      key: "offers",
      label: t("modal.errors.hasUpcomingOffers"),
    });
  }
  if (data.has_upcoming_private_bookings) {
    messages.push({
      key: "bookings",
      label: t("modal.errors.hasUpcomingPrivateBookings"),
    });
  }
  if (data.establishment_billing_group.is_exclusive) {
    messages.push({
      key: "billing",
      label: t("modal.errors.hasExclusiveBillingGroup"),
    });
  }
  if (data.establishment_group.exclusive_establishment_groups.length > 0) {
    const names = data.establishment_group.exclusive_establishment_groups
      .map((g) => g.establishment_group_name)
      .join(", ");
    messages.push({
      key: "groups",
      label: t("modal.errors.exclusiveEstablishmentGroups", { names }),
    });
  }
  if (data.payment_pack.exclusive_payment_packs.length > 0) {
    const names = data.payment_pack.exclusive_payment_packs
      .map((p) => p.payment_pack_name)
      .join(", ");
    messages.push({
      key: "packs",
      label: t("modal.errors.exclusivePaymentPacks", { names }),
    });
  }
  if (
    data.marketplace_component_config
      .has_exclusive_marketplace_component_configs
  ) {
    messages.push({
      key: "marketplace",
      label: t("modal.errors.hasExclusiveMarketplaceComponentConfigs"),
    });
  }
  if (data.is_integrated_in_partnership) {
    messages.push({
      key: "partnership",
      label: t("modal.errors.isIntegratedInPartnership"),
    });
  }

  return messages;
};

// Non-blocking side effects: archiving will proceed but these items will be impacted
const getWarningMessages = (
  data: CheckDeleteEstablishmentData,
  t: NamespacedTFunction<"venues-list">,
): ModalMessage[] => {
  const messages: ModalMessage[] = [];

  if (
    data.establishment_billing_group.establishment_billing_group_name &&
    !data.establishment_billing_group.is_exclusive
  ) {
    messages.push({
      key: "billing",
      label: t("modal.warnings.hasBillingGroup", {
        name: data.establishment_billing_group.establishment_billing_group_name,
      }),
    });
  }
  if (data.private_service.exclusive_private_services.length > 0) {
    const names = data.private_service.exclusive_private_services
      .map((s) => s.private_service_name)
      .join(", ");
    messages.push({
      key: "services",
      label: t("modal.warnings.exclusivePrivateServices", { names }),
    });
  }
  if (
    data.payment_pack.related_payment_packs.length > 0 &&
    data.payment_pack.exclusive_payment_packs.length === 0
  ) {
    const names = data.payment_pack.related_payment_packs
      .map((p) => p.payment_pack_name)
      .join(", ");
    messages.push({
      key: "relatedPacks",
      label: t("modal.warnings.relatedPaymentPacks", { names }),
    });
  }
  if (data.staff_location.has_exclusive_staff_configurations) {
    messages.push({
      key: "staffExclusive",
      label: t("modal.warnings.hasExclusiveStaffConfigurations"),
    });
  } else if (data.staff_location.has_related_staff_configurations) {
    messages.push({
      key: "staffRelated",
      label: t("modal.warnings.hasRelatedStaffConfigurations"),
    });
  }
  if (data.coach_availability_slot.exclusive_coaches.length > 0) {
    const names = data.coach_availability_slot.exclusive_coaches
      .map((c) => c.coach_name)
      .join(", ");
    messages.push({
      key: "coachSlots",
      label: t("modal.warnings.exclusiveCoachAvailabilitySlots", { names }),
    });
  } else if (
    data.coach_availability_slot.has_related_coach_availability_slots
  ) {
    messages.push({
      key: "coachSlotsRelated",
      label: t("modal.warnings.hasRelatedCoachAvailabilitySlots"),
    });
  }
  if (data.associated_coach.exclusive_coaches.length > 0) {
    const names = data.associated_coach.exclusive_coaches
      .map((c) => c.coach_name)
      .join(", ");
    messages.push({
      key: "assocCoach",
      label: t("modal.warnings.exclusiveAssociatedCoaches", { names }),
    });
  } else if (data.associated_coach.has_related_associated_coaches) {
    messages.push({
      key: "assocCoachRelated",
      label: t("modal.warnings.hasRelatedAssociatedCoaches"),
    });
  }
  if (data.has_related_availability_slots) {
    messages.push({
      key: "availSlots",
      label: t("modal.warnings.hasRelatedAvailabilitySlots"),
    });
  }
  if (
    data.marketplace_component_config
      .has_related_marketplace_component_configs &&
    !data.marketplace_component_config
      .has_exclusive_marketplace_component_configs
  ) {
    messages.push({
      key: "marketplace",
      label: t("modal.warnings.hasRelatedMarketplaceComponentConfigs"),
    });
  }
  if (data.has_related_zoom_establishment) {
    messages.push({
      key: "zoom",
      label: t("modal.warnings.hasRelatedZoomEstablishment"),
    });
  }
  if (data.has_related_marketing_notifications) {
    messages.push({
      key: "marketing",
      label: t("modal.warnings.hasRelatedMarketingNotifications"),
    });
  }

  return messages;
};

type InfoListProps = {
  t: NamespacedTFunction<"venues-list">;
  data: CheckDeleteEstablishmentData;
};

const InfoList: FC<InfoListProps> = ({ t, data }) => (
  <ul className="flex flex-col gap-xs list-disc pl-md">
    <li>
      <Body htmlVariant="span" color="default">
        {t("modal.info.noReports")}
      </Body>
    </li>
    <li>
      <Body htmlVariant="span" color="default">
        {t("modal.info.widgets")}
      </Body>
    </li>
    {!data.has_upcoming_offers && (
      <li>
        <Body htmlVariant="span" color="default">
          {t("modal.info.sessions")}
        </Body>
      </li>
    )}
    {!data.has_upcoming_private_bookings && (
      <li>
        <Body htmlVariant="span" color="default">
          {t("modal.info.appointments")}
        </Body>
      </li>
    )}
  </ul>
);

type MessageListProps = { messages: ModalMessage[] };
const MessageList: FC<MessageListProps> = ({ messages }) => (
  <ul className="flex flex-col gap-xs list-disc pl-md">
    {messages.map(({ key, label }) => (
      <li key={key}>
        <Body htmlVariant="span" color="default">
          {label}
        </Body>
      </li>
    ))}
  </ul>
);

type VenueArchiveModalProps = {
  venue: Establishment;
  onClose: () => void;
};

export const VenueArchiveModal: FC<VenueArchiveModalProps> = ({
  venue,
  onClose,
}) => {
  const { t } = useTranslation("venues-list");
  const { mutate: archiveVenue } = useArchiveVenue();

  const { data, isLoading } = useQuery({
    ...checkDeleteEstablishmentQueryOptions(fetch, venue.id),
  });

  // true while data is loading — unreachable in practice but prevents handleConfirm firing before preflight resolves
  const isBlocked = data ? !data.can_destroy : true;

  const handleConfirm = () => {
    if (isBlocked) return;
    archiveVenue(venue.id, { onSuccess: onClose });
  };

  if (isLoading || !data) {
    return (
      <Modal
        open
        size="md"
        title={t("modal.title")}
        onClose={onClose}
        onClickOutside={onClose}
      >
        <Loader size="sm" className="mx-auto" />
      </Modal>
    );
  }

  const errorMessages = getErrorMessages(data, t);
  const warningMessages = getWarningMessages(data, t);

  const title =
    warningMessages.length > 0 ? t("modal.warnings.title") : t("modal.title");

  return (
    <Modal
      open
      size="md"
      title={title}
      onClose={onClose}
      onClickOutside={onClose}
      confirmButton={{
        color: "critical",
        label: t("modal.confirm"),
        onClick: handleConfirm,
        disabled: isBlocked,
      }}
      cancelButton={{ label: t("modal.cancel"), onClick: onClose }}
    >
      {isBlocked ? (
        <div className="flex flex-col gap-sm">
          <Alert
            status="critical"
            type="weak"
            title={t("modal.alert.blocking")}
          />
          <MessageList messages={errorMessages} />
        </div>
      ) : (
        <>
          {warningMessages.length > 0 && (
            <div className="flex flex-col gap-sm">
              <Alert
                status="warning"
                type="weak"
                title={t("modal.alert.warning")}
              />
              <MessageList messages={warningMessages} />
            </div>
          )}
          <InfoList t={t} data={data} />
        </>
      )}
    </Modal>
  );
};
