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
import classNames from 'classnames';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import CachedIcon from '@material-ui/icons/Cached';
import CancelIcon from '@material-ui/icons/Cancel';
import EuroSymbolIcon from '@material-ui/icons/EuroSymbol';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import UpdateIcon from '@material-ui/icons/Update';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { withTranslation, TFunction } from 'react-i18next';
import { push as routerPush } from 'connected-react-router';
// eslint-disable-next-line bsport/no-redux-in-component
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import {
  BOOKING_STATUS_CANCELLED_BY_MANAGER,
  BOOKING_STATUS_CANCELLED_BY_CONSUMER,
  BOOKING_STATUS_OK,
} from '@bsport/common/lib/master-data/booking_status_code';
import { EventSeat, OfflineBolt } from '@material-ui/icons';
import WarningIcon from '@material-ui/icons/Warning';
import { BookingStatusCodeText } from '../utils';
import AvatarWithBadge from '#libs/member/components/AvatarWithBadge.component';

import Tooltip from '#components/Tooltip.component';
import RedButton from '#components/button/RedButton.component';

import { getCurrencyDisplay } from '#libs/theme/selectors';

import { formatAsDatetime, formatAsDate } from '../../../utils/datetime';

import type { Member } from '#libs/member/types';
import { Booking } from '#libs/booking/types';
import VaccinationBadge from '#libs/member/components/VaccinationBadge.component';

import type { PerformanceTrackingProgram } from '#libs/performance-tracking/types';

import PlaceNumber from '#libs/spot-scheduling/component/PlaceNumber.component';
import NoShowChip from './NoShowChip.component';

type Props = {
  t: TFunction,
  classes: Object,
  heading: ?string,
  booking: Booking,
  member: Member,

  disabled?: boolean,
  showQuickInvoiceButton: ?boolean,
  button: ?boolean,
  showRevertBookingButton: ?boolean,
  redirectToMember: ?boolean,
  redirectToOffer: ?boolean,
  newTab: ?boolean,
  selected?: boolean,

  timezone?: string,

  push: (path: string) => void,
  onClick: ?() => void,
  onQuickInvoiceClick: () => void,
  handleRevert: () => void,
  confirmBookingAttendance: () => void,
  discardBookingAttendance: () => void,
  spotSchedulingEnabled?: boolean,
  onClickChangeSpot: (booking: Booking) => void,
  showVaccinationStatus: boolean,
  programList: Array<PerformanceTrackingProgram>,
  onProgramDetailsClick: (member?: Member, booking?: Booking) => void,
  displayNoShowChip?: boolean,
  noShowChipMessage?: string,
  onClickWarningIcon?: () => void,
  onClickNoShowChip?: () => void,
  isRollCallMandatory?: boolean,
  dateRollCallLastModified?: string,
};

const getPackDate = (consumerPack) => {
  const { ending_date, starting_date } = consumerPack;
  return [
    `${formatAsDate(starting_date)}→${formatAsDate(ending_date)}`,
    moment(ending_date).isBefore(moment().add(6, 'day')),
  ];
};

type AttendanceButtonProps = {
  t: TFunction,
  classes: Object,
  discardBookingAttendance: () => void,
  attendance_date_updated: string | null,
  confirmBookingAttendance: () => void,
  variant: ?string,
  attendance: boolean,
  isNoShow: boolean,
};

