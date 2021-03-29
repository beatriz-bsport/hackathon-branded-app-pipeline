// @flow

import React, { useState } from 'react';

import type { TFunction } from 'react-i18next';

import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import GetAppIcon from '@material-ui/icons/GetApp';
import { deletebackgroundDialog } from './actions/backgroundDialog.actions';
import withIntercomAction from './hocs/tracking/dispatch-action.hoc';

const styles = (theme) => ({
  circularProgress: {
    color: 'white',
    marginLeft: theme.spacing(1.5),
    marginRight: theme.spacing(1.5),
  },
  snackContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
});
type Props = {
  t: TFunction,
  backgroundDialog: Object,
  deletebackgroundDialog: (id: number) => void,
};
export function BackgroundDialog(props: Props) {
  const { t } = props;
  const [downloadDisable, setDownloadDisable] = useState(true);
  const handleDownloadDisable = () => {
    setDownloadDisable(false);
  };
  return (
    <div>
      {props.backgroundDialog.map((dialog) => (
        <Dialog
          open
          fullWidth
          maxWidth="md"
          aria-labelledby="alert-excel-report"
          aria-describedby="alert-excel-report"
        >
          <DialogTitle id="alert-dialog-title">{dialog.title}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {dialog.message}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={withIntercomAction('Exported a report')(async () => {
                window.open(dialog.link);
                window.close();
                handleDownloadDisable();
              })}
              variant="contained"
              color="primary"
              autoFocus
            >
              {t('common.download')}
              <GetAppIcon />
            </Button>

            <Button
              disabled={downloadDisable}
              onClick={() => props.deletebackgroundDialog(dialog.id)}
              color="secondary"
              autoFocus
            >
              {t('common.continue')}
            </Button>
          </DialogActions>
        </Dialog>
      ))}
    </div>
  );
}

function mapStateToProps(state) {
  return {
    backgroundDialog: state.backgroundDialog.messages,
  };
}

const mapDispatchToProps = {
  deletebackgroundDialog,
};

export default withTranslation()(
  withStyles(styles)(
    connect(mapStateToProps, mapDispatchToProps)(BackgroundDialog),
  ),
);
