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
} from '#libs/clock-in/actions';
import { getUsersPaginatedWithRole } from '#libs/role/selectors';
import ClockInHistoryComponent from '#libs/clock-in/components/ClockInHistory.component';
import ClockInHistoryHeader, {
  Values as ClockInHistoryHeaderValues,
} from '#libs/clock-in/components/ClockInHistoryHeader.component';
import { withHistoryAttendance } from '#libs/clock-in/selectors';
import { fetchCompanyUserRolesPaginated as fetchCompanyUserRolesPaginatedAction } from '#libs/role/actions';

type Props = ConnectedProps<typeof connector>;

const MEMBER_PER_PAGE = 10;

const ClockInHistory: React.FC<Props> = ({
  usersPaginatedWithAttendanceHistory,
  fetchCompanyUserRolesPaginated,
  editClockIn,
  deleteClockIn,
  getStaffsAttendanceHistory,
  exportStaffAttendanceHistory,
}) => {
  const { t } = useTranslation('clockIn');

  const [page, setPage] = useState(1);
  const [page_size, setPageSize] = useState(MEMBER_PER_PAGE);
  const [dateStart, setDateStart] = useState<DateTime>(
    DateTime.now().startOf('day'),
  );
  const [dateEnd, setDateEnd] = useState<DateTime>(DateTime.now().endOf('day'));

  useEffect(() => {
    fetchCompanyUserRolesPaginated(
      {
        page,
        page_size,
      },
      {
        onSuccess: (payload) =>
          getStaffsAttendanceHistory({
            min_date: dateStart.toUnixInteger(),
            max_date: dateEnd.toUnixInteger(),
            user_id__in: payload.results.map((u) => u.id),
          }),
      },
    );
  }, [
    dateEnd,
    dateStart,
    page_size,
    page,
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
        deleteClockIn={deleteClockIn}
        editClockIn={editClockIn}
        handleExport={handleExport}
        handlePageChange={(newPage) => {
          setPage(newPage);
        }}
        handlePageSizeChange={(pageSize) => {
          setPageSize(pageSize);
        }}
        page={page}
        page_size={page_size}
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
  }),
  {
    fetchCompanyUserRolesPaginated: fetchCompanyUserRolesPaginatedAction,
    getStaffsAttendanceHistory: getStaffsAttendanceHistoryAction,
    editClockIn: editClockInAction,
    deleteClockIn: deleteClockInAction,
    exportStaffAttendanceHistory: exportStaffAttendanceHistoryAction,
  },
);

export default compose(connector)(ClockInHistory);
