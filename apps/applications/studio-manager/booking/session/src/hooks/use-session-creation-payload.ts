import { useCallback } from "react";

import { type SessionCreationPayload } from "@bsport/api-book";

import { generateRecurrenceDates } from "#src/helpers/recurrence";
import type {
  SessionCreationFormAdvancedOptionsData,
  SessionCreationFormData,
} from "#src/stores/session-creation/types";

import { useRecurrenceConfig } from "./useRecurrenceConfig";

type BuildPayloadParams = {
  configureSessionData: SessionCreationFormData;
  advancedOptionsData: SessionCreationFormAdvancedOptionsData;
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
      configureSessionData,
      advancedOptionsData,
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
      } = configureSessionData;

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
      const dates = (
        recurrenceConfig
          ? generateRecurrenceDates(recurrenceConfig)
          : [startDateTime]
      ).map((date) => Math.floor(date.getTime() / 1000)); // Convert to UNIX timestamp in seconds

      return {
        // Configure session step data
        name_override: configureSessionData.allowCustomNameAndDescription
          ? configureSessionData.name_override
          : "",
        description_override: configureSessionData.allowCustomNameAndDescription
          ? configureSessionData.description_override
          : "",
        manager_only: configureSessionData.manager_only,
        credits: configureSessionData.credits,
        waiting_list_max_size: configureSessionData.waiting_list_max_size,
        effectif: configureSessionData.effectif,
        available_on_partnership: configureSessionData.available_on_partnership,
        partner_max_booking_count:
          configureSessionData.partner_max_booking_count,
        duration_minute: configureSessionData.duration_minute,
        level: configureSessionData.level,
        is_hybrid: configureSessionData.is_hybrid,
        coach: configureSessionData.coach!,
        coach_payment_rule: configureSessionData.coach_payment_rule,
        broadcast_link: configureSessionData.broadcast_link,
        establishment: configureSessionData.establishment!,
        room_blueprint: configureSessionData.room_blueprint,
        meta_activity: metaActivityId,
        dates,

        // Advanced options step data
        allow_guest_offer: advancedOptionsData.allow_guest_offer,
        blacklist_tags: advancedOptionsData.blacklist_tags,
        whitelist_tags: advancedOptionsData.whitelist_tags,

        // TODO: wellhub product selection
        wellhub_product_id: null,
      };
    },
    [getRecurrenceConfig],
  );

  return { buildPayload };
};
