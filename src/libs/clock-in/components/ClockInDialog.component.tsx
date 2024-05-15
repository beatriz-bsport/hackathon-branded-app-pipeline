import React, { useState } from 'react';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';

import { makeStyles, Theme } from '@material-ui/core';
import classNames from 'classnames';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import StopIcon from '@material-ui/icons/Stop';
import DoneAllIcon from '@material-ui/icons/DoneAll';

import { OptionCallback, OptionPaginatedCallback } from '../../../state/types';
import { getTextColorFromRGB } from '../../../utils/color';

import { RolePermission, Role } from '#libs/role/types';
import {
  ClockInQueryParams,
  LastClockIn,
  UserWithRealTimeAttendance,
} from '../types';
import ClockInForOtherTable from './ClockInForOtherTable.component';

const CLOCK_IN = 0;
const CLOCK_IN_FOR_OTHER = 1;
const CLOCK_IN_SUCCESS = 2;

enum PopupState {
  clockIn = CLOCK_IN,
  clockInForOther = CLOCK_IN_FOR_OTHER,
  success = CLOCK_IN_SUCCESS,
}

type Props = {
  name: string;
  email: string;
  open: boolean;
  lastClockIn: LastClockIn;
  permissions: RolePermission;
  value: {
    loading: boolean;
    count: number;
    results: UserWithRealTimeAttendance[];
  };
  fetchAttendance: (
    params: ClockInQueryParams,
    options?: OptionCallback,
  ) => Promise<void>;
  clockIn: (
    params: { userId?: number },
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
  // eslint-disable-next-line no-empty-pattern
  getLastClockin: ({}) => Promise<void>;
  onClose: () => void;
};

const ClockInDialog: React.FC<Props> = ({
  open,
  email,
  name,
  permissions,
  value,
  lastClockIn: { dateStart = null, onGoing = false, id },
  fetchAttendance,
  getLastClockin,
  fetchCompanyUserRolesPaginated,
  clockIn,
  clockOut,
  onClose,
}) => {
  const [mode, setMode] = useState<PopupState>(CLOCK_IN);
  const [successData, setSuccessData] = useState<{
    last_clock_in?: number;
    last_clock_out?: number;
  }>({});

  const { t } = useTranslation(['clockIn']);
  const classes = useStyles();

  const isClockingIn = !onGoing;
  const isClockingOut = onGoing;
  const [selfProcessing, setSelfProcessing] = React.useState(false);

  const handleSelfClockIn = () => {
    setSelfProcessing(true);
    if (!onGoing) {
      clockIn(
        {},
        {
          onSuccess: () => {
            getLastClockin({});
            setSelfProcessing(false);
          },
          onError: () => {
            setSelfProcessing(false);
          },
        },
      );
    } else {
      clockOut(
        { clockInId: id },
        {
          onSuccess: (data) => {
            setSuccessData({
              // @ts-ignore
              last_clock_in: data?.date_start,
              // @ts-ignore
              last_clock_out: data?.date_end,
            });
            setSelfProcessing(false);
            getLastClockin({});

            // @ts-ignore
            if (data?.date_end) {
              setMode(CLOCK_IN_SUCCESS);
            }
          },
        },
      );
    }
  };

  const handleClose = () => {
    if (mode === CLOCK_IN || mode === CLOCK_IN_SUCCESS) {
      onClose();
      return;
    }

    if (mode === CLOCK_IN_FOR_OTHER) {
      setMode(CLOCK_IN);
    }
  };

  const getDurationText = () => {
    const end = DateTime.fromSeconds(
      successData?.last_clock_in ?? DateTime.now().toUnixInteger(),
    );
    const start = DateTime.fromSeconds(
      successData?.last_clock_out ?? DateTime.now().toUnixInteger(),
    );
    const duration = start.diff(end);

    return duration.toFormat('HH:mm');
  };

  return (
    <Dialog
      classes={{
        paper: classNames({ [classes.bigPaper]: mode === CLOCK_IN_FOR_OTHER }),
      }}
      onClose={onClose}
      open={open}
    >
      <div className={classes.dialog}>
        <DialogTitle>{t('clockinDialog.title')}</DialogTitle>
        <DialogContent>
          {mode === CLOCK_IN && (
            <>
              {permissions?.navigationMenu?.payments?.clockIn?.selfClockIn && (
                <>
                  <Typography color="textPrimary">
                    {isClockingIn &&
                      t('clockinDialog.subtitleClockIn', {
                        name: name.trim() ? name : email,
                      })}
                    {isClockingOut && t('clockinDialog.subtitleClockOut')}
                  </Typography>
                  <Button
                    className={classes.button}
                    color="primary"
                    disabled={selfProcessing}
                    onClick={handleSelfClockIn}
                    variant="contained"
                  >
                    {isClockingIn && (
                      <>
                        {selfProcessing ? (
                          <CircularProgress color="inherit" size={12} />
                        ) : (
                          <PowerSettingsNewIcon className={classes.iconColor} />
                        )}
                        <Typography className={classes.textColor}>
                          {t('clockinDialog.clockIn')}
                        </Typography>
                      </>
                    )}
                    {isClockingOut && (
                      <>
                        {selfProcessing ? (
                          <CircularProgress color="inherit" size={12} />
                        ) : (
                          <StopIcon className={classes.iconColor} />
                        )}
                        <Typography className={classes.textColor}>
                          {t('clockinDialog.clockOut')}
                        </Typography>
                      </>
                    )}
                  </Button>
                  <div className={classes.subText}>
                    {isClockingIn && dateStart && (
                      <Typography className={classes.grey} variant="caption">
                        {t('clockinDialog.lastClockIn', {
                          date: DateTime.fromSeconds(
                            dateStart,
                          ).toLocaleString(),
                          hour: DateTime.fromSeconds(dateStart).toLocaleString(
                            DateTime.TIME_SIMPLE,
                          ),
                        })}
                      </Typography>
                    )}
                    {isClockingOut && (
                      <div className={classes.row}>
                        <HourglassEmptyIcon />
                        <Typography variant="caption">
                          <span className={classes.bold}>
                            {t('clockinDialog.lastClockOut')}
                          </span>
                          {`${DateTime.fromSeconds(
                            dateStart,
                          ).toLocaleString()} - ${DateTime.fromSeconds(
                            dateStart,
                          ).toLocaleString(DateTime.TIME_SIMPLE)}`}
                        </Typography>
                      </div>
                    )}
                  </div>
                </>
              )}
              {permissions?.navigationMenu?.payments?.clockIn
                ?.clockInForOther && (
                <Button
                  color="primary"
                  onClick={() => {
                    setMode(CLOCK_IN_FOR_OTHER);
                  }}
                  variant="outlined"
                >
                  {t('clockinDialog.clockInForOther')}
                </Button>
              )}
            </>
          )}

          {mode === CLOCK_IN_FOR_OTHER && (
            <ClockInForOtherTable
              clockIn={clockIn}
              clockOut={clockOut}
              fetchAttendance={fetchAttendance}
              fetchCompanyUserRolesPaginated={fetchCompanyUserRolesPaginated}
              value={value}
            />
          )}

          {mode === CLOCK_IN_SUCCESS && (
            <>
              <Typography color="textPrimary">
                {t('clockinDialog.subtitleSuccess')}
              </Typography>
              <div className={classes.iconContainer}>
                <DoneAllIcon className={classes.icon} color="primary" />
              </div>
              <div className={classes.spacing}>
                <Typography color="textPrimary">
                  <span className={classes.successText}>
                    {t('clockinDialog.successClockIn')}
                  </span>
                  {`${DateTime.fromSeconds(
                    successData?.last_clock_in,
                  ).toLocaleString()} - ${DateTime.fromSeconds(
                    successData?.last_clock_in,
                  ).toLocaleString(DateTime.TIME_SIMPLE)}`}
                </Typography>
              </div>
              <div className={classes.spacing}>
                <Typography color="textPrimary">
                  <span className={classes.successText}>
                    {t('clockinDialog.successClockOut')}
                  </span>
                  {`${DateTime.fromSeconds(
                    successData?.last_clock_out,
                  ).toLocaleString()} - ${DateTime.fromSeconds(
                    successData?.last_clock_out,
                  ).toLocaleString(DateTime.TIME_SIMPLE)}`}
                </Typography>
              </div>
              <div className={classes.spacing}>
                <Typography color="textPrimary">
                  <span className={classes.successText}>
                    {t('clockinDialog.successDuration')}
                  </span>
                  {getDurationText()}
                </Typography>
              </div>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t('clockinDialog.close')}</Button>
        </DialogActions>
      </div>
    </Dialog>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  bigPaper: {
    maxWidth: '80vw',
  },
  dialog: {
    padding: theme.spacing(1),
  },
  button: {
    marginTop: theme.spacing(2),
    alignSelf: 'center',
  },
  grey: {
    color: theme.palette.grey[700],
    marginTop: theme.spacing(2),
  },
  iconColor: {
    // @ts-expect-error
    fill: getTextColorFromRGB(theme.palette.primary.main),
  },
  icon: {
    marginTop: theme.spacing(2),
    width: 46,
    height: 46,
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  subText: {
    marginTop: theme.spacing(2),
  },
  textColor: {
    marginLeft: theme.spacing(2),
    // @ts-expect-error
    color: getTextColorFromRGB(theme.palette.primary.main),
  },
  spacing: {
    marginTop: theme.spacing(2),
  },
  successText: {
    fontWeight: 'bold',
    marginRight: theme.spacing(1),
  },
  bold: {
    fontWeight: 'bold',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
}));

export default React.memo(ClockInDialog);
