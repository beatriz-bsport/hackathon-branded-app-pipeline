import React from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';

import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import RedButton from '../../../components/button/RedButton.component';

type OwnProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (sendEmail: boolean) => void;
};

type Props = OwnProps & WithTranslation;

interface State {
  sendEmail: boolean;
}

class DiscardBookingOptionDialogV2 extends React.PureComponent<Props, State> {
  state: State = {
    sendEmail: true,
  };

  onSwitch = (ev: any) => {
    this.setState({ sendEmail: ev.target.checked });
  };

  onSubmit = () => {
    this.props.onSubmit(this.state.sendEmail);
  };

  render() {
    return (
      <Dialog
        aria-describedby="alert-dialog-description"
        aria-labelledby="alert-dialog-title"
        onClose={this.props.onClose}
        open={!!this.props.open}
      >
        <DialogTitle id="alert-dialog-title">
          {this.props.t('dialog.delete.title')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {this.props.t('dialog.delete.contentV2')}
          </DialogContentText>

          <FormControlLabel
            control={
              <Switch
                checked={this.state.sendEmail}
                color="primary"
                name="checkedB"
                onChange={this.onSwitch}
              />
            }
            label={this.props.t('dialog.delete.sendEmail')}
          />
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={this.props.onClose}>
            {this.props.t('dialog.delete.cancel')}
          </Button>
          <RedButton onClick={this.onSubmit}>
            {this.props.t('dialog.delete.confirm')}
          </RedButton>
        </DialogActions>
      </Dialog>
    );
  }
}

export default compose<any, OwnProps>(withTranslation(['waitingList']))(
  DiscardBookingOptionDialogV2,
);
