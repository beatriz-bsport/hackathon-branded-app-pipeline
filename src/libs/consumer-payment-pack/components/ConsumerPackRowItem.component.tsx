// @ts-nocheck
import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import { compose } from 'recompose';
import EventIcon from '@material-ui/icons/Event';
import DateRangeIcon from '@material-ui/icons/DateRange';
import ExposureNeg1Icon from '@material-ui/icons/ExposureNeg1';
import ExposurePlus1Icon from '@material-ui/icons/ExposurePlus1';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withTranslation, WithTranslation } from 'react-i18next';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import withWidth, { isWidthDown } from '@material-ui/core/withWidth';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

import moment from 'moment-timezone';

import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import { OptionCallback } from '../../../state/types';
import { MaterialStyleType } from '../../../utils/types';
import Tooltip from '#components/Tooltip.component';

import { formatAsDate } from '../../../utils/datetime';
import RedButton from '#components/button/RedButton.component';
import { PaymentPack } from '#libs/payment-packs/types';
import {
  MaxoutBooking,
  ConsumerPaymentPack,
} from '#libs/consumer-payment-pack/types';

import CreditStatus from '#libs/consumer-payment-pack/components/CreditStatus.component';
import { showDeleteDialog } from '#components/genericDialog/CustomDialogs';
import { Offer } from '#libs/offer/types';
import { WithIsSharedActive } from '#libs/relationship/types';
import ConsumerPaymentPackIncompatibilitiesReasons from './ConsumerPaymentPackIncompatibilitiesReasons.component';
import { getSpecificIncompatibilitiesReasons } from '../utils';

type Props = {
  loading: boolean;
  hideConsumer?: boolean;
  selected?: boolean;
  noDivider?: boolean;
  disabled?: boolean;

  consumerPack: WithIsSharedActive<ConsumerPaymentPack<PaymentPack>>;
  paymentPack?: PaymentPack;
  maxoutBooking?: MaxoutBooking;
  button?: Node;

  unblock?: (id: number) => void;

  onClick?: () => void;
  incrementCredit: (id: number) => void;
  decrementCredit: (id: number) => void;
  onBook?: (id: number) => void;

  isNonCompatible?: boolean;
  onBookOne: (id: number) => void;
  onBookMultiple: (id: number) => void;
  offer?: Offer;
  updating: boolean;
  goToPaymentPack: () => void;

  fetchIncompatibilitiesReasonsByOfferByConsumerPack: (
    cpp_id: number,
    offer_id: number,
    options: OptionCallback,
  ) => void;
  incompatibilitiesReasons: {
    [offerAndCpp: [offer_id: number, cpp_id: string]]: number[];
  };
  width: Breakpoint;
} & WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

type State = {
  consumerPackHasBeenHovered: boolean;
  showIncompatibilities: boolean;
  incompatibilitiesAreLoading: boolean;
};

export class ConsumerPackRowItem extends Component<Props, State> {
  state = {
    consumerPackHasBeenHovered: false,
    showIncompatibilities: false,
    incompatibilitiesAreLoading: true,
  };

  checkMaxoutBeforeBook = async (callback: () => void) => {
    const { t } = this.props;
    const maxoutStatus = this.getCppMaxoutStatus(
      this.props.maxoutBooking,
      this.props.offer,
    );

    let book: boolean | unknown = true;

    if (maxoutStatus) {
      let maxBooking = 0;

      if (maxoutStatus === 'days') {
        maxBooking = this.props.paymentPack.max_bookings_per_day;
      }
      if (maxoutStatus === 'weeks') {
        maxBooking = this.props.paymentPack.max_bookings_per_week;
      }
      if (maxoutStatus === 'months') {
        maxBooking = this.props.paymentPack.max_bookings_per_month;
      }

      const unit = this.props.t(`consumerPaymentPack.maxout.${maxoutStatus}`);

      book = await showDeleteDialog(
        t('consumerPaymentPack.maxout.dialogTitle'),
        t('consumerPaymentPack.maxout.dialog_message', {
          count: maxBooking,
          unit,
        }),
      );
    }

    if (book) {
      callback();
    }
  };

