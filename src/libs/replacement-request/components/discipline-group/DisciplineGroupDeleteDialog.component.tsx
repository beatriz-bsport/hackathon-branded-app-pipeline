import React from 'react';
import { useTranslation } from 'react-i18next';

import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import makeStyles from '@material-ui/core/styles/makeStyles';

import { DisciplineGroup } from '#libs/replacement-request/types';

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  disciplineGroup: DisciplineGroup;
};

export const DisciplineGroupDeleteDialog: React.FC<Props> = ({
  open,
  onClose,
  onConfirm,
  disciplineGroup,
  loading,
}) => {
  const classes = useStyles();

  const { t } = useTranslation('replacement');

  return (
    <Dialog open={open} maxWidth="sm" classes={{ paper: classes.dialogPaper }}>
      <Typography variant="h6" className={classes.title}>
        {t('disciplineGroup.delete.title')}
      </Typography>
      <Typography variant="body1" className={classes.title}>
        {t('disciplineGroup.delete.description', {
          name: disciplineGroup?.name || '',
        })}
      </Typography>
      <div className={classes.alignRight}>
        {loading ? (
          <CircularProgress className={classes.circularProgress} />
        ) : (
          <>
            <Button
              className={classNames(classes.buttons, classes.textSecondary)}
              onClick={onClose}
            >
              {t('disciplineGroup.delete.cancel')}
            </Button>
            <Button
              className={classNames(classes.buttons, classes.redButton)}
              onClick={onConfirm}
              disabled={loading}
            >
              {t('disciplineGroup.delete.confirm')}
            </Button>
          </>
        )}
      </div>
    </Dialog>
  );
};

const useStyles = makeStyles((theme) => ({
  title: {
    margin: `${theme.spacing(2)}px ${theme.spacing(3)}px`,
  },
  dialogPaper: { marginLeft: theme.spacing(2), marginRight: theme.spacing(2) },
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
  redButton: {
    color: theme.palette.error.main,
  },
  textSecondary: { color: theme.palette.text.secondary },
}));

export default DisciplineGroupDeleteDialog;
