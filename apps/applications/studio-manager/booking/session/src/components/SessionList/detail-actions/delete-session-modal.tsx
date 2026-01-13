import { FC, useEffect, useState } from "react";

import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import { Alert, Body, Modal, Toggle } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { SessionSummaryList } from "#src/components/common/session-summary-list";
import { useFetchSessionsInGroup } from "#src/hooks/session-api/fetch/use-fetch-sessions-in-group";
import { useFetchSimilarSessions } from "#src/hooks/session-api/fetch/use-fetch-similar-sessions";
import { useDeleteSession } from "#src/hooks/session-api/session-actions/use-delete-session";
import {
  closeModal,
  selectIsDeleteModalOpen,
  useSessionListStore,
} from "#src/stores/session-list";
import { EnrichedSession } from "#src/types";
import { TFunction, Trans, useTranslation } from "#src/utils/i18n";

type DeleteSessionModalProps = {
  session: EnrichedSession;
};
export const DeleteSessionModal: FC<DeleteSessionModalProps> = ({
  session,
}) => {
  const { t, i18n } = useTranslation("sessionList");
  const companyTimezone = dataAccessLayer.useCompanyTheme()?.timezone_name;
  const isOpen = useSessionListStore(selectIsDeleteModalOpen);

  const [shouldDeleteFutureSessions, setShouldDeleteFutureSessions] =
    useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data: regularSimilarSessions } = useFetchSimilarSessions(
    session.id,
    !session.group,
  );

  const { data: groupSimilarSessions } = useFetchSessionsInGroup(
    session.group,
    { min_date: session.date_start.split("T")[0], available: false },
    !!session.group,
  );

  const similarSessions = session.group
    ? groupSimilarSessions
    : regularSimilarSessions;

  const deleteSession = useDeleteSession();

  const areFutureSessionsSelected =
    shouldDeleteFutureSessions &&
    !!similarSessions &&
    similarSessions.length > 1;

  const shouldDeleteAllFutureSessions =
    // For group sessions, we need to list each session id
    !session.group &&
    areFutureSessionsSelected &&
    similarSessions.length === selectedIds.length;

  // there is always the current session in the selectedIds list
  const shouldDeleteOnlySomeFutureSessions =
    areFutureSessionsSelected &&
    // For group sessions, we need to list each session id
    (session.group || selectedIds.length < similarSessions.length);

  const handleConfirm = () => {
    closeModal();
    deleteSession.mutate({
      id: session.id,
      params: {
        apply_to_all_similar_offers: shouldDeleteAllFutureSessions,
        selected_similar_offer_ids: shouldDeleteOnlySomeFutureSessions
          ? selectedIds.map(Number)
          : undefined,
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
    if (similarSessions) {
      setSelectedIds(similarSessions.map((s) => `${s.id}`));
    }
  }, [similarSessions]);

  return (
    <Modal
      open={isOpen}
      size="md"
      title={t("deleteModal.title")}
      description={getDescription()}
      onClose={closeModal}
      confirmButton={{
        label: t("deleteModal.confirmButton"),
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
          {t("deleteModal.description")}
        </Body>
        <Alert status="critical">
          <>
            <Body htmlVariant="p" size="md" weight="weak" color="critical">
              {t("deleteModal.commonAlert")}
            </Body>
            {session.groupName && (
              <Body htmlVariant="p" size="md" weight="weak" color="critical">
                <Trans
                  t={t as TFunction}
                  ns="sessionList"
                  i18nKey="deleteModal.groupSessionAlert"
                  values={{ groupName: session.groupName }}
                  components={{
                    strong: <strong />,
                  }}
                />
              </Body>
            )}
          </>
        </Alert>
        {similarSessions && similarSessions.length > 0 && (
          <>
            <Toggle
              id="delete-session-future-sessions-toggle"
              label={
                session.groupName
                  ? t("deleteModal.deleteFutureSessionsForGroup", {
                      groupName: session.groupName,
                    })
                  : t("deleteModal.deleteFutureSessions")
              }
              checked={shouldDeleteFutureSessions}
              onChange={() =>
                setShouldDeleteFutureSessions((prevState) => !prevState)
              }
            />
            {shouldDeleteFutureSessions && (
              <div className="flex flex-col gap-md ml-xl">
                <SessionSummaryList
                  sessions={similarSessions}
                  isSelectable
                  originalSessionId={session.id}
                  selectedIds={selectedIds}
                  setSelectedIds={setSelectedIds}
                  title={t("deleteModal.futureSessionsHeader", {
                    number: similarSessions.length,
                  })}
                  description={t("deleteModal.descriptionFutureSessions")}
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
