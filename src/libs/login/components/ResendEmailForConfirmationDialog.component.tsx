import React, { useState } from 'react';
import '#csscomponents/Login/LoginBackground.css';
import Button from '@material-ui/core/Button';
import '#csscomponents/Login/styles.css';
import { useTranslation } from 'react-i18next';

import { Theme } from '@material-ui/core/styles/createTheme';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  useTheme,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { DateTime } from 'luxon';
import ValidationIcon from '#components/icons/ValidationIcon.component';

type Props = {
  open: boolean;
  onClose: () => void;
  lastTimeSentEmailConfirmation: string;
  resendEmailForConfirmation: (options: any) => void;
};

const RESEND_STEP = 0;
const SENT_STEP = 1;

export const ResendEmailForConfirmation = (props: Props) => {
  const { t } = useTranslation('login');
  const classes = useStyles();
  const {
    open,
    onClose,
    resendEmailForConfirmation,
    lastTimeSentEmailConfirmation,
  } = props;

  const [dialogStep, setDialogStep] = useState(RESEND_STEP);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = () => {
    setIsSubmitting(true);
    resendEmailForConfirmation({
      onSuccess: () => {
        setDialogStep(SENT_STEP);
        setIsSubmitting(false);
      },
      onError: onClose,
    });
  };

  const canBeResent =
    !lastTimeSentEmailConfirmation ||
    DateTime.fromISO(lastTimeSentEmailConfirmation) <=
      DateTime.now().minus({ minute: 5 });

  const theme = useTheme();

  return (
    <Dialog maxWidth="sm" onClose={onClose} open={open}>
      {dialogStep === RESEND_STEP ? (
        <div>
          <DialogTitle> {t('emailConfirmation.dialog.title')}</DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              {canBeResent
                ? t('emailConfirmation.dialog.canBeResent')
                : t('emailConfirmation.dialog.cannotBeResent', {
                    timeLeftBeforeNewSent: Math.floor(
                      DateTime.fromISO(lastTimeSentEmailConfirmation)
                        .diff(DateTime.now().minus({ minute: 6 }), 'minutes')
                        .as('minutes'),
                    ),
                  })}
            </Typography>
          </DialogContent>
          <DialogActions>
            {canBeResent ? (
              <div>
                <Button color="secondary" onClick={onClose}>
                  {t('emailConfirmation.dialog.cancel')}
                </Button>
                <Button
                  color="primary"
                  disabled={isSubmitting}
                  onClick={onSubmit}
                  type="submit"
                  variant="contained"
                >
                  {t('emailConfirmation.dialog.send')}
                </Button>
              </div>
            ) : (
              <Button color="secondary" onClick={onClose}>
                {t('emailConfirmation.dialog.close')}
              </Button>
            )}
          </DialogActions>
        </div>
      ) : (
        <div className={classes.center}>
          <ValidationIcon color={theme.palette.success.main} />
          <Typography variant="h6">
            {t('emailConfirmation.dialog.sentAgain')}
          </Typography>
          <Typography className={classes.textExplain} variant="body1">
            {t('emailConfirmation.dialog.sentAgainExplain')}
          </Typography>
          <DialogActions>
            <Button
              color="primary"
              onClick={() => {
                onClose();
                setDialogStep(RESEND_STEP);
              }}
              type="submit"
            >
              {t('emailConfirmation.dialog.continue')}
            </Button>
          </DialogActions>
        </div>
      )}
    </Dialog>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    gap: theme.spacing(2),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(2),
  },
  textExplain: {
    maxWidth: '400px',
    textAlign: 'center',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

export default ResendEmailForConfirmation;
