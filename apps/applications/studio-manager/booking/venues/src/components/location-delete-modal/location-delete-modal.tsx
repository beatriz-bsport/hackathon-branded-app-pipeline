import { useQuery } from "@tanstack/react-query";
import { type FC } from "react";

import {
  type CheckDeleteEstablishmentGroupData,
  type EstablishmentGroup,
  checkDeleteEstablishmentGroupQueryOptions,
} from "@bsport/api-book";
import { Alert, Body, Loader, Modal } from "@bsport/kaizen-primitive-core";

import { useDeleteLocation } from "#src/hooks/api/use-delete-location";
import { fetch } from "#src/utils/fetch";
import { type NamespacedTFunction, useTranslation } from "#src/utils/i18n";

type ModalMessage = { key: string; label: string };

const getErrorMessages = (
  data: CheckDeleteEstablishmentGroupData,
  t: NamespacedTFunction<"venues-list">,
): ModalMessage[] => {
  const messages: ModalMessage[] = [];

  if (
    data.marketplace_component_config
      .has_exclusive_marketplace_component_configs
  ) {
    messages.push({
      key: "marketplace",
      label: t(
        "locations.deleteModal.errors.hasExclusiveMarketplaceComponentConfigs",
      ),
    });
  }

  return messages;
};

const getWarningMessages = (
  data: CheckDeleteEstablishmentGroupData,
  t: NamespacedTFunction<"venues-list">,
): ModalMessage[] => {
  const messages: ModalMessage[] = [];

  if (data.has_related_staff_configurations) {
    messages.push({
      key: "staff",
      label: t("locations.deleteModal.warnings.hasRelatedStaffConfigurations"),
    });
  }

  if (data.associated_coach.exclusive_coaches.length > 0) {
    const exclusiveCoachesCount =
      data.associated_coach.exclusive_coaches.length;
    const coachNames = data.associated_coach.exclusive_coaches
      .map((coach) => coach.coach_name)
      .join(", ");
    messages.push({
      key: "assocCoach",
      label: t(
        exclusiveCoachesCount === 1
          ? "locations.deleteModal.warnings.exclusiveAssociatedCoaches_one"
          : "locations.deleteModal.warnings.exclusiveAssociatedCoaches_other",
        {
          count: exclusiveCoachesCount,
          coach_name: coachNames,
        },
      ),
    });
  } else if (data.associated_coach.has_related_associated_coaches) {
    messages.push({
      key: "assocCoachRelated",
      label: t("locations.deleteModal.warnings.hasRelatedAssociatedCoaches"),
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
      label: t(
        "locations.deleteModal.warnings.hasRelatedMarketplaceComponentConfigs",
      ),
    });
  }

  if (data.has_related_marketing_notifications) {
    messages.push({
      key: "marketing",
      label: t(
        "locations.deleteModal.warnings.hasRelatedMarketingNotifications",
      ),
    });
  }

  return messages;
};

type InfoParagraphsProps = { t: NamespacedTFunction<"venues-list"> };

const InfoParagraphs: FC<InfoParagraphsProps> = ({ t }) => (
  <div className="flex flex-col gap-xs">
    <Body htmlVariant="p" color="default">
      {t("locations.deleteModal.info.reportsDefault")}
    </Body>
    <Body htmlVariant="p" color="default">
      {t("locations.deleteModal.info.widgetsDefault")}
    </Body>
  </div>
);

type MessageParagraphsProps = { messages: ModalMessage[] };
const MessageParagraphs: FC<MessageParagraphsProps> = ({ messages }) => (
  <div className="flex flex-col gap-xs">
    {messages.map(({ key, label }) => (
      <Body key={key} htmlVariant="p" color="default">
        {label}
      </Body>
    ))}
  </div>
);

type LocationDeleteModalProps = {
  location: EstablishmentGroup;
  onClose: () => void;
};

export const LocationDeleteModal: FC<LocationDeleteModalProps> = ({
  location,
  onClose,
}) => {
  const { t } = useTranslation("venues-list");
  const { mutate: deleteLocation, isPending: isDeleting } = useDeleteLocation();

  const { data, isLoading, isError } = useQuery({
    ...checkDeleteEstablishmentGroupQueryOptions(fetch, location.id),
  });

  const isBlocked = data ? !data.can_destroy : true;

  const handleConfirm = () => {
    if (isBlocked || isDeleting) return;
    deleteLocation(location.id, { onSuccess: onClose });
  };

  if (isLoading) {
    return (
      <Modal
        open
        size="md"
        title={t("locations.deleteModal.title")}
        onClose={onClose}
        onClickOutside={onClose}
      >
        <Loader size="sm" className="mx-auto" />
      </Modal>
    );
  }

  if (isError || !data) {
    return (
      <Modal
        open
        size="md"
        title={t("locations.deleteModal.title")}
        onClose={onClose}
        onClickOutside={onClose}
      >
        <Alert
          status="critical"
          type="weak"
          title={t("locations.deleteModal.preflightError")}
        />
      </Modal>
    );
  }

  const errorMessages = getErrorMessages(data, t);
  const warningMessages = getWarningMessages(data, t);

  const title =
    warningMessages.length > 0
      ? t("locations.deleteModal.warningsTitle")
      : t("locations.deleteModal.title");

  return (
    <Modal
      open
      size="md"
      title={title}
      onClose={onClose}
      onClickOutside={onClose}
      confirmButton={{
        color: "critical",
        label: t("locations.deleteModal.confirm"),
        onClick: handleConfirm,
        disabled: isBlocked || isDeleting,
        loading: isDeleting,
      }}
      cancelButton={{
        label: t("locations.deleteModal.cancel"),
        onClick: onClose,
      }}
    >
      {isBlocked ? (
        <div className="flex flex-col gap-sm">
          <Alert
            status="critical"
            type="weak"
            title={t("locations.deleteModal.alert.blocking")}
          />
          <MessageParagraphs messages={errorMessages} />
        </div>
      ) : (
        <>
          {warningMessages.length > 0 && (
            <div className="flex flex-col gap-sm">
              <Alert
                status="warning"
                type="weak"
                title={t("locations.deleteModal.alert.warning")}
              />
              <MessageParagraphs messages={warningMessages} />
            </div>
          )}
          <InfoParagraphs t={t} />
        </>
      )}
    </Modal>
  );
};
