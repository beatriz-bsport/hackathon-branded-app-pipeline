import { FC, useId, useMemo } from "react";

import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import { fromIsoString, toDate } from "@bsport/datetime-manipulation";
import { ControlledForm, useFormController } from "@bsport/form";
import { Modal, toast } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { SessionDuration } from "#src/components/SessionForm/TimeAndDate/SessionDuration";
import { SessionStartDateTime } from "#src/components/SessionForm/TimeAndDate/SessionStartDateTime";
import { SessionRecurrence } from "#src/components/SessionForm/TimeAndDate/recurrence/session-recurrence";
import {
  CustomRecurrenceUnit,
  MonthlyRecurrencePattern,
  RecurrenceType,
} from "#src/helpers/recurrence/types";
import { useCreateSession } from "#src/hooks/session-api/session-actions/use-create-session";
import { useSessionCreationPayload } from "#src/hooks/use-session-creation-payload";
import {
  closeModal,
  selectIsDuplicateModalOpen,
  useSessionListStore,
} from "#src/stores/session-list";
import { EnrichedSession } from "#src/types";
import { useTranslation } from "#src/utils/i18n";

import { useDuplicateSessionSchema } from "./duplicate-session-schema";

type DuplicateSessionModalProps = {
  session: EnrichedSession;
};
export const DuplicateSessionModal: FC<DuplicateSessionModalProps> = ({
  session,
}) => {
  const { t, i18n } = useTranslation("sessionList");
  const companyTimezone = dataAccessLayer.useCompanyTheme()?.timezone_name;
  const isOpen = useSessionListStore(selectIsDuplicateModalOpen);

  const formId = `session-form-duplicate-${useId()}`;
  const duplicateSessionSchema = useDuplicateSessionSchema();

  const initialValues = useMemo(() => {
    const startDate = fromIsoString(session.date_start);
    const endDate = startDate.plus({ day: 1 });
    return {
      startDateTime: toDate(startDate),
      duration_minute: session.duration_minute,
      isRecurring: false,
      recurrenceType: RecurrenceType.WEEKLY,
      recurrenceWeekdays: {
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
        7: false,
      },
      recurrenceUnit: CustomRecurrenceUnit.DAYS,
      recurrenceInterval: 1,
      recurrencePattern: MonthlyRecurrencePattern.NTH_WEEKDAY,
      recurrenceEndDate: toDate(endDate),
    };
  }, [session.date_start, session.duration_minute]);

  const duplicateSessionMethods = useFormController({
    schema: duplicateSessionSchema,
    mode: "onChange",
    shouldFocusError: true,
    defaultValues: initialValues,
  });

  const getDescription = () => {
    const sessionDate = formatDateTime(
      session.date_start,
      DATETIME_FORMATS.MEDIUM_DATETIME,
      { locale: i18n.language, timeZone: companyTimezone },
    );
    return `${session.name} - ${sessionDate}`;
  };

  const { buildPayload } = useSessionCreationPayload();
  const { mutate: createSession } = useCreateSession();

  const handleConfirm = () => {
    try {
      const payload = buildPayload({
        sessionData: {
          ...session,
          ...duplicateSessionMethods.getValues(),
          credits: session.credit_price,
          is_hybrid: !!session.linked_hybrid_offer_id,
          coach_payment_rule: session.coach_payment_rule_id,
          allowCustomNameAndDescription: true,
          name_override: session.name_override ?? "",
          description_override: session.description_override ?? "",
          // TODO: add recurrence_id when link is selected
        },
        metaActivityId: session.meta_activity,
      });

      createSession({
        payload,
        onEarlySuccess: () => {
          closeModal();
          duplicateSessionMethods.reset();
        },
      });
      return;
    } catch (error) {
      toast({
        status: "critical",
        description: t("duplicateModal.errorMessage"),
      });
      console.error("Error building session payload:", error);
      return;
    }
  };

  return (
    <Modal
      open={isOpen}
      size="md"
      title={t("duplicateModal.title")}
      description={getDescription()}
      onClose={closeModal}
      confirmButton={{
        label: t("duplicateModal.confirmButton"),
        onClick: handleConfirm,
      }}
      cancelButton={{
        label: t("duplicateModal.cancelButton"),
        onClick: closeModal,
      }}
    >
      <ControlledForm
        id={formId}
        {...duplicateSessionMethods}
        onSubmit={() => console.log}
        className="w-full flex flex-col gap-md"
      >
        <SessionStartDateTime fieldIdPrefix={formId} />
        <SessionDuration fieldIdPrefix={formId} />
        <SessionRecurrence fieldIdPrefix={formId} />
      </ControlledForm>
    </Modal>
  );
};
