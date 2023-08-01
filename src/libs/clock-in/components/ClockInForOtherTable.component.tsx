// @ts-nocheck
// @flow

import React, { useEffect, useState } from 'react';
import { TFunction } from 'i18next';
import MUIDataTable from 'mui-datatables';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';
import classNames from 'classnames';

import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
import { makeStyles } from '@material-ui/styles';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import { Theme } from '@material-ui/core';

import { UserWithRealTimeAttendance, ClockInQueryParams } from '../types';
import type {
  OptionCallback,
  OptionPaginatedCallback,
} from '../../../state/types';
import { Role } from '#libs/role/types';
import { getRoleName } from '#libs/role/utils';

const MEMBER_PER_PAGE = 15;

type Props = {
  value: {
    loading: boolean;
    count: number;
    results: UserWithRealTimeAttendance[];
  };
  fetchAttendance: (params: ClockInQueryParams) => Promise<void>;
  clockIn: (
    params: { userId: number },
    options?: OptionCallback,
  ) => Promise<void>;
  clockOut: (params: { clockInId: number }, options?: OptionCallback) => void;
  fetchCompanyUserRolesPaginated: (
    params: {
      page_size: number;
      page: number;
    },
    options: OptionPaginatedCallback<Role>,
  ) => void;
};

const ClockInForOtherTable: React.FC<Props> = ({
  value: { loading, results, count },
  fetchAttendance,
  fetchCompanyUserRolesPaginated,
  clockIn,
  clockOut,
}) => {
  const { t } = useTranslation(['clockIn', 'role']);
  const classes = useStyles();

  const [page, setPage] = useState(1);
  const [page_size, setPageSize] = useState(MEMBER_PER_PAGE);

  useEffect(() => {
    fetchCompanyUserRolesPaginated(
      {
        page,
        page_size,
      },
      {
        onSuccess: (payload) => {
          fetchAttendance({
            user_id__in: payload.results.map((u) => u.id),
          });
        },
      },
    );
  }, [page, page_size, fetchAttendance, fetchCompanyUserRolesPaginated]);

  const [processingIdList, setProcessingAttendance] = React.useState<
    Array<number>
  >([]);

  const options = React.useMemo(
    () => ({
      serverSide: true,
      rowsPerPage: MEMBER_PER_PAGE,
      rowsPerPageOptions: [MEMBER_PER_PAGE],
      loading,
      count: results.length,
      filter: false,
      search: false,
      sort: false,
      textLabels: {
        body: {
          noMatch: '',
        },
      },
      selectableRows: false,
      download: false,
      print: false,
      viewColumns: false,
      customFooter: () => (
        <>
          {loading && <LinearProgress style={{ width: '100%' }} />}
          <TableFooter>
            <TableRow>
              <TablePagination
                count={count}
                onChangeRowsPerPage={(event) => {
                  setPageSize(Number.parseInt(event.target.value, 10));
                }}
                onPageChange={(_, page_) => {
                  setPage(page_ + 1);
                }}
                page={page - 1}
                rowsPerPage={page_size}
                rowsPerPageOptions={[10, MEMBER_PER_PAGE, 50, 100]}
              />
            </TableRow>
          </TableFooter>
        </>
      ),
    }),
    [page_size, page, setPageSize, setPage, loading, count, results?.length],
  );

  const handleClockIn = React.useCallback(
    (params: { userId: number }, id: number) => {
      setProcessingAttendance([...processingIdList, id]);
      clockIn(params, {
        onSuccess: () => {
          fetchCompanyUserRolesPaginated(
            {
              page,
              page_size,
            },
            {
              onSuccess: (payload) => {
                fetchAttendance({
                  user_id__in: payload.results.map((u) => u.id),
                });
                setProcessingAttendance(
                  processingIdList.filter((id_) => id_ !== id),
                );
              },
              onError: () => {
                setProcessingAttendance(
                  processingIdList.filter((id_) => id_ !== id),
                );
              },
            },
          );
        },
      });
    },
    [
      clockIn,
      page,
      page_size,
      fetchCompanyUserRolesPaginated,
      fetchAttendance,

      processingIdList,
      setProcessingAttendance,
    ],
  );

  const handleClockOut = React.useCallback(
    (params: { clockInId: number }, id: number) => {
      setProcessingAttendance([...processingIdList, id]);
      clockOut(params, {
        onSuccess: () => {
          fetchCompanyUserRolesPaginated(
            {
              page,
              page_size,
            },
            {
              onSuccess: (payload) => {
                setProcessingAttendance(
                  processingIdList.filter((id_) => id_ !== id),
                );
                fetchAttendance({
                  user_id__in: payload.results.map((u) => u.id),
                });
              },
              onError: () => {
                setProcessingAttendance(
                  processingIdList.filter((id_) => id_ !== id),
                );
              },
            },
          );
        },
      });
    },
    [
      clockOut,
      fetchCompanyUserRolesPaginated,
      page,
      page_size,
      fetchAttendance,
      processingIdList,
      setProcessingAttendance,
    ],
  );

  return (
    <MUIDataTable
      columns={getColumnData(t)}
      data={results.map(
        ({ id, first_name, last_name, email, role, attendance }) => ({
          firstname: first_name,
          lastname: last_name,
          email,
          role: getRoleName(role, t),
          lastClockIn: attendance?.date_start
            ? `${moment.unix(attendance?.date_start).format('L')} - ${moment
                .unix(attendance?.date_start)
                .format('HH:mm')}`
            : '-',
          status: (
            <div
              className={classNames(classes.attendanceIndicator, {
                [classes.here]: !attendance?.on_going,
                [classes.missing]: attendance?.on_going,
              })}
            >
              {attendance?.on_going ? (
                <CheckIcon className={classes.icon} />
              ) : (
                <CloseIcon className={classes.icon} />
              )}
              <div>
                {t(
                  attendance?.on_going
                    ? 'attendanceTable.here'
                    : 'attendanceTable.missing',
                )}
              </div>
            </div>
          ),
          action: (
            <Button
              color="primary"
              disabled={processingIdList.includes(id)}
              onClick={
                attendance?.on_going
                  ? () => handleClockOut({ clockInId: attendance.id }, id)
                  : () => handleClockIn({ userId: id }, id)
              }
              style={{ width: '100%' }}
              variant="outlined"
            >
              {processingIdList.includes(id) && (
                <CircularProgress
                  className={classes.marginRight}
                  color="inherit"
                  size={12}
                />
              )}
              {t(
                attendance?.on_going
                  ? 'attendanceTable.start'
                  : 'attendanceTable.end',
              )}
            </Button>
          ),
        }),
      )}
      options={options}
    />
  );
};

const getColumnData = (t: TFunction) => {
  return [
    {
      name: 'lastname',
      label: t('attendanceTable.lastname'),
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: 'firstname',
      label: t('attendanceTable.firstname'),
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: 'email',
      label: t('attendanceTable.email'),
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: 'role',
      label: t('attendanceTable.role'),
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: 'lastClockIn',
      label: t('attendanceTable.lastClockIn'),
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: 'status',
      label: t('attendanceTable.status'),
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: 'action',
      label: t('attendanceTable.action'),
      options: {
        filter: false,
        sort: false,
      },
    },
  ];
};

const useStyles = makeStyles((theme: Theme) => ({
  attendanceIndicator: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1),
    maxWidth: 140,
    fontWeight: 500,
    borderRadius: 5,
  },
  marginRight: {
    marginRight: theme.spacing(1),
  },
  here: {
    backgroundColor: theme.palette.error.light,
  },
  missing: {
    backgroundColor: theme.palette.success.light,
  },
  icon: {
    marginRight: theme.spacing(2),
  },
}));

export default ClockInForOtherTable;
