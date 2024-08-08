import React from 'react';
import { useTranslation, Trans } from 'react-i18next';

import {
  MuiThemeProvider,
  makeStyles,
  DialogContentText,
  IconButton,
  Button,
} from '@material-ui/core/';
import GenericMuiDialog from '#src/components/genericDialog/GenericMuiDIalog';
import CloseIcon from '@material-ui/icons/Close';
import { reportSwitcherTheme } from '#src/libs/reporting/v2/mui-theme-providers';
import Config from '#src/config';
import { Alert, AlertTitle } from '@material-ui/lab';

type Props = {
  handleConfirmationDialogState: (bool: boolean) => () => void;
  handleDisplayReworkedVersion: (shouldCloseDialog: boolean) => () => void;
  isConfirmationDialogOpen: boolean;
  isReportAlertDisplayedInV2: boolean;
  isV2Displayed: boolean;
  handleRemoveReportAlertDisplay: () => void;
};

const ReportVersionSwitcher: React.FC<Props> = ({
  handleConfirmationDialogState,
  handleDisplayReworkedVersion,
  isConfirmationDialogOpen,
  isReportAlertDisplayedInV2,
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
        {isV2Displayed && isReportAlertDisplayedInV2 ? (
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
