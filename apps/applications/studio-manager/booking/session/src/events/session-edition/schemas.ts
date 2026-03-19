import { z } from "zod";

import { SessionVisibility } from "#src/events/constants";

const sessionUpdateActionButtonClickedEventSchema = (
  action: string,
  eventType: string,
  availableVerb: string,
) =>
  z
    .object({
      eventType: z.string().default(eventType),
      session_id: z
        .number()
        .describe(
          `The id of the session for which the user clicks on the ${action} button`,
        ),
      session_name: z
        .string()
        .describe(
          `The name of the session for which the user clicks on the ${action} button`,
        ),
      session_start_date_time: z
        .string()
        .describe(
          `The date and time of the session for which the user clicks on the ${action} button`,
        ),
      participant_number: z
        .number()
        .describe(
          `The number of participants registered for the session for which the user clicks on the ${action} button`,
        ),
      teacher_name: z
        .string()
        .optional()
        .describe(
          `The name of the teacher of the session for which the user clicks on the ${action} button`,
        ),
      teacher_id: z
        .number()
        .optional()
        .describe(
          `The id of the teacher of the session for which the user clicks on the ${action} button`,
        ),
      session_type: z
        .string()
        .describe(
          `The type of the session for which the user clicks on the ${action} button (e.g. group activity, workshop)`,
        ),
      session_is_online: z
        .boolean()
        .describe(
          `Whether the session for which the user clicks on the ${action} button is an online session`,
        ),
      session_available: z
        .boolean()
        .describe(
          `Whether the session for which the user clicks on the ${action} button is still available when ${availableVerb} (i.e. not cancelled or already took place)`,
        ),
      session_duration: z
        .number()
        .describe(
          `The duration in minutes of the session for which the user clicks on the ${action} button`,
        ),
      session_visibility: z
        .enum(SessionVisibility)
        .describe(
          `The visibility of the session for which the user clicks on the ${action} button`,
        ),
    })
    .describe(`When the user clicks on the ${action} button`);

export const sessionUpdateRestoreButtonClickedEventSchema =
  sessionUpdateActionButtonClickedEventSchema(
    "restore",
    "session_update_restore_button_clicked",
    "restoring",
  );

export const sessionUpdateCancelButtonClickedEventSchema =
  sessionUpdateActionButtonClickedEventSchema(
    "cancel",
    "session_update_cancel_button_clicked",
    "cancelling",
  );

export const sessionUpdateCopyLinkButtonClickedEventSchema =
  sessionUpdateActionButtonClickedEventSchema(
    "copy link",
    "session_update_copy_link_button_clicked",
    "copying the link",
  );

export const sessionUpdateDuplicateButtonClickedEventSchema =
  sessionUpdateActionButtonClickedEventSchema(
    "duplicate",
    "session_update_duplicate_session_button_clicked",
    "duplicating",
  );

export const sessionUpdateUpdatedEventSchema = z
  .object({
    eventType: z.string().default("session_update_updated"),
    session_id: z
      .number()
      .describe("The id of the session that has been updated"),
    session_name: z
      .string()
      .describe("The name of the session that has been updated"),
    session_visibility: z
      .enum(SessionVisibility)
      .describe("The visibility of the session that has been updated"),
    session_available: z
      .boolean()
      .describe(
        "Whether the session that has been updated is still available when the update is saved (i.e. not cancelled or already took place)",
      ),
    session_date: z
      .string()
      .describe("The date of the session that has been updated"),
    updated_fields: z
      .array(z.string())
      .describe("The list of fields that have been updated for the session"),
  })
  .describe("When the user saves the session update");

export const sessionUpdateWaitingListMaxSizeUpdatedEventSchema = z
  .object({
    eventType: z
      .string()
      .default("session_update_waiting_list_max_size_updated"),
    session_id: z
      .number()
      .describe(
        "The id of the session for which the waiting list max size has been updated",
      ),
    old_waiting_list_max_size: z
      .number()
      .describe(
        "The old waiting list max size of the session before the update",
      ),
    new_waiting_list_max_size: z
      .number()
      .describe(
        "The new waiting list max size of the session after the update",
      ),
    delta: z
      .number()
      .describe(
        "The difference between the new and old waiting list max size of the session after the update",
      ),
  })
  .describe("When the user updates the waiting list max size of a session");

export const sessionUpdateCreditsUpdatedEventSchema = z
  .object({
    eventType: z.string().default("session_update_credits_updated"),
    session_id: z
      .number()
      .describe(
        "The id of the session for which the credits have been updated",
      ),
    old_credits: z
      .number()
      .describe("The old credits of the session before the update"),
    new_credits: z
      .number()
      .describe("The new credits of the session after the update"),
    delta: z
      .number()
      .describe(
        "The difference between the new and old credits of the session after the update",
      ),
  })
  .describe("When the user updates the credits of a session");

export const sessionUpdateDateStartUpdatedEventSchema = z
  .object({
    eventType: z.string().default("session_update_date_start_updated"),
    session_id: z
      .number()
      .describe(
        "The id of the session for which the start date has been updated",
      ),
    old_date_start: z
      .string()
      .describe("The old start date of the session before the update"),
    new_date_start: z
      .string()
      .describe("The new start date of the session after the update"),
  })
  .describe("When the user updates the start date of a session");

export const sessionUpdateDurationUpdatedEventSchema = z
  .object({
    eventType: z.string().default("session_update_duration_updated"),
    session_id: z
      .number()
      .describe(
        "The id of the session for which the duration has been updated",
      ),
    old_duration: z
      .number()
      .describe("The old duration in minutes of the session before the update"),
    new_duration: z
      .number()
      .describe("The new duration in minutes of the session after the update"),
    delta: z
      .number()
      .describe(
        "The difference between the new and old duration in minutes of the session after the update",
      ),
  })
  .describe("When the user updates the duration of a session");
