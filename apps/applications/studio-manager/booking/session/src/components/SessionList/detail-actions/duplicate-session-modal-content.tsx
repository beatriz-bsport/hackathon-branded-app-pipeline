import { UseMutateFunction } from "@tanstack/react-query";
import { FC, useMemo, useState } from "react";
import { z } from "zod";

import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import { fromIsoString, toDate } from "@bsport/datetime-manipulation";
import { ControlledForm, useFormController } from "@bsport/form";
import { Alert, Body, Toggle, toast } from "@bsport/kaizen-primitive-core";

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
import { closeModal } from "#src/stores/session-list";
import { EnrichedSession } from "#src/types";
import { useTranslation } from "#src/utils/i18n";

export type DuplicateModalContentProps = {
  session: EnrichedSession;
  lastDate: string | undefined;
  recurrenceCount: number | undefined;
  companyTimezone: string | undefined;
  formId: string;
  duplicateSessionSchema: z.ZodSchema;
  buildPayload: ReturnType<typeof useSessionCreationPayload>["buildPayload"];
  createSession: UseMutateFunction<
    unknown,
    Error,
    Parameters<ReturnType<typeof useCreateSession>["mutate"]>[0],
    unknown
  >;
  formRef: React.MutableRefObject<(() => void) | null>;
};

export const DuplicateModalContent: FC<DuplicateModalContentProps> = ({
  session,
  lastDate,
  recurrenceCount,
  companyTimezone,
  formId,
  duplicateSessionSchema,
  buildPayload,
  createSession,
  formRef,
}) => {
  const { t, i18n } = useTranslation("sessionList");
  const newRecurrenceStartDate = fromIsoString(lastDate ?? session.date_start, {
    zone: companyTimezone,
  }).plus({
    day: 1,
  });

  const [shouldLinkNewSessions, setShouldLinkNewSessions] = useState(
    recurrenceCount !== undefined && recurrenceCount > 1,
  );

  const isHybrid = !!session.linked_hybrid_offer_id;

  const initialValues = useMemo(() => {
    // The new recurrence should start the day after the last session in the previous recurrence
    const endDate = newRecurrenceStartDate.plus({ day: 1 });
    return {
      startDateTime: toDate(newRecurrenceStartDate),
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
  }, [session.duration_minute, newRecurrenceStartDate]);

  const duplicateSessionMethods = useFormController({
    schema: duplicateSessionSchema,
    mode: "onChange",
    shouldFocusError: true,
    defaultValues: initialValues,
  });

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
          recurrence_id: shouldLinkNewSessions
            ? session.recurrence_id
            : undefined,
        },
        metaActivityId: session.meta_activity,
      });

      createSession(
        {
          payload,
          onEarlySuccess: () => {
            closeModal();
            duplicateSessionMethods.reset();
          },
        },
        {
          onError: (error) => {
            toast({
              status: "critical",
              description: t("duplicateModal.errorMessage"),
            });
            console.error("Error creating duplicated session:", error);
          },
        },
      );
    } catch (error) {
      toast({
        status: "critical",
        description: t("duplicateModal.errorMessage"),
      });
      console.error("Error building session payload:", error);
    }
  };

  // Expose handler to parent via ref
  formRef.current = handleConfirm;

  return (
    <div className="flex flex-col gap-xl">
      <Alert status="info">
        <Body htmlVariant="p" size="md" weight="weak" color="info">
          {recurrenceCount && recurrenceCount > 1
            ? t("duplicateModal.descriptionRecurrentSession", {
                formattedDate: formatDateTime(
                  lastDate!,
                  DATETIME_FORMATS.FULL_DATETIME,
                  { locale: i18n.language, timeZone: companyTimezone },
                ),
              })
            : t("duplicateModal.descriptionNoRecurrence")}
        </Body>
        {isHybrid && (
          <Body htmlVariant="p" size="md" weight="weak" color="info">
            {t("duplicateModal.hybridSessionNotice")}
          </Body>
        )}
      </Alert>
      <ControlledForm
        id={formId}
        {...duplicateSessionMethods}
        onSubmit={() => console.log}
        className="w-full flex flex-col gap-md"
      >
        <SessionStartDateTime
          fieldIdPrefix={formId}
          disableBeforeStartDate={newRecurrenceStartDate}
        />
        <SessionDuration fieldIdPrefix={formId} />
        <SessionRecurrence fieldIdPrefix={formId} />
      </ControlledForm>
      <Toggle
        id="duplicate-link-sessions-toggle"
        // @ts-expect-error our type does not handle the counts properly
        label={t("duplicateModal.linkToOriginalSession", {
          count: recurrenceCount,
        })}
        // @ts-expect-error our type does not handle the counts properly
        helperText={t("duplicateModal.linkToOriginalSessionDescription", {
          count: recurrenceCount,
        })}
        checked={shouldLinkNewSessions}
        onChange={() => setShouldLinkNewSessions((prevState) => !prevState)}
      />
    </div>
  );
};
