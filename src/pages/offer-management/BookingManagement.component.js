// @flow
import React from 'react';

import { compose } from 'recompose';

import Collapse from '@material-ui/core/Collapse';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import RadioGroup from '@material-ui/core/RadioGroup';
import withStyles from '@material-ui/core/styles/withStyles';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import LinearProgress from '@material-ui/core/LinearProgress';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import MailIcon from '@material-ui/icons/Mail';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import moment from 'moment';
import { BOOKING_STATUS_OK } from '@bsport/common/lib/master-data/booking_status_code';
import {
  BOOKING_DATE_ORDER,
  BOOKING_FIRSTNAME_ORDER,
  BOOKING_LASTNAME_ORDER,
} from '@bsport/common/lib/master-data/settings';
import ResultList from '../../components/search/ResultList.component';
import MemberBookingHelper from './MemberBookingHelper.component';

import SearchMember from './SearchMember.component';
import WaitingListControlHeader from './WaitingListControlHeader.component';

import BookingTable from '../../libs/booking/components/BookingTable.component';
import BookingOptionForManager from '../../libs/waiting-list/components/BookingOptionForManager.component';

import type { Booking, BookingOption } from '../../libs/booking/types';
import type { Member } from '../../libs/member/types';
import type { Invoice } from '../../libs/invoice/types';
import type { Permission } from '../../libs/role/types';

const getMemberFromId = (id: number, membersList: Array<Member>) => {
  const member = membersList.find((m) => m.id === id);
  return { name: member.name, photo: member.photo };
};

type Props = {
  t: TFunction,
  classes: Object,
  bookings: Array<Booking>,
  bookingOptionsPending: Array<BookingOption>,
  openMailDialog: () => void,

  offer: ?Offer,

  addToQuickInvoicePanel: (number) => void,
  permission: Permission,
  bookingLoading: boolean,
  loading: boolean,
  booking_ordering: string,
  handleRevertBooking: (Booking) => void,
  offerId: number,
  offerLoading: boolean,

  memberHistory: Array<Member>,
  searchedText: string,
  memberSearchLoading: boolean,
  searchMembers: (string) => void,
  searchedMembers: Array<Member>,
  clearSearch: () => void,

  openAddMemberModal: () => void,
  onChangeBookingOrdering: (string) => void,

  confirmBookingAttendance: (bookingId: number) => void,
  discardBookingAttendance: (bookingId: number) => void,

  handleMemberToRegister: ({ name: string, id: number, photo: string }) => void,
  discardOption: (number) => void,
  registerOption: (
    BookingOption,
    { id: number, name: string, photo: string },
  ) => void,

  unevenSavedInvoices: Array<Invoice>,
  revertQuickInvoiceAndRefreshOffer: (
    uuid: string,
    offerId: number,
    booking_ordering: number,
  ) => void,
  registerToWaitingList: (offerId: number, memberId: number) => void,
  members: Array<Member>,
  switchWaitingListFreeze: (offerId: number, freezeStatus: boolean) => void,
};

type State = {
  bookingToRevert: ?Booking,
  memberHistoryAnchor: ?HTMLElement,
};

export class BookingManagement extends React.Component<Props, State> {
  state = { memberHistoryAnchor: null };

  renderSearchedMember = (member: Member) => {
    const hasBooked = !!this.props.bookings.find((b) => b.member === member.id);
    return (
      <MemberBookingHelper
        key={member.id}
        isFull={this.props.offer.is_full}
        onClickBill={() => this.props.addToQuickInvoicePanel(member.id)}
        onClickOption={() => {
          this.props.registerToWaitingList(this.props.offer.id, member.id);
          this.props.clearSearch();
        }}
        onClickRegister={() => {
          this.props.handleMemberToRegister({
            name: member.name,
            photo: member.photo,
            id: member.id,
          });
        }}
        onClickListItem={
          hasBooked ? () => this.props.addToQuickInvoicePanel(member.id) : null
        }
        showMember={
          this.props.permission.member.retrieve
            ? () => window.open(`/member/${member.id}/`)
            : null
        }
        member={member}
        hasBooked={hasBooked}
      />
    );
  };

