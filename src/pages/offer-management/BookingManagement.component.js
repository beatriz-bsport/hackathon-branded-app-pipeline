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
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import LinearProgress from '@material-ui/core/LinearProgress';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import MailIcon from '@material-ui/icons/Mail';
import SendIcon from '@material-ui/icons/Send';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { withTranslation, TFunction } from 'react-i18next';

import moment from 'moment-timezone';
import { BOOKING_STATUS_OK } from '@bsport/common/lib/master-data/booking_status_code';
import {
  BOOKING_DATE_ORDER,
  BOOKING_FIRSTNAME_ORDER,
  BOOKING_LASTNAME_ORDER,
} from '@bsport/common/lib/master-data/settings';
import {
  ButtonBase,
  DialogContent,
  Hidden,
  Dialog,
  DialogTitle,
} from '@material-ui/core';
import ResultList from '#components/search/ResultList.component';
import MemberBookingHelper from './MemberBookingHelper.component';

import SearchMember from './SearchMember.component';
import WaitingListControlHeader from './WaitingListControlHeader.component';

import BookingTable from '#libs/booking/components/BookingTable.component';
import RecurrenceRuleBookingListItem from '#libs/booking/components/RecurrenceRuleBookingListItem.component';
import BookingOptionForManager from '#libs/waiting-list/components/BookingOptionForManager.component';
import BookingOptionActionBar from '#libs/waiting-list/components/BookingOptionActionBar.component';
import { getActivityWorkshopPermission } from '#libs/role/permission-utils/utils';

import type { Booking, BookingOption } from '#libs/booking/types';
import type { Member } from '#libs/member/types';
import type { Invoice } from '#libs/invoice/types';
import { PermissionContext } from '../../context';
import CheckPermission from '#libs/role/components/CheckPermission.component';
import { Tag, TagGroup } from '#libs/tag/types';
import { OptionCallback } from '../../state/types';
import type { PerformanceTrackingProgram } from '../../performance-tracking/types';
import BottomActionsButtonCustom from '#components/button/BottomActionsButtonCustom.component';
import Config, { useOldPermissions } from '../../config';
import ValidationRollCallButton from '#libs/offer/components/ValidationRollCallButton.component';
import ValidationRollCallText from '#libs/offer/components/ValidationRollCallText.component';
import { formatAsTime } from '../../utils/datetime';
import OfferIconHybridIndicator from '../../libs/offer/components/OfferHybridIconIndicator.component';
import ObjectLevelPermissionProvider from '#libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import { OfferStatusWaitingListPosition } from '#libs/offer/types';
import { MetaActivity } from '#libs/meta-activity/types';

const getMemberFromId = (id: number, membersList: Array<Member>) => {
  const member = membersList.find((m) => m.id === id);
  return { name: member.name, photo: member.photo };
};

