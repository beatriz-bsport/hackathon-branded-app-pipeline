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
