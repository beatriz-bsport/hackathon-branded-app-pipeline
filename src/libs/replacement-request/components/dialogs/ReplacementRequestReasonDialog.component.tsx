import React, { useCallback, useState } from 'react';
import moment from 'moment-timezone';
import { useTranslation, Trans } from 'react-i18next';
import classNames from 'classnames';

import { Alert } from '@material-ui/lab';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useTheme } from '@material-ui/core/';
import CircularProgress from '@material-ui/core/CircularProgress';

import ValidationIcon from '#components/icons/ValidationIcon.component';
import { OptionCallback } from '../../../../state/types';
import { ReplacementRequestAPIData } from '#libs/replacement-request/types';
import { CoachLateReplacementRequestStatus } from '#libs/associated-coach/types';

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
        open={open}
        maxWidth="sm"
        classes={{ paper: classes.dialogPaper }}
      >
        <div className={classes.validationIcon}>
          <ValidationIcon color={theme.palette.success.main} />
        </div>
        <Typography variant="h6" className={classes.successTexts}>
          {t('askForReplacement.requestSent', { count: nbSelectedOffers })}
        </Typography>
        <Typography variant="body1" className={classes.successTexts}>
          {t('askForReplacement.requestSentDescription', {
            count: nbSelectedOffers,
          })}
        </Typography>
        <div className={classes.alignMiddle}>
          <Button
            className={classNames(classes.buttons, classes.textSecondary)}
            onClick={onCloseAfterSuccess}
          >
            {t('askForReplacement.close')}
          </Button>
        </div>
      </Dialog>
    );

  return (
    <Dialog
      open={open}
      maxWidth="sm"
      fullWidth
      classes={{ paper: classes.dialogPaper }}
    >
      <div className={classes.dialogContainer}>
        <Typography variant="h6" className={classes.title}>
          {t('askForReplacement.title')}
        </Typography>
        <TextField
          name="reason"
          label={t('askForReplacement.label')}
          inputProps={{ minLength: 0, maxLength: 100 }}
          value={reason}
          onChange={handleChange}
          className={classes.textField}
          helperText={`${reason.length}/100`}
          required
          multiline
          fullWidth
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
                className={classes.alert}
                severity="info"
                classes={{ root: classes.alertOverride }}
              >
                <Trans
                  t={t}
                  i18nKey="askForReplacement.lateRequestCounterInfo"
                  values={{
                    requestsLeft: nbLateRequestsLeft,
                    requestsMax:
                      lateReplacementRequestStatus.max_late_requests_per_limitation_period,
                    dateEnd: moment(
                      lateReplacementRequestStatus.current_limitation_period_end,
                    ).format('L'),
                    count: nbLateRequestsLeft,
                  }}
                />
              </Alert>
            )}

            <Alert
              className={classes.alert}
              severity="info"
              classes={{ root: classes.alertOverride }}
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
                className={classNames(classes.buttons, classes.textSecondary)}
                onClick={onClose}
              >
                {t('askForReplacement.cancel')}
              </Button>
              <Button
                disabled={
                  reason.replaceAll(' ', '').replaceAll('\n', '').length === 0
                }
                className={classes.buttons}
                onClick={handleSubmit}
                color="primary"
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
