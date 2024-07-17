import React from 'react';
import { useTranslation, Trans } from 'react-i18next';

import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import Button from '@material-ui/core/Button/Button';
import IconButton from '@material-ui/core/IconButton/IconButton';
import { MuiThemeProvider } from '@material-ui/core/';
import makeStyles from '@material-ui/core/styles/makeStyles';
import GenericMuiDialog from '#src/components/genericDialog/GenericMuiDIalog';
import DialogContentText from '@material-ui/core/DialogContentText';
import CloseIcon from '@material-ui/icons/Close';

import { reportSwitcherTheme } from '#src/libs/reporting/v2/mui-theme-providers';
import Config from '#src/config';

type Props = {
  handleConfirmationDialogState: (bool: boolean) => () => void;
  handleDisplayReworkedVersion: (shouldCloseDialog: boolean) => () => void;
  isConfirmationDialogOpen: boolean;
  IsReportAlertDisplayedInV2: boolean;
  isV2Displayed: boolean;
  handleRemoveReportAlertDisplay: () => void;
};

const ReportVersionSwitcher: React.FC<Props> = ({
  handleConfirmationDialogState,
  handleDisplayReworkedVersion,
  isConfirmationDialogOpen,
  IsReportAlertDisplayedInV2,
  isV2Displayed,
  handleRemoveReportAlertDisplay,
}) => {
  const { t } = useTranslation('reporting');
  const classes = useStyles();

  return (
    <>
      <GenericMuiDialog
        confirmButtonVariant="text"
        confirmText={t('versionSwitcher.dialog.confirm')}
        onCancel={handleConfirmationDialogState(false)}
        onConfirm={handleDisplayReworkedVersion(true)}
        open={isConfirmationDialogOpen}
        title={t('versionSwitcher.dialog.title')}
      >
        <DialogContentText>
          {t('versionSwitcher.dialog.firstContentText')}
        </DialogContentText>
        <DialogContentText>
          {t('versionSwitcher.dialog.secondContentText')}
        </DialogContentText>
      </GenericMuiDialog>
      <MuiThemeProvider theme={reportSwitcherTheme}>
        {isV2Displayed && IsReportAlertDisplayedInV2 ? (
          <Alert severity="warning">
            <div>
              <AlertTitle>{t('versionSwitcher.title')}</AlertTitle>
              <Trans
                components={[
                  null,
                  <strong key="views"> Views </strong>,
                  <a
                    key="feedback-board"
                    className={classes.featureBaseAnchor}
                    href={`${Config.PUBLIC_URL}/feature-base`}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Feedback board
                  </a>,
                ]}
                i18nKey="versionSwitcher.content"
                t={t}
              />
            </div>
            <div className={classes.alertRightButton}>
              <IconButton onClick={handleRemoveReportAlertDisplay}>
                <CloseIcon fontSize="small" stroke="currentColor" />
              </IconButton>
            </div>
          </Alert>
        ) : null}
        {!isV2Displayed && (
          <Alert severity="warning">
            <div>
              <AlertTitle>{t('versionSwitcher.title')}</AlertTitle>
              <Trans
                components={[
                  null,
                  <strong key="views"> Views </strong>,
                  <a
                    key="feedback-board"
                    className={classes.featureBaseAnchor}
                    href={`${Config.PUBLIC_URL}/feature-base`}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Feedback board
                  </a>,
                ]}
                i18nKey="versionSwitcher.content"
                t={t}
              />
            </div>
            <div className={classes.alertRightButton}>
              <Button onClick={handleDisplayReworkedVersion(false)}>
                {t('versionSwitcher.fromOldToNew')}
              </Button>
            </div>
          </Alert>
        )}
      </MuiThemeProvider>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  alertRightButton: {
    display: 'flex',
    alignSelf: 'center',
    padding: theme.spacing(0.5, 0, 0, 2),
    color: 'inherit',
  },
  featureBaseAnchor: {
    color: 'inherit',
    textDecoration: 'underline',
  },
}));

export default React.memo(ReportVersionSwitcher);