  handleInfoIncompatibilitesHovering = () => {
    this.setState((prevState: State) => {
      if (prevState.consumerPackHasBeenHovered)
        return {
          showIncompatibilities: true,
        };
      this.props.fetchIncompatibilitiesReasonsByOfferByConsumerPack(
        this.props.consumerPack.id,
        this.props.offer.id,
        {
          onSuccess: () =>
            this.setState({ incompatibilitiesAreLoading: false }),
          onError: () => this.setState({ incompatibilitiesAreLoading: false }),
        },
      );
      return {
        showIncompatibilities: true,
        consumerPackHasBeenHovered: true,
      };
    });
  };

  handleInfoIncompatibilitesLeaving = () => {
    this.setState({ showIncompatibilities: false });
  };

  renderButton = () => {
    const {
      paymentPack,
      consumerPack,
      incrementCredit,
      decrementCredit,
      onBook,
      onBookOne,
      onBookMultiple,
      goToPaymentPack,
      isNonCompatible,
      loading,
      updating,
      width,
      t,
    } = this.props;

    const isMobile = isWidthDown('sm', width);
    const closeMobileIncompatibilities = isMobile
      ? this.handleInfoIncompatibilitesLeaving
      : null;

    const incompatibilitiesReasons = getSpecificIncompatibilitiesReasons(
      this.props.incompatibilitiesReasons,
      this.props.offer?.id,
      consumerPack?.id,
    );

    if (isNonCompatible) {
      return (
        <div>
          <div className={this.props.classes.buttonsContainer}>
            {isMobile ? (
              <IconButton onClick={this.handleInfoIncompatibilitesHovering}>
                <InfoOutlinedIcon />
              </IconButton>
            ) : (
              <InfoOutlinedIcon
                onMouseEnter={this.handleInfoIncompatibilitesHovering}
                onMouseLeave={this.handleInfoIncompatibilitesLeaving}
              />
            )}

            <IconButton color="secondary" onClick={goToPaymentPack}>
              <ArrowForwardIcon />
            </IconButton>
          </div>
          {this.state.showIncompatibilities &&
            (this.state.incompatibilitiesAreLoading ||
            !incompatibilitiesReasons ? (
              <div className={this.props.classes.container}>
                <CircularProgress />
              </div>
            ) : (
              <div className={this.props.classes.tooltipContainer}>
                <ConsumerPaymentPackIncompatibilitiesReasons
                  closeMobileIncompatibilities={closeMobileIncompatibilities}
                  extraStartingDate={consumerPack.starting_date}
                  reasons={incompatibilitiesReasons}
                />
              </div>
            ))}
        </div>
      );
    }
    if (onBook) {
      return (
        <Button
          color="primary"
          id={`btn-payment-pack-${consumerPack.id}`}
          onClick={() =>
            this.checkMaxoutBeforeBook(() => onBook(consumerPack.id))
          }
          variant="outlined"
        >
          {t('use')}
        </Button>
      );
    }
    if (onBookOne && onBookMultiple) {
      return (
        <div className={this.props.classes.buttonRow}>
          <Button
            color="primary"
            id={`btn-payment-pack-${consumerPack.id}`}
            onClick={() =>
              this.checkMaxoutBeforeBook(() => onBookOne(consumerPack.id))
            }
            variant="outlined"
          >
            <EventIcon />
          </Button>
          <Tooltip title={t('multipleBookingTooltip')}>
            <Button
              color="secondary"
              id={`btn-payment-pack-${consumerPack.id}`}
              onClick={() =>
                this.checkMaxoutBeforeBook(() =>
                  onBookMultiple(consumerPack.id),
                )
              }
              variant="outlined"
            >
              <DateRangeIcon />
            </Button>
          </Tooltip>
        </div>
      );
    }

    if (consumerPack.dst_consumer_payment_pack) {
      return null;
    }
    if (!paymentPack) {
      return <CircularProgress />;
    }
    const { credits, unlimited } = paymentPack;
    const { available_credits, reverted } = consumerPack;
    const available_pass_credits = credits - consumerPack.used_credits;

    if (reverted) {
      return <Button>{t('reverted')}</Button>;
    }

    if (unlimited && incrementCredit && decrementCredit) {
      if (consumerPack.disabled && !consumerPack.dst_consumer_payment_pack) {
        return (
          <Button
            onClick={(ev) => {
              ev.preventDefault();
              ev.stopPropagation();
              incrementCredit(consumerPack.id);
            }}
            variant="outlined"
          >
            {t('enableConsumer')}
          </Button>
        );
      }
      return (
        <RedButton
          onClick={(ev: React.ChangeEvent) => {
            ev.preventDefault();
            ev.stopPropagation();
            decrementCredit(consumerPack.id);
          }}
          variant="outlined"
        >
          {t('disableConsumer')}
        </RedButton>
      );
    }

    if (!incrementCredit || !decrementCredit) {
      return null;
    }

    if (loading) {
      return (
        <div>
          <CircularProgress />
        </div>
      );
    }

    if (consumerPack.consumer_payment_pack_source) {
      return (
        <Chip
          color="primary"
          label={t(
            'paymentPackTemplateInstance.consumerPaymentPackSharedFromOtherFranchisee',
          )}
        />
      );
    }
    /*
    if (paymentPack && paymentPack.template_instance) {
      return (
        <Chip
          color="primary"
          label={t(
            'paymentPackTemplateInstance.paymentPackSharedFromFranchisor',
          )}
        />
      );
    }
    */

    return (
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {updating ? (
          <CircularProgress size={24} />
        ) : (
          <>
            <IconButton
              aria-label="change-credits-add"
              color="primary"
              disabled={
                updating ||
                (available_credits
                  ? available_credits >= credits
                  : available_pass_credits >= credits)
              }
              onClick={(ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                incrementCredit(consumerPack.id);
              }}
            >
              <ExposurePlus1Icon />
            </IconButton>

            <IconButton
              aria-label="change-credits-sub"
              color="secondary"
              disabled={
                updating ||
                (available_credits
                  ? available_credits === 0
                  : available_pass_credits === 0)
              }
              onClick={(ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                decrementCredit(consumerPack.id);
              }}
            >
              <ExposureNeg1Icon />
            </IconButton>
          </>
        )}
        {consumerPack.disabled && this.props.unblock && (
          <Button
            onClick={(ev) => {
              ev.preventDefault();
              ev.stopPropagation();
              this.props.unblock(consumerPack.id);
            }}
            variant="outlined"
          >
            {t('enableConsumer')}
          </Button>
        )}
      </div>
    );
  };