const AttendanceButton = (props: AttendanceButtonProps) => {
  const Wrapper = props.attendance_date_updated
    ? (props_) => (
        <Tooltip
          title={props.t('attendanceUpdatedOn', {
            d: moment(props.attendance_date_updated).format('LL'),
            t: moment(props.attendance_date_updated).format('LT'),
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
          variant={props.variant}
          onClick={(e) => {
            e.stopPropagation();
            props.discardBookingAttendance(e);
          }}
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
        variant={props.variant}
        onClick={(e) => {
          e.stopPropagation();
          props.confirmBookingAttendance(e);
        }}
        disabled={props.isNoShow}
      >
        {props.t('doNotAttend')}
        <CachedIcon className={props.classes.iconButton} />
      </RedButton>
    </Wrapper>
  );
};

type State = {
  menuAnchor: ?any,
  isMemberProgramDetailDialogOpen?: boolean,
  indexMemberFocused: number,
};

export class BookingItemForManager extends Component<Props, State> {
  state = {
    menuAnchor: null,
  };

  getStatusStyleProps = (status: ?boolean) => {
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
    const { credits } = payment_pack;
    return [
      [payment_pack.name, 'secondary'],
      [
        ` ${packDates} - ${available_credits}/${credits}${
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
    } = this.props;
    const attendText = booking.attendance ? t('attend') : t('doNotAttend');
    const switchAttendance = booking.attendance
      ? discardBookingAttendance
      : confirmBookingAttendance;
    const { closeAndAction } = this;

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
          id="simple-menu"
          anchorEl={this.state.menuAnchor}
          open={Boolean(this.state.menuAnchor)}
          onClose={closeAndAction()}
        >
          {showQuickInvoiceButton && onQuickInvoiceClick ? (
            <MenuItem
              onClick={closeAndAction(onQuickInvoiceClick)}
              className={classes.menuItem}
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
              onClick={closeAndAction(switchAttendance)}
              className={classes.menuItem}
            >
              <CachedIcon className={classes.icon} />

              <Typography>{attendText}</Typography>
            </MenuItem>
          )}
          {!!handleRevert && (
            <MenuItem
              onClick={closeAndAction(handleRevert)}
              className={classes.menuItem}
            >
              <CancelIcon className={classes.icon} />

              <Typography>{t('actions.unregister')}</Typography>
            </MenuItem>
          )}
          {this.props.spotSchedulingEnabled && this.props.onClickChangeSpot && (
            <MenuItem
              onClick={closeAndAction(() =>
                this.props.onClickChangeSpot(booking),
              )}
              className={classes.menuItem}
            >
              <EventSeat className={classes.icon} />
              <Typography>
                {typeof booking.spot_id === 'number'
                  ? t('changeSpot')
                  : t('setSpot')}
              </Typography>
            </MenuItem>
          )}
          {!!programList?.length && (
            <MenuItem
              onClick={this.handleProgramDetailClick}
              className={classes.menuItem}
            >
              <OfflineBolt className={classes.icon} />
              <Typography>{t('performanceTracking.stat')}</Typography>
            </MenuItem>
          )}
        </Menu>
      </ListItemSecondaryAction>
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
    } = this.props;
    const { closeAndAction } = this;

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
          {this.props.isRollCallMandatory &&
            this.props.dateRollCallLastModified &&
            booking.attendance !== booking.roll_call_attendance &&
            this.props.onClickWarningIcon && (
              <div className={classes.warningIconContainer}>
                <ButtonBase onClick={this.props.onClickWarningIcon}>
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
            {this.props.isRollCallMandatory &&
              this.props.dateRollCallLastModified &&
              booking.attendance !== booking.roll_call_attendance && (
                <div className={classes.warningIconContainer}>
                  <Tooltip title={t('offer:rollCall.warningIcon.stateChanged')}>
                    <WarningIcon className={classes.warningIcon} />
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
              <AttendanceButton
                attendance={booking.attendance}
                attendance_date_updated={booking.attendance_date_updated}
                variant="outlined"
                t={t}
                classes={classes}
                discardBookingAttendance={discardBookingAttendance}
                confirmBookingAttendance={confirmBookingAttendance}
                isNoShow={booking.is_no_show}
              />
            ) : null}
            {showQuickInvoiceButton &&
            booking.booking_status_code === BOOKING_STATUS_OK.id ? (
              <Button
                variant="outlined"
                color="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  this.props.onQuickInvoiceClick(e);
                }}
                className={classes.rightButton}
              >
                {getCurrencyDisplay() === '€' ? (
                  <EuroSymbolIcon />
                ) : (
                  <AttachMoneyIcon />
                )}
              </Button>
            ) : null}
            {showRevertBookingButton &&
            [
              BOOKING_STATUS_CANCELLED_BY_CONSUMER.id,
              BOOKING_STATUS_OK.id,
            ].includes(booking.booking_status_code) ? (
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleRevert(e);
                }}
                disabled={
                  booking &&
                  booking.booking_status_code ===
                    BOOKING_STATUS_CANCELLED_BY_MANAGER.id
                }
              >
                <CancelIcon />
              </IconButton>
            ) : null}

            {booking.booking_status_code === BOOKING_STATUS_OK.id &&
              ((this.props.spotSchedulingEnabled &&
                this.props.onClickChangeSpot) ||
                !!programList?.length) && (
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
                    id="simple-menu"
                    anchorEl={this.state.menuAnchor}
                    open={Boolean(this.state.menuAnchor)}
                    onClose={closeAndAction()}
                  >
                    {this.props.spotSchedulingEnabled &&
                      this.props.onClickChangeSpot && (
                        <MenuItem
                          onClick={closeAndAction(() =>
                            this.props.onClickChangeSpot(booking),
                          )}
                          className={classes.menuItem}
                        >
                          <EventSeat className={classes.icon} />
                          <Typography>
                            {typeof booking.spot_id === 'number'
                              ? t('changeSpot')
                              : t('setSpot')}
                          </Typography>
                        </MenuItem>
                      )}
                    {!!programList?.length && (
                      <MenuItem
                        onClick={this.handleProgramDetailClick}
                        className={classes.menuItem}
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
    const { heading, booking, timezone } = this.props;
    switch (heading) {
      case 'date_start':
        return `${booking.name || ''} - ${formatAsDatetime(
          booking.offer_date_start,
          timezone,
        )}`;
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

  // eslint-disable-next-line
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
        let Wrapper = (p) => <div>{p.children}</div>;
        if (this.props.showVaccinationStatus)
          Wrapper = (p) => (
            <VaccinationBadge
              status={this.props.member.vaccination_status}
              topRightIcon
            >
              {p.children}
            </VaccinationBadge>
          );

        return (
          <ListItemAvatar
            className={classNames(
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
            <Wrapper>
              <AvatarWithBadge
                member={member}
                classes={{ badge: classes.badge }}
                bottomCredit
              />
            </Wrapper>
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
      const win = window.open(url);
      win.focus();
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
    if (this.props.heading !== 'date_start' && (notes || []).length) {
      return (
        <Tooltip
          placement="right"
          variant="highlighted"
          title={
            <div>
              {this.props.member.notes
                .filter((n) => n.highlighted)
                .map((n) => (
                  <Typography key={n.id} variant="caption" display="block">
                    {n.text}
                  </Typography>
                ))}
            </div>
          }
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
    return this.wrapToolTip(
      <div>
        <ListItem
          divider
          selected={!!this.props.selected}
          button={redirectToMember || redirectToOffer || this.props.button}
          disableRipple
          disabled={disabled}
          onClick={this.handleListItemClick}
          className={classes}
        >
          <Grid
            container
            justify="space-between"
            alignItems="center"
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
                      <Typography variant="caption" color="secondary">
                        {this.getArchivedStatus()}
                      </Typography>
                      <Typography color="primary">
                        {this.getIsFirstIndicator(this.props.booking)}
                      </Typography>
                      {this.getIsRecurrentBooking()}
                      <Typography color="primary">
                        <strong>{this.getHasNoteIndicator()}</strong>
                      </Typography>
                      <Typography variant="body2" inline>
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
                          <Typography variant="body2" color="textSecondary">
                            {t('asGuest')}
                          </Typography>
                        </div>
                      )}
                      {bookingStatus.map(([txt, color]) => {
                        return (
                          <Typography key={txt} variant="body2" color={color}>
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
                          <Typography variant="body2" color="error">
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
});

export default compose(
  withTranslation(['booking', 'offer']),
  withStyles(styles),
  connect(null, {
    push: routerPush,
  }),
)(BookingItemForManager);
