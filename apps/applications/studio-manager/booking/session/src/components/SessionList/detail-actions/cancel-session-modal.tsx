import { FC, useEffect, useState } from "react";

import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import { Alert, Body, Modal, Toggle } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { SessionSummaryList } from "#src/components/common/session-summary-list";
import { useFetchSessionsInGroup } from "#src/hooks/session-api/fetch/use-fetch-sessions-in-group";
import { useFetchSimilarSessions } from "#src/hooks/session-api/fetch/use-fetch-similar-sessions";
import { useCancelSession } from "#src/hooks/session-api/session-actions/use-cancel-session";
import {
  closeModal,
  selectIsCancelModalOpen,
  useSessionListStore,
} from "#src/stores/session-list";
import { EnrichedSession } from "#src/types";
import { TFunction, Trans, useTranslation } from "#src/utils/i18n";

type CancelSessionModalProps = {
  session: EnrichedSession;
};
export const CancelSessionModal: FC<CancelSessionModalProps> = ({
  session,
}) => {
  const { t, i18n } = useTranslation("sessionList");
  const companyTimezone = dataAccessLayer.useCompanyTheme()?.timezone_name;
  const isOpen = useSessionListStore(selectIsCancelModalOpen);

  const [shouldSendNotification, setShouldSendNotification] = useState(false);
  const [shouldCancelFutureSessions, setShouldCancelFutureSessions] =
    useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data: regularSimilarSessions } = useFetchSimilarSessions(
    session.id,
    !session.group,
  );

  const { data: groupSimilarSessions } = useFetchSessionsInGroup(
    session.group,
    { min_date: session.date_start.split("T")[0], available: true },
    !!session.group,
  );

  const similarSessions = session.group
    ? groupSimilarSessions
    : regularSimilarSessions;

  const cancelSession = useCancelSession();

  const areFutureSessionsSelected =
    shouldCancelFutureSessions &&
    !!similarSessions &&
    similarSessions.length > 1;

  const shouldCancelAllFutureSessions =
    // For group sessions, we need to list each session id
    !session.group &&
    areFutureSessionsSelected &&
    similarSessions.length === selectedIds.length;

  // there is always the current session in the selectedIds list
  const shouldCancelOnlySomeFutureSessions =
    areFutureSessionsSelected &&
    // For group sessions, we need to list each session id
    (session.group || selectedIds.length < similarSessions.length);

  const handleConfirm = () => {
    closeModal();
    cancelSession.mutate({
      id: session.id,
      params: {
        should_notify: shouldSendNotification,
        apply_to_all_similar_offers: shouldCancelAllFutureSessions,
        selected_similar_offer_ids: shouldCancelOnlySomeFutureSessions
          ? selectedIds.map(Number)
          : undefined,
        cancel_linked_hybrid_offer: false,
      },
    });
  };

  const getDescription = () => {
    const sessionDate = formatDateTime(
      session.date_start,
      DATETIME_FORMATS.MEDIUM_DATETIME,
      { locale: i18n.language, timeZone: companyTimezone },
    );
    return `${session.name} - ${sessionDate}`;
  };

  const shouldDisplayAlert = session.nb_bookings > 0 || session.groupName;

  useEffect(() => {
    if (isOpen) {
      setShouldSendNotification(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (similarSessions) {
      setSelectedIds(similarSessions.map((s) => `${s.id}`));
    }
  }, [similarSessions]);

  return (
    <Modal
      open={isOpen}
      size="md"
      title={t("cancelModal.title")}
      description={getDescription()}
      onClose={closeModal}
      confirmButton={{
        label: t("cancelModal.confirmButton"),
        color: "critical",
        onClick: handleConfirm,
      }}
      cancelButton={{
        label: t("cancelModal.cancelButton"),
        onClick: closeModal,
      }}
    >
      <div className="flex flex-col gap-md">
        <Body htmlVariant="p" size="lg">
          {t("cancelModal.description")}
        </Body>
        {shouldDisplayAlert && (
          <Alert status="critical">
            {session.nb_bookings > 0 && (
              <Body htmlVariant="p" size="md" weight="weak" color="critical">
                <Trans
                  t={t as TFunction}
                  ns="sessionList"
                  i18nKey="cancelModal.bookingsAlert"
                  values={{ number: session.nb_bookings }}
                  components={{
                    strong: <strong />,
                  }}
                  count={session.nb_bookings}
                />
              </Body>
            )}
            {session.groupName && (
              <Body htmlVariant="p" size="md" weight="weak" color="critical">
                <Trans
                  t={t as TFunction}
                  ns="sessionList"
                  i18nKey="cancelModal.groupSessionAlert"
                  values={{ groupName: session.groupName }}
                  components={{
                    strong: <strong />,
                  }}
                />
              </Body>
            )}
          </Alert>
        )}
        {session.nb_bookings > 0 && (
          <Toggle
            id="cancel-session-send-notification-toggle"
            label={t("cancelModal.notificationLabel")}
            checked={shouldSendNotification}
            onChange={() => setShouldSendNotification(!shouldSendNotification)}
          />
        )}
        {similarSessions && similarSessions.length > 0 && (
          <>
            <Toggle
              id="cancel-session-future-sessions-toggle"
              label={
                session.groupName
                  ? t("cancelModal.cancelFutureSessionsForGroup", {
                      groupName: session.groupName,
                    })
                  : t("cancelModal.cancelFutureSessions")
              }
              checked={shouldCancelFutureSessions}
              onChange={() =>
                setShouldCancelFutureSessions((prevState) => !prevState)
              }
            />
            {shouldCancelFutureSessions && (
              <div className="flex flex-col gap-md ml-xl">
                <SessionSummaryList
                  sessions={similarSessions}
                  isSelectable
                  originalSessionId={session.id}
                  selectedIds={selectedIds}
                  setSelectedIds={setSelectedIds}
                  title={t("cancelModal.futureSessionsHeader", {
                    number: similarSessions.length,
                  })}
                  description={t("cancelModal.descriptionFutureSessions")}
                  includeParticipantsCount
                />
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
};
