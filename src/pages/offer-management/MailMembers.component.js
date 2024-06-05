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
import { ResolvedGenericTags } from '#libs/email-editor/types';
import DEPRECATEDCommunicationDrawer from '../../libs/communication/components/DEPRECATEDCommunicationDrawer.component';
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
  resolvedGenericTags: ResolvedGenericTags,

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
          onClose={onClose}
          open={this.state.openMailChoiceDialog}
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
                className={classes.mailChoiceDialog}
                onClick={() =>
                  this.setState((prevState) => ({
                    mailToBookings: !prevState.mailToBookings,
                  }))
                }
              >
                <ListItemText
                  id="bookings"
                  primary={t('communication:dialogReceiverChoice.reservation')}
                />
                <ListItemSecondaryAction>
                  <Checkbox
                    checked={this.state.mailToBookings}
                    edge="end"
                    onChange={() =>
                      this.setState((prevState) => ({
                        mailToBookings: !prevState.mailToBookings,
                      }))
                    }
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem
                button
                className={classes.mailChoiceDialogEnd}
                onClick={() =>
                  this.setState((prevState) => ({
                    mailToCanceledBookings: !prevState.mailToCanceledBookings,
                  }))
                }
              >
                <ListItemText
                  id="CanceledBookings"
                  primary={t(
                    'communication:dialogReceiverChoice.canceledReservation',
                  )}
                />
                <ListItemSecondaryAction>
                  <Checkbox
                    checked={this.state.mailToCanceledBookings}
                    edge="end"
                    onChange={() =>
                      this.setState((prevState) => ({
                        mailToCanceledBookings:
                          !prevState.mailToCanceledBookings,
                      }))
                    }
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem
                button
                className={classes.mailChoiceDialogEnd}
                onClick={() =>
                  this.setState((prevState) => ({
                    mailToWaitingList: !prevState.mailToWaitingList,
                  }))
                }
              >
                <ListItemText
                  id="waitingList"
                  primary={t('communication:dialogReceiverChoice.waitingList')}
                />
                <ListItemSecondaryAction>
                  <Checkbox
                    checked={this.state.mailToWaitingList}
                    edge="end"
                    onChange={() =>
                      this.setState((prevState) => ({
                        mailToWaitingList: !prevState.mailToWaitingList,
                      }))
                    }
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
                          ? bookingOptionsPending
                              .filter((booking) => !booking.cancelled)
                              .map((booking) =>
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
                type="submit"
                variant="outlined"
              >
                {t('common.confirm')}
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
        <DEPRECATEDCommunicationDrawer
          allIds={this.state.receiversList.map((member) => member.id)}
          allIdsWithEmail={this.state.receiversList
            .filter((member) => member.email)
            .map((member) => member.id)}
          allIdsWithPhone={this.state.receiversList
            .filter((member) => member.phone)
            .map((member) => member.id)}
          emailDetailLoading={this.props.emailDetailLoading}
          emailDetails={this.props.emailDetails}
          emailListLoading={this.props.emailListLoading}
          emails={this.props.emails}
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
          fullScreen={fullScreen}
          getEmailDetail={this.props.fetchEmailTemplateDetail}
          getEmails={this.props.fetchEmailTemplatesSummaries}
          mailDefaultTitle={this.props.mailDefaultTitle}
          membersAllLoading={
            this.state.resetMembersFetchForCommunication &&
            this.props.members.loading
          }
          membersByPageLoading={this.props.members.loading}
          membersToDisplay={[...this.state.receiversList].splice(
            (this.state.page - 1) * 5,
            this.state.page * 5,
          )}
          onCancel={() => {
            onClose();
            this.setState({
              openMailDialog: false,
              mailToWaitingList: false,
              mailToBookings: false,
              mailToCanceledBookings: false,
            });
          }}
          open={this.state.openMailDialog}
          page={this.state.page}
          page_size={5}
          receiverInfo={this.state.receiversList}
          resolvedGenericTags={this.props.resolvedGenericTags}
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
