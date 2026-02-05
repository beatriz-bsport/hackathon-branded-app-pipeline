import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import clsx from 'clsx';

import { Alert } from '@material-ui/lab';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useTheme } from '@material-ui/core/';
import CircularProgress from '@material-ui/core/CircularProgress';

import { DateTime } from 'luxon';
import ValidationIcon from '#src/components/icons/ValidationIcon.component';
import { ReplacementRequestAPIData } from '#src/libs/replacement-request/types';
import { CoachLateReplacementRequestStatus } from '#src/libs/associated-coach/types';
import { OptionCallback } from '../../../../state/types';

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    reason: string,
    options?: OptionCallback<ReplacementRequestAPIData[]>,
  ) => void;
  onCloseAfterSuccess: () => void;
  lateReplacementRequestStatus: CoachLateReplacementRequestStatus;
  nbLateRequestsLeft: number;
  nbSelectedOffers: number;
  atLeastOneLateRequest: boolean;
};

export const ReplacementRequestReasonDialog: React.FC<Props> = ({
  open,
  onClose,
  onSubmit,
  onCloseAfterSuccess,
  lateReplacementRequestStatus,
  nbLateRequestsLeft,
  nbSelectedOffers,
  atLeastOneLateRequest,
}) => {
  const classes = useStyles();

  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!open) {
      setReason('');
      setLoading(false);
      setSuccess(false);
    }
  }, [open]);

  const { t } = useTranslation('replacement');

  const theme = useTheme();

  const handleSubmit = useCallback(() => {
    setLoading(true);
    onSubmit(reason, {
      onSuccess: () => {
        setLoading(false);
        setSuccess(true);
      },
      onError: () => setLoading(false),
    });
  }, [onSubmit, reason]);

  const handleChange = (
    ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setReason(ev.currentTarget.value);
  };

  if (success)
    return (
      <Dialog
        classes={{ paper: classes.dialogPaper }}
        maxWidth="sm"
        open={open}
      >
        <div className={classes.validationIcon}>
          <ValidationIcon color={theme.palette.success.main} />
        </div>
        <Typography className={classes.successTexts} variant="h6">
          {t('askForReplacement.requestSent', { count: nbSelectedOffers })}
        </Typography>
        <Typography className={classes.successTexts} variant="body1">
          {t('askForReplacement.requestSentDescription', {
            count: nbSelectedOffers,
          })}
        </Typography>
        <div className={classes.alignMiddle}>
          <Button
            className={clsx(classes.buttons, classes.textSecondary)}
            onClick={onCloseAfterSuccess}
          >
            {t('askForReplacement.close')}
          </Button>
        </div>
      </Dialog>
    );

  return (
    <Dialog
      fullWidth
      classes={{ paper: classes.dialogPaper }}
      maxWidth="sm"
      open={open}
    >
      <div className={classes.dialogContainer}>
        <Typography className={classes.title} variant="h6">
          {t('askForReplacement.title')}
        </Typography>
        <TextField
          fullWidth
          multiline
          required
          className={classes.textField}
          helperText={`${reason.length}/100`}
          inputProps={{ minLength: 0, maxLength: 100 }}
          label={t('askForReplacement.label')}
          name="reason"
          onChange={handleChange}
          value={reason}
        />

        {lateReplacementRequestStatus && atLeastOneLateRequest && (
          <div className={classes.lateRequestHelpContainer}>
            <Typography>
              {t('askForReplacement.lateRequestTypo', {
                daysBeforeOffer:
                  lateReplacementRequestStatus.days_before_offer_replacement_request_is_late,
                count: nbSelectedOffers,
              })}
            </Typography>

            {lateReplacementRequestStatus.is_late_replacement_request_limited && (
              <Alert
                classes={{ root: classes.alertOverride }}
                className={classes.alert}
                severity="info"
              >
                <Trans
                  i18nKey="askForReplacement.lateRequestCounterInfo"
                  t={t}
                  values={{
                    requestsLeft: nbLateRequestsLeft,
                    requestsMax:
                      lateReplacementRequestStatus.max_late_requests_per_limitation_period,
                    dateEnd: DateTime.fromISO(
                      lateReplacementRequestStatus.current_limitation_period_end,
                    ).toFormat('D'),
                    count: nbLateRequestsLeft,
                  }}
                />
              </Alert>
            )}

            <Alert
              classes={{ root: classes.alertOverride }}
              className={classes.alert}
              severity="info"
            >
              <Typography variant="body2">
                {t('askForReplacement.lateRequestInfo', {
                  count: nbSelectedOffers,
                })}
              </Typography>
            </Alert>
          </div>
        )}

        <div className={classes.alignRight}>
          {loading ? (
            <CircularProgress className={classes.circularProgress} />
          ) : (
            <>
              <Button
                className={clsx(classes.buttons, classes.textSecondary)}
                onClick={onClose}
              >
                {t('askForReplacement.cancel')}
              </Button>
              <Button
                className={classes.buttons}
                color="primary"
                disabled={
                  reason.replaceAll(' ', '').replaceAll('', '').length === 0
                }
                onClick={handleSubmit}
                variant="contained"
              >
                {t('askForReplacement.submit')}
              </Button>
            </>
          )}
        </div>
      </div>
    </Dialog>
  );
};

const useStyles = makeStyles((theme) => ({
  dialogContainer: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(2),
  },
  textSecondary: { color: theme.palette.text.secondary },
  alert: { marginTop: theme.spacing(2), marginBottom: theme.spacing(2) },
  container: {
    minWidth: '30%',
  },
  title: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  textField: {
    marginBottom: theme.spacing(2),
  },
  alignRight: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  circularProgress: {
    margin: theme.spacing(1),
  },
  buttons: {
    margin: theme.spacing(1),
  },
  validationIcon: {
    paddingTop: theme.spacing(3),
    display: 'table',
    margin: 'auto',
  },
  successTexts: {
    margin: `${theme.spacing(2)}px ${theme.spacing(3)}px`,
    textAlign: 'center',
  },
  alignMiddle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: theme.spacing(3),
  },
  lateRequestHelpContainer: {
    marginTop: theme.spacing(2),
  },
  alertOverride: {
    alignItems: 'center',
  },
  dialogPaper: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
}));

export default ReplacementRequestReasonDialog;
