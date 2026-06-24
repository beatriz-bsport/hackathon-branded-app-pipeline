import { FC, useId, useRef } from "react";

import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import { Loader, Modal } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useFetchRecurrenceFromSession } from "#src/hooks/session-api/fetch/use-fetch-recurrence-from-session";
import { useCreateSession } from "#src/hooks/session-api/session-actions/use-create-session";
import { useSessionPayload } from "#src/hooks/use-session-payload";
import { EnrichedSession } from "#src/types";
import { useTranslation } from "#src/utils/i18n";

import { DuplicateModalContent } from "./duplicate-session-modal-content";
import { useDuplicateSessionSchema } from "./duplicate-session-schema";

type DuplicateSessionModalProps = {
  session: Pick<
    EnrichedSession,
    | "id"
    | "name"
    | "date_start"
    | "duration_minute"
    | "credit_price"
    | "linked_hybrid_offer_id"
    | "coach_payment_rule_id"
    | "name_override"
    | "description_override"
    | "recurrence_id"
    | "meta_activity"
  >;
  isOpen: boolean;
  onClose: () => void;
};
export const DuplicateSessionModal: FC<DuplicateSessionModalProps> = ({
  session,
  isOpen,
  onClose,
}) => {
  const { t, i18n } = useTranslation("sessionList");
  const companyTimezone = dataAccessLayer.useCompanyTheme()?.timezone_name;
  const formRef = useRef<(() => void) | null>(null);

  const formId = `session-form-duplicate-${useId()}`;
  const duplicateSessionSchema = useDuplicateSessionSchema();

  const { data: recurrenceResponse, isLoading } = useFetchRecurrenceFromSession(
    session.id,
  );

  const lastDate = recurrenceResponse?.last_offer.date_start;
  const recurrenceCount = recurrenceResponse?.recurrence_count;

  const getDescription = () => {
    const sessionDate = formatDateTime(
      session.date_start,
      DATETIME_FORMATS.MEDIUM_DATETIME,
      { locale: i18n.language, timeZone: companyTimezone },
    );
    return `${session.name} - ${sessionDate}`;
  };

  const { buildCreationPayload } = useSessionPayload();
  const { mutate: createSession, isPending } = useCreateSession();

  const handleClose = () => {
    if (isPending || isLoading) return;
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      size="md"
      title={t("duplicateModal.title")}
      description={getDescription()}
      onClose={handleClose}
      confirmButton={{
        label: t("duplicateModal.confirmButton"),
        onClick: () => {
          if (formRef.current) {
            formRef.current();
          }
        },
        disabled: isLoading || isPending,
      }}
      cancelButton={{
        label: t("duplicateModal.cancelButton"),
        onClick: handleClose,
        disabled: isLoading || isPending,
      }}
    >
      {isLoading ? (
        <div className="grid place-content-center">
          <Loader size="md" />
        </div>
      ) : (
        <DuplicateModalContent
          session={session}
          lastDate={lastDate}
          recurrenceCount={recurrenceCount}
          companyTimezone={companyTimezone}
          formId={formId}
          duplicateSessionSchema={duplicateSessionSchema}
          buildPayload={buildCreationPayload}
          createSession={createSession}
          formRef={formRef}
        />
      )}
    </Modal>
  );
};