  getCppMaxoutStatus = (maxoutBooking: MaxoutBooking, offer?: Offer) => {
    if (!maxoutBooking || !offer) {
      return undefined;
    }

    const maxout = {
      days: false,
      weeks: false,
      months: false,
    };

    const offerStart = moment(offer.date_start);

    Object.entries(maxoutBooking).forEach(([key, data]) => {
      if (data) {
        data.forEach((d) => {
          const maxoutStart = moment(d.start_date);
          const maxoutEnd = moment(d.end_date);

          if (
            offerStart.isSameOrAfter(maxoutStart, 'day') &&
            offerStart.isSameOrBefore(maxoutEnd, 'day') &&
            d.booking_available === 0
          ) {
            maxout[key] = true;
          }
        });
      }
    });

    if (maxout.months) {
      return 'months';
    }

    if (maxout.weeks) {
      return 'weeks';
    }

    if (maxout.days) {
      return 'days';
    }
    return undefined;
  };

  renderMaxoutError = () => {
    if (this.props.maxoutBooking) {
      const maxoutStatus = this.getCppMaxoutStatus(
        this.props.maxoutBooking,
        this.props.offer,
      );

      if (maxoutStatus) {
        const unit = this.props.t(`consumerPaymentPack.maxout.${maxoutStatus}`);

        return (
          <Typography color="error">
            {this.props.t('consumerPaymentPack.maxout.limit_reach', {
              unit,
            })}
          </Typography>
        );
      }
    }

    return null;
  };

