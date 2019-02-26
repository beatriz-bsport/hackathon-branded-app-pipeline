// @flow

import React from 'react';
import type { TFunction } from 'react-i18next';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

type Props = { t: TFunction, onConfirm: () => void };

class MemberLinkDialog extends React.Component<Props> {
  state = {
    open: false,
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleConfirm = () => {
    this.props.onConfirm();
    this.handleClose();
  };

  render() {
    const { t } = this.props;
    return (
      <div>
        <Button onClick={this.handleClickOpen}>
          {t('member.exists.linkUser')}
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {t('member.linkDialog.title')}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {t('member.linkDialog.content')}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              {t('member.linkDialog.cancel')}
            </Button>
            <Button onClick={this.handleConfirm} color="primary" autoFocus>
              {t('member.linkDialog.confirm')}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default MemberLinkDialog;
