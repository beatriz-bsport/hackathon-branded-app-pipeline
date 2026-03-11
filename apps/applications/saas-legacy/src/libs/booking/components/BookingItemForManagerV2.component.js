// @flow
import React, { Component } from 'react';

import { compose } from 'recompose';

import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
import Grid from '@material-ui/core/Grid';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ButtonBase from '@material-ui/core/ButtonBase';
import clsx from 'clsx';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import CachedIcon from '@material-ui/icons/Cached';
import CancelIcon from '@material-ui/icons/Cancel';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import MonetizationOnOutlinedIcon from '@material-ui/icons/MonetizationOnOutlined';
import EuroSymbolIcon from '@material-ui/icons/EuroSymbol';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import UpdateIcon from '@material-ui/icons/Update';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { withTranslation, TFunction } from 'react-i18next';
import { push as routerPush } from 'connected-react-router';
// eslint-disable-next-line bsport/no-redux-in-component
import { connect } from 'react-redux';
import { DateTime } from 'luxon';
import {
  BOOKING_STATUS_CANCELLED_BY_MANAGER,
  BOOKING_STATUS_CANCELLED_BY_CONSUMER,
  BOOKING_STATUS_OK,
} from '@bsport/common/lib/master-data/booking_status_code.js';
import { Cake, EventSeat, OfflineBolt } from '@material-ui/icons';
import WarningIcon from '@material-ui/icons/Warning';
import AvatarWithBadge from '#src/libs/member/components/AvatarWithBadge.component';
import { MetaActivity } from '#src/libs/meta-activity/types';
import { Offer } from '#src/libs/offer/types';

import Tooltip from '#src/components/Tooltip.component';
import RedButton from '#src/components/button/RedButton.component';

import { getCurrencyDisplay } from '#src/libs/theme/selectors';
import { getCreditsDividedDisplay } from '#src/libs/theme/utils';
import { withFeatureFlags } from '#src/utils/feature-flag/withFeatureFlags';
import {
  formatAsDatetime,
  formatAsDate,
  formatISOStringAsTime,
  formatAsDatetimeAdapted,
} from '#src/utils/datetime';

import type { Member } from '#src/libs/member/types';
import { Booking } from '#src/libs/booking/types';
import VaccinationBadge from '#src/libs/member/components/VaccinationBadge.component';

import type { PerformanceTrackingProgram } from '#src/libs/performance-tracking/types';

import PlaceNumber from '#src/libs/spot-scheduling/component/PlaceNumber.component';
import ObjectLevelPermissionProvider from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import { getActivityWorkshopPermission } from '#src/libs/role/permission-utils/utils';
import NoShowChip from './NoShowChip.component';
import SwapPassMenuItem from './SwapPassMenuItem.component';
import { BookingStatusCodeText } from '../utils';
import { openNewBackOfficeWindow } from '#src/utils/windows';
import { getIsLateBookingCancellation } from '../../../utils/datetime';

type Props = {
  t: TFunction,
  classes: Object,
  heading?: string,
  booking: Booking,
  member: Member,

  /** Hides action buttons if the loading is set to true */
  isLoading?: boolean,

  disabled?: boolean,
  showQuickInvoiceButton?: boolean,
  button?: boolean,
  showRevertBookingButton?: boolean,
  redirectToMember?: boolean,
  redirectToOffer?: boolean,
  newTab?: boolean,
  selected?: boolean,

  timezone?: string,

  push: (path: string) => void,
  onClick?: () => void,
  onQuickInvoiceClick: () => void,
  handleRevert: () => void,
  confirmBookingAttendance: () => void,
  discardBookingAttendance: () => void,
  spotSchedulingEnabled?: boolean,
  onClickChangeSpot: (booking: Booking) => void,
  programList: Array<PerformanceTrackingProgram>,
  onProgramDetailsClick: (member?: Member, booking?: Booking) => void,
  displayNoShowChip?: boolean,
  noShowChipMessage?: string,
  onClickWarningIcon?: (
    ev: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    rollCallWarning: boolean,
    spiviWarning: boolean,
  ) => void,
  onClickNoShowChip?: () => void,
  isRollCallMandatory?: boolean,
  dateRollCallLastModified?: string,
  getOfferMetaActivity: (metaActivityId: number) => MetaActivity,
  getBookingOffer: (offerId: number) => Offer,
  showBookingDisplaySwapPass?: boolean,
  handleOpenRefundBookingDialog?: (
    id: number,
    isConsumerPaymentPackUnlimited: boolean,
  ) => void,
};

