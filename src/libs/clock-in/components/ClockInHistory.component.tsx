import React, { useState } from 'react';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';
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

import withConfirm from '#hocs/with-confirm.hoc';
import { ClockInData } from '../types';
import { getTextColorFromRGB } from '../../../utils/color';
import EditClockinModal from './EditClockIn.dialog';

const MEMBER_PER_PAGE = 15;

type Props = {
  value: {
    loading: boolean;
    count: number;
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
              rowsPerPage={page_size}
              page={page - 1}
              onPageChange={(_, page_) => {
                handlePageChange(page_);
              }}
              onChangeRowsPerPage={(event) => {
                handlePageSizeChange(Number.parseInt(event.target.value, 10));
              }}
              rowsPerPageOptions={[10, MEMBER_PER_PAGE, 50, 100]}
            />
          </TableRow>
          <TableRow>
            <TableCell colSpan={1} className={classes.firstColumn}></TableCell>
            <TableCell className={classes.name}>
              {t('attendanceTable.staff')}
            </TableCell>
            <TableCell colSpan={10}>
              {t('historyTable.durationHoursMinutes')}
            </TableCell>
            <TableCell colSpan={10}>
              {t('historyTable.durationHours')}
            </TableCell>
            <TableCell colSpan={10} className={classes.email}>
              {t('attendanceTable.email')}
            </TableCell>
            <TableCell colSpan={10}>{t('attendanceTable.role')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {results?.map((user) => (
            <ClockInHistoryRow
              row={user}
              key={user.id}
              handleExport={handleExport}
              editClockIn={editClockIn}
              deleteClockIn={deleteClockIn}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const ClockInHistoryRow: React.FC<{
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
    clock_in: string;
    clock_out: string;
  } | null>(null);

  const getDurationTextInHour = (clock_in: number, clock_out: number) => {
    const end = moment.unix(clock_in);
    const start = moment.unix(clock_out);
    const duration = moment.duration(start.diff(end));

    return moment.utc(duration.as('milliseconds')).format('HH:mm');
  };

  const getDurationTextInBase10 = (clock_in: number, clock_out: number) => {
    const end = moment.unix(clock_in);
    const start = moment.unix(clock_out);
    const duration = moment.duration(start.diff(end));

    return Math.floor(duration.as('hour') * 100) / 100;
  };

  const totalDuration =
    row?.history?.reduce((acc, row) => {
      const end = moment.unix(row.date_start);
      const start = moment.unix(row.date_end);

      acc += moment.duration(start.diff(end)).as('milliseconds');
      return acc;
    }, 0) ?? 0;

  return (
    <>
      <TableRow>
        <TableCell colSpan={1} className={classes.firstColumn}>
          <IconButton
            onClick={() => {
              setExpanded(!expanded);
            }}
            aria-expanded={expanded}
            aria-label="show more"
            className={classNames(classes.icon, {
              [classes.inverseIcon]: expanded,
            })}
          >
            <ExpandMoreIcon />
          </IconButton>
        </TableCell>
        <TableCell className={classes.name}>
          {`${row.first_name} ${row.last_name}`}
        </TableCell>
        <TableCell colSpan={10}>
          {moment.utc(totalDuration).format('HH:mm')}
        </TableCell>
        <TableCell colSpan={10}>
          {Math.floor(
            moment.duration(totalDuration, 'millisecond').as('hour') * 100,
          ) / 100}
        </TableCell>
        <TableCell colSpan={10} className={classes.email}>
          {row.email}
        </TableCell>
        <TableCell colSpan={10}>{row?.role?.name}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          colSpan={1}
          className={classNames(classes.firstColumn, classes.innerTable)}
        />
        <TableCell colSpan={250} className={classes.innerTable}>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Table>
              <TableRow className={classes.root}>
                <TableCell colSpan={50}>
                  <Button
                    color="primary"
                    variant="contained"
                    className={classes.download}
                    onClick={() => {
                      handleExport(row.id);
                    }}
                  >
                    <CloudDownloadIcon className={classes.downloadIcon} />
                    {t('historyTable.download')}
                  </Button>
                </TableCell>
              </TableRow>
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
                  colSpan={10}
                  className={classNames(classes.border, classes.bold)}
                >
                  {t('historyTable.durationHoursMinutes')}
                </TableCell>
                <TableCell
                  colSpan={10}
                  className={classNames(classes.border, classes.bold)}
                >
                  {t('historyTable.durationHours')}
                </TableCell>
                <TableCell
                  colSpan={10}
                  className={classNames(
                    classes.border,
                    classes.bold,
                    classes.email,
                  )}
                />
                <TableCell
                  colSpan={10}
                  className={classNames(
                    classes.border,
                    classes.bold,
                    classes.action,
                  )}
                >
                  {t('historyTable.action')}
                </TableCell>
              </TableRow>
              {row?.history?.map((detail, index) => (
                <TableRow className={classes.root} key={detail.id}>
                  <TableCell
                    className={classNames(classes.subName, {
                      [classes.border]: index !== row.history.length - 1,
                    })}
                  >
                    {`${moment.unix(detail.date_start).format('L')} - ${moment
                      .unix(detail.date_start)
                      .format('HH:mm')}`}
                  </TableCell>
                  <TableCell
                    className={classNames(classes.subName, {
                      [classes.border]: index !== row.history.length - 1,
                    })}
                  >
                    {`${moment.unix(detail.date_end).format('L')} - ${moment
                      .unix(detail.date_end)
                      .format('HH:mm')}`}
                  </TableCell>
                  <TableCell
                    colSpan={10}
                    className={classNames({
                      [classes.border]: index !== row.history.length - 1,
                    })}
                  >
                    {getDurationTextInHour(detail.date_start, detail.date_end)}
                  </TableCell>
                  <TableCell
                    colSpan={10}
                    className={classNames({
                      [classes.border]: index !== row.history.length - 1,
                    })}
                  >
                    {getDurationTextInBase10(
                      detail.date_start,
                      detail.date_end,
                    )}
                  </TableCell>
                  <TableCell
                    colSpan={10}
                    className={classNames(classes.email, {
                      [classes.border]: index !== row.history.length - 1,
                    })}
                  />
                  <TableCell
                    colSpan={10}
                    className={classNames(classes.action, {
                      [classes.border]: index !== row.history.length - 1,
                    })}
                  >
                    <div className={classes.actionContainer}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => {
                          setEditData({
                            id: detail.id,
                            clock_in: moment
                              .unix(detail.date_start)
                              .format('LLL'),
                            clock_out: moment
                              .unix(detail.date_end)
                              .format('LLL'),
                          });
                        }}
                        className={classes.editButton}
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
          open={!!editData}
          config={{
            dateStart: editData.clock_in,
            dateEnd: editData.clock_out,
          }}
          onCancel={() => {
            setEditData(null);
          }}
          onSubmit={(values) => {
            editClockIn(editData.id, {
              date_start: values.dateStart.unix(),
              date_end: values.dateEnd.unix(),
            });
            setEditData(null);
          }}
        />
      )}
    </>
  );
};

const ButtonWithConfirmMenuItem = withConfirm(
  ({ onClick }: { onClick: () => void }) => (
    <IconButton size="small" onClick={onClick}>
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
