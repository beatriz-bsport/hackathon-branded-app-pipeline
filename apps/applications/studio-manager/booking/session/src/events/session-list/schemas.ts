import { z } from "zod";

import { CalendarView } from "#src/types";
import { Columns } from "#src/types";

export const sessionListViewedEventSchema = z
  .object({
    eventType: z.string().default("session_list_viewed"),
    calendar_view: z
      .enum([CalendarView.DAILY, CalendarView.RANGE])
      .describe("The time interval for which sessions are displayed"),
    cancelled_sessions_displayed: z
      .boolean()
      .describe("Whether cancelled sessions are displayed in the session list"),
    displayed_columns: z
      .array(
        z.enum([
          Columns.TIME,
          Columns.SESSION_NAME,
          Columns.TEACHER,
          Columns.PARTICIPANTS,
          Columns.ESTABLISHMENT,
          Columns.SESSION_TYPE,
          Columns.ACTIONS,
        ]),
      )
      .describe("The columns displayed in the session list"),
    filters: z
      .array(
        z.object({
          field: z
            .string()
            .nullable()
            .describe("The field on which the filter is applied"),
          filter: z
            .string()
            .nullable()
            .describe("The operator of the filter applied (e.g. is, is not)"),
          valueIds: z
            .array(z.string())
            .describe("The value of the filter applied"),
        }),
      )
      .describe("The list of filters currently applied on the session list"),
  })
  .describe("When the user views the session list page");

export const sessionListCalendarViewChangedEventSchema = z
  .object({
    eventType: z.string().default("session_list_calendar_view_changed"),
    calendar_view: z
      .enum([CalendarView.DAILY, CalendarView.RANGE])
      .describe("The time interval for which sessions are displayed"),
  })
  .describe(
    "When the user changes the calendar view to display sessions for a different time interval",
  );

export const sessionListVisibleColumnsClickedEventSchema = z
  .object({
    eventType: z.string().default("session_list_visible_columns_clicked"),
    calendar_column_name: z
      .enum([
        Columns.TIME,
        Columns.SESSION_NAME,
        Columns.TEACHER,
        Columns.PARTICIPANTS,
        Columns.ESTABLISHMENT,
        Columns.SESSION_TYPE,
        Columns.ACTIONS,
      ])
      .describe(
        "The column for which the user clicks on the visible columns settings",
      ),
    calendar_column_visibility: z
      .enum(["visible", "hidden"])
      .describe(
        "Whether the column is currently visible or hidden when the user clicks on the visible columns settings",
      ),
  })
  .describe(
    "When the user clicks on the visible columns settings for a specific column, whether to show or hide it",
  );

export const sessionListDisplayCancelledSessionClickedEventSchema = z
  .object({
    eventType: z
      .string()
      .default("session_list_display_cancelled_sessions_clicked"),
    cancelled_sessions_displayed: z
      .boolean()
      .describe(
        "Whether the user chooses to show or hide cancelled sessions in the session list",
      ),
  })
  .describe(
    "When the user clicks on the setting to show or hide cancelled sessions in the session list",
  );

export const sessionListFiltersChangedEventSchema = z
  .object({
    eventType: z.string().default("session_list_filters_changed"),
    filters: z
      .array(
        z.object({
          field: z
            .string()
            .nullable()
            .describe("The field on which the filter is applied"),
          filter: z
            .string()
            .nullable()
            .describe("The operator of the filter applied (e.g. is, is not)"),
          valueIds: z
            .array(z.string())
            .describe("The value of the filter applied"),
        }),
      )
      .describe("The list of filters currently applied on the session list"),
  })
  .describe(
    "When the user applies, changes or removes filters on the session list",
  );

export const sessionListDashboardButtonClickedEventSchema = z
  .object({
    eventType: z.string().default("session_list_dashboard_button_clicked"),
  })
  .describe(
    "When the user clicks on the button to go to the dashboard from the session list page",
  );

export const sessionListSessionClickedEventSchema = z
  .object({
    eventType: z.string().default("session_list_session_clicked"),
    session_id: z
      .number()
      .describe("The id of the session that the user clicks on"),
    session_name: z
      .string()
      .describe("The name of the session that the user clicks on"),
    session_date: z
      .string()
      .describe("The date of the session that the user clicks on"),
    participant_number: z
      .number()
      .describe(
        "The number of participants registered for the session that the user clicks on",
      ),
    teacher_name: z
      .string()
      .describe(
        "The name of the teacher of the session that the user clicks on",
      ),
    teacher_id: z
      .number()
      .describe("The id of the teacher of the session that the user clicks on"),
    session_type: z
      .string()
      .describe(
        "The type of the session that the user clicks on (e.g. group activity, workshop)",
      ),
    session_is_online: z
      .boolean()
      .describe(
        "Whether the session that the user clicks on is an online session",
      ),
  })
  .describe("When the user clicks on a session in the session list");