  render() {
    const {
      t,
      consumerPack,
      button,
      hideConsumer,
      paymentPack,
      onClick,
      classes,
    } = this.props;
    const { consumer, dst_consumer_payment_pack: isFromShare } =
      consumerPack ?? {};

    return (
      <div>
        <ListItem
          dense
          button={!!onClick}
          className={classes.listContainer}
          disabled={!!consumerPack.reverted || !!this.props.disabled}
          divider={!this.props.noDivider}
          onClick={onClick || null}
          selected={!!this.props.selected}
          style={
            consumerPack.disabled || !!this.props.isNonCompatible
              ? { backgroundColor: 'rgba(255,0,0,.05)' }
              : {}
          }
        >
          {hideConsumer ? null : (
            <ListItemAvatar>
              <Avatar src={consumer ? consumer.photo : null} />
            </ListItemAvatar>
          )}
          <ListItemText
            primary={
              <div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Typography>
                    {hideConsumer
                      ? (paymentPack && paymentPack.name) || ' - '
                      : `${
                          // eslint-disable-next-line
                          consumer && consumer.name
                            ? consumer.name
                            : consumer && consumer.first_name
                            ? consumer.first_name
                            : ' - '
                        } ${
                          consumer && consumer.last_name
                            ? consumer.last_name
                            : ''
                        }`}
                  </Typography>
                  {consumer && consumer.archived && (
                    <Typography color="secondary" variant="caption">
                      {`(${t('member:archived')})`}
                    </Typography>
                  )}
                </div>
                <CreditStatus
                  consumerPack={consumerPack}
                  paymentPack={paymentPack}
                />
              </div>
            }
            secondary={
              <div>
                <Typography>
                  {`${formatAsDate(consumerPack.starting_date)}→${formatAsDate(
                    consumerPack.ending_date,
                  )}`}
                </Typography>
                {this.renderMaxoutError()}
              </div>
            }
          />
          {button || this.renderButton()}
        </ListItem>
        {isFromShare || consumerPack.isSharedActive ? (
          <React.Fragment>
            <Typography
              color="textSecondary"
              style={{ paddingLeft: 16 }}
              variant="caption"
            >
              {' '}
              {consumerPack.isSharedActive ? t('consumer.isOwnerOfShares') : ''}
              {isFromShare && consumerPack.disabled
                ? t('consumer.isFromDisabledShare')
                : ''}
              {isFromShare && !consumerPack.disabled
                ? t('consumer.isFromShare')
                : ''}
            </Typography>
            <Divider />
          </React.Fragment>
        ) : null}
      </div>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
    buttonRow: {
      '&>*': {
        marginLeft: theme.spacing(1),
      },
      [theme.breakpoints.down('xs')]: {
        display: 'flex',
        justifyContent: 'flex-end',
        width: '100%',
        marginTop: theme.spacing(1),
      },
    },
    listContainer: {
      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
        alignItems: 'flex-start',
      },
    },
    container: {
      width: '150px',
      height: '150px',
      position: 'absolute',
      backgroundColor: 'white',
      right: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      boxShadow: theme.shadows[1],
      zIndex: 1500,
    },
    buttonsContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    tooltipContainer: {
      position: 'absolute',
      right: 0,
      zIndex: 1500,
      padding: theme.spacing(2),
      borderRadius: theme.spacing(1),
      maxWidth: '340px',
      height: 'auto',
      backgroundColor: 'white',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      boxShadow: theme.shadows[1],
    },
  });

export default compose<any, Props>(
  withTranslation(['paymentPack']),
  withStyles(styles),
  withWidth(),
)(ConsumerPackRowItem);
