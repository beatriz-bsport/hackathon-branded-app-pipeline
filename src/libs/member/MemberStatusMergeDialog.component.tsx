import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  DialogActions,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import { Cancel, CheckCircle } from '@material-ui/icons';
import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';

type SuccessDialogProps = {
  closeDialog: () => void;
  onSeeClick: () => void;
};

const MemberStatusMergeSuccessDialog: React.FC<SuccessDialogProps> = ({
  closeDialog,
  onSeeClick,
}) => {
  const { t } = useTranslation(['snackbar', 'common']);
  const classes = useStyles();
  return (
    <GenericResponsiveDialog open maxWidth="sm">
      <div className={classes.dialogContent}>
        <DialogTitle className={classes.contentWithIcon}>
          <div className={classes.successIconOutline}>
            <CheckCircle className={classes.circleIcon} color="primary" />
          </div>
        </DialogTitle>
        <DialogTitle className={classes.centerContent} id="alert-dialog-title">
          {t('mergeSuccess.title')}
        </DialogTitle>
        <DialogContentText
          className={classes.centerContent}
          color="inherit"
          id="alert-dialog-description"
        >
          {t('mergeSuccess.content')}
        </DialogContentText>
      </div>
      <DialogActions>
        <Button color="secondary" onClick={closeDialog}>
          {t('close')}
        </Button>

        <Button autoFocus color="primary" onClick={onSeeClick}>
          {t('mergeSuccess.seeMemberProfile')}
        </Button>
      </DialogActions>
    </GenericResponsiveDialog>
  );
};

type ErrorDialogProps = {
  closeDialog: () => void;
};

export const MemberStatusMergeErrorDialog: React.FC<ErrorDialogProps> = ({
  closeDialog,
}) => {
  const { t } = useTranslation(['snackbar', 'common']);
  const classes = useStyles();
  return (
    <GenericResponsiveDialog open maxWidth="sm">
      <div className={classes.dialogContent}>
        <DialogTitle className={classes.contentWithIcon}>
          <div className={classes.errorIconOutline}>
            <Cancel className={classes.circleIcon} color="error" />
          </div>
        </DialogTitle>
        <DialogTitle className={classes.centerContent} id="alert-dialog-title">
          {t('mergeError.title')}
        </DialogTitle>
        <DialogContentText
          className={classes.centerContent}
          color="inherit"
          id="alert-dialog-description"
        >
          {t('mergeError.content')}
        </DialogContentText>
      </div>
      <DialogActions>
        <Button color="secondary" onClick={closeDialog}>
          {t('close')}
        </Button>
      </DialogActions>
    </GenericResponsiveDialog>
  );
};

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  circleIcon: { height: 60, width: 60 },
  successIconOutline: {
    backgroundColor: '#F1F9F1',
    height: 110,
    width: 110,
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorIconOutline: {
    backgroundColor: '#FFF0EF',
    height: 110,
    width: 110,
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentWithIcon: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2),
  },
  centerContent: { display: 'flex', justifyContent: 'center' },
}));

export default {
  Success: MemberStatusMergeSuccessDialog,
  Error: MemberStatusMergeErrorDialog,
};
