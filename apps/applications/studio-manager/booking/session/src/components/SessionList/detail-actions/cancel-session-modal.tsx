import { FC, useEffect, useState } from "react";

import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import { Alert, Body, Modal, Toggle } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { SessionSummaryList } from "#src/components/common/session-summary-list";
import { useCancelSession } from "#src/hooks/session-actions/use-cancel-session";
import { useFetchSimilarSessions } from "#src/hooks/use-fetch-similar-sessions";
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

  const [sendNotification, setSendNotification] = useState(false);
  const [cancelFutureSessions, setCancelFutureSessions] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data: similarSessions } = useFetchSimilarSessions(
    session.id,
    !session.group,
  );

  const cancelSession = useCancelSession();

  const cancelAllFutureSessions =
    cancelFutureSessions &&
    !!similarSessions &&
    similarSessions.length > 0 &&
    similarSessions.length === selectedIds.length;
  // there is always the current session in the selectedIds list
  const cancelOnlySomeFutureSessions =
    cancelFutureSessions &&
    !!similarSessions &&
    selectedIds.length > 1 &&
    selectedIds.length < similarSessions.length;

  const handleConfirm = () => {
    closeModal();
    cancelSession.mutate({
      id: session.id,
      params: {
        should_notify: sendNotification,
        apply_to_all_similar_offers: cancelAllFutureSessions,
        selected_similar_offer_ids: cancelOnlySomeFutureSessions
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

  useEffect(() => {
    if (isOpen) {
      setSendNotification(false);
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
        {session.nb_bookings > 0 && (
          <>
            <Alert status="critical">
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
            </Alert>
            <Toggle
              id="cancel-session-send-notification-toggle"
              label={t("cancelModal.notificationLabel")}
              checked={sendNotification}
              onChange={() => setSendNotification(!sendNotification)}
            />
          </>
        )}
        {!session.group && similarSessions && similarSessions.length > 0 && (
          <>
            <Toggle
              id="cancel-session-future-sessions-toggle"
              label={t("cancelModal.cancelFutureSessions")}
              checked={cancelFutureSessions}
              onChange={() =>
                setCancelFutureSessions((prevState) => !prevState)
              }
            />
            {cancelFutureSessions && (
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
