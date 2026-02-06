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
