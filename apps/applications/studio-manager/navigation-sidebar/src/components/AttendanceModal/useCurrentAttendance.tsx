import { useEffect, useState } from "react";

import { toast } from "@bsport/kaizen-primitive-core";
import {
  clockInAction,
  clockOutAction,
  fetchAttendancesAction,
  selectAttendance,
  useAttendanceStore,
} from "@bsport/store-staff-management-attendance";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

const _fetchAttendances = fetchAttendancesAction.bind(null, fetch, {
  my_current: true,
});
const _clockIn = clockInAction.bind(null, fetch);
const _clockOut = clockOutAction.bind(null, fetch);

export const useCurrentAttendance = () => {
  const { t } = useTranslation("features");

  // ----- State -----
  const [currentAttendanceId, setCurrentAttendanceId] = useState<
    number | undefined
  >(undefined);
  const currentAttendance = useAttendanceStore((state) =>
    selectAttendance(state, currentAttendanceId ?? -1),
  );

  // ----- Handlers -----

  const [{ isLoading: isFetchingCurrentAttendance }, fetchCurrentAttendance] =
    useAsync<typeof _fetchAttendances>({
      asyncFn: _fetchAttendances,
      onSuccess: ({ value }) => {
        if (value?.results?.length) {
          const currentAttendance = value.results[0];
          setCurrentAttendanceId(currentAttendance.id);
        }
      },
    });

  const [{ isLoading: isClockingIn }, clockIn] = useAsync<typeof _clockIn>({
    asyncFn: _clockIn,
    onSuccess: ({ value }) => {
      setCurrentAttendanceId(value.id);
    },
    onFailure: () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t("attendance.clockedIn.failedClockIn"),
        buttonIcon: "x-close",
      });
    },
    dependencies: [t],
  });

  const [{ isLoading: isClockingOut }, clockOut] = useAsync<typeof _clockOut>({
    asyncFn: _clockOut,
    onFailure: () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t("attendance.clockedOut.failedClockOut"),
        buttonIcon: "x-close",
      });
    },
    dependencies: [t],
  });

  // ----- Load data -----

  useEffect(() => {
    fetchCurrentAttendance();
  }, [fetchCurrentAttendance]);

  return {
    isInitialLoading: isFetchingCurrentAttendance,
    isLoading: isFetchingCurrentAttendance || isClockingIn || isClockingOut,
    clockIn,
    clockOut,
    currentAttendance,
  };
};
