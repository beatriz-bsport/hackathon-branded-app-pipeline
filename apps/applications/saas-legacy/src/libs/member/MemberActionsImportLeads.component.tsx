import React, { FC, useCallback, useState, memo } from 'react';
import { LEAD_MANAGEMENT_IMPORT_LOCK_ACQUISITION_ERROR } from '@bsport/common/master-data/error-codes/member.js';

import { useTranslation } from 'react-i18next';

import GenericResponsiveDialog from '#src/components/genericDialog/GenericResponsiveDialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import makeStyles from '@material-ui/core/styles/makeStyles';
import useTheme from '@material-ui/core/styles/useTheme';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import ValidationIcon from '#src/components/icons/ValidationIcon.component';
import WarningIcon from '#src/components/icons/WarningIcon.component';
import ErrorIcon from '#src/components/icons/ErrorIcon.component';

import {
  LIGHT_RED_BACKGROUND_COLOR,
  LEAD_MANAGEMENT_IMPORT_INTERCOM_URL,
} from '#src/libs/member/constants';

import classNames from 'classnames';

export const MemberActionsImportLeadsSuccess: FC = () => {
  const { t } = useTranslation('member');

  const theme = useTheme();

  const classes = useStyles();

  const [dialogOpen, setDialogOpen] = useState(true);

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
  }, []);

  return (
    <GenericResponsiveDialog maxWidth="sm" open={dialogOpen}>
      <DialogContent className={classes.contentContainer}>
        <div className={classes.statusIcon}>
          <ValidationIcon color={theme.palette.success.main} />
        </div>
        <Typography variant="h6">{t('leads.dialogs.success')}</Typography>
      </DialogContent>
      <DialogActions className={classes.actionsContainer}>
        <Button onClick={handleDialogClose}>
          {t('archive.dialog.actions.close')}
        </Button>
      </DialogActions>
    </GenericResponsiveDialog>
  );
};

type PartialSuccessProps = {
  successFileDownloadUrl: string;
  errorFileDownloadUrl: string;
};

export const MemberActionsImportLeadsPartialSuccess: FC<
  PartialSuccessProps
> = ({ successFileDownloadUrl, errorFileDownloadUrl }) => {
  const { t } = useTranslation('member');

  const classes = useStyles();

  const [dialogOpen, setDialogOpen] = useState(true);

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
  }, []);

  const handleDownloadSuccessFile = useCallback(() => {
    window.open(successFileDownloadUrl, '_blank');
  }, [successFileDownloadUrl]);

  const handleDownloadErrorFile = useCallback(() => {
    window.open(errorFileDownloadUrl, '_blank');
  }, [errorFileDownloadUrl]);

  return (
    <GenericResponsiveDialog maxWidth="sm" open={dialogOpen}>
      <DialogContent className={classes.contentContainer}>
        <div className={classes.statusIcon}>
          <WarningIcon />
        </div>

        <Typography className={classes.titleText} variant="h6">
          {t('leads.dialogs.partialSuccess.title')}
        </Typography>
        <Typography variant="body1">
          {t('leads.dialogs.partialSuccess.lineOneMessage')}
        </Typography>
        <Typography variant="body1">
          {t('leads.dialogs.partialSuccess.lineTwoMessage')}
        </Typography>
        <div
          className={classNames(classes.paperContainer, classes.errorFile)}
          onClick={handleDownloadErrorFile}
        >
          <div className={classes.textContainer}>
            <Typography variant="body1">
              {t('leads.dialogs.partialSuccess.fileName')}
            </Typography>
            <Typography variant="body2">
              {t('leads.dialogs.partialSuccess.failedImportSubtext')}
            </Typography>
          </div>
          <CloudDownloadIcon />
        </div>

        <div
          className={classNames(classes.paperContainer, classes.successFile)}
          onClick={handleDownloadSuccessFile}
        >
          <div className={classes.textContainer}>
            <Typography variant="body1">
              {t('leads.dialogs.partialSuccess.fileName')}
            </Typography>
            <Typography variant="body2">
              {t('leads.dialogs.partialSuccess.successImportSubtext')}
            </Typography>
          </div>
          <CloudDownloadIcon />
        </div>
      </DialogContent>
      <DialogActions className={classes.actionsContainer}>
        <Button onClick={handleDialogClose}>
          {t('archive.dialog.actions.close')}
        </Button>
      </DialogActions>
    </GenericResponsiveDialog>
  );
};

