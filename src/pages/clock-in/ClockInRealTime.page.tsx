import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';
import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';
import { push as pushAction } from 'connected-react-router';

import { RootState } from '../../reducers';
import ClockInForOtherTable from '#libs/clock-in/components/ClockInForOtherTable.component';
import { fetchCompanyUserRolesPaginated as fetchCompanyUserRolesPaginatedAction } from '#libs/role/actions';
import { getPermissions } from '#libs/role/selectors';
import {
  clockIn as clockInAction,
  clockOut as clockOutAction,
  getStaffsAttendanceRealTime as getStaffsAttendanceRealTimeAction,
} from '#libs/clock-in/actions';
import { getUsersPaginatedWithRolesWithRealTimeAttendance } from '#libs/clock-in/selectors';
import IsEmptyList from '#components/navigation/IsEmptyList.component';

type Props = ConnectedProps<typeof connector>;

const ClockInRealTime: React.FC<Props> = ({
  permissions,
  usersPaginatedWithRoles,
  fetchCompanyUserRolesPaginated,
  getStaffsAttendanceRealTime,
  clockIn,
  clockOut,
  push,
}) => {
  const { t } = useTranslation(['clockIn']);
  const classes = useStyles();

  useEffect(() => {
    fetchCompanyUserRolesPaginated(
      {
        page: 1,
        page_size: 15,
      },
      {
        onSuccess: (payload) => {
          getStaffsAttendanceRealTime({
            user_id__in: payload.results.map((u) => u.id),
          });
        },
      },
    );
  }, [getStaffsAttendanceRealTime, fetchCompanyUserRolesPaginated]);

  const canAccessStaff = permissions?.navigationMenu?.settings?.staffs;
  return (
    <div className={classes.container}>
      {!usersPaginatedWithRoles.loading &&
      usersPaginatedWithRoles.count === 0 ? (
        <IsEmptyList
          button={canAccessStaff && t('attendanceTable.createStaff')}
          onCreate={
            canAccessStaff
              ? () => {
                  push('/settings/role');
                }
              : undefined
          }
          onCreateLabel={canAccessStaff && t('attendanceTable.createStaff')}
          text={t('attendanceTable.emptyState')}
        />
      ) : (
        <ClockInForOtherTable
          clockIn={clockIn}
          clockOut={clockOut}
          fetchAttendance={getStaffsAttendanceRealTime}
          fetchCompanyUserRolesPaginated={fetchCompanyUserRolesPaginated}
          // @ts-expect-error
          value={usersPaginatedWithRoles}
        />
      )}
    </div>
  );
};

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 100%',
  },
}));

const connector = connect(
  (state: RootState) => ({
    permissions: getPermissions(state),
    usersPaginatedWithRoles:
      getUsersPaginatedWithRolesWithRealTimeAttendance(state),
  }),
  {
    fetchCompanyUserRolesPaginated: fetchCompanyUserRolesPaginatedAction,
    getStaffsAttendanceRealTime: getStaffsAttendanceRealTimeAction,
    clockIn: clockInAction,
    clockOut: clockOutAction,
    push: pushAction,
  },
);

export default compose(connector)(ClockInRealTime);
