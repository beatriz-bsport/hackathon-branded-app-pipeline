import React from 'react';

import { makeStyles, Theme, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import TextField from '@material-ui/core/TextField';

import { MAX_LENGTH_PUSH_TITLE, MAX_LENGTH_PUSH_CONTENT } from '../constants';

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
        fullWidth
        className={classes.input}
        inputProps={{ maxLength: MAX_LENGTH_PUSH_TITLE }}
        label={t('mail.titleNotification')}
        onChange={(e) => onNotificationTitleChange(e.target.value)}
        value={notificationTitle}
      />
      <Typography className={classes.grey} variant="caption">
        {`${notificationTitle?.length ?? 0}/${MAX_LENGTH_PUSH_TITLE}`}
      </Typography>
      <TextField
        fullWidth
        multiline
        className={classes.input}
        inputProps={{ maxLength: MAX_LENGTH_PUSH_CONTENT }}
        label={t('mail.contentNotification')}
        onChange={(e) => onNotificationContentChange(e.target.value)}
        rows={5}
        value={notificationContent}
        variant="outlined"
      />
      <Typography className={classes.grey} variant="caption">
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
