import { useCallback } from "react";

import type {
  SessionCreationPayload,
  SessionEditActions,
  SessionEditPayload,
  SessionWithActivity,
} from "@bsport/api-book";

import type { SessionEditFormData } from "#src/components/SessionForm/types";
import { TeacherSubstitutionPropagationMode } from "#src/constants";
import { generateRecurrenceDates } from "#src/helpers/recurrence";
import type {
  SessionCreationFormAdvancedOptionsData,
  SessionCreationFormData,
} from "#src/stores/session-creation/types";

import { useRecurrenceConfig } from "./useRecurrenceConfig";

type BuildPayloadParams = {
  sessionData: SessionCreationFormData & SessionCreationFormAdvancedOptionsData;
  metaActivityId?: number;
};

/**
 * Returns a function to build the API payload from the form data collected across the session creation and edition steps.
 * Call buildCreationPayload or buildEditionPayload in your submit handlers.
 */
export const useSessionPayload = () => {
  const { getRecurrenceConfig } = useRecurrenceConfig();

  const buildCreationPayload = useCallback(
    ({
      sessionData,
      metaActivityId,
    }: BuildPayloadParams): SessionCreationPayload => {
      if (!metaActivityId) {
        throw new Error(
          "Meta activity ID is required to build session payload",
        );
      }
      const {
        isRecurring,
        startDateTime,
        recurrenceType,
        recurrenceEndDate,
        recurrenceInterval,
        recurrencePattern,
        recurrenceUnit,
        recurrenceWeekdays,
      } = sessionData;

      const recurrenceConfig = getRecurrenceConfig({
        startDateTime,
        isRecurring,
        recurrenceEndDate,
        recurrenceInterval,
        recurrencePattern,
        recurrenceType,
        recurrenceUnit,
        recurrenceWeekdays,
      });

      const generatedDates = recurrenceConfig
        ? generateRecurrenceDates(recurrenceConfig)
        : [startDateTime];

      const dates = (
        generatedDates?.length > 0 ? generatedDates : [startDateTime]
      ).map((dateTime) => Math.floor(dateTime.toSeconds())); // Convert to UNIX timestamp in seconds

      return {
        // Configure session step data
        name_override: sessionData.allowCustomNameAndDescription
          ? sessionData.name_override
          : "",
        description_override: sessionData.allowCustomNameAndDescription
          ? sessionData.description_override
          : "",
        manager_only: sessionData.manager_only,
        credits: sessionData.credits,
        waiting_list_max_size: sessionData.waiting_list_max_size,
        effectif: sessionData.effectif,
        available_on_partnership: sessionData.available_on_partnership,
        partner_max_booking_count: sessionData.partner_max_booking_count,
        duration_minute: sessionData.duration_minute,
        level: sessionData.level,
        is_hybrid: sessionData.is_hybrid,
        coach: sessionData.coach!,
        coach_payment_rule: sessionData.coach_payment_rule,
        broadcast_link: sessionData.broadcast_link,
        establishment: sessionData.establishment!,
        room_blueprint: sessionData.room_blueprint,
        meta_activity: metaActivityId,
        dates,
        ...(sessionData.sync_on_spivi !== undefined && {
          sync_on_spivi: sessionData.sync_on_spivi,
        }),
        wellhub_product_id: sessionData.wellhub_product_id,

        // Advanced options step data
        allow_guest_offer: sessionData.allow_guest_offer,
        blacklist_tags: sessionData.blacklist_tags,
        whitelist_tags: sessionData.whitelist_tags,

        // only for duplication
        recurrence_id: sessionData.recurrence_id || undefined,
      };
    },
    [getRecurrenceConfig],
  );

  const buildEditionPayload = (
    formData: SessionEditFormData,
    session: SessionWithActivity,
    editActions: SessionEditActions,
  ): SessionEditPayload => {
    return {
      // Identity
      id: session.id,
      meta_activity: session.meta_activity,

      // Date/time
      date_start: formData.startDateTime.toISO()!,
      duration_minute: formData.duration_minute,

      // Details
      name_override:
        formData.name_override === session.metaActivity?.name
          ? ""
          : formData.name_override,
      description_override:
        formData.description_override === session.metaActivity?.description
          ? ""
          : formData.description_override,

      // Settings
      manager_only: formData.manager_only,
      waiting_list_max_size: formData.waiting_list_max_size,
      effectif: formData.effectif,
      available_on_partnership: formData.available_on_partnership,
      partner_max_booking_count: formData.partner_max_booking_count,
      level: formData.level,
      broadcast_link: formData.broadcast_link,

      // Teacher and establishment
      coach: formData.coach,
      coach_payment_rule: formData.overrideTeacherPayrollRule
        ? formData.coach_payment_rule
        : session.coach_payment_rule_id,
      coach_override: formData.coach_override,
      establishment: formData.establishment,
      room_blueprint: formData.room_blueprint,
      ...(formData.sync_on_spivi !== undefined && {
        sync_on_spivi: formData.sync_on_spivi,
      }),
      wellhub_product_id: formData.wellhub_product_id,
      recurrence_id: formData.recurrence_id,

      // Advanced options
      allow_guest_offer: formData.allow_guest_offer,
      blacklist_tags: formData.blacklist_tags,
      whitelist_tags: formData.whitelist_tags,

      // Edit-specific defaults
      propagate_coach_override_value:
        editActions.modifyAllDates || editActions.custom_selection
          ? TeacherSubstitutionPropagationMode.PROPAGATE_TO_ALL
          : TeacherSubstitutionPropagationMode.NO_PROPAGATION,
      ...editActions,
    };
  };

  return { buildCreationPayload, buildEditionPayload };
};