type FailureProps = {
  errorCodes?: number[];
};

const MemberActionsImportLeadsFailure: FC<FailureProps> = ({
  errorCodes = [LEAD_MANAGEMENT_IMPORT_LOCK_ACQUISITION_ERROR],
}) => {
  const { t } = useTranslation('member');

  const classes = useStyles();

  const [dialogOpen, setDialogOpen] = useState(true);

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
  }, []);

  return (
    <GenericResponsiveDialog maxWidth="sm" open={dialogOpen}>
      <DialogContent className={classes.contentContainer}>
        <div className={classes.statusIcon}>
          <ErrorIcon />
        </div>
        <Typography variant="h6">{t('leads.dialogs.errors.title')}</Typography>
        <List>
          {errorCodes.map((errorCode) => (
            <ListItem key={errorCode} className={classes.bulletPoint}>
              <Typography className={classes.listElement} variant="body1">
                {t(`leads.dialogs.errors.${errorCode}`)}
              </Typography>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions className={classes.actionsContainer}>
        <Button onClick={handleDialogClose}>
          {t('archive.dialog.actions.close')}
        </Button>
      </DialogActions>
    </GenericResponsiveDialog>
  );
};

type NotACSVProps = {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
};

const MemberActionsImportLeadsNotACSV: FC<NotACSVProps> = ({
  setDialogOpen,
  dialogOpen,
}) => {
  const { t } = useTranslation('member');

  const classes = useStyles();

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
  }, [setDialogOpen]);

  const goToIntercomPage = useCallback(() => {
    window.open(LEAD_MANAGEMENT_IMPORT_INTERCOM_URL, '_blank');
  }, []);

  return (
    <GenericResponsiveDialog maxWidth="sm" open={dialogOpen}>
      <DialogContent className={classes.contentContainer}>
        <div className={classes.statusIcon}>
          <ErrorIcon />
        </div>
        <Typography className={classes.titleText} variant="h6">
          {t('leads.notACSV.title')}
        </Typography>
        <Typography variant="body1">{t('leads.notACSV.message')}</Typography>
      </DialogContent>
      <DialogActions className={classes.actionsContainer}>
        <Button onClick={handleDialogClose}>
          {t('archive.dialog.actions.close')}
        </Button>
        <Button color="primary" onClick={goToIntercomPage} variant="outlined">
          {t('leads.notACSV.goToIntercom')}
        </Button>
      </DialogActions>
    </GenericResponsiveDialog>
  );
};

const useStyles = makeStyles((theme) => ({
  statusIcon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  contentContainer: {
    marginTop: theme.spacing(3),
    marginRight: theme.spacing(3),
    marginLeft: theme.spacing(3),
    marginBottom: theme.spacing(1),
  },
  actionsContainer: {
    margin: theme.spacing(1),
  },
  paperContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  errorFile: {
    backgroundColor: LIGHT_RED_BACKGROUND_COLOR,
  },
  successFile: {
    backgroundColor: '#209D8214',
    marginBottom: 0,
  },
  titleText: {
    marginBottom: theme.spacing(2),
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
  },

  bulletPoint: {
    listStyleType: 'disc',
    display: 'list-item',
    listStylePosition: 'inside',
    marginLeft: theme.spacing(0),
    paddingLeft: theme.spacing(1),
  },
  listElement: {
    display: 'inline',
  },
}));

export default {
  Success: memo(MemberActionsImportLeadsSuccess),
  PartialSuccess: memo(MemberActionsImportLeadsPartialSuccess),
  Failure: memo(MemberActionsImportLeadsFailure),
  NotACSV: memo(MemberActionsImportLeadsNotACSV),
};
