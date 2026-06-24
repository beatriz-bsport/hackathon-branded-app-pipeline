import { z } from "zod";

import { type DateTime, LuxonDateTime } from "@bsport/datetime-manipulation";

export type SeriesDuplicateFormData = {
  name: string;
  startDate: DateTime;
};

const isDateTime = (value: unknown): value is DateTime =>
  LuxonDateTime.isDateTime(value) && value.isValid;

export const buildSeriesDuplicateFormSchema = ({
  nameRequired,
  startDateRequired,
}: {
  nameRequired: string;
  startDateRequired: string;
}): z.ZodType<SeriesDuplicateFormData> =>
  z.object({
    name: z.string().trim().min(1, nameRequired),
    startDate: z.custom<DateTime>(isDateTime, {
      message: startDateRequired,
    }),
  });