type Props = {
  goToMemberBooking: (memberId: number, bookingId?: number) => void,
  t: TFunction,
  classes: Object,
  bookings: Array<Booking>,
  bookingOptionsPending: Array<BookingOption>,
  openMailDialog: () => void,
  openCommunicationDrawer: () => void,
  offer: ?Offer,

  addToQuickInvoicePanel: (number) => void,
  bookingLoading: boolean,
  loading: boolean,
  booking_ordering: string,
  handleRevertBooking: (Booking) => void,
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

  quickCreatedInvoices: Array<Invoice>,
  revertQuickInvoiceAndRefreshOffer: (uuid: string) => void,
  registerToWaitingList: (offerId: number, memberId: number) => void,
  members: Array<Member<Tag<TagGroup>>>,
  switchWaitingListFreeze: (offerId: number, freezeStatus: boolean) => void,
  recurrenceRuleBookingList: Array,
  onDeleteRecurrenceRuleBooking: (id: number) => void,

  recurrentBookingOnPageRequested: (page: number, page_size: number) => void,
  recurrentBookingNextPage: number,
  recurrentBookingCurrentPage: number,
  recurrentBookingItemPerPage: number,
  recurrentBookingCount: number,
  onClickChangeSpot: (booking: Booking) => void,
  showVaccinationStatus: boolean,

  fetchBookingsByConsumerPack: (
    consumer_payment_pack: number,
    page: number,
    page_size: number,
    options?: OptionCallback,
  ) => void,
  fetchVideoPurchase: {
    page: number,
    page_size: number,
    params: any,
    options?: OptionCallback,
  },
  programList: Array<PerformanceTrackingProgram>,
  refresh: () => void,
  companyId: number,
  onProgramDetailsClick: (member?: Member, booking?: Booking) => void,
  numberOfUnreadAnswers: number,
  onRollCallButtonClick: () => void,
  isRollCallMandatory: boolean,
  displayPositionInWaitingList: boolean,
  bookingOptionPositionById: {
    [key: number]: OfferStatusWaitingListPosition,
  },
  handleSelectAllBookingOptions: () => void,
  handleUnselectAllBookingOptions: () => void,
  selectedBookingOptionsIds: number[],
  handleCheckBookingOption: (bookingOptionId: number) => void,
  handleUncheckBookingOption: (bookingOptionId: number) => void,
  onClickAutoBook: () => void,
  getOfferMetaActivity: (metaActivityId: number) => MetaActivity,
};

type State = {
  bookingToRevert: ?Booking,
  memberHistoryAnchor: ?HTMLElement,
  lastValidatedRollCallDialogIsOpen: boolean,
  warningDialogIsOpen: boolean,
  hasSpiviWarning: boolean,
  hasRollCallWarning: boolean,
  noShowChipMessageDialogIsOpen: boolean,
};

export class BookingManagement extends React.PureComponent<Props, State> {
  state = {
    memberHistoryAnchor: null,
    lastValidatedRollCallDialogIsOpen: false,
    warningDialogIsOpen: false,
    noShowChipMessageDialogIsOpen: false,
    hasSpiviWarning: false,
    hasRollCallWarning: false,
  };

  componentDidMount() {
    this.handlePageRequested(1);
  }

