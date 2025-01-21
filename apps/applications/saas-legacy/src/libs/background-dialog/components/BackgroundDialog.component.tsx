import React, { useCallback, useState } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

// eslint-disable-next-line bsport/no-redux-in-component
import { connect } from 'react-redux';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import GetAppIcon from '@material-ui/icons/GetApp';
import { push } from 'connected-react-router';
import InfoIcon from '@material-ui/icons/Info';
import BlockIcon from '@material-ui/icons/Block';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/Check';
import { deletebackgroundDialog as deletebackgroundDialogAction } from '../actions';
import { RootState } from '../../../reducers';
import {
  BackgroundDialog,
  BackgroundDialogActionMode,
  BackgroundDialogDisplayMode,
  CustomDialogComponent,
} from '../types';

type Props = {
  backgroundDialog: BackgroundDialog['messages'];
  deletebackgroundDialog: (id: string) => void;
  pushRouter: (link: string) => void;
};

const useStyles = makeStyles((theme: Theme) => ({
  contentWithIcon: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2),
  },
  icon: {
    height: 64,
    width: 64,
    marginBottom: theme.spacing(2),
  },
  infoText: {},
  red: {
    color: theme.palette.error.main,
  },
}));

export const BackgroundDialogComponent: React.FC<Props> = ({
  backgroundDialog,
  deletebackgroundDialog,
  pushRouter,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const [downloadDisable, setDownloadDisable] = useState(true);
  const handleDownloadDisable = () => {
    setDownloadDisable(false);
  };

  return (
    <div>
      {(backgroundDialog ?? []).map((dialog) => {
        if (dialog.customDialogComponent) {
          return (
            <CustomDialog
              key={dialog.id}
              deleteBackgroundDialog={deletebackgroundDialog}
              DialogComponent={dialog.customDialogComponent}
              dialogId={dialog.id}
            />
          );
        }
        return (
          <Dialog
            key={dialog.id}
            fullWidth
            open
            aria-describedby="alert-excel-report"
            aria-labelledby="alert-excel-report"
            maxWidth="md"
          >
            {!!dialog.title && (
              <DialogTitle id="alert-dialog-title">{dialog.title}</DialogTitle>
            )}

            {dialog.displayMode ===
              BackgroundDialogDisplayMode.ACCESS_DENIED && (
              <DialogTitle id="alert-dialog-title">
                {t('snackbar:accessDenied.general.title')}
              </DialogTitle>
            )}
            <DialogContent>
              {dialog.displayMode === 'TEXT' && (
                <DialogContentText id="alert-dialog-description">
                  {dialog.message}
                </DialogContentText>
              )}
              {dialog.displayMode ===
                BackgroundDialogDisplayMode.INFORMATION && (
                <div className={classes.contentWithIcon}>
                  <InfoIcon className={classes.icon} />
                  <Typography
                    align="center"
                    className={classes.infoText}
                    id="alert-dialog-description"
                  >
                    {dialog.message}
                  </Typography>
                </div>
              )}
              {dialog.displayMode ===
                BackgroundDialogDisplayMode.ACCESS_DENIED && (
                <div className={classes.contentWithIcon}>
                  <BlockIcon className={clsx(classes.icon, classes.red)} />
                  <Typography
                    align="center"
                    className={classes.infoText}
                    id="alert-dialog-description"
                  >
                    {t('snackbar:accessDenied.general.message')}
                  </Typography>
                </div>
              )}
              {dialog.displayMode === BackgroundDialogDisplayMode.SUCCESS && (
                <div className={classes.contentWithIcon}>
                  <CheckIcon className={classes.icon} color="secondary" />
                  <Typography
                    align="center"
                    className={classes.infoText}
                    id="alert-dialog-description"
                  >
                    {dialog.message}
                  </Typography>
                </div>
              )}
            </DialogContent>
            <DialogActions>
              {dialog.actionMode === BackgroundDialogActionMode.DOWNLOAD && (
                <>
                  <a href={dialog.link} rel="noreferrer" target="_blank">
                    <Button
                      autoFocus
                      color="primary"
                      onClick={() => {
                        handleDownloadDisable();
                      }}
                      variant="contained"
                    >
                      {t('common.download')}
                      <GetAppIcon />
                    </Button>
                  </a>

                  <Button
                    autoFocus
                    color="secondary"
                    disabled={downloadDisable}
                    onClick={() => deletebackgroundDialog(dialog.id)}
                  >
                    {(dialog?.continueMessage &&
                      t(`${dialog.continueMessage}`)) ||
                      t('common.continue')}
                  </Button>
                </>
              )}
              {dialog.actionMode === BackgroundDialogActionMode.REDIRECT && (
                <>
                  <Button
                    color="secondary"
                    onClick={() => deletebackgroundDialog(dialog.id)}
                  >
                    {t('common.continue')}
                  </Button>
                  {dialog.link && (
                    <Button
                      autoFocus
                      color="primary"
                      onClick={() => {
                        pushRouter(dialog.link);
                        deletebackgroundDialog(dialog.id);
                      }}
                    >
                      {t('common.see')}
                      <ArrowForwardIcon />
                    </Button>
                  )}
                </>
              )}
              {!Object.values(BackgroundDialogActionMode).includes(
                dialog.actionMode,
              ) && (
                <Button
                  color="secondary"
                  onClick={() => deletebackgroundDialog(dialog.id)}
                >
                  {t('common.continue')}
                </Button>
              )}
            </DialogActions>
          </Dialog>
        );
      })}
    </div>
  );
};

const CustomDialog = React.memo(
  ({
    dialogId,
    DialogComponent,
    deleteBackgroundDialog,
  }: {
    dialogId: string;
    DialogComponent: CustomDialogComponent;
    deleteBackgroundDialog: (id: string) => void;
  }) => {
    const closeDialog = useCallback(
      () => deleteBackgroundDialog(dialogId),
      [dialogId, deleteBackgroundDialog],
    );

    return <DialogComponent closeDialog={closeDialog} />;
  },
);

function mapStateToProps(state: RootState) {
  return {
    backgroundDialog: state.backgroundDialog.messages,
  };
}

const mapDispatchToProps = {
  deletebackgroundDialog: deletebackgroundDialogAction,
  pushRouter: push,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  // @ts-expect-error state.backgroundDialog.messages is wrongly typed
)(BackgroundDialogComponent);
