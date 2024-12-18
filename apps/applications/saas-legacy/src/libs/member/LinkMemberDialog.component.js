// @flow

import React from 'react';
import { TFunction, withTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

type Props = { t: TFunction, onConfirm: () => void, classes: Object };

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
        <Button
          classes={{ outlined: this.props.classes.buttonOutlined }}
          onClick={this.handleClickOpen}
          variant="outlined"
        >
          {t('exists.linkUser')}
        </Button>
        <Dialog
          aria-describedby="alert-dialog-description"
          aria-labelledby="alert-dialog-title"
          onClose={this.handleClose}
          open={this.state.open}
        >
          <DialogTitle id="alert-dialog-title">
            {t('linkDialog.title')}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {t('linkDialog.content')}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.handleClose}>
              {t('linkDialog.cancel')}
            </Button>
            <Button autoFocus color="primary" onClick={this.handleConfirm}>
              {t('linkDialog.confirm')}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const styles = () => ({
  buttonOutlined: {
    borderColor: 'white',
    color: 'white',
  },
});

export default withTranslation(['member'])(
  withStyles(styles)(MemberLinkDialog),
);
