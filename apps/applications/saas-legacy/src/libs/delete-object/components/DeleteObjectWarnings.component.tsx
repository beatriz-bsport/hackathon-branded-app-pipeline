import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';

import { WarningMessagesHook, useDeleteObjectWarningMessages } from '../hooks';
import { DeleteObjectStatus, DELETE_OBJECT_TRANSLATIONS } from '../constants';

import type { DeleteObjectVariant } from '../types';

type Props = {
  variant: DeleteObjectVariant;
};

const DeleteObjectWarningsList: React.FC<ReturnType<WarningMessagesHook>> = ({
  deleteObjectStatus,
  errorMessages,
  infoMessages,
  warningMessages,
}) => {
  const classes = useStyles();

  switch (deleteObjectStatus) {
    case DeleteObjectStatus.ERROR:
      return (
        <ul className={classes.list}>
          {errorMessages.map((message, index) => (
            <li key={`error-messages-${index}`} className={classes.listItem}>
              {message}
            </li>
          ))}
        </ul>
      );

    case DeleteObjectStatus.WARNING:
    case DeleteObjectStatus.INFO:
      return (
        <ul className={classes.list}>
          {warningMessages.map((message, index) => (
            <li key={`warning-messages-${index}`} className={classes.listItem}>
              <b>{message}</b>
            </li>
          ))}
          {infoMessages.map((message, index) => (
            <li key={`info-messages-${index}`} className={classes.listItem}>
              {message}
            </li>
          ))}
        </ul>
      );

    default:
      return null;
  }
};

/** Component wrapping all potential warnings before deleting an object
 *
 * The `variant` prop will determine which hook to use to get the warning messages.
 */
const DeleteObjectWarnings: React.FC<Props> = ({ variant }) => {
  const classes = useStyles();
  const { t } = useTranslation(DELETE_OBJECT_TRANSLATIONS[variant]);

  const { warningMessages, errorMessages, infoMessages, deleteObjectStatus } =
    useDeleteObjectWarningMessages[variant]?.() ?? {};

  if (!deleteObjectStatus) {
    return null;
  }

  return (
    <div className={classes.root}>
      {(deleteObjectStatus === DeleteObjectStatus.ERROR ||
        deleteObjectStatus === DeleteObjectStatus.WARNING) && (
        <Alert severity={deleteObjectStatus}>
          {t(`deleteObject.title.${deleteObjectStatus}`)}
        </Alert>
      )}
      <DeleteObjectWarningsList
        deleteObjectStatus={deleteObjectStatus}
        errorMessages={errorMessages}
        infoMessages={infoMessages}
        warningMessages={warningMessages}
      />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  listItem: {
    listStyleType: 'disc',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    paddingLeft: theme.spacing(2),
  },
}));

export default React.memo(DeleteObjectWarnings);
