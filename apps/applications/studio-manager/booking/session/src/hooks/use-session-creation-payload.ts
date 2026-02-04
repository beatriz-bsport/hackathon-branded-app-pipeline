import { useCallback } from "react";

import { type SessionCreationPayload } from "@bsport/api-book";

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
 * Returns a function to build the API payload from the form data collected across the session creation steps.
 * Call buildPayload in your submit handler.
 */
export const useSessionCreationPayload = () => {
  const { getRecurrenceConfig } = useRecurrenceConfig();

  const buildPayload = useCallback(
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

      // TODO: Refacto this to use Luxon throughout the app
      const generatedDates = recurrenceConfig
        ? generateRecurrenceDates(recurrenceConfig)
        : [startDateTime];

      const dates = (
        generatedDates?.length > 0 ? generatedDates : [startDateTime]
      ).map((date) => Math.floor(date.getTime() / 1000)); // Convert to UNIX timestamp in seconds

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

  return { buildPayload };
};
