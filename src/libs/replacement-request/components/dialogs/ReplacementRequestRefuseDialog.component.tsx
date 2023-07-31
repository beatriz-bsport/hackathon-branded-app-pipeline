import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import red from '@material-ui/core/colors/red';
import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';

import ErrorIcon from '#components/icons/ErrorIcon.component';
import { OptionCallback } from '../../../../state/types';
import { ReplacementRequest } from '#libs/replacement-request/types';

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: (id: number, options?: OptionCallback) => void;
  replacementRequest: ReplacementRequest;
  loading: boolean;
};

export const ReplacementRequestRefuseDialog: React.FC<Props> = ({
  open,
  onClose,
  onConfirm,
  replacementRequest,
  loading,
}) => {
  const classes = useStyles();

  const { t } = useTranslation('replacement');

  const handleConfirm = useCallback(() => {
    onConfirm(replacementRequest.id, {
      onSuccess: () => {
        onClose();
      },
    });
  }, [onConfirm, replacementRequest, onClose]);

  return (
    <GenericResponsiveDialog open={open} maxWidth="sm">
      <div className={classes.errorIcon}>
        <ErrorIcon />
      </div>
      <Typography
        variant="body1"
        align="center"
        className={classes.description}
      >
        {t('coachAnswers.refuse.description')}
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
              {t('coachAnswers.refuse.cancel')}
            </Button>
            <Button
              className={classes.buttons}
              onClick={handleConfirm}
              color="primary"
              variant="contained"
            >
              {t('coachAnswers.refuse.confirm')}
            </Button>
          </>
        )}
      </div>
    </GenericResponsiveDialog>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    minWidth: '30%',
  },
  description: {
    margin: `${theme.spacing(2)}px ${theme.spacing(3)}px`,
    color: red[900],
  },
  textField: {
    margin: theme.spacing(2),
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
  errorIcon: {
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
  textSecondary: { color: theme.palette.text.secondary },
}));

export default ReplacementRequestRefuseDialog;
