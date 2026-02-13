import { FC, useEffect } from "react";

import { SessionEditActions, SessionWithActivity } from "@bsport/api-book";
import { useFormContext } from "@bsport/form";
import { Alert, Body, Modal, Toggle } from "@bsport/kaizen-primitive-core";

import { SessionSummaryList } from "#src/components/common/session-summary-list";
import { useFetchSessionsInGroup } from "#src/hooks/session-api/fetch/use-fetch-sessions-in-group";
import { useFetchSimilarSessions } from "#src/hooks/session-api/fetch/use-fetch-similar-sessions";
import { TFunction, Trans, useTranslation } from "#src/utils/i18n";

type SaveSessionModalProps = {
  session: SessionWithActivity;
  isOpen: boolean;
  saveForm: (formActions: SessionEditActions) => void;
  closeModal: () => void;
};
export const SaveSessionModal: FC<SaveSessionModalProps> = ({
  session,
  saveForm,
  isOpen,
  closeModal,
}) => {
  const { t } = useTranslation("sessionEdit");

  const { watch, setValue } = useFormContext();
  const shouldSendNotification = watch("shouldSendNotification");
  const shouldUpdateFutureSessions = watch("shouldUpdateFutureSessions");
  const selectedSessionIds = watch("selectedSessionIds");

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

  const areFutureSessionsSelected =
    shouldUpdateFutureSessions &&
    !!similarSessions &&
    similarSessions.length > 1;

  const shouldUpdateAllFutureSessions =
    // For group sessions, we need to list each session id
    !session.group &&
    areFutureSessionsSelected &&
    similarSessions.length === selectedSessionIds.length;

  // there is always the current session in the selectedIds list
  const shouldUpdateOnlySomeFutureSessions =
    areFutureSessionsSelected &&
    // For group sessions, we need to list each session id
    (!!session.group || selectedSessionIds.length < similarSessions.length);

  const handleConfirm = () => {
    closeModal();
    saveForm({
      custom_selection_ids: selectedSessionIds.map(Number),
      custom_selection: shouldUpdateOnlySomeFutureSessions,
      modifyAllDates: shouldUpdateAllFutureSessions,
      notifyConsumers: shouldSendNotification,
    });
  };

  useEffect(() => {
    if (similarSessions) {
      setValue(
        "selectedSessionIds",
        similarSessions.map((s) => `${s.id}`),
      );
    }
  }, [similarSessions]);

  return (
    <Modal
      open={isOpen}
      size="md"
      title={t("saveSessionModal.title")}
      onClose={closeModal}
      confirmButton={{
        label: t("saveSessionModal.confirmButton"),
        color: "main",
        onClick: handleConfirm,
      }}
      cancelButton={{
        label: t("saveSessionModal.cancelButton"),
        onClick: closeModal,
      }}
    >
      <div className="flex flex-col gap-md">
        <Body htmlVariant="p" size="lg">
          {t("saveSessionModal.description")}
        </Body>
        {session.nb_bookings > 0 && (
          <Toggle
            id="cancel-session-send-notification-toggle"
            label={t("saveSessionModal.notificationLabel")}
            checked={shouldSendNotification}
            onChange={() =>
              setValue("shouldSendNotification", !shouldSendNotification)
            }
          />
        )}
        {similarSessions && similarSessions.length > 0 && (
          <>
            <Toggle
              id="cancel-session-future-sessions-toggle"
              label={
                session.group
                  ? t("saveSessionModal.updateFutureSessionsForGroup")
                  : t("saveSessionModal.updateFutureSessions")
              }
              checked={shouldUpdateFutureSessions}
              onChange={() =>
                setValue(
                  "shouldUpdateFutureSessions",
                  !shouldUpdateFutureSessions,
                )
              }
            />
            {shouldUpdateFutureSessions && (
              <div className="flex flex-col gap-md ml-xl">
                {session.nb_bookings > 0 && (
                  <Alert status="info">
                    <Body htmlVariant="p" size="md" weight="weak" color="info">
                      <Trans
                        t={t as TFunction}
                        i18nKey="saveSessionModal.passesAlert"
                        ns="sessionEdit"
                        components={{
                          strong: <strong />,
                        }}
                      />
                    </Body>
                  </Alert>
                )}

                <SessionSummaryList
                  sessions={similarSessions}
                  isSelectable
                  originalSessionId={session.id}
                  selectedIds={selectedSessionIds}
                  setSelectedIds={(selectedIds) =>
                    setValue("selectedSessionIds", selectedIds)
                  }
                  title={t("saveSessionModal.futureSessionsHeader", {
                    number: similarSessions.length,
                  })}
                  description={t("saveSessionModal.descriptionFutureSessions")}
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