  renderSearchedMember = (member: Member) => {
    const hasBooked = !!this.props.bookings
      .filter((b) => b.booking_status_code === BOOKING_STATUS_OK)
      .find((b) => b.member === member.id);
    return (
      <PermissionContext.Consumer>
        {(permissions) => (
          <MemberBookingHelper
            key={member.id}
            anonimize={!permissions?.member?.search}
            hasBooked={hasBooked}
            isFull={this.props.offer.is_full}
            member={member}
            onClickBill={() => this.props.addToQuickInvoicePanel(member.id)}
            onClickListItem={
              hasBooked
                ? () => this.props.addToQuickInvoicePanel(member.id)
                : null
            }
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
            showMember={
              permissions?.member?.retrieve
                ? () => window.open(`/member/${member.id}/`)
                : null
            }
          />
        )}
      </PermissionContext.Consumer>
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
    for (const inv of this.props.quickCreatedInvoices) {
      for (const ii of inv.invoice_items.filter((ii_) => !!ii_)) {
        if (ii.object_id === booking.consumer_payment_pack?.id) {
          this.props.fetchVideoPurchase(
            1,
            1,
            {
              consumer_payment_pack: booking.consumer_payment_pack.id,
            },
            {
              onSuccess: (vp) => {
                if (vp.length === 0) {
                  this.props.fetchBookingsByConsumerPack(
                    booking.consumer_payment_pack.id,
                    1,
                    20,
                    {
                      onSuccess: (payload) => {
                        let alreadyUsed = false;
                        payload
                          .filter((b) => b.id !== booking.id)
                          .forEach((b) => {
                            if (b.booking_status_code === BOOKING_STATUS_OK.id)
                              alreadyUsed = true;
                          });
                        if (alreadyUsed)
                          this.props.handleRevertBooking(booking);
                        else
                          this.props.revertQuickInvoiceAndRefreshOffer(
                            inv.uuid,
                          );
                      },
                    },
                  );
                } else this.props.handleRevertBooking(booking);
              },
            },
          );
          return;
        }
      }
    }
    this.props.handleRevertBooking(booking);
  };

  handlePageRequested = (page: number) => {
    this.props.recurrentBookingOnPageRequested(
      page,
      this.props.recurrentBookingItemPerPage,
    );
  };

  hasNext = () => {
    return this.props.recurrentBookingNextPage !== null;
  };

  goNext = () => {
    this.handlePageRequested(this.props.recurrentBookingCurrentPage + 1);
  };

  onSearchMemberChange = (event) => {
    this.setState({
      memberHistoryAnchor: null,
    });
    this.props.searchMembers(event.target.value);
  };

  setMemberHistoryAnchor = (anchor) =>
    this.setState({ memberHistoryAnchor: anchor });

  onSearchMemberClickRegister = (member) => {
    this.props.handleMemberToRegister({
      name: member.name,
      photo: member.photo,
      id: member.id,
    });
  };

  openLastValidatedRollCallDialog = () => {
    this.setState({ lastValidatedRollCallDialogIsOpen: true });
  };

  closeLastValidatedRollCallDialog = () => {
    this.setState({ lastValidatedRollCallDialogIsOpen: false });
  };

  openWarningDialog = (
    ev: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    rollCallWarning: boolean,
    spiviWarning: boolean,
  ) => {
    ev.stopPropagation();
    this.setState({ warningDialogIsOpen: true });
    this.setState({ hasRollCallWarning: rollCallWarning });
    this.setState({ hasSpiviWarning: spiviWarning });
  };

  closeWarningDialog = () => {
    this.setState({ warningDialogIsOpen: false });
  };

  openNoShowChipMessageDialog = (
    ev: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    ev.stopPropagation();
    this.setState({ noShowChipMessageDialogIsOpen: true });
  };

  closeNoShowChipMessageDialog = () => {
    this.setState({ noShowChipMessageDialogIsOpen: false });
  };

  openLinkedHybridOfferManagementPage = (e) => {
    e.stopPropagation();
    if (this.props.offer?.linked_hybrid_offer_id) {
      window.open(`/offer/${this.props.offer?.linked_hybrid_offer_id}`);
    }
  };

  setRollCallWarning = (hasRollCallWarning: boolean) => {
    this.setState({ hasRollCallWarning });
  };

  setSpiviWarning = (hasSpiviWarning: boolean) => {
    this.setState({ hasSpiviWarning });
  };

  getIsWorkshop = () => {
    const { getOfferMetaActivity, offer } = this.props;
    if (getOfferMetaActivity && offer?.meta_activity_id) {
      return (
        offer?.meta_activity_id &&
        getOfferMetaActivity(offer.meta_activity_id)?.is_workshop
      );
    }
    return false;
  };

  render() {
    const { offer, classes, t, onProgramDetailsClick } = this.props;

    const availableBookingOptions =
      this.props.bookingOptionsPending?.filter(
        (bookingOption) => !bookingOption.cancelled,
      ) ?? [];

    const isOfferExpired = moment(this.props.offer.date_start).isBefore(
      moment(),
    );

    return (
      <div className={classes.container}>
        <Dialog
          maxWidth="sm"
          open={this.state.lastValidatedRollCallDialogIsOpen}
        >
          <DialogContent>
            {t('offer:rollCall.warningText.lastValidatedRollCall', {
              date: moment(
                this.props.offer.date_roll_call_last_modified,
              ).format('L'),
              time: formatAsTime(this.props.offer.date_roll_call_last_modified),
            })}
          </DialogContent>
          <DialogActions>
            <Button
              className={classes.grey}
              onClick={this.closeLastValidatedRollCallDialog}
            >
              {t('common:close')}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={this.state.warningDialogIsOpen}>
          {this.state.hasRollCallWarning && !this.state.hasSpiviWarning && (
            <div>
              <DialogTitle>
                <Typography className={classes.bold} variant="h6">
                  {t('offer:rollCall.warningIcon.stateChangedTitle')}
                </Typography>
              </DialogTitle>
              <DialogContent>
                {t('offer:rollCall.warningIcon.stateChanged')}
              </DialogContent>
            </div>
          )}
          {!this.state.hasRollCallWarning && this.state.hasSpiviWarning && (
            <div>
              <DialogTitle>
                <Typography className={classes.bold} variant="h6">
                  {t('booking:spivi.connectionImpossible')}
                </Typography>
              </DialogTitle>
              <DialogContent>{t('booking:spivi.errorText')}</DialogContent>
            </div>
          )}
          {this.state.hasRollCallWarning && this.state.hasSpiviWarning && (
            <div>
              <DialogTitle>
                <Typography className={classes.bold} variant="h6">
                  {t('booking:warning')}
                </Typography>
              </DialogTitle>
              <DialogContent>
                <div>
                  <Typography className={classes.bold} variant="subtitle1">
                    {t('booking:spivi.connectionImpossible')}
                  </Typography>
                  {t('booking:spivi.errorText')}
                </div>
                <div className={classes.secondWarning}>
                  <Typography className={classes.bold} variant="subtitle1">
                    {t('offer:rollCall.warningIcon.stateChangedTitle')}
                  </Typography>
                  {t('offer:rollCall.warningIcon.stateChanged')}
                </div>
              </DialogContent>
            </div>
          )}
          <DialogActions>
            <Button className={classes.grey} onClick={this.closeWarningDialog}>
              {t('common:close')}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog maxWidth="sm" open={this.state.noShowChipMessageDialogIsOpen}>
          <DialogContent>{t('booking:noShowChip.message')}</DialogContent>
          <DialogActions>
            <Button
              className={classes.grey}
              onClick={this.closeNoShowChipMessageDialog}
            >
              {t('common:close')}
            </Button>
          </DialogActions>
        </Dialog>

        {!!offer && (
          <>
            {offer?.linked_hybrid_offer_id && (
              <div className={classes.alertHybridSection}>
                <Alert
                  action={
                    <IconButton
                      color="primary"
                      onClick={this.openLinkedHybridOfferManagementPage}
                    >
                      <OpenInNewIcon />
                    </IconButton>
                  }
                  icon={
                    <OfferIconHybridIndicator
                      iconProps={{ fontSize: 'large' }}
                    />
                  }
                  severity="info"
                >
                  <AlertTitle>
                    {t('offer:form.section.specificities.field.hybridSection')}
                  </AlertTitle>
                  {t(
                    'offer:form.section.specificities.field.hybridManagementHelper',
                  )}
                </Alert>
              </div>
            )}
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
                      <CheckPermission requiredPermissions="member.retrieve">
                        <IconButton
                          color="primary"
                          disabled={this.props.bookingLoading}
                          onClick={(e) => {
                            e.stopPropagation();
                            this.props.openMailDialog();
                          }}
                        >
                          <MailIcon />
                        </IconButton>
                        {(Config.REACT_APP_SENTRY_ENVIRONMENT === 'dev' ||
                          Config.REACT_APP_SENTRY_ENVIRONMENT === 'local' ||
                          Config.REACT_APP_SENTRY_ENVIRONMENT === 'staging' ||
                          this.props.companyId === 498) && (
                          <BottomActionsButtonCustom
                            buttonsProperties={[
                              {
                                onClick: (e) => {
                                  e.stopPropagation();
                                  this.props.openCommunicationDrawer();
                                },
                                color: 'primary',
                                disabled:
                                  this.props.bookingLoading ||
                                  this.props.loading,
                                icon: <SendIcon />,
                                text: t('communication:generic.communication'),
                                keepTextUnderSelectedMinWidth: true,
                                badgeValue: this.props.numberOfUnreadAnswers,
                              },
                            ]}
                            minWidth="xs"
                          />
                        )}
                      </CheckPermission>
                      <PermissionContext.Consumer>
                        {(permissions) => (
                          <>
                            <ObjectLevelPermissionProvider requiredPermission="member.allowed_actions.create">
                              {(hasNewPermission) => {
                                // Temporary while former and new set of permissions coexist
                                const hasPermission = useOldPermissions
                                  ? permissions?.member?.create
                                  : hasNewPermission;
                                return (
                                  hasPermission && (
                                    <IconButton
                                      color="primary"
                                      onClick={this.props.openAddMemberModal}
                                    >
                                      <PersonAddIcon />
                                    </IconButton>
                                  )
                                );
                              }}
                            </ObjectLevelPermissionProvider>
                            <SearchMember
                              anonimize={!permissions?.member?.search}
                              memberHistory={this.props.memberHistory || []}
                              memberHistoryAnchor={
                                this.state.memberHistoryAnchor
                              }
                              onChange={this.onSearchMemberChange}
                              onClickRegister={this.onSearchMemberClickRegister}
                              onReset={this.props.clearSearch}
                              permissions={permissions}
                              setMemberHistoryAnchor={
                                this.setMemberHistoryAnchor
                              }
                              value={this.props.searchedText}
                            />
                          </>
                        )}
                      </PermissionContext.Consumer>
                    </div>
                  </div>
                  <Divider />
                  {this.props.isRollCallMandatory && (
                    <div className={classes.rollCallContainer}>
                      <div className={classes.rollCallButton}>
                        <ObjectLevelPermissionProvider
                          requiredPermission={[
                            'reservation.activity.allowed_actions.rollcall',
                            'reservation.workshop.allowed_actions.rollcall',
                          ]}
                        >
                          {([
                            hasActivityRollCallPermission,
                            hasWorkshopRollCallPermission,
                          ]) =>
                            getActivityWorkshopPermission(
                              this.getIsWorkshop(),
                              hasActivityRollCallPermission,
                              hasWorkshopRollCallPermission,
                            ) && (
                              <ValidationRollCallButton
                                nbRollCallsLeftToValidate={
                                  this.props.offer.roll_call_needs_validation
                                    ? 1
                                    : 0
                                }
                                onClick={this.props.onRollCallButtonClick}
                              />
                            )
                          }
                        </ObjectLevelPermissionProvider>
                      </div>
                      <Hidden smUp>
                        <div className={classes.rollCallText}>
                          <ButtonBase
                            onClick={this.openLastValidatedRollCallDialog}
                          >
                            <ValidationRollCallText
                              lastValidatedRollCallDate={
                                this.props.offer.date_roll_call_last_modified
                              }
                              nbRollCallsLeftToValidate={
                                this.props.offer.roll_call_needs_validation
                                  ? 1
                                  : 0
                              }
                            />
                          </ButtonBase>
                        </div>
                      </Hidden>
                      <Hidden xsDown>
                        <div className={classes.rollCallText}>
                          <ValidationRollCallText
                            lastValidatedRollCallDate={
                              this.props.offer.date_roll_call_last_modified
                            }
                            nbRollCallsLeftToValidate={
                              this.props.offer.roll_call_needs_validation
                                ? 1
                                : 0
                            }
                          />
                        </div>
                      </Hidden>
                    </div>
                  )}
                  <div className={classes.bookingOrderingContainer}>
                    <RadioGroup
                      onChange={(ev) =>
                        this.props.onChangeBookingOrdering(ev.target.value)
                      }
                      value={this.props.booking_ordering}
                    >
                      <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <FormControlLabel
                          control={<Radio />}
                          label={
                            <Typography variant="caption">
                              {t('offer:offerManagement.bookingOrder.date')}
                            </Typography>
                          }
                          value={BOOKING_DATE_ORDER}
                        />
                        <FormControlLabel
                          control={<Radio />}
                          label={
                            <Typography variant="caption">
                              {t(
                                'offer:offerManagement.bookingOrder.firstname',
                              )}
                            </Typography>
                          }
                          value={BOOKING_FIRSTNAME_ORDER}
                        />
                        <FormControlLabel
                          control={<Radio />}
                          label={
                            <Typography variant="caption">
                              {t('offer:offerManagement.bookingOrder.lastname')}
                            </Typography>
                          }
                          value={BOOKING_LASTNAME_ORDER}
                        />
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                <Divider />
                <Collapse in={!!this.props.searchedText}>
                  <div className={classes.resultListContainer}>
                    <PermissionContext>
                      {(permissions) => (
                        <ResultList
                          items={this.props.searchedMembers}
                          loading={this.props.memberSearchLoading}
                          redirectToMember={permissions?.member?.retrieve}
                          renderListComponent={this.renderSearchedMember}
                          showVaccinationStatus={
                            this.props.showVaccinationStatus
                          }
                        />
                      )}
                    </PermissionContext>
                  </div>
                  <Divider />
                </Collapse>
                {this.props.bookingLoading || this.props.offerLoading ? (
                  <LinearProgress />
                ) : (
                  <div className={classes.bookingSubHeader}>
                    <Typography color="primary" variant="caption">
                      {this.getNbAttendant()} {t('translation:offer.attendant')}
                    </Typography>
                    <Typography color="error" variant="caption">
                      {this.getNbNonAttendant()}{' '}
                      {t('translation:offer.nonAttendant')}
                    </Typography>
                    <Typography variant="caption">
                      {`${
                        this.getNbAttendant() + this.getNbNonAttendant()
                      }/${this.getMaxBookings()} ${t(
                        'translation:offer.maxBookingsNb',
                      )}`}
                    </Typography>
                  </div>
                )}
                <PermissionContext.Consumer>
                  {(permissions) => (
                    <>
                      <BookingTable
                        newTab
                        showQuickInvoiceButton
                        showRevertBookingButton
                        bookings={this.props.bookings}
                        confirmBookingAttendance={
                          this.props.confirmBookingAttendance
                        }
                        dateRollCallLastModified={
                          this.props.offer.date_roll_call_last_modified
                        }
                        discardBookingAttendance={
                          this.props.discardBookingAttendance
                        }
                        handleRevert={this.handleBookingRevert}
                        isRollCallMandatory={this.props.isRollCallMandatory}
                        loading={this.props.loading}
                        members={this.props.members}
                        onClickChangeSpot={this.props.onClickChangeSpot}
                        onClickNoShowChip={this.openNoShowChipMessageDialog}
                        onClickWarningIcon={this.openWarningDialog}
                        onProgramDetailsClick={onProgramDetailsClick}
                        onQuickInvoiceClick={this.props.addToQuickInvoicePanel}
                        programList={this.props.programList}
                        redirectToMember={permissions?.member?.retrieve}
                        refresh={this.props.refresh}
                        showVaccinationStatus={this.props.showVaccinationStatus}
                        spotSchedulingEnabled={
                          !!this.props.offer.room_blueprint
                        }
                      />
                    </>
                  )}
                </PermissionContext.Consumer>

                {this.props.bookingOptionsPending &&
                this.props.bookingOptionsPending.length ? (
                  <WaitingListControlHeader
                    bookingOptionsPending={this.props.bookingOptionsPending}
                    isDisabled={this.props.offer.waiting_list_disabled}
                    switchWaitingListFreeze={() =>
                      this.props.switchWaitingListFreeze(
                        this.props.offer.id,
                        !this.props.offer.waiting_list_disabled,
                      )
                    }
                  />
                ) : null}
                <List disablePadding>
                  <BookingOptionActionBar
                    availableBookingOptionsCount={
                      availableBookingOptions?.length
                    }
                    handleSelectAllBookingOptions={
                      this.props.handleSelectAllBookingOptions
                    }
                    handleUnselectAllBookingOptions={
                      this.props.handleUnselectAllBookingOptions
                    }
                    isDisabled={isOfferExpired}
                    onBook={this.props.onClickAutoBook}
                    selectedBookingOptionsCount={
                      this.props.selectedBookingOptionsIds?.length
                    }
                  />
                  {this.props.bookingOptionsPending.map((bookingOption) => (
                    <BookingOptionForManager
                      key={bookingOption.id}
                      disabled={moment(this.props.offer.date_start).isBefore(
                        moment(),
                      )}
                      displayPositionInWaitingList={
                        this.props.displayPositionInWaitingList
                      }
                      handleCheckBookingOption={
                        this.props.handleCheckBookingOption
                      }
                      handleUncheckBookingOption={
                        this.props.handleUncheckBookingOption
                      }
                      member={this.props.members.find(
                        (m) => m.id === bookingOption.member,
                      )}
                      onClickRegister={(e) => {
                        e.stopPropagation();
                        const member = getMemberFromId(
                          bookingOption.member,
                          this.props.members,
                        );
                        this.props.registerOption(bookingOption.id, {
                          name: member.name,
                          photo: member.photo,
                          id: bookingOption.member,
                        });
                      }}
                      onDiscard={(e) => {
                        e.stopPropagation();
                        this.props.discardOption(bookingOption.id);
                      }}
                      option={bookingOption}
                      selectedBookingOptionsIds={
                        this.props.selectedBookingOptionsIds
                      }
                      waitingListPosition={
                        this.props.bookingOptionPositionById?.[bookingOption.id]
                          ?.waiting_list_position
                      }
                    />
                  ))}
                </List>
                {!!this.props.recurrenceRuleBookingList.length && (
                  <div>
                    <div className={classes.containerRecurrentBooking}>
                      <div className={classes.titleRecurrenceRule}>
                        <Typography variant="caption">
                          {t('booking:recurrenceRule.recurrentBookings')}
                        </Typography>
                      </div>
                      <Divider />
                      <List disablePadding>
                        {this.props.recurrenceRuleBookingList.map((r) => (
                          <PermissionContext>
                            {(permissions) => (
                              <RecurrenceRuleBookingListItem
                                key={r.id}
                                onClick={
                                  r.member && permissions?.member?.retrieve
                                    ? () =>
                                        this.props.goToMemberBooking(
                                          r.member.id,
                                        )
                                    : null
                                }
                                onDelete={
                                  this.props.onDeleteRecurrenceRuleBooking
                                }
                                recurrenceRuleBooking={r}
                              />
                            )}
                          </PermissionContext>
                        ))}
                      </List>
                    </div>
                  </div>
                )}
              </div>
              <div className={this.props.classes.bookButtonWideContainer}>
                {this.hasNext() && (
                  <Button
                    className={this.props.classes.bookButtonWide}
                    color="primary"
                    onClick={this.goNext}
                  >
                    {t('booking:recurrenceRule.showMore', {
                      count:
                        this.props.recurrentBookingCount -
                        this.props.recurrentBookingItemPerPage *
                          this.props.recurrentBookingCurrentPage,
                    })}
                  </Button>
                )}
              </div>
            </Paper>
          </>
        )}
      </div>
    );
  }
}

const styles = (theme) => ({
  containerRecurrentBooking: {
    width: '100%',
  },
  bookButtonWideContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'noWrap',
  },
  bookButtonWide: {
    width: '40%',
    alignItems: 'center',
    marginRight: 'auto',
    marginLeft: 'auto',
  },
  titleRecurrenceRule: {
    background: '#F8F8F8',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
  },
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
    marginTop: theme.spacing(-2),
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
  rollCallContainer: {
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      justifyContent: 'start',
    },
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  },
  rollCallButton: {
    margin: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      marginBottom: 0,
    },
  },
  rollCallText: {
    margin: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      marginLeft: theme.spacing(2),
    },
  },
  grey: {
    color: theme.palette.text.secondary,
  },
  alertHybridSection: {
    paddingBottom: theme.spacing(1),
  },
});

export default compose(
  withStyles(styles),
  withTranslation([
    'offer',
    'translation',
    'communication',
    'common',
    'booking',
  ]),
)(React.memo(BookingManagement));
