import { z } from "zod";

import {
  RecurrenceInterval,
  RecurrenceRule,
  SessionCreationStep,
  SessionType,
  SessionVisibility,
} from "../constants";

export const sessionCreationOpensEventSchema = z
  .object({
    eventType: z.string().default("session_creation_opens"),
  })
  .describe("When the user clicks on ‘Add a session’ button");

export const sessionCreationActivitySelectedEventSchema = z
  .object({
    eventType: z.string().default("session_creation_activity_selected"),
    search_value: z
      .string()
      .nullable()
      .describe("The search query used to find the activity"),
    activity_type: z
      .enum(SessionType)
      .describe("The type of activity selected"),
    activity_id: z.number().describe("The id of the activity selected"),
    activity_name: z.string().describe("The name of the activity selected"),
  })
  .describe("When the user selects an activity in the session creation flow");

export const sessionCreationNextClickedEventSchema = z
  .object({
    eventType: z.string().default("session_creation_next_clicked"),
    current_step: z
      .enum(SessionCreationStep)
      .describe("The step from which the user clicks next."),
  })
  .describe(
    "When the user clicks on the ‘Next’ button in the session creation flow",
  );

export const sessionCreationBackClickedEventSchema = z
  .object({
    eventType: z.string().default("session_creation_back_clicked"),
    current_step: z
      .enum(SessionCreationStep)
      .describe("The step from which the user clicks back."),
  })
  .describe(
    "When the user clicks on the ‘Back’ button in the session creation flow",
  );

export const sessionCreationCloseButtonClickedEventSchema = z
  .object({
    eventType: z.string().default("session_creation_close_button_clicked"),
    current_step: z
      .enum(SessionCreationStep)
      .describe("The step from which the user clicks on the close button."),
  })
  .describe(
    "When the user clicks on the close button in the session creation flow",
  );

export const sessionCreationCreateSessionButtonClickedEventSchema = z
  .object({
    eventType: z
      .string()
      .default("session_creation_create_session_button_clicked"),
    session_is_recurrent: z
      .boolean()
      .describe("Whether the session being created is recurrent"),
    session_recurrence_end_date: z
      .date()
      .nullable()
      .describe(
        "The end date of the session recurrence, null if the session is not recurrent",
      ),
    session_recurrence_interval_selected: z
      .enum(RecurrenceInterval)
      .nullable()
      .describe(
        "The recurrence interval selected for the session when the session is recurrent",
      ),
    session_recurrence_rule: z
      .enum(RecurrenceRule)
      .nullable()
      .describe(
        "The specific recurrence rule selected by the user, e.g. every Monday and Wednesday, every 2 weeks on Tuesday, etc.",
      ),
  })
  .describe(
    "When the user clicks on the button to create the session in the session creation flow",
  );

export const sessionCreationCustomizeNameToggleEnabledEventSchema = z
  .object({
    eventType: z
      .string()
      .default("session_creation_customize_name_toggle_enabled"),
    customize_name_toggle_enabled: z
      .boolean()
      .describe(
        "Whether the user enables the toggle to customize session name",
      ),
  })
  .describe(
    "When the user toggles the option to customize the session name in the session creation flow",
  );

export const sessionCreationVisibilitySelectEventSchema = z
  .object({
    eventType: z.string().default("session_creation_visibility_select"),
    session_visibility: z
      .enum(SessionVisibility)
      .describe("The visibility option selected for the session"),
  })
  .describe(
    "When the user selects a visibility option for the session in the session creation flow",
  );

export const sessionCreationRecurrenceToggleEnabledEventSchema = z
  .object({
    eventType: z.string().default("session_creation_recurrence_toggle_enabled"),
    session_is_recurrent: z
      .boolean()
      .describe("Whether the session being created is recurrent"),
  })
  .describe(
    "When the user toggles the option to make the session recurrent in the session creation flow",
  );

export const sessionCreationRecurrenceIntervalEventSchema = z
  .object({
    eventType: z
      .string()
      .default("session_creation_recurrence_interval_select"),
    session_recurrence_interval_selected: z
      .enum(RecurrenceInterval)
      .describe(
        "The recurrence interval selected for the session when the session is recurrent",
      ),
  })
  .describe(
    "When the user selects a recurrence interval for the session in the session creation flow",
  );

export const sessionCreationRecurrenceRuleSelectedEventSchemas = z
  .object({
    eventType: z.string().default("session_creation_recurrence_rule_selected"),
    session_recurrence_rule: z
      .enum(RecurrenceRule)
      .describe(
        "The specific recurrence rule selected by the user, e.g. every Monday and Wednesday, every 2 weeks on Tuesday, etc.",
      ),
  })
  .describe(
    "When the user selects a specific recurrence rule for the session in the session creation flow",
  );
