import type { DateTime } from "@bsport/datetime-manipulation";

import { useToday } from "#src/utils/date";

export const useDisablePast = () => {
  const today = useToday();

  const disablePast = (date: DateTime) =>
    date.startOf("day") < today.startOf("day");

  return disablePast;
};