const getPackDate = (consumerPack) => {
  const { ending_date, starting_date } = consumerPack;
  return [
    `${formatAsDate(starting_date)}→${formatAsDate(ending_date)}`,
    DateTime.fromISO(ending_date) < DateTime.now().plus({ day: 6 }),
  ];
};

type AttendanceButtonProps = {
  t: TFunction,
  classes: Object,
  discardBookingAttendance: () => void,
  attendance_date_updated: string | null,
  confirmBookingAttendance: () => void,
  variant?: string,
  attendance: boolean,
  isNoShow: boolean,
};

const AttendanceButton = (props: AttendanceButtonProps) => {
  const Wrapper = props.attendance_date_updated
    ? (props_) => (
        <Tooltip
          title={props.t('attendanceUpdatedOn', {
            d: formatAsDatetimeAdapted(props.attendance_date_updated, 'DDD'),
            t: formatISOStringAsTime(props.attendance_date_updated),
          })}
        >
          {props_.children}
        </Tooltip>
      )
    : (props_) => <>{props_.children}</>;
  if (props.attendance) {
    return (
      <Wrapper>
        <Button
          color="primary"
          onClick={(e) => {
            e.stopPropagation();
            props.discardBookingAttendance(e);
          }}
          variant={props.variant}
        >
          {props.t('attend')}
          <CachedIcon className={props.classes.iconButton} />
        </Button>
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      <RedButton
        disabled={props.isNoShow}
        onClick={(e) => {
          e.stopPropagation();
          props.confirmBookingAttendance(e);
        }}
        variant={props.variant}
      >
        {props.t('doNotAttend')}
        <CachedIcon className={props.classes.iconButton} />
      </RedButton>
    </Wrapper>
  );
};

type State = {
  menuAnchor?: any,
  isMemberProgramDetailDialogOpen?: boolean,
  indexMemberFocused: number,
};

export class BookingItemForManager extends Component<Props, State> {
  state = {
    menuAnchor: null,
  };

  getStatusStyleProps = (status?: boolean) => {
    if (status) {
      return { color: 'primary' };
    }
    return {};
  };

  getStatusText = () => {
    const { booking, t } = this.props;
    const { consumer_payment_pack } = booking;
    if (!consumer_payment_pack || !consumer_payment_pack.payment_pack) {
      return [[t('loading'), 'secondary']];
    }

    const { payment_pack } = consumer_payment_pack;

    if (!payment_pack) {
      return [[t('loading'), 'secondary']];
    }
    const [packDates, soonExpired] = getPackDate(consumer_payment_pack);
    if (payment_pack.unlimited) {
      return [
        [`${payment_pack.name}`, 'secondary'],
        [
          `${packDates} - ${t('unlimited').toLowerCase()}${
            booking.was_refunded ? ` (${t('wasRefunded')})` : ''
          }`,
          soonExpired ? 'error' : 'primary',
        ],
      ];
    }
    const { available_credits } = consumer_payment_pack;
    const dividedAvailableCredits = getCreditsDividedDisplay(
      parseInt(available_credits, 10),
    );
    const { credits } = payment_pack;
    const dividedCredits = getCreditsDividedDisplay(parseInt(credits, 10));
    return [
      [payment_pack.name, 'secondary'],
      [
        ` ${packDates} - ${dividedAvailableCredits}/${dividedCredits}${
          booking.was_refunded ? `, (${t('wasRefunded')})` : ''
        }`,
        available_credits / credits < 0.1 || soonExpired ? 'error' : 'primary',
      ],
    ];
  };

  closeAndAction = (nextAction?: () => void) => (e: SyntheticEvent<any>) => {
    e.stopPropagation();
    if (nextAction) nextAction();
    this.setState({ menuAnchor: null });
  };

  handleProgramDetailClick = this.closeAndAction(() => {
    this.props.onProgramDetailsClick(this.props.member, this.props.booking);
  });

  renderCompactMenu = () => {
    const {
      onQuickInvoiceClick,
      showQuickInvoiceButton,
      confirmBookingAttendance,
      discardBookingAttendance,
      handleRevert,
      booking,
      classes,
      t,
      programList,
      getBookingOffer,
      getOfferMetaActivity,
      handleOpenRefundBookingDialog,
      isLoading,
    } = this.props;
    const attendText = booking.attendance ? t('attend') : t('doNotAttend');
    const bookingOffer = getBookingOffer?.(booking.offer);
    const bookingOfferMetaActivity = getOfferMetaActivity?.(
      bookingOffer?.meta_activity ?? bookingOffer?.meta_activity_id,
    );
    const isLateBookingCancellation = getIsLateBookingCancellation(
      booking.date_canceled,
      bookingOfferMetaActivity?.last_discard_minutes,
      bookingOffer?.date_start,
    );
    const switchAttendance = booking.attendance
      ? discardBookingAttendance
      : confirmBookingAttendance;
    const canDisplaySwitchPass =
      !!this.props.showBookingDisplaySwapPass &&
      booking.booking_status_code === BOOKING_STATUS_OK.id;
    const { closeAndAction } = this;

    if (isLoading) return null;

    return (
      <ListItemSecondaryAction>
        <IconButton
          onClick={(event) => {
            event.stopPropagation();
            this.setState({ menuAnchor: event.currentTarget });
          }}
        >
          <MoreVertIcon />
        </IconButton>

        <Menu
          anchorEl={this.state.menuAnchor}
          id="simple-menu"
          onClose={closeAndAction()}
          open={Boolean(this.state.menuAnchor)}
        >
          {showQuickInvoiceButton && onQuickInvoiceClick ? (
            <MenuItem
              className={classes.menuItem}
              onClick={closeAndAction(onQuickInvoiceClick)}
            >
              {getCurrencyDisplay() === '€' ? (
                <EuroSymbolIcon className={classes.icon} />
              ) : (
                <AttachMoneyIcon className={classes.icon} />
              )}

              <Typography>{t('actions.bill')}</Typography>
            </MenuItem>
          ) : null}
          {!!switchAttendance && !booking.is_no_show && (
            <MenuItem
              className={classes.menuItem}
              onClick={closeAndAction(switchAttendance)}
            >
              <CachedIcon className={classes.icon} />

              <Typography>{attendText}</Typography>
            </MenuItem>
          )}
          {!!handleRevert && (
            <MenuItem
              className={classes.menuItem}
              onClick={closeAndAction(handleRevert)}
            >
              <CancelIcon className={classes.icon} />

              <Typography>{t('actions.unregister')}</Typography>
            </MenuItem>
          )}
          {booking.date_canceled &&
            isLateBookingCancellation &&
            !booking.was_refunded &&
            [
              BOOKING_STATUS_CANCELLED_BY_CONSUMER.id,
              BOOKING_STATUS_CANCELLED_BY_MANAGER.id,
            ].includes(booking.booking_status_code) && (
              <MenuItem
                className={classes.menuItem}
                onClick={closeAndAction(() =>
                  this.props.handleOpenRefundBookingDialog?.(booking.id),
                )}
              >
                <MonetizationOnOutlinedIcon className={classes.icon} />
                <Typography>{t('booking:refund')}</Typography>
              </MenuItem>
            )}
          {canDisplaySwitchPass && (
            <SwapPassMenuItem
              booking={booking}
              classes={classes}
              onClose={() => this.setState({ menuAnchor: null })}
            />
          )}
          <ObjectLevelPermissionProvider
            requiredPermission={[
              'reservation.activity.allowed_actions.editSpot',
              'reservation.workshop.allowed_actions.editSpot',
            ]}
          >
            {([hasActivityEditSpotPermission, hasWorkshopEditSpotPermission]) =>
              this.props.spotSchedulingEnabled &&
              this.props.onClickChangeSpot &&
              getActivityWorkshopPermission(
                bookingOfferMetaActivity?.is_workshop,
                hasActivityEditSpotPermission,
                hasWorkshopEditSpotPermission,
              ) && (
                <MenuItem
                  className={classes.menuItem}
                  onClick={closeAndAction(() =>
                    this.props.onClickChangeSpot(booking),
                  )}
                >
                  <EventSeat className={classes.icon} />
                  <Typography>
                    {typeof booking.spot_id === 'number'
                      ? t('changeSpot')
                      : t('setSpot')}
                  </Typography>
                </MenuItem>
              )
            }
          </ObjectLevelPermissionProvider>
          {!!programList?.length && (
            <MenuItem
              className={classes.menuItem}
              onClick={this.handleProgramDetailClick}
            >
              <OfflineBolt className={classes.icon} />
              <Typography>{t('performanceTracking.stat')}</Typography>
            </MenuItem>
          )}
        </Menu>
      </ListItemSecondaryAction>
    );
  };

  openWarningDialog = (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const rollCallWarning =
      this.props.isRollCallMandatory &&
      this.props.dateRollCallLastModified &&
      this.props.booking?.attendance !==
        this.props.booking?.roll_call_attendance;
    this.props.onClickWarningIcon?.(
      ev,
      rollCallWarning,
      this.props.booking?.has_spivi_error,
    );
  };

  renderButtons = () => {
    const {
      t,
      booking,
      showQuickInvoiceButton,
      discardBookingAttendance,
      confirmBookingAttendance,
      showRevertBookingButton,
      handleRevert,
      classes,
      programList,
      getBookingOffer,
      getOfferMetaActivity,
      isLoading,
    } = this.props;
    const { closeAndAction } = this;

    const rollCallWarning =
      this.props.isRollCallMandatory &&
      this.props.dateRollCallLastModified &&
      booking?.attendance !== booking?.roll_call_attendance;

    const bookingOffer = getBookingOffer?.(booking.offer);
    const bookingOfferMetaActivity = getOfferMetaActivity?.(
      bookingOffer?.meta_activity ?? bookingOffer?.meta_activity_id,
    );
    const isLateBookingCancellation = getIsLateBookingCancellation(
      booking.date_canceled,
      bookingOfferMetaActivity?.last_discard_minutes,
      bookingOffer?.date_start,
    );

    if (isLoading) return null;

    const canDisplaySwitchPass =
      !!this.props.showBookingDisplaySwapPass &&
      booking.booking_status_code === BOOKING_STATUS_OK.id;

    const canDisplayChangeSpotAction =
      this.props.spotSchedulingEnabled && this.props.onClickChangeSpot;

    const canDisplayStatisticsAction = !!programList?.length;

    const hasMoreActionsMenu =
      booking.booking_status_code === BOOKING_STATUS_OK.id &&
      (canDisplaySwitchPass ||
        canDisplayChangeSpotAction ||
        canDisplayStatisticsAction);

    return (
      <div>
        <Hidden smUp>
          {this.props.displayNoShowChip &&
            booking.is_no_show &&
            this.props.onClickNoShowChip && (
              <div className={classes.noShowChip}>
                <ButtonBase onClick={this.props.onClickNoShowChip}>
                  <NoShowChip
                    small
                    tooltipMessage={this.props.noShowChipMessage}
                  />
                </ButtonBase>
              </div>
            )}
          {(rollCallWarning || booking?.has_spivi_error) && (
            <div className={classes.warningIconContainer}>
              <ButtonBase onClick={this.openWarningDialog}>
                <WarningIcon className={classes.warningIcon} />
              </ButtonBase>
            </div>
          )}
          {this.renderCompactMenu()}
        </Hidden>

        <Hidden xsDown>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            {(rollCallWarning || booking?.has_spivi_error) && (
              <div className={classes.warningIconContainer}>
                <Tooltip
                  title={
                    <ul className={classes.list}>
                      {booking.has_spivi_error && <li>{t('spivi.error')}</li>}
                      {rollCallWarning && (
                        <li>{t('offer:rollCall.warningIcon.stateChanged')}</li>
                      )}
                    </ul>
                  }
                >
                  <ButtonBase onClick={this.openWarningDialog}>
                    <WarningIcon className={classes.warningIcon} />
                  </ButtonBase>
                </Tooltip>
              </div>
            )}
            {this.props.displayNoShowChip && booking.is_no_show && (
              <div className={classes.noShowChip}>
                <NoShowChip tooltipMessage={this.props.noShowChipMessage} />
              </div>
            )}
            {discardBookingAttendance &&
            confirmBookingAttendance &&
            booking.booking_status_code === BOOKING_STATUS_OK.id ? (
              <ObjectLevelPermissionProvider
                requiredPermission={[
                  'reservation.activity.allowed_actions.attendance',
                  'reservation.workshop.allowed_actions.attendance',
                ]}
              >
                {([
                  hasActivityAttendancePermission,
                  hasWorkshopAttendancePermission,
                ]) =>
                  getActivityWorkshopPermission(
                    bookingOfferMetaActivity?.is_workshop,
                    hasActivityAttendancePermission,
                    hasWorkshopAttendancePermission,
                  ) && (
                    <AttendanceButton
                      attendance={booking.attendance}
                      attendance_date_updated={booking.attendance_date_updated}
                      classes={classes}
                      confirmBookingAttendance={confirmBookingAttendance}
                      discardBookingAttendance={discardBookingAttendance}
                      isNoShow={booking.is_no_show}
                      t={t}
                      variant="outlined"
                    />
                  )
                }
              </ObjectLevelPermissionProvider>
            ) : null}
            {showQuickInvoiceButton &&
            booking.booking_status_code === BOOKING_STATUS_OK.id ? (
              <Button
                className={classes.rightButton}
                color="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  this.props.onQuickInvoiceClick(e);
                }}
                variant="outlined"
              >
                {getCurrencyDisplay() === '€' ? (
                  <EuroSymbolIcon />
                ) : (
                  <AttachMoneyIcon />
                )}
              </Button>
            ) : null}
            {showRevertBookingButton &&
            !isLateBookingCancellation &&
            !(
              booking.booking_status_code ===
                BOOKING_STATUS_CANCELLED_BY_CONSUMER.id && booking.was_refunded
            ) &&
            [
              BOOKING_STATUS_CANCELLED_BY_CONSUMER.id,
              BOOKING_STATUS_OK.id,
            ].includes(booking.booking_status_code) ? (
              <ObjectLevelPermissionProvider
                requiredPermission={[
                  'reservation.activity.allowed_actions.delete',
                  'reservation.workshop.allowed_actions.delete',
                ]}
              >
                {([
                  hasActivityAttendancePermission,
                  hasWorkshopAttendancePermission,
                ]) =>
                  getActivityWorkshopPermission(
                    bookingOfferMetaActivity?.is_workshop,
                    hasActivityAttendancePermission,
                    hasWorkshopAttendancePermission,
                  ) && (
                    <IconButton
                      disabled={
                        booking &&
                        booking.booking_status_code ===
                          BOOKING_STATUS_CANCELLED_BY_MANAGER.id
                      }
                      onClick={(event) => {
                        event.stopPropagation();
                        handleRevert(event);
                      }}
                    >
                      <CancelIcon />
                    </IconButton>
                  )
                }
              </ObjectLevelPermissionProvider>
            ) : null}
            {isLateBookingCancellation &&
              !booking.was_refunded &&
              [
                BOOKING_STATUS_CANCELLED_BY_CONSUMER.id,
                BOOKING_STATUS_CANCELLED_BY_MANAGER.id,
              ].includes(booking.booking_status_code) && (
                <ObjectLevelPermissionProvider
                  requiredPermission={[
                    'reservation.activity.allowed_actions.refund',
                    'reservation.workshop.allowed_actions.refund',
                  ]}
                >
                  {([
                    hasActivityRefundPermission,
                    hasWorkshopRefundPermission,
                  ]) =>
                    getActivityWorkshopPermission(
                      bookingOfferMetaActivity?.is_workshop,
                      hasActivityRefundPermission,
                      hasWorkshopRefundPermission,
                    ) && (
                      <Tooltip title={t('booking:refund')}>
                        <IconButton
                          onClick={(event) => {
                            event.stopPropagation();
                            this.props.handleOpenRefundBookingDialog?.(
                              booking.id,
                              booking.consumer_payment_pack?.payment_pack
                                ?.unlimited,
                            );
                          }}
                        >
                          <MonetizationOnOutlinedIcon />
                        </IconButton>
                      </Tooltip>
                    )
                  }
                </ObjectLevelPermissionProvider>
              )}
            {hasMoreActionsMenu && (
              <>
                <IconButton
                  onClick={(event) => {
                    event.stopPropagation();
                    this.setState({ menuAnchor: event.currentTarget });
                  }}
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={this.state.menuAnchor}
                  id="simple-menu"
                  onClose={closeAndAction()}
                  open={Boolean(this.state.menuAnchor)}
                >
                  {canDisplaySwitchPass && (
                    <SwapPassMenuItem
                      booking={booking}
                      classes={classes}
                      onClose={() => this.setState({ menuAnchor: null })}
                    />
                  )}
                  <ObjectLevelPermissionProvider
                    requiredPermission={[
                      'reservation.activity.allowed_actions.editSpot',
                      'reservation.workshop.allowed_actions.editSpot',
                    ]}
                  >
                    {([
                      hasActivityEditSpotPermission,
                      hasWorkshopEditSpotPermission,
                    ]) =>
                      this.props.spotSchedulingEnabled &&
                      this.props.onClickChangeSpot &&
                      getActivityWorkshopPermission(
                        bookingOfferMetaActivity?.is_workshop,
                        hasActivityEditSpotPermission,
                        hasWorkshopEditSpotPermission,
                      ) && (
                        <MenuItem
                          className={classes.menuItem}
                          onClick={closeAndAction(() =>
                            this.props.onClickChangeSpot(booking),
                          )}
                        >
                          <EventSeat className={classes.icon} />
                          <Typography>
                            {typeof booking.spot_id === 'number'
                              ? t('changeSpot')
                              : t('setSpot')}
                          </Typography>
                        </MenuItem>
                      )
                    }
                  </ObjectLevelPermissionProvider>
                  {!!programList?.length && (
                    <MenuItem
                      className={classes.menuItem}
                      onClick={this.handleProgramDetailClick}
                    >
                      <OfflineBolt className={classes.icon} />
                      <Typography>{t('performanceTracking.stat')}</Typography>
                    </MenuItem>
                  )}
                </Menu>
              </>
            )}
          </div>
        </Hidden>
      </div>
    );
  };

  getHeading = () => {
    const { heading, booking, timezone, getBookingOffer } = this.props;
    switch (heading) {
      case 'date_start': {
        const bookingOffer = getBookingOffer?.(booking.offer);
        return `${
          bookingOffer?.name_override || booking.name || ''
        } - ${formatAsDatetime(booking.offer_date_start, timezone)}`;
      }
      default:
        return this.props.member ? this.props.member.name : '';
    }
  };

  getArchivedStatus = () => {
    const { member, t } = this.props;
    return member?.archived ? `(${t('member:archived')})` : '';
  };

  getIsFirstIndicator = (booking) => (booking?.first_in_company ? '★' : '');

  getIsRecurrentBooking = () => {
    if (this.props.booking.recurrence_rule_booking) {
      return <UpdateIcon color="primary" fontSize="small" />;
    }
    return '';
  };

  getHasNoteIndicator = () =>
    this.props.member &&
    this.props.member.notes &&
    this.props.member.notes.filter((n) => n.highlighted).length
      ? ' ⓘ'
      : '';

  getAvatar = () => {
    const { heading, classes, member } = this.props;
    if (!member) {
      return null;
    }
    switch (heading) {
      case 'date_start':
        return null;
      default: {
        return (
          <ListItemAvatar
            className={clsx(
              {
                [classes.hoverCredit]:
                  this.props.member?.tags && this.props.member.tags.length !== 0
                    ? [...this.props.member.tags].reduce(
                        (value, tag) =>
                          value || (!!tag?.icon && tag?.icon.length !== 0),
                        false,
                      )
                    : false,
              },
              classes.avatar,
            )}
          >
            <AvatarWithBadge
              bottomCredit
              classes={{ badge: classes.badge }}
              member={member}
            />
          </ListItemAvatar>
        );
      }
    }
  };

  handleListItemClick = (event: SyntheticEvent<any>) => {
    event.preventDefault();
    if (this.props.onClick) {
      this.props.onClick(event);
    }
    const { redirectToMember, booking, newTab, redirectToOffer } = this.props;
    const url = `/member/${booking.member}/bookings/${booking.id}`;
    if (redirectToOffer) {
      this.props.push(`/offer/${booking.offer}`);
    }
    if (redirectToMember && newTab) {
      openNewBackOfficeWindow(url);
      return;
    }
    if (redirectToMember) {
      this.props.push(url);
    }
  };

  wrapToolTip = (children: any) => {
    const notes =
      this.props.member &&
      this.props.member.notes &&
      this.props.member.notes.filter((n) => n.highlighted);
    if (this.props.heading !== 'date_start' && (notes ?? []).length) {
      return (
        <Tooltip
          placement="right"
          title={
            <div>
              {this.props.member.notes
                .filter((n) => n.highlighted)
                .map((n) => (
                  <Typography key={n.id} display="block" variant="caption">
                    {n.text}
                  </Typography>
                ))}
            </div>
          }
          variant="highlighted"
        >
          {children}
        </Tooltip>
      );
    }
    return children;
  };

  render() {
    const { t, booking, redirectToMember, disabled, redirectToOffer } =
      this.props;

    const bookingStatus = this.getStatusText();

    let classes = '';
    if (!booking.attendance && this.props.confirmBookingAttendance) {
      classes = this.props.classes.disabled;
    }
    if (booking.booking_status_code !== 0) {
      classes = this.props.classes.cancelled;
    }

    const isBirthday = this.props.member?.birthday
      ? DateTime.now().toFormat('MM-dd') ===
        DateTime.fromISO(this.props.member.birthday).toFormat('MM-DD')
      : false;

    return this.wrapToolTip(
      <div>
        <ListItem
          disableRipple
          divider
          button={redirectToMember || redirectToOffer || this.props.button}
          className={classes}
          disabled={disabled}
          onClick={this.handleListItemClick}
          selected={!!this.props.selected}
        >
          <Grid
            container
            alignItems="center"
            justify="space-between"
            wrap="nowrap"
          >
            <Grid item>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                {this.getAvatar()}
                <ListItemText
                  primary={
                    <div className={this.props.classes.rowPrimary}>
                      <Typography variant="body2">
                        {this.getHeading()}
                      </Typography>
                      {isBirthday && this.props.heading !== 'date_start' && (
                        <Cake color="secondary" style={{ fontSize: '14px' }} />
                      )}
                      <Typography color="secondary" variant="caption">
                        {this.getArchivedStatus()}
                      </Typography>
                      <Typography color="primary">
                        {this.getIsFirstIndicator(this.props.booking)}
                      </Typography>
                      {this.getIsRecurrentBooking()}
                      <Typography color="primary">
                        <strong>{this.getHasNoteIndicator()}</strong>
                      </Typography>
                      <Typography inline variant="body2">
                        <BookingStatusCodeText booking={booking} />
                      </Typography>
                    </div>
                  }
                  secondary={
                    <div>
                      {!!(
                        !!this.props.booking.source_member &&
                        this.props.booking.source_member !==
                          this.props.booking.member
                      ) && (
                        <div className={this.props.classes.rowPrimary}>
                          <PersonAddIcon color="textSecondary" />
                          <Typography color="textSecondary" variant="body2">
                            {t('asGuest')}
                          </Typography>
                        </div>
                      )}
                      {bookingStatus.map(([txt, color]) => {
                        return (
                          <Typography key={txt} color={color} variant="body2">
                            {txt}
                          </Typography>
                        );
                      })}

                      {this.props.spotSchedulingEnabled &&
                        (typeof this.props.booking.spot_id === 'number' ? (
                          <PlaceNumber
                            spotInformation={
                              Object.keys(
                                this.props.booking.spot_information || {},
                              ).length > 0
                                ? this.props.booking.spot_information
                                : {
                                    indexType: this.props.booking.spot_id,
                                  }
                            }
                          />
                        ) : (
                          <Typography color="error" variant="body2">
                            {t('noSpotAttributed')}
                          </Typography>
                        ))}
                    </div>
                  }
                />
              </div>
            </Grid>
            <Grid item>{this.renderButtons()}</Grid>
          </Grid>
        </ListItem>
      </div>,
    );
  }
}