  getNbAttendant = () => {
    if (this.props.bookingLoading) {
      return '...';
    }
    return this.props.bookings.filter(
      (booking) =>
        booking.booking_status_code === BOOKING_STATUS_OK.id &&
        booking.attendance,
    ).length;
  };

  getNbNonAttendant = () => {
    if (this.props.bookingLoading) {
      return '...';
    }
    return this.props.bookings.filter(
      (booking) =>
        !booking.attendance &&
        booking.booking_status_code === BOOKING_STATUS_OK.id,
    ).length;
  };

  getMaxBookings = () => {
    if (this.props.offerLoading) {
      return '...';
    }
    return (this.props.offer && this.props.offer.effectif) || 0;
  };

  handleBookingRevert = (booking: Booking) => {
    for (const inv of this.props.unevenSavedInvoices) {
      for (const ii of inv.invoice_items) {
        if (ii.object_id === booking.consumer_payment_pack.id) {
          this.props.revertQuickInvoiceAndRefreshOffer(
            inv.uuid,
            this.props.offerId,
            this.props.booking_ordering,
          );
          return;
        }
      }
    }
    this.props.handleRevertBooking(booking);
  };

  render() {
    const { offer, classes, t } = this.props;
    return (
      <div className={classes.container}>
        {!!offer && (
          <Paper className={classes.autoScroll}>
            <div className={classes.fullWidthRow}>
              {offer.meta_activity_color ? (
                <div
                  style={{
                    width: '100%',
                    height: '5px',
                    backgroundColor: offer.meta_activity_color,
                  }}
                />
              ) : null}
              <div>
                <div className={classes.bookingsHeader}>
                  <div />
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      flexDirection: 'row',
                    }}
                  >
                    {!!this.props.permission.member.retrieve && (
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          this.props.openMailDialog();
                        }}
                        color="primary"
                        disabled={this.props.bookingLoading}
                      >
                        <MailIcon />
                      </IconButton>
                    )}
                    <IconButton
                      onClick={this.props.openAddMemberModal}
                      color="primary"
                    >
                      <PersonAddIcon />
                    </IconButton>
                    <SearchMember
                      onChange={(event) => {
                        this.setState({
                          memberHistoryAnchor: null,
                        });
                        this.props.searchMembers(event.target.value);
                      }}
                      value={this.props.searchedText}
                      onReset={this.props.clearSearch}
                      memberHistoryAnchor={this.state.memberHistoryAnchor}
                      memberHistory={this.props.memberHistory || []}
                      setMemberHistoryAnchor={(anchor) =>
                        this.setState({ memberHistoryAnchor: anchor })
                      }
                      onClickRegister={(member) => {
                        this.props.handleMemberToRegister({
                          name: member.name,
                          photo: member.photo,
                          id: member.id,
                        });
                      }}
                    />
                  </div>
                </div>
                <div className={classes.bookingOrderingContainer}>
                  <RadioGroup
                    value={this.props.booking_ordering}
                    onChange={(ev) =>
                      this.props.onChangeBookingOrdering(ev.target.value)
                    }
                  >
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <FormControlLabel
                        value={BOOKING_DATE_ORDER}
                        control={<Radio />}
                        label={
                          <Typography variant="caption">
                            {t('offer:offerManagement.bookingOrder.date')}
                          </Typography>
                        }
                      />
                      <FormControlLabel
                        value={BOOKING_FIRSTNAME_ORDER}
                        control={<Radio />}
                        label={
                          <Typography variant="caption">
                            {t('offer:offerManagement.bookingOrder.firstname')}
                          </Typography>
                        }
                      />
                      <FormControlLabel
                        value={BOOKING_LASTNAME_ORDER}
                        control={<Radio />}
                        label={
                          <Typography variant="caption">
                            {t('offer:offerManagement.bookingOrder.lastname')}
                          </Typography>
                        }
                      />
                    </div>
                  </RadioGroup>
                </div>
              </div>
              <Divider />
              <Collapse in={!!this.props.searchedText}>
                <div className={classes.resultListContainer}>
                  <ResultList
                    items={this.props.searchedMembers}
                    loading={this.props.memberSearchLoading}
                    renderListComponent={this.renderSearchedMember}
                    redirectToMember={this.props.permission.member.retrieve}
                  />
                </div>
                <Divider />
              </Collapse>
              {this.props.bookingLoading || this.props.offerLoading ? (
                <LinearProgress />
              ) : (
                <div className={classes.bookingSubHeader}>
                  <Typography variant="caption" color="primary">
                    {this.getNbAttendant()} {t('translation:offer.attendant')}
                  </Typography>
                  <Typography variant="caption" color="error">
                    {this.getNbNonAttendant()}{' '}
                    {t('translation:offer.nonAttendant')}
                  </Typography>
                  <Typography variant="caption">
                    {`${this.getNbAttendant() +
                      this.getNbNonAttendant()}/${this.getMaxBookings()} ${t(
                      'translation:offer.maxBookingsNb',
                    )}`}
                  </Typography>
                </div>
              )}
              <BookingTable
                redirectToMember={this.props.permission.member.retrieve}
                newTab
                members={this.props.members}
                loading={this.props.loading}
                bookings={this.props.bookings}
                confirmBookingAttendance={this.props.confirmBookingAttendance}
                discardBookingAttendance={this.props.discardBookingAttendance}
                showQuickInvoiceButton
                showRevertBookingButton
                handleRevert={this.handleBookingRevert}
                onQuickInvoiceClick={this.props.addToQuickInvoicePanel}
              />
              {this.props.bookingOptionsPending &&
              this.props.bookingOptionsPending.length ? (
                <WaitingListControlHeader
                  switchWaitingListFreeze={() =>
                    this.props.switchWaitingListFreeze(
                      this.props.offer.id,
                      !this.props.offer.waiting_list_disabled,
                    )
                  }
                  bookingOptionsPending={this.props.bookingOptionsPending}
                  isDisabled={this.props.offer.waiting_list_disabled}
                />
              ) : null}
              <List disablePadding>
                {this.props.bookingOptionsPending.map((bo) => (
                  <BookingOptionForManager
                    option={bo}
                    onDiscard={(e) => {
                      e.stopPropagation();
                      this.props.discardOption(bo.id);
                    }}
                    disabled={moment(this.props.offer.date_start).isBefore(
                      moment(),
                    )}
                    member={this.props.members.find((m) => m.id === bo.member)}
                    onClickRegister={(e) => {
                      e.stopPropagation();
                      const member = getMemberFromId(
                        bo.member,
                        this.props.members,
                      );
                      this.props.registerOption(bo.id, {
                        name: member.name,
                        photo: member.photo,
                        id: bo.member,
                      });
                    }}
                  />
                ))}
              </List>
            </div>
          </Paper>
        )}
      </div>
    );
  }
}
const styles = (theme) => ({
  container: {
    width: '100%',
  },
  bookingsHeader: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    width: '100%',
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  rightIcon: {
    marginLight: theme.spacing(1),
  },
  headerContainer: {
    marginTop: -theme.spacing(2),
  },
  bookingOrderingContainer: {
    marginRight: theme.spacing(1),
    display: 'flex',
    justifyContent: 'flex-end',
  },
  autoScroll: {
    overflowY: 'auto',
    [theme.breakpoints.up('lg')]: {
      height: `calc(100vh - ${theme.spacing(19)}px)`,
    },
  },
  titleBanner: {
    paddingTop: theme.spacing(1) / 2,
    paddingBottom: theme.spacing(1) / 2,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  bookingSubHeader: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(1),
    paddingBottom: theme.spacing(1) / 2,
    paddingTop: theme.spacing(1) / 2,
    background: '#F8F8F8',
    borderBottom: 'solid 1px #E4E4E4',
  },
  fullWidthRow: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['offer', 'translation']),
)(BookingManagement);
