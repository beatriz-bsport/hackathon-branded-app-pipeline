import React from 'react';
import {
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  makeStyles,
  type Theme,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

export const StopSubscriptionInfoModal: React.FC<{
  open: boolean;
  link: string;
  onClose: () => void;
  onValidate: () => void;
}> = ({ open, onClose, link, onValidate }) => {
  const { t } = useTranslation('theme');
  const classes = useStyles();

  return (
    <Dialog className={classes.dialog} onClose={onClose} open={open}>
      <DialogTitle>
        {t(
          'forms.themePersonalization.displayStopSubscriptionFromMemberSide.modal.title',
        )}
      </DialogTitle>
      <DialogContent>
        <Typography>
          {t(
            'forms.themePersonalization.displayStopSubscriptionFromMemberSide.modal.content',
          )}
        </Typography>
        <Typography className={classes.subText}>
          {t(
            'forms.themePersonalization.displayStopSubscriptionFromMemberSide.modal.linkText',
          )}
        </Typography>

        <a
          className={classes.link}
          href={link}
          rel="noreferrer"
          target="_blank"
        >
          <Button className={classes.button} color="primary" variant="outlined">
            {t(
              'forms.themePersonalization.displayStopSubscriptionFromMemberSide.modal.linkButton',
            )}
          </Button>
        </a>
      </DialogContent>
      <DialogActions>
        <Button className={classes.button} onClick={onClose} variant="text">
          {t(
            'forms.themePersonalization.displayStopSubscriptionFromMemberSide.modal.cancel',
          ).toUpperCase()}
        </Button>
        <Button
          className={classes.button}
          color="primary"
          onClick={onValidate}
          variant="contained"
        >
          {t(
            'forms.themePersonalization.displayStopSubscriptionFromMemberSide.modal.confirm',
          ).toUpperCase()}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  dialog: {
    padding: theme.spacing(1),
  },
  link: {
    textDecoration: 'none',
    display: 'flex',
    color: 'black',
    '&:focus, &:hover, &:visited, &:link, &:active': {
      textDecoration: 'none',
      color: 'black',
    },
  },
  button: {
    marginTop: theme.spacing(2),
    alignSelf: 'center',
  },
  subText: {
    marginTop: theme.spacing(4),
  },
}));
