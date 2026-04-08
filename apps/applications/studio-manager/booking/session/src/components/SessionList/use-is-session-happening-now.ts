import { useEffect, useState } from "react";

import {
  type DateTime,
  fromIsoString,
  getLocalNow,
} from "@bsport/datetime-manipulation";

// Keeps the "now" badge in sync for rendered sessions.
export const useIsSessionHappeningNow = (
  dateStartIso: string,
  durationMinutes: number,
  timezone: string,
) => {
  const [isHappeningNow, setIsHappeningNow] = useState(false);

  useEffect(() => {
    const start: DateTime = fromIsoString(dateStartIso, { zone: timezone });
    const end: DateTime = start.plus({ minutes: durationMinutes });

    const checkIsHappeningNow = () => {
      const now: DateTime = getLocalNow({ zone: timezone });

      setIsHappeningNow(now >= start && now < end);
    };

    checkIsHappeningNow();

    const interval = setInterval(checkIsHappeningNow, 60000);

    return () => clearInterval(interval);
  }, [dateStartIso, durationMinutes, timezone]);

  return isHappeningNow;
};