const styles = (theme) => ({
  icon: {
    color: '#868686',
  },
  menuItem: {
    display: 'flex',
    gap: theme.spacing(2),
  },
  iconButton: {
    marginLeft: theme.spacing(1),
  },
  rightButton: {
    marginLeft: theme.spacing(1),
  },
  avatar: {
    margin: theme.spacing(1),
  },
  badge: {
    right: '50%',
  },
  disabled: {
    // backgroundColor: '#FFDDDD',
    background: 'linear-gradient(135deg, #FFDDDD, transparent)',

    '&:hover': {
      background: 'linear-gradient(135deg, #FFC1C1, transparent)',
    },
  },
  cancelled: {
    opacity: 0.5,
    backgroundColor: '#F8F8F8',
  },
  rowPrimary: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    '&>*': {
      marginRight: theme.spacing(0.5),
    },
  },
  hoverCredit: {
    '& $badge': {
      opacity: 1,
      transition: 'opacity 0.2s',
    },
    '&:hover': {
      '& $badge': {
        opacity: 0,
        transition: 'opacity 0.2s',
      },
    },
  },
  stickRight: { left: 'inherit', right: '10%' },
  warningIconContainer: {
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      marginRight: theme.spacing(5),
    },
  },
  warningIcon: {
    color: theme.palette.warning.main,
  },
  noShowChip: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      marginRight: theme.spacing(3),
    },
  },
  list: {
    margin: 'unset',
    paddingLeft: theme.spacing(3),
    '& li': {
      listStyleType: 'unset',
    },
  },
  bold: {
    fontWeight: 500,
  },
  secondWarning: { marginTop: theme.spacing(2) },
});

export default compose(
  withTranslation(['booking', 'offer', 'b2b_booking']),
  withStyles(styles),
  connect(null, {
    push: routerPush,
  }),
  withFeatureFlags,
)(BookingItemForManager);
