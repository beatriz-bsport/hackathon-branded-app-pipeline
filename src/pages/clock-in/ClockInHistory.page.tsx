import React, { useEffect, useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';
import moment from 'moment-timezone';

import { RootState } from '../../reducers';
import {
  editClockIn as editClockInAction,
  deleteClockIn as deleteClockInAction,
  getStaffsAttendanceHistory as getStaffsAttendanceHistoryAction,
  exportStaffAttendanceHistory as exportStaffAttendanceHistoryAction,
} from '#libs/clock-in/actions';
import { getUsersPaginatedWithRole } from '#libs/role/selectors';
import ClockInHistoryComponent from '#libs/clock-in/components/ClockInHistory.component';
import ClockInHistoryHeader from '#libs/clock-in/components/ClockInHistoryHeader.component';
import { withHistoryAttendance } from '#libs/clock-in/selectors';
import { fetchCompanyUserRolesPaginated as fetchCompanyUserRolesPaginatedAction } from '#libs/role/actions';
import { useTranslation } from 'react-i18next';

type Props = ConnectedProps<typeof connector>;

const MEMBER_PER_PAGE = 15;

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
  const [dateStart, setDateStart] = useState(moment().startOf('day'));
  const [dateEnd, setDateEnd] = useState(moment().endOf('day'));

  useEffect(() => {
    fetchCompanyUserRolesPaginated(
      {
        page,
        page_size,
      },
      {
        onSuccess: (payload) =>
          getStaffsAttendanceHistory({
            min_date: dateStart.unix(),
            max_date: dateEnd.unix(),
            user_id__in: payload.results.map((u) => u.id),
          }),
      },
    );
  }, [page, page_size, dateStart, dateEnd, getStaffsAttendanceHistory]);

  const handleExport = React.useCallback((userId?: number) => {
    exportStaffAttendanceHistory(
      {
        min_date: dateStart.unix(),
        max_date: dateEnd.unix(),
        ...(userId && { user_id__in: [userId] }),
      },
      {
        backgroundDialog: {
          title: t('export.dialog.title'),
          message: t('export.dialog.message'),
        },
      },
    );
  }, [exportStaffAttendanceHistory, dateEnd, dateStart, t]);

  return (
    <>
      <ClockInHistoryHeader
        config={{
          dateStart,
          dateEnd,
        }}
        onSubmit={(values) => {
          setDateStart(values.dateStart);
          setDateEnd(values.dateEnd);
        }}
        handleExportation={handleExport}
        isSubmitting_={false}
      />
      <ClockInHistoryComponent
        page={page}
        page_size={page_size}
        handlePageChange={(page) => {
          setPage(page);
        }}
        handlePageSizeChange={(page_size) => {
          setPageSize(page_size);
        }}
        value={usersPaginatedWithAttendanceHistory}
        editClockIn={editClockIn}
        deleteClockIn={deleteClockIn}
        handleExport={handleExport}
      />
    </>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    flex: '1 1 100%',
  },
}));

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
