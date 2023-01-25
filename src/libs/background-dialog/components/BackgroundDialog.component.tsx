import React, { useState } from 'react';
import classNames from 'classnames';
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
import { deletebackgroundDialog } from '../actions';
import { RootState } from '../../../reducers';
import {
  BackgroundDialog,
  ACTION_MODE_DOWNLOAD,
  DISPLAY_TEXT,
  DISPLAY_SUCCESS,
  DISPLAY_INFORMATION,
  ACTION_MODE_REDIRECT,
  DISPLAY_ACCESS_DENIED,
} from '../types';

type Props = {
  backgroundDialog: Array<BackgroundDialog>;
  deletebackgroundDialog: (id: number) => void;
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

export function BackgroundDialogComponent(props: Props) {
  const { t } = useTranslation();
  const classes = useStyles();

  const [downloadDisable, setDownloadDisable] = useState(true);
  const handleDownloadDisable = () => {
    setDownloadDisable(false);
  };
  return (
    <div>
      {props.backgroundDialog.map((dialog: any) => (
        <Dialog
          open
          fullWidth
          maxWidth="md"
          aria-labelledby="alert-excel-report"
          aria-describedby="alert-excel-report"
        >
          {!!dialog.title && (
            <DialogTitle id="alert-dialog-title">{dialog.title}</DialogTitle>
          )}
          {dialog.displayMode === DISPLAY_ACCESS_DENIED && (
            <DialogTitle id="alert-dialog-title">
              {t('snackbar:accessDenied.general.title')}
            </DialogTitle>
          )}
          <DialogContent>
            {dialog.displayMode === DISPLAY_TEXT && (
              <DialogContentText id="alert-dialog-description">
                {dialog.message}
              </DialogContentText>
            )}
            {dialog.displayMode === DISPLAY_INFORMATION && (
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
            {dialog.displayMode === DISPLAY_ACCESS_DENIED && (
              <div className={classes.contentWithIcon}>
                <BlockIcon className={classNames(classes.icon, classes.red)} />
                <Typography
                  align="center"
                  className={classes.infoText}
                  id="alert-dialog-description"
                >
                  {t('snackbar:accessDenied.general.message')}
                </Typography>
              </div>
            )}
            {dialog.displayMode === DISPLAY_SUCCESS && (
              <div className={classes.contentWithIcon}>
                <CheckIcon color="secondary" className={classes.icon} />
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
            {dialog.actionMode === ACTION_MODE_DOWNLOAD && (
              <>
                <a href={dialog.link} target="_blank" rel="noreferrer">
                  <Button
                    onClick={() => {
                      handleDownloadDisable();
                    }}
                    variant="contained"
                    color="primary"
                    autoFocus
                  >
                    {t('common.download')}
                    <GetAppIcon />
                  </Button>
                </a>

                <Button
                  disabled={downloadDisable}
                  onClick={() => props.deletebackgroundDialog(dialog.id)}
                  color="secondary"
                  autoFocus
                >
                  {t('common.continue')}
                </Button>
              </>
            )}
            {dialog.actionMode === ACTION_MODE_REDIRECT && (
              <>
                <Button
                  onClick={() => props.deletebackgroundDialog(dialog.id)}
                  color="secondary"
                >
                  {t('common.continue')}
                </Button>
                {dialog.link && (
                  <Button
                    onClick={() => {
                      props.pushRouter(dialog.link);
                      props.deletebackgroundDialog(dialog.id);
                    }}
                    color="primary"
                    autoFocus
                  >
                    {t('common.see')}
                    <ArrowForwardIcon />
                  </Button>
                )}
              </>
            )}
          </DialogActions>
        </Dialog>
      ))}
    </div>
  );
}

function mapStateToProps(state: RootState) {
  return {
    backgroundDialog: state.backgroundDialog.messages,
  };
}

const mapDispatchToProps = {
  deletebackgroundDialog,
  pushRouter: push,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BackgroundDialogComponent);
