import { z } from "zod";

import { CalendarView } from "#src/types";
import { Columns } from "#src/types";

import { SearchClearSource } from "../constants";

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

export const sessionListExportParticipantConfirmButtonClickedEventSchema = z
  .object({
    eventType: z
      .string()
      .default("session_list_export_participant_confirm_button_clicked"),
    day_selected: z
      .string()
      .describe(
        "The day for which the user clicks to export participants of a session",
      ),
    calendar_filters_toggle_value: z
      .boolean()
      .describe(
        "Whether the user has toggled on the calendar filters when exporting participants of a session",
      ),
  })
  .describe(
    "When the user clicks on the confirm button to export participants of a session in the session list",
  );

export const sessionListCancelMultipleSessionsConfirmButtonClickedEventSchema =
  z
    .object({
      eventType: z
        .string()
        .default("session_list_cancel_multiple_sessions_button_clicked"),
      time_period_value: z.object({
        start_date: z
          .string()
          .describe(
            "The start date of the time period for which the user cancels multiple sessions",
          ),
        end_date: z
          .string()
          .describe(
            "The end date of the time period for which the user cancels multiple sessions",
          ),
      }),
    })
    .describe(
      "When the user clicks on the confirm button to cancel multiple sessions in the session list",
    );

export const sessionListCancelMultipleSessionTimePeriodSelectedEventSchema = z
  .object({
    eventType: z
      .string()
      .default("session_list_cancel_multiple_sessions_time_period_selected"),
    time_period_value: z.object({
      start_date: z
        .string()
        .describe(
          "The start date of the time period for which the user cancels multiple sessions",
        ),
      end_date: z
        .string()
        .describe(
          "The end date of the time period for which the user cancels multiple sessions",
        ),
    }),
  })
  .describe(
    "When the user selects a time period to cancel multiple sessions in the session list",
  );

export const sessionListSearchChangedEventSchema = z
  .object({
    eventType: z.string().default("session_list_search_changed"),
    search_value: z.string().describe("The search query that the user input"),
  })
  .describe("When the user input a value in the session list search bar");

export const sessionListSearchClearedEventSchema = z
  .object({
    eventType: z.string().default("session_list_search_cleared"),
    search_value: z.string().describe("The search query that the user cleared"),
    source: z
      .enum([SearchClearSource.CLEAR_BUTTON, SearchClearSource.CLEAR_FILTERS])
      .describe("The source from which the user cleared the search query"),
  })
  .describe("When the user clears the search input in the session list");

export const sessionListAllAttendanceButtonClickedEventSchema = z
  .object({
    eventType: z.string().default("session_list_all_attendance_button_clicked"),
    date: z
      .string()
      .describe(
        "The date for which the user clicks on the attendance button to validate all sessions",
      ),
    number_of_sessions: z
      .number()
      .describe(
        "The number of sessions displayed for the day for which the user clicks on the attendance button to validate all sessions",
      ),
  })
  .describe(
    "When the user clicks on the attendance button to validate all sessions for a specific day in the session list",
  );

export const sessionListAllAttendanceonfirmButtonClickedEventSchema = z
  .object({
    eventType: z
      .string()
      .default("session_list_all_attendance_confirm_button_clicked"),
    date: z
      .string()
      .describe(
        "The date for which the user clicks on the confirm button to validate all sessions",
      ),
    number_of_sessions: z
      .number()
      .describe(
        "The number of sessions displayed for the day for which the user clicks on the confirm button to validate all sessions",
      ),
  })
  .describe(
    "When the user clicks on the confirm button after clicking on the attendance button to validate all sessions for a specific day in the session list",
  );

export const sessionListAttendanceButtonClickedEventSchema = z
  .object({
    eventType: z.string().default("session_list_attendance_button_clicked"),
    session_id: z
      .number()
      .describe(
        "The id of the session for which the user clicks on the attendance button",
      ),
    session_name: z
      .string()
      .describe(
        "The name of the session for which the user clicks on the attendance button",
      ),
    session_date: z
      .string()
      .describe(
        "The date of the session for which the user clicks on the attendance button",
      ),
    participant_number: z
      .number()
      .describe(
        "The number of participants registered for the session for which the user clicks on the attendance button",
      ),
    teacher_name: z
      .string()
      .describe(
        "The name of the teacher of the session for which the user clicks on the attendance button",
      ),
    teacher_id: z
      .number()
      .describe(
        "The id of the teacher of the session for which the user clicks on the attendance button",
      ),
    session_type: z
      .string()
      .describe(
        "The type of the session for which the user clicks on the attendance button (e.g. group activity, workshop)",
      ),
    session_is_online: z
      .boolean()
      .describe(
        "Whether the session for which the user clicks on the attendance button is an online session",
      ),
  })
  .describe(
    "When the user clicks on the attendance button of a session in the session list",
  );
export const sessionListAttendanceConfirmButtonClickedEventSchema = z
  .object({
    eventType: z
      .string()
      .default("session_list_attendace_confirm_button_clicked"),
    session_id: z
      .number()
      .describe(
        "The id of the session for which the user clicks on the attendance confirm button",
      ),
    session_name: z
      .string()
      .describe(
        "The name of the session for which the user clicks on the attendance confirm button",
      ),
    session_date: z
      .string()
      .describe(
        "The date of the session for which the user clicks on the attendance confirm button",
      ),
    participant_number: z
      .number()
      .describe(
        "The number of participants registered for the session for which the user clicks on the attendance confirm button",
      ),
    teacher_name: z
      .string()
      .describe(
        "The name of the teacher of the session for which the user clicks on the attendance confirm button",
      ),
    teacher_id: z
      .number()
      .describe(
        "The id of the teacher of the session for which the user clicks on the attendance confirm button",
      ),
    session_type: z
      .string()
      .describe(
        "The type of the session for which the user clicks on the attendance confirm button (e.g. group activity, workshop)",
      ),
    session_is_online: z
      .boolean()
      .describe(
        "Whether the session for which the user clicks on the attendance confirm button is an online session",
      ),
  })
  .describe("When the user clicks on the attendance confirm button");
