// @flow
import React, { Component } from 'react';
import { compose } from 'recompose';

import { withTranslation } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import type { TFunction } from 'react-i18next';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';

import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Checkbox from '@material-ui/core/Checkbox';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import SendMailToMembersDialog from '../../libs/communication/components/MailDialog.component';
import type { Booking, BookingOption } from '../../libs/booking/types';

type Props = {
  fullScreen: boolean,
  mailDefaultTitle: string,
  bookingOptionsPending: Array<BookingOption>,
  bookings: Array<Booking>,
  members: Array<Member>,
  onClose: () => void,
  mailMembers: boolean,

  t: TFunction,
  classes: Object,
};

type State = {
  receiversList: Array<ReceiverInfo>,
  mailToWaitingList: boolean,
  mailToBookings: boolean,
  openMailChoiceDialog: boolean,
};

export class MailDialog extends Component<Props, State> {
  state = {
    receiversList: [],
    mailToWaitingList: false,
    mailToBookings: false,
    openMailChoiceDialog: true,
  };

  getBookingMember = (bookingMember) => {
    try {
      const member = this.props.members.find(
        (m) => m.id === bookingMember.member,
      );
      return member;
    } catch (error) {
      return null;
    }
  };

  getBookingOptionName = (bookingMember) => {
    try {
      const { name } = this.props.members.find(
        (member) => member.id === bookingMember.member,
      );
      return name;
    } catch (error) {
      return null;
    }
  };

  onlyUnique = (value, index, self) => {
    const firstIndex = self.findIndex((member) => member.id === value.id);
    return firstIndex === index;
  };

  render() {
    const {
      bookings,
      bookingOptionsPending,
      t,
      classes,
      fullScreen,
      onClose,
      mailMembers,
    } = this.props;

    return (
      <div>
        <Dialog
          fullScreen={fullScreen}
          open={this.state.openMailChoiceDialog}
          onClose={onClose}
        >
          <DialogContent>
            <ListItem>
              <ListItemText
                id="mail-receiver-choice"
                primary={t('communication:dialogReceiverChoice.title')}
                primaryTypographyProps={{
                  textAlign: 'center',
                  variant: 'h6',
                }}
              />
            </ListItem>
            <Divider />
            <div>
              <ListItem
                button
                onClick={() =>
                  this.setState((prevState) => ({
                    mailToBookings: !prevState.mailToBookings,
                  }))
                }
                className={classes.mailChoiceDialog}
              >
                <ListItemText
                  id="bookings"
                  primary={t('communication:dialogReceiverChoice.reservation')}
                />
                <ListItemSecondaryAction>
                  <Checkbox
                    onChange={() =>
                      this.setState((prevState) => ({
                        mailToBookings: !prevState.mailToBookings,
                      }))
                    }
                    edge="end"
                    checked={this.state.mailToBookings}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem
                button
                onClick={() =>
                  this.setState((prevState) => ({
                    mailToWaitingList: !prevState.mailToWaitingList,
                  }))
                }
                className={classes.mailChoiceDialogEnd}
              >
                <ListItemText
                  id="waitingList"
                  primary={t('communication:dialogReceiverChoice.waitingList')}
                />
                <ListItemSecondaryAction>
                  <Checkbox
                    edge="end"
                    onChange={() =>
                      this.setState((prevState) => ({
                        mailToWaitingList: !prevState.mailToWaitingList,
                      }))
                    }
                    checked={this.state.mailToWaitingList}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </div>
            <DialogActions>
              <Button
                color="secondary"
                onClick={() => {
                  onClose();
                  this.setState({
                    mailToWaitingList: false,
                    mailToBookings: false,
                    openMailChoiceDialog: false,
                  });
                }}
              >
                {t('common.cancel')}
              </Button>
              <Button
                color="primary"
                variant="outlined"
                type="submit"
                onClick={() =>
                  this.setState((prevState) => ({
                    receiversList: (prevState.mailToBookings
                      ? bookings.map((booking) => ({
                          id: booking.member,
                          name: this.getBookingMember(booking).name,
                          email: this.getBookingMember(booking).email,
                        }))
                      : []
                    )
                      .concat(
                        prevState.mailToWaitingList
                          ? bookingOptionsPending.map((booking) => ({
                              id: booking.member,
                              name: this.getBookingMember(booking).name,
                              email: this.getBookingMember(booking).email,
                            }))
                          : [],
                      )
                      .filter(this.onlyUnique),

                    openMailChoiceDialog: false,
                    openMailDialog: true,
                  }))
                }
              >
                {t('common.confirm')}
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
        <SendMailToMembersDialog
          fullScreen={fullScreen}
          open={this.state.openMailDialog}
          receiverInfo={this.state.receiversList}
          mailDefaultTitle={this.props.mailDefaultTitle}
          onCancel={() => {
            onClose();
            this.setState({
              openMailDialog: false,
              mailToWaitingList: false,
              mailToBookings: false,
            });
          }}
          sendMailAction={mailMembers}
        />
      </div>
    );
  }
}

const styles = (theme) => ({
  mailChoiceDialog: {
    marginTop: theme.spacing(2),
  },
  mailChoiceDialogEnd: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(1),
  },
});

export default compose(
  withTranslation(),
  withStyles(styles),
)(MailDialog);
