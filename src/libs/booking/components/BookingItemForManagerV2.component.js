// @flow

import React, { Component } from 'react';

import { compose } from 'recompose';

import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
import Grid from '@material-ui/core/Grid';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import CachedIcon from '@material-ui/icons/Cached';
import CancelIcon from '@material-ui/icons/Cancel';
import EuroSymbolIcon from '@material-ui/icons/EuroSymbol';
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
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import { EventSeat, OfflineBolt } from '@material-ui/icons';
import { getBookingStatusCode } from '../utils';

import Tooltip from '../../../components/Tooltip.component';
import RedButton from '../../../components/button/RedButton.component';

import { getCurrencyDisplayWithPrice } from '../../theme/selectors';

import { formatAsDatetime, formatAsDate } from '../../../utils/datetime';

// eslint-disable-next-line
import type { PaymentPack } from '../../../libs/payment-packs/types';
// eslint-disable-next-line
import type { Member } from '../../../libs/member/types';
import { Booking } from '../types';
import VaccinationBadge from '../../member/components/VaccinationBadge.component';
import { TagBadge } from '../../member/components/TagBadge';

import MemberProgramDetailDialog from '../../performance-tracking/components/member-program/MemberProgramDetail.dialog';
import type { PerformanceTrackingProgram } from '../../performance-tracking/types';

type Props = {
  t: TFunction,
  classes: Object,
  heading: ?string,
  booking: Booking,
  bookings: Array<Booking>,
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
  updateMemberMetricValue: (data: any, options?: any) => void,
  createMemberProgram: (data: any, options?: any) => void,
  programList: Array<PerformanceTrackingProgram>,
  programDataLoading: boolean,
  membersWithStatusOk: Array<Member>,
  fetchPerformanceTrackingData: (member: number) => void,
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
  confirmBookingAttendance: () => void,
  variant: ?string,
  attendance: boolean,
};

