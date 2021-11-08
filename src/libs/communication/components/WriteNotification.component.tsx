import React from 'react';

import { makeStyles, Theme, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import TextField from '@material-ui/core/TextField';

export const MAX_LENGTH_PUSH_TITLE = 25;
export const MAX_LENGTH_PUSH_CONTENT = 200;

type OwnProps = {
  notificationTitle: string;
  onNotificationTitleChange: (text: string) => void;
  notificationContent: string;
  onNotificationContentChange: (text: string) => void;
};

type Props = OwnProps;

export const WriteNotification = (props: Props) => {
  const {
    notificationTitle,
    onNotificationTitleChange,
    notificationContent,
    onNotificationContentChange,
  } = props;
  const classes = useStyles();

  const { t } = useTranslation(['communication']);

  return (
    <div className={classes.container}>
      <TextField
        label={t('mail.titleNotification')}
        value={notificationTitle}
        onChange={(e) => onNotificationTitleChange(e.target.value)}
        fullWidth
        inputProps={{ maxLength: MAX_LENGTH_PUSH_TITLE }}
        className={classes.input}
      />
      <Typography variant="caption" className={classes.grey}>
        {`${notificationTitle?.length ?? 0}/${MAX_LENGTH_PUSH_TITLE}`}
      </Typography>
      <TextField
        label={t('mail.contentNotification')}
        value={notificationContent}
        onChange={(e) => onNotificationContentChange(e.target.value)}
        fullWidth
        multiline
        rows={5}
        inputProps={{ maxLength: MAX_LENGTH_PUSH_CONTENT }}
        variant="outlined"
        className={classes.input}
      />
      <Typography variant="caption" className={classes.grey}>
        {`${notificationContent?.length ?? 0}/${MAX_LENGTH_PUSH_CONTENT}`}
      </Typography>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  input: {
    marginTop: theme.spacing(2),
  },
  grey: {
    colors: theme.palette.grey[700],
  },
}));

export default WriteNotification;
