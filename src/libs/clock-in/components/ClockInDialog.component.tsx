// @ts-nocheck
/* eslint-disable no-empty-pattern */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';
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
              last_clock_in: data?.date_start,
              last_clock_out: data?.date_end,
            });
            setSelfProcessing(false);
            getLastClockin({});

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
    const end = moment.unix(successData?.last_clock_in);
    const start = moment.unix(successData?.last_clock_out);
    const duration = moment.duration(start.diff(end));

    return moment.utc(duration.as('milliseconds')).format('HH:mm');
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
                          date: moment.unix(dateStart).format('L'),
                          hour: moment.unix(dateStart).format('HH:mm'),
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
                          {`${moment.unix(dateStart).format('L')} - ${moment
                            .unix(dateStart)
                            .format('HH:mm')}`}
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
                  {`${moment
                    .unix(successData?.last_clock_in)
                    .format('L')} - ${moment
                    .unix(successData?.last_clock_in)
                    .format('HH:mm')}`}
                </Typography>
              </div>
              <div className={classes.spacing}>
                <Typography color="textPrimary">
                  <span className={classes.successText}>
                    {t('clockinDialog.successClockOut')}
                  </span>
                  {`${moment
                    .unix(successData?.last_clock_out)
                    .format('L')} - ${moment
                    .unix(successData?.last_clock_out)
                    .format('HH:mm')}`}
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

export default ClockInDialog;