const AttendanceButton = (props: AttendanceButtonProps) => {
  if (props.attendance) {
    return (
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
    );
  }
  return (
    <RedButton
      variant={props.variant}
      onClick={(e) => {
        e.stopPropagation();
        props.confirmBookingAttendance(e);
      }}
    >
      {props.t('doNotAttend')}
      <CachedIcon className={props.classes.iconButton} />
    </RedButton>
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
    isMemberProgramDetailDialogOpen: false,
    indexMemberFocused: this.props.membersWithStatusOk?.findIndex(
      (member) => member?.id === this.props.member?.id,
    ),
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
    // const { credit_consumed } = booking;
    if (payment_pack.unlimited) {
      return [
        [`${payment_pack.name}`, 'secondary'],
        [
          `${packDates} - illimité${
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

  renderCompactMenu = () => {
    const closeAndAction = (actionCallback) => (e: SyntheticEvent<any>) => {
      e.stopPropagation();
      actionCallback();
      this.setState({ menuAnchor: null });
    };
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
          onClose={closeAndAction(() => {})}
        >
          {showQuickInvoiceButton && onQuickInvoiceClick ? (
            <MenuItem
              onClick={closeAndAction(onQuickInvoiceClick)}
              className={classes.menuItem}
            >
              <EuroSymbolIcon className={classes.icon} />

              <Typography>{t('actions.bill')}</Typography>
            </MenuItem>
          ) : null}
          {!!switchAttendance && (
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
              onClick={closeAndAction(() => {
                this.setState({ isMemberProgramDetailDialogOpen: true });
              })}
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

    const closeAndAction = (actionCallback) => (e: SyntheticEvent<any>) => {
      e.stopPropagation();
      actionCallback();
      this.setState({ menuAnchor: null });
    };

    return (
      <div>
        <Hidden smUp>{this.renderCompactMenu()}</Hidden>
        <Hidden xsDown>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            {discardBookingAttendance &&
            confirmBookingAttendance &&
            booking.booking_status_code === BOOKING_STATUS_OK.id ? (
              <AttendanceButton
                attendance={booking.attendance}
                variant="outlined"
                t={t}
                classes={classes}
                discardBookingAttendance={discardBookingAttendance}
                confirmBookingAttendance={confirmBookingAttendance}
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
                <EuroSymbolIcon />
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
                    onClose={closeAndAction(() => {})}
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
                        onClick={closeAndAction(() => {
                          this.props.fetchPerformanceTrackingData(
                            booking.member,
                          );
                          this.setState({
                            isMemberProgramDetailDialogOpen: true,
                          });
                        })}
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
        const credits = parseFloat(member.credit_account_balance);
        let creditsFormatted = '';
        let creditColor = 'primary';
        if (credits >= 0) {
          creditsFormatted = `${getCurrencyDisplayWithPrice(
            credits.toFixed(1),
          )}`;
          creditColor = 'primary';
        }
        if (!credits) {
          creditColor = 'secondary';
        }
        if (credits < 0) {
          creditsFormatted = `${getCurrencyDisplayWithPrice(
            -credits.toFixed(1),
          )}`;
          creditColor = 'error';
        }

        let Wrapper = (p) => <div>{p.children}</div>;
        if (this.props.showVaccinationStatus)
          Wrapper = (p) => (
            <VaccinationBadge status={this.props.member.vaccination_status}>
              {p.children}
            </VaccinationBadge>
          );
        return (
          <ListItemAvatar>
            <Wrapper>
              <TagBadge
                tags={this.props.member?.tags}
                name={this.props.member?.name}
              >
                <Badge
                  badgeContent={creditsFormatted}
                  color={creditColor}
                  classes={{ badge: classes.badge }}
                >
                  <Avatar src={this.props.member?.photo} />
                </Badge>
              </TagBadge>
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
    const url = `/member/${booking.member}/`;
    if (redirectToOffer) {
      this.props.push(`/offer/${booking.offer}`);
    }
    if (redirectToMember && newTab) {
      const win = window.open(url);
      win.focus();
      return;
    }
    if (redirectToMember) {
      this.props.push(`/member/${booking.member}/`);
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
                  <Typography key={n.id} variant="caption">
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
    const {
      t,
      booking,
      redirectToMember,
      disabled,
      redirectToOffer,
      membersWithStatusOk,
      member,
    } = this.props;

    const { indexMemberFocused } = this.state;
    const memberFocused = membersWithStatusOk?.[indexMemberFocused];
    // <TableCell>{t(`booking.sources.${b.source}`)}</TableCell>
    const bookingStatus = this.getStatusText();

    let classes = '';
    if (!booking.attendance && this.props.confirmBookingAttendance) {
      classes = this.props.classes.disabled;
    }
    if (booking.booking_status_code !== 0) {
      classes = this.props.classes.cancelled;
    }
    return this.wrapToolTip(
      <>
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
                        {getBookingStatusCode(t, booking)}
                      </Typography>
                    </div>
                  }
                  secondary={
                    <div>
                      {bookingStatus.map(([txt, color]) => {
                        return (
                          <Typography key={txt} variant="body2" color={color}>
                            {txt}
                          </Typography>
                        );
                      })}

                      {this.props.spotSchedulingEnabled &&
                        (typeof this.props.booking.spot_id === 'number' ? (
                          <Typography variant="body2">
                            {t('placeNumber', {
                              count: this.props.booking.spot_id,
                            })}
                          </Typography>
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

        <MemberProgramDetailDialog
          loading={this.props.programDataLoading}
          open={this.state.isMemberProgramDetailDialogOpen}
          closeDialog={() =>
            this.setState(
              {
                isMemberProgramDetailDialogOpen: false,
              },
              () =>
                this.setState({
                  indexMemberFocused: membersWithStatusOk?.findIndex(
                    (m) => m.id === member.id,
                  ),
                }),
            )
          }
          memberName={`${memberFocused?.name} ${this.getIsFirstIndicator(
            this.props.bookings?.find((b) => b?.member === memberFocused?.id),
          )}`}
          memberProgramList={memberFocused?.memberProgramList}
          changeMember={(i: number) =>
            this.setState(
              (prevState) => ({
                ...prevState,
                indexMemberFocused: Math.abs(
                  (prevState.indexMemberFocused + i) %
                    membersWithStatusOk?.length,
                ),
              }),
              () =>
                this.props.fetchPerformanceTrackingData(
                  membersWithStatusOk?.[this.state.indexMemberFocused]?.id,
                ),
            )
          }
          updateMemberMetricValue={this.props.updateMemberMetricValue}
          createMemberProgram={(id) =>
            this.props.createMemberProgram({
              program: id,
              member: memberFocused.id,
            })
          }
          programList={this.props.programList}
        />
      </>,
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
  badge: {
    right: '0%',
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
});

export default compose(
  withTranslation(['booking']),
  withStyles(styles),
  connect(null, {
    push: routerPush,
  }),
)(BookingItemForManager);
