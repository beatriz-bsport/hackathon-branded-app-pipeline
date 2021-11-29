// @flow
import React, { Component } from 'react';
import { compose } from 'recompose';

import { withTranslation, TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';

import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Checkbox from '@material-ui/core/Checkbox';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CommunicationDialog from '../../libs/communication/components/CommunicationDialog.component';
import type { Booking, BookingOption } from '../../libs/booking/types';

type Props = {
  fullScreen: boolean,
  mailDefaultTitle: string,
  bookingOptionsPending: Array<BookingOption>,
  bookings: Array<Booking>,
  members: Array<Member>,
  onClose: () => void,
  fetchEmailTemplatesSummaries: () => void,
  fetchEmailTemplateDetail: (id: number) => void,
  sendCommunication: (any) => void,
  emailListLoading: boolean,
  emails: Array<any>,
  emailDetailLoading: boolean,
  emailDetails: Array<any>,

  t: TFunction,
  classes: Object,
};

type State = {
  receiversList: Array<ReceiverInfo>,
  mailToWaitingList: boolean,
  mailToBookings: boolean,
  openMailChoiceDialog: boolean,
  mailToCanceledBookings: boolean,
};

export class MailDialog extends Component<Props, State> {
  state = {
    receiversList: [],
    mailToWaitingList: false,
    mailToBookings: false,
    mailToCanceledBookings: false,
    openMailChoiceDialog: true,
    page: 1,
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
    const { bookings, bookingOptionsPending, t, classes, fullScreen, onClose } =
      this.props;

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
                    mailToCanceledBookings: !prevState.mailToCanceledBookings,
                  }))
                }
                className={classes.mailChoiceDialogEnd}
              >
                <ListItemText
                  id="CanceledBookings"
                  primary={t(
                    'communication:dialogReceiverChoice.canceledReservation',
                  )}
                />
                <ListItemSecondaryAction>
                  <Checkbox
                    edge="end"
                    onChange={() =>
                      this.setState((prevState) => ({
                        mailToCanceledBookings:
                          !prevState.mailToCanceledBookings,
                      }))
                    }
                    checked={this.state.mailToCanceledBookings}
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
                      ? bookings
                          .filter(
                            (booking) => booking.booking_status_code === 0,
                          )
                          .map((booking) => ({
                            id: booking.member,
                            name: this.getBookingMember(booking).name,
                            email: this.getBookingMember(booking).email,
                            phone: this.getBookingMember(booking).phone,
                          }))
                      : []
                    )
                      .concat(
                        prevState.mailToWaitingList
                          ? bookingOptionsPending.map((booking) =>
                              this.props.members.find(
                                (member) => member.id === booking.member,
                              ),
                            )
                          : [],
                      )
                      .concat(
                        prevState.mailToCanceledBookings
                          ? bookings
                              .filter(
                                (booking) => booking.booking_status_code !== 0,
                              )
                              .map((booking) => ({
                                id: booking.member,
                                name: this.getBookingMember(booking).name,
                                email: this.getBookingMember(booking).email,
                                phone: this.getBookingMember(booking).phone,
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
        <CommunicationDialog
          getEmails={this.props.fetchEmailTemplatesSummaries}
          emails={this.props.emails}
          getEmailDetail={this.props.fetchEmailTemplateDetail}
          emailDetails={this.props.emailDetails}
          emailListLoading={this.props.emailListLoading}
          emailDetailLoading={this.props.emailDetailLoading}
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
              mailToCanceledBookings: false,
            });
          }}
          membersToDisplay={[...this.state.receiversList].splice(
            (this.state.page - 1) * 5,
            this.state.page * 5,
          )}
          page_size={5}
          allIds={this.state.receiversList.map((member) => member.id)}
          allIdsWithEmail={this.state.receiversList
            .filter((member) => member.email)
            .map((member) => member.id)}
          allIdsWithPhone={this.state.receiversList
            .filter((member) => member.phone)
            .map((member) => member.id)}
          fetchPreviousPage={(page, page_size) => {
            if (page - 1 === 0) {
              this.setState((prevState) => ({
                page:
                  parseInt(prevState.receiversList.length / page_size, 10) + 1,
              }));
            } else {
              this.setState({ page });
            }
          }}
          fetchNextPage={(page, page_size) => {
            if (
              page > parseInt(this.state.receiversList.length / page_size, 10)
            ) {
              this.setState({
                page: 1,
              });
            } else {
              this.setState({ page: page + 1 });
            }
          }}
          page={this.state.page}
          membersAllLoading={
            this.state.resetMembersFetchForCommunication &&
            this.props.members.loading
          }
          membersByPageLoading={this.props.members.loading}
          send={this.props.sendCommunication}
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

export default compose(withTranslation(), withStyles(styles))(MailDialog);
