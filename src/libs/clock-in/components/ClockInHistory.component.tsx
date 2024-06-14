import React, { useState } from 'react';
import { DateTime, Duration } from 'luxon';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import chroma from 'chroma-js';

import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';
import TableBody from '@material-ui/core/TableBody';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import { Theme } from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';

// @ts-expect-error
import withConfirm from '#src/hocs/with-confirm.hoc';
import { ClockInData } from '../types';
import { getTextColorFromRGB } from '../../../utils/color';
import EditClockinModal, {
  Values as EditClockInValues,
} from './EditClockIn.dialog';
import { getRoleName } from '#src/libs/role/utils';
import ObjectLevelPermissionProviderComponent from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';

type Props = {
  value: {
    loading: boolean;
    count: number;
    // @ts-expect-error
    results: UserAttendanceHistory[];
  };
  page: number;
  page_size: number;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (page_size: number) => void;
  handleExport: (user_id?: number) => void;
  editClockIn: (clockInId: number, clockInData: ClockInData) => Promise<void>;
  deleteClockIn: ({ clockInId }: { clockInId: number }) => Promise<void>;
};

const ClockInHistory: React.FC<Props> = ({
  value: { loading, count, results },
  page,
  page_size,
  handlePageChange,
  handlePageSizeChange,
  handleExport,
  editClockIn,
  deleteClockIn,
}) => {
  const { t } = useTranslation(['clockIn']);
  const classes = useStyles();
  return (
    <TableContainer component={Paper}>
      {loading && <LinearProgress />}
      <Table size="small">
        <TableHead>
          <TableRow>
            <TablePagination
              count={count}
              onPageChange={(_, _page) => {
                handlePageChange(_page + 1);
              }}
              onRowsPerPageChange={(event) => {
                handlePageSizeChange(Number.parseInt(event.target.value, 10));
              }}
              page={page - 1}
              rowsPerPage={page_size}
              rowsPerPageOptions={[10, 25, 50].sort((a, b) => a - b)}
            />
          </TableRow>
          <TableRow>
            <TableCell className={classes.firstColumn} colSpan={1} />
            <TableCell className={classes.name}>
              {t('attendanceTable.staff')}
            </TableCell>
            <TableCell colSpan={10}>
              {t('historyTable.durationHoursMinutes')}
            </TableCell>
            <TableCell colSpan={10}>
              {t('historyTable.durationHours')}
            </TableCell>
            <TableCell className={classes.email} colSpan={10}>
              {t('attendanceTable.email')}
            </TableCell>
            <TableCell colSpan={10}>{t('attendanceTable.role')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {results?.map((userHistory) => (
            <ClockInHistoryRow
              key={userHistory.id}
              deleteClockIn={deleteClockIn}
              editClockIn={editClockIn}
              handleExport={handleExport}
              row={userHistory}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const ClockInHistoryRow: React.FC<{
  // @ts-expect-error
  row: UserAttendanceHistory;
  handleExport: (userId?: number) => void;
  editClockIn: (clockInId: number, clockInData: ClockInData) => Promise<void>;
  deleteClockIn: ({ clockInId }: { clockInId: number }) => Promise<void>;
}> = ({ row, handleExport, editClockIn, deleteClockIn }) => {
  const { t } = useTranslation(['clockIn']);
  const classes = useStyles();

  const [expanded, setExpanded] = useState(false);
  const [editData, setEditData] = useState<{
    id: number;
    clock_in: DateTime;
    clock_out: DateTime;
  } | null>(null);

  const getDurationTextInHour = (clock_in: number, clock_out: number) => {
    const end = DateTime.fromSeconds(clock_in);
    const start = DateTime.fromSeconds(clock_out);
    const duration = start.diff(end);

    return duration.toFormat('hh:mm');
  };

  const getDurationTextInBase10 = (clock_in: number, clock_out: number) => {
    const end = DateTime.fromSeconds(clock_in);
    const start = DateTime.fromSeconds(clock_out);
    const duration = start.diff(end);

    return Math.floor(duration.as('hours') * 100) / 100;
  };

  const totalDuration: number = // @ts-expect-error
    row?.history?.reduce<number>((acc, row) => {
      const end = DateTime.fromSeconds(row.date_start);
      const start = DateTime.fromSeconds(row.date_end);

      acc += start.diff(end).as('milliseconds');
      return acc;
    }, 0) ?? 0;

  const totalDurationDisplay =
    Duration.fromMillis(totalDuration).toFormat('hh:mm');

  const handleEditClockIn = React.useCallback(
    (clockInId: number, values: EditClockInValues) => {
      const valuesAsTimestamps = {
        date_start: values.dateStart.toUnixInteger(),
        date_end: values.dateEnd.toUnixInteger(),
      };
      // @ts-expect-error
      editClockIn(clockInId, valuesAsTimestamps);
      setEditData(null);
    },
    [],
  );

  return (
    <>
      <TableRow>
        <TableCell className={classes.firstColumn} colSpan={1}>
          <IconButton
            aria-expanded={expanded}
            aria-label="show more"
            className={classNames(classes.icon, {
              [classes.inverseIcon]: expanded,
            })}
            onClick={() => {
              setExpanded(!expanded);
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
        </TableCell>
        <TableCell className={classes.name}>
          {`${row.first_name} ${row.last_name}`}
        </TableCell>
        <TableCell colSpan={10}>{totalDurationDisplay}</TableCell>
        <TableCell colSpan={10}>
          {Math.floor(Duration.fromMillis(totalDuration).as('hour') * 100) /
            100}
        </TableCell>
        <TableCell className={classes.email} colSpan={10}>
          {row.email}
        </TableCell>
        <TableCell colSpan={10}>{getRoleName(row?.role, t)}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          className={classNames(classes.firstColumn, classes.innerTable)}
          colSpan={1}
        />
        <TableCell className={classes.innerTable} colSpan={250}>
          <Collapse unmountOnExit in={expanded} timeout="auto">
            <Table>
              <ObjectLevelPermissionProviderComponent requiredPermission="export.allowed_actions.attendance">
                {(hasPermission) =>
                  hasPermission && (
                    <TableRow className={classes.root}>
                      <TableCell colSpan={50}>
                        <Button
                          className={classes.download}
                          color="primary"
                          onClick={() => {
                            handleExport(row.id);
                          }}
                          variant="contained"
                        >
                          <CloudDownloadIcon className={classes.downloadIcon} />
                          {t('historyTable.download')}
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                }
              </ObjectLevelPermissionProviderComponent>
              <TableRow className={classes.root}>
                <TableCell
                  className={classNames(
                    classes.border,
                    classes.bold,
                    classes.subName,
                  )}
                >
                  {t('historyTable.startingHour')}
                </TableCell>
                <TableCell
                  className={classNames(
                    classes.border,
                    classes.bold,
                    classes.subName,
                  )}
                >
                  {t('historyTable.endingHour')}
                </TableCell>
                <TableCell
                  className={classNames(classes.border, classes.bold)}
                  colSpan={10}
                >
                  {t('historyTable.durationHoursMinutes')}
                </TableCell>
                <TableCell
                  className={classNames(classes.border, classes.bold)}
                  colSpan={10}
                >
                  {t('historyTable.durationHours')}
                </TableCell>
                <TableCell
                  className={classNames(
                    classes.border,
                    classes.bold,
                    classes.email,
                  )}
                  colSpan={10}
                />
                <TableCell
                  className={classNames(
                    classes.border,
                    classes.bold,
                    classes.action,
                  )}
                  colSpan={10}
                >
                  {t('historyTable.action')}
                </TableCell>
              </TableRow>
              {/* @ts-expect-error */}
              {row?.history?.map((detail, index) => (
                <TableRow key={detail.id} className={classes.root}>
                  <TableCell
                    className={classNames(classes.subName, {
                      [classes.border]: index !== row.history.length - 1,
                    })}
                  >
                    {`${DateTime.fromSeconds(
                      detail.date_start,
                    ).toLocaleString()} - ${DateTime.fromSeconds(
                      detail.date_start,
                    ).toLocaleString(DateTime.TIME_SIMPLE)}`}
                  </TableCell>
                  <TableCell
                    className={classNames(classes.subName, {
                      [classes.border]: index !== row.history.length - 1,
                    })}
                  >
                    {`${DateTime.fromSeconds(
                      detail.date_end,
                    ).toLocaleString()} - ${DateTime.fromSeconds(
                      detail.date_end,
                    ).toLocaleString(DateTime.TIME_SIMPLE)}`}
                  </TableCell>
                  <TableCell
                    className={classNames({
                      [classes.border]: index !== row.history.length - 1,
                    })}
                    colSpan={10}
                  >
                    {getDurationTextInHour(detail.date_start, detail.date_end)}
                  </TableCell>
                  <TableCell
                    className={classNames({
                      [classes.border]: index !== row.history.length - 1,
                    })}
                    colSpan={10}
                  >
                    {getDurationTextInBase10(
                      detail.date_start,
                      detail.date_end,
                    )}
                  </TableCell>
                  <TableCell
                    className={classNames(classes.email, {
                      [classes.border]: index !== row.history.length - 1,
                    })}
                    colSpan={10}
                  />
                  <TableCell
                    className={classNames(classes.action, {
                      [classes.border]: index !== row.history.length - 1,
                    })}
                    colSpan={10}
                  >
                    <div className={classes.actionContainer}>
                      <IconButton
                        className={classes.editButton}
                        color="primary"
                        onClick={() => {
                          setEditData({
                            id: detail.id,
                            clock_in: DateTime.fromSeconds(detail.date_start),
                            clock_out: DateTime.fromSeconds(detail.date_end),
                          });
                        }}
                        size="small"
                      >
                        <CreateIcon />
                      </IconButton>
                      <ButtonWithConfirmMenuItem
                        onClick={() => {
                          deleteClockIn({ clockInId: detail.id });
                        }}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
      {!!editData && (
        <EditClockinModal
          clockInId={editData?.id}
          dateEnd={editData?.clock_out}
          dateStart={editData?.clock_in}
          onCancel={() => setEditData(null)}
          onSubmit={handleEditClockIn}
          open={!!editData}
        />
      )}
    </>
  );
};

const ButtonWithConfirmMenuItem = withConfirm(
  ({ onClick }: { onClick: () => void }) => (
    <IconButton onClick={onClick} size="small">
      <DeleteIcon />
    </IconButton>
  ),
  'onClick',
  {
    title: 'clockIn:modal.delete.title',
    cancel: 'emailTemplate:modal.delete.cancel',
    confirm: 'emailTemplate:modal.delete.confirm',
    Content: ({ t }: { t: TFunction }) => (
      <p>{t('clockIn:modal.delete.content')}</p>
    ),
    isDeletion: true,
  },
);

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
    backgroundColor: theme.palette.grey[100],
  },
  innerTable: {
    '& > *': {
      borderBottom: 'unset',
    },
    padding: 0,
    backgroundColor: theme.palette.grey[100],
  },
  border: {
    borderBottom: '1px solid rgba(224, 224, 224, 1)',
  },
  name: {
    width: 400,
    minWidth: 400,
  },
  subName: {
    width: 200,
  },
  email: {
    width: 300,
    minWidth: 300,
  },
  firstColumn: {
    width: 40,
  },
  action: {
    width: 100,
  },
  bold: {
    fontWeight: 500,
  },
  icon: {
    transition: 'all 0.5s',
  },
  inverseIcon: {
    transform: 'rotate(180deg)',
  },
  download: {
    display: 'flex',
    alignItems: 'center',
    color: getTextColorFromRGB(chroma(theme.palette.primary.main).rgb()),
    fill: getTextColorFromRGB(chroma(theme.palette.primary.main).rgb()),
  },
  actionContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  editButton: {
    marginRight: theme.spacing(2),
  },
  downloadIcon: {
    marginRight: theme.spacing(2),
  },
}));

export default ClockInHistory;
