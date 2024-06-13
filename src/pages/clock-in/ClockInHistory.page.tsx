import React, { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';

import { useTranslation } from 'react-i18next';
import { RootState } from '../../reducers';
import {
  editClockIn as editClockInAction,
  deleteClockIn as deleteClockInAction,
  getStaffsAttendanceHistory as getStaffsAttendanceHistoryAction,
  exportStaffAttendanceHistory as exportStaffAttendanceHistoryAction,
  fetchStaffWorkTimeSummary as fetchStaffWorkTimeSummaryAction,
} from '#src/libs/clock-in/actions';
import { getUsersPaginatedWithRole } from '#src/libs/role/selectors';
import ClockInHistoryComponent from '#src/libs/clock-in/components/ClockInHistory.component';
import ClockInHistoryHeader, {
  Values as ClockInHistoryHeaderValues,
} from '#src/libs/clock-in/components/ClockInHistoryHeader.component';
import { withHistoryAttendance } from '#src/libs/clock-in/selectors';
import { fetchCompanyUserRolesPaginated as fetchCompanyUserRolesPaginatedAction } from '#src/libs/role/actions';
import {
  ATTENDANCE_HISTORY_DETAILS_PAGE_SIZE_DEFAULT,
  ATTENDANCE_HISTORY_PAGE_SIZE_DEFAULT,
} from '#src/libs/clock-in/constants';

type Props = ConnectedProps<typeof connector>;

const ClockInHistory: React.FC<Props> = ({
  usersPaginatedWithAttendanceHistory,
  isSingleUserAttendanceLoading,
  fetchCompanyUserRolesPaginated,
  editClockIn,
  deleteClockIn,
  getStaffsAttendanceHistory,
  exportStaffAttendanceHistory,
  fetchStaffWorkTimeSummary,
  singleUserAttendanceRecordsCount,
}) => {
  const { t } = useTranslation('clockIn');

  const [userWithDetails, setUserWithDetails] = useState<number | null>(null);
  const [detailsPage, setDetailsPage] = useState(1);
  const [globalPage, setGlobalPage] = useState(1);
  const [globalPageSize, setGlobalPageSize] = useState<number>(
    ATTENDANCE_HISTORY_PAGE_SIZE_DEFAULT,
  );
  const [detailsPageSize, setDetailsPageSize] = useState(
    ATTENDANCE_HISTORY_DETAILS_PAGE_SIZE_DEFAULT,
  );

  const [dateStart, setDateStart] = useState<DateTime>(
    DateTime.now().startOf('day'),
  );
  const [dateEnd, setDateEnd] = useState<DateTime>(DateTime.now().endOf('day'));

  const handleToggleDetails = (userId: number) => {
    setUserWithDetails((prev) => (prev === userId ? null : userId));
    getStaffsAttendanceHistory({
      page: detailsPage,
      page_size: detailsPageSize,
      min_date: dateStart.toUnixInteger(),
      max_date: dateEnd.toUnixInteger(),
      user_id__in: [userId],
    });
  };

  useEffect(() => {
    if (!userWithDetails) return;
    getStaffsAttendanceHistory({
      page: detailsPage,
      page_size: detailsPageSize,
      min_date: dateStart.toUnixInteger(),
      max_date: dateEnd.toUnixInteger(),
      user_id__in: [userWithDetails],
    });
  }, [detailsPage, dateEnd, dateStart, detailsPageSize]);

  useEffect(() => {
    fetchCompanyUserRolesPaginated(
      {
        page: globalPage,
        page_size: globalPageSize,
      },
      {
        onSuccess: (payload) => {
          fetchStaffWorkTimeSummary({
            page_size: globalPageSize,
            min_date: dateStart.toUnixInteger(),
            max_date: dateEnd.toUnixInteger(),
            user_id__in: payload.results.map((u) => u.id),
          });
        },
      },
    );
  }, [
    dateEnd,
    dateStart,
    globalPageSize,
    globalPage,
    fetchCompanyUserRolesPaginated,
    getStaffsAttendanceHistory,
  ]);

  const handleExport = React.useCallback(
    (userId?: number) => {
      exportStaffAttendanceHistory(
        {
          min_date: dateStart.toUnixInteger(),
          max_date: dateEnd.toUnixInteger(),
          ...(userId && { user_id__in: [userId] }),
        },
        {
          backgroundDialog: {
            title: t('export.dialog.title'),
            message: t('export.dialog.message'),
          },
        },
      );
    },
    [exportStaffAttendanceHistory, dateEnd, dateStart, t],
  );

  const handleSubmitClockInHeader = React.useCallback(
    (values: ClockInHistoryHeaderValues) => {
      setDateStart(values.dateStart);
      setDateEnd(values.dateEnd);
    },
    [],
  );

  return (
    <>
      <ClockInHistoryHeader
        dateEnd={dateEnd}
        dateStart={dateStart}
        handleExportation={handleExport}
        onSubmit={handleSubmitClockInHeader}
      />
      <ClockInHistoryComponent
        userWithDetails={userWithDetails}
        areUserDetailsLoading={isSingleUserAttendanceLoading}
        globalPage={globalPage}
        globalPageSize={globalPageSize}
        handleGlobalPageChange={setGlobalPage}
        handleToggleDetails={handleToggleDetails}
        deleteClockIn={deleteClockIn}
        editClockIn={editClockIn}
        handleExport={handleExport}
        handleDetailsPageChange={setDetailsPage}
        handleGlobalPageSizeChange={setGlobalPageSize}
        handleDetailsPageSizeChange={setDetailsPageSize}
        detailsPage={detailsPage}
        detailsPageSize={detailsPageSize}
        detailsCount={singleUserAttendanceRecordsCount}
        // @ts-expect-error
        value={usersPaginatedWithAttendanceHistory}
      />
    </>
  );
};

const connector = connect(
  (state: RootState) => ({
    usersPaginatedWithAttendanceHistory: withHistoryAttendance(
      getUsersPaginatedWithRole,
    )(state),
    singleUserAttendanceRecordsCount: state.clockIn?.attendanceRecords?.count,
    isSingleUserAttendanceLoading: state.clockIn?.attendanceRecords?.loading,
  }),
  {
    fetchCompanyUserRolesPaginated: fetchCompanyUserRolesPaginatedAction,
    getStaffsAttendanceHistory: getStaffsAttendanceHistoryAction,
    fetchStaffWorkTimeSummary: fetchStaffWorkTimeSummaryAction,
    editClockIn: editClockInAction,
    deleteClockIn: deleteClockInAction,
    exportStaffAttendanceHistory: exportStaffAttendanceHistoryAction,
  },
);

export default compose(connector)(ClockInHistory);
