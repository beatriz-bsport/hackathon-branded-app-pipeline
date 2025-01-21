import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '@material-ui/core/Button';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  updateLoading: boolean;
};

export const ReplacementRequestDeleteDialog: React.FC<Props> = ({
  open,
  onClose,
  onConfirm,
  updateLoading,
}) => {
  const classes = useStyles();

  const { t } = useTranslation('replacement');

  return (
    <Dialog classes={{ paper: classes.dialogPaper }} maxWidth="sm" open={open}>
      <Typography className={classes.title} variant="h6">
        {t('delete.title')}
      </Typography>
      <Typography className={classes.title} variant="body1">
        {t('delete.description')}
      </Typography>
      <div className={classes.alignRight}>
        {updateLoading ? (
          <CircularProgress className={classes.circularProgress} />
        ) : (
          <>
            <Button
              className={clsx(classes.buttons, classes.textSecondary)}
              onClick={onClose}
            >
              {t('delete.cancel')}
            </Button>
            <Button
              className={clsx(classes.buttons, classes.red)}
              onClick={onConfirm}
            >
              {t('delete.confirm')}
            </Button>
          </>
        )}
      </div>
    </Dialog>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    minWidth: '30%',
  },
  title: {
    margin: `${theme.spacing(2)}px ${theme.spacing(3)}px`,
  },
  textSecondary: { color: theme.palette.text.secondary },
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
  red: {
    color: theme.palette.error.main,
  },
  dialogPaper: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
}));

export default ReplacementRequestDeleteDialog;
