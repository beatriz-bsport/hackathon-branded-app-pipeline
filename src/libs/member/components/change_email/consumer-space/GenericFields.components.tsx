import React from 'react';
import { useTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import MailIcon from '@material-ui/icons/Mail';
import BlockIcon from '@material-ui/icons/Block';
import { makeStyles, useTheme } from '@material-ui/styles';
import Button from '@material-ui/core/Button';

export const ContentTitle = ({
  title,
  iconType,
}: {
  title: string;
  iconType?: 'blocked' | undefined;
}) => {
  const theme: Theme = useTheme();
  const classes = useStyles(theme);
  return (
    <div className={classes.titleContainer}>
      {iconType === 'blocked' ? (
        <BlockIcon className={classes.redIcon} />
      ) : (
        <MailIcon className={classes.greyIcon} />
      )}
      <Typography variant="h5" className={classes.title}>
        {title}
      </Typography>
    </div>
  );
};
export const EmailDetailContent = ({
  old_email,
  new_email,
}: {
  old_email: string;
  new_email: string;
}) => {
  const theme: Theme = useTheme();
  const classes = useStyles(theme);
  const { t } = useTranslation('member');
  return (
    <div className={classes.emailDetailContainer}>
      <div className={classes.emailDetail}>
        <Typography variant="body1">
          {t('changeEmailRequest.dialog.oldEmail', {
            email: old_email,
          })}
        </Typography>
      </div>
      <div className={classes.emailDetail}>
        <Typography variant="body1">
          {t('changeEmailRequest.dialog.newEamil', {
            email: new_email,
          })}
        </Typography>
      </div>
    </div>
  );
};

export const SpacedText = ({ text }: { text: string }) => {
  const theme: Theme = useTheme();
  const classes = useStyles(theme);
  return (
    <div className={classes.spacedTextContainer}>
      <Typography variant="body1">{text}</Typography>
    </div>
  );
};
export const ContentActions = ({
  confirmText,
  denyText,
  onConfirm,
  onDenied,
}: {
  confirmText?: string;
  denyText?: string;
  onConfirm?: () => void;
  onDenied: () => void;
}) => {
  const theme: Theme = useTheme();
  const classes = useStyles(theme);
  return (
    <div className={classes.actions}>
      {denyText && onDenied && (
        <Button onClick={() => onDenied()} variant="text" color="inherit">
          {denyText}
        </Button>
      )}
      {confirmText && onConfirm && (
        <Button onClick={() => onConfirm()} variant="contained" color="primary">
          {confirmText}
        </Button>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    paddingBottom: theme.spacing(3),
  },
  title: {
    paddingLeft: theme.spacing(2),
  },
  emailDetail: {
    display: 'flex',
    paddingLeft: theme.spacing(1),
    '&::before': {
      content: '"\u2022"',
      paddingRight: theme.spacing(1),
    },
  },
  emailDetailContainer: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  spacedTextContainer: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  redIcon: {
    color: 'red',
  },
  greyIcon: {
    color: '#868686',
  },
}));
