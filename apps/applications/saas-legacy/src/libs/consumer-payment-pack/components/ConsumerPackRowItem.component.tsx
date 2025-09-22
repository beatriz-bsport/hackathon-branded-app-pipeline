import React, { Component } from 'react';
import { compose } from 'recompose';
import { DateTime } from 'luxon';
import { withTranslation, WithTranslation } from 'react-i18next';

import createStyles from '@material-ui/core/styles/createStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import DateRangeIcon from '@material-ui/icons/DateRange';
import Divider from '@material-ui/core/Divider';
import EventIcon from '@material-ui/icons/Event';
import ExposureNeg1Icon from '@material-ui/icons/ExposureNeg1';
import ExposurePlus1Icon from '@material-ui/icons/ExposurePlus1';
import IconButton from '@material-ui/core/IconButton';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import withWidth, { isWidthDown } from '@material-ui/core/withWidth';
import type { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import type { Theme } from '@material-ui/core/styles';

import {
  formatAsDate,
  isDateInTheFuture,
  isDateTodayOrInTheFuture,
} from '#src/utils/datetime';
import { getSpecificIncompatibilitiesReasons } from '#src/libs/consumer-payment-pack/utils';
import {
  DialogActionEnum,
  showActionDialog,
} from '#src/components/genericDialog/CustomDialogs';
import { WithIsSharedActive } from '#src/libs/relationship/types';
import ConsumerPassSourceChip from '#src/components/chip/ConsumerPassSourceChip';
import CreditStatus from '#src/libs/consumer-payment-pack/components/CreditStatus.component';
import ObjectLevelPermissionProvider from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import RedButton from '#src/components/button/RedButton.component';
import Tooltip from '#src/components/Tooltip.component';

import type { MaterialStyleType } from '#src/utils/types';
import type { PaymentPack } from '#src/libs/payment-packs/types';
import type { Offer } from '#src/libs/offer/types';
import type {
  MaxoutBooking,
  ConsumerPaymentPack,
} from '#src/libs/consumer-payment-pack/types';
import type { OptionCallback } from '../../../state/types';
import ConsumerPaymentPackIncompatibilitiesReasons from './ConsumerPaymentPackIncompatibilitiesReasons.component';
import { START_ON_FIRST_BOOKING } from '@bsport/common/lib/master-data/payment-pack';
import { ManualActivationDialog } from './ManualActivationDialog.component';

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
  activateManually?: (id: number) => void;

  onClick?: () => void;
  incrementCredit?: (id: number) => void;
  decrementCredit?: (id: number) => void;
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
    // @ts-expect-error
    [offerAndCpp: [offer_id: number, cpp_id: string]]: number[];
  };
  width: Breakpoint;
} & WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

type State = {
  consumerPackHasBeenHovered: boolean;
  showIncompatibilities: boolean;
  incompatibilitiesAreLoading: boolean;
  manualActivationDialogOpen: boolean;
};

export class ConsumerPackRowItem extends Component<Props, State> {
  state = {
    consumerPackHasBeenHovered: false,
    showIncompatibilities: false,
    incompatibilitiesAreLoading: true,
    manualActivationDialogOpen: false,
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

      book = await showActionDialog(
        t('consumerPaymentPack.maxout.dialogTitle'),
        t('consumerPaymentPack.maxout.dialog_message', {
          count: maxBooking,
          unit,
        }),
        DialogActionEnum.CONFIRM,
      );
    }

    if (book) {
      callback();
    }
  };

  handleInfoIncompatibilitesHovering = () => {
    // @ts-expect-error
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

  openManualActivationDialog = () => {
    this.setState((prevState: State) => ({
      ...prevState,
      manualActivationDialogOpen: true,
    }));
  };

  closeManualActivationDialog = () => {
    this.setState((prevState: State) => ({
      ...prevState,
      manualActivationDialogOpen: false,
    }));
  };

  activateManuallyFromDialog = (id: number) => {
    if (this.props.activateManually) {
      this.props.activateManually(id);
    }
    this.closeManualActivationDialog();
  };

  renderCompanySourceChip = () => {
    const { consumerPack, t } = this.props;
    return (
      <ConsumerPassSourceChip
        companySourceName={consumerPack.company_source_name}
        companySourcePrimaryColor={consumerPack.company_source_primary_color}
        tooltipText={t('paymentPackTemplateInstance.isFromShareTooltip')}
      />
    );
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

    const isManuallyActivable =
      !consumerPack.manual_start_date &&
      !isDateInTheFuture(consumerPack.date_bought) &&
      paymentPack?.grants_door_access &&
      paymentPack?.start_date_method === START_ON_FIRST_BOOKING &&
      isDateTodayOrInTheFuture(consumerPack.ending_date) &&
      this.props.activateManually;

    const manualActivationButton = (
      <>
        <ManualActivationDialog
          action={() => this.activateManuallyFromDialog(consumerPack.id)}
          close={this.closeManualActivationDialog}
          consumerPaymentPack={consumerPack}
          isActivating={updating}
          open={this.state.manualActivationDialogOpen}
        />
        <Button
          color="primary"
          onClick={(ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            this.openManualActivationDialog();
          }}
          variant="contained"
        >
          {t('activateManually')}
        </Button>
      </>
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

    const incrementConsumerPackCredit = (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
      event?.preventDefault();
      event?.stopPropagation();
      incrementCredit(consumerPack.id);
    };

    const decrementConsumerPackCredit = (event: React.ChangeEvent) => {
      event?.preventDefault();
      event?.stopPropagation();
      decrementCredit(consumerPack.id);
    };

    if (
      consumerPack.consumer_payment_pack_source &&
      consumerPack.payment_pack_template_instance_disabled
    ) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {this.renderCompanySourceChip()}
        </div>
      );
    }

    if (unlimited && incrementCredit && decrementCredit) {
      if (consumerPack.disabled && !consumerPack.dst_consumer_payment_pack) {
        return (
          <div className={this.props.classes.rightButtonsContainer}>
            {consumerPack.consumer_payment_pack_source &&
              this.renderCompanySourceChip()}
            {isManuallyActivable && manualActivationButton}
            <Button onClick={incrementConsumerPackCredit} variant="outlined">
              {t('enableConsumer')}
            </Button>
          </div>
        );
      }
      return (
        <div className={this.props.classes.rightButtonsContainer}>
          {consumerPack.consumer_payment_pack_source &&
            this.renderCompanySourceChip()}
          {isManuallyActivable && manualActivationButton}
          <RedButton onClick={decrementConsumerPackCredit} variant="outlined">
            {t('disableConsumer')}
          </RedButton>
        </div>
      );
    }

    if (!incrementCredit || !decrementCredit) {
      return isManuallyActivable ? manualActivationButton : null;
    }

    if (loading) {
      return (
        <div>
          <CircularProgress />
        </div>
      );
    }

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        {!!consumerPack.consumer_payment_pack_source &&
          this.renderCompanySourceChip()}

        {isManuallyActivable && manualActivationButton}

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

    const offerStart = DateTime.fromISO(offer.date_start);

    Object.entries(maxoutBooking).forEach(([key, data]) => {
      if (data) {
        data.forEach((d) => {
          const maxoutStart = DateTime.fromISO(d.start_date);
          const maxoutEnd = DateTime.fromISO(d.end_date);

          if (
            offerStart.startOf('day') >= maxoutStart.startOf('day') &&
            offerStart.startOf('day') <= maxoutEnd.startOf('day') &&
            d.booking_available === 0
          ) {
            // @ts-expect-error
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

    if (!consumerPack) return null;

    let listItemPrimaryText: string;
    if (hideConsumer) {
      listItemPrimaryText = paymentPack?.name || ' - ';
      // @ts-expect-error
    } else if (consumer?.name) {
      // @ts-expect-error
      listItemPrimaryText = consumer.name;
    } else {
      listItemPrimaryText =
        // @ts-expect-error
        `${consumer?.first_name || ''}${
          // @ts-expect-error
          consumer?.last_name ? ` ${consumer.last_name}` : ''
        }` || ' - ';
    }

    return (
      <ObjectLevelPermissionProvider requiredPermission="member.allowed_actions.accessProfile">
        {(hasMemberProfileAccessPermission: boolean) => (
          <div>
            <ListItem
              dense
              button={!!onClick && (hasMemberProfileAccessPermission as any)}
              className={classes.listContainer}
              disabled={!!consumerPack.reverted || !!this.props.disabled}
              divider={!this.props.noDivider}
              onClick={
                !!onClick && hasMemberProfileAccessPermission ? onClick : null
              }
              selected={!!this.props.selected}
              style={
                consumerPack.disabled || !!this.props.isNonCompatible
                  ? { backgroundColor: 'rgba(255,0,0,.05)' }
                  : {}
              }
            >
              {hideConsumer ? null : (
                <ListItemAvatar>
                  {/* @ts-expect-error */}
                  <Avatar src={consumer ? consumer.photo : null} />
                </ListItemAvatar>
              )}
              <ListItemText
                primary={
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Typography>{listItemPrimaryText}</Typography>

                      {
                        // @ts-expect-error
                        consumer && consumer.archived && (
                          <Typography color="secondary" variant="caption">
                            {`(${t('member:archived')})`}
                          </Typography>
                        )
                      }
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
                      {`${formatAsDate(
                        consumerPack.starting_date,
                      )}→${formatAsDate(consumerPack.ending_date)}`}
                    </Typography>
                    {this.renderMaxoutError()}
                  </div>
                }
              />
              {button || this.renderButton()}
            </ListItem>
            {(!!isFromShare || !!consumerPack.isSharedActive) && (
              <React.Fragment>
                <Typography
                  color="textSecondary"
                  style={{ paddingLeft: 16 }}
                  variant="caption"
                >
                  {' '}
                  {consumerPack.isSharedActive
                    ? t('consumer.isOwnerOfShares')
                    : ''}
                  {isFromShare && consumerPack.disabled
                    ? t('consumer.isFromDisabledShare')
                    : ''}
                  {isFromShare && !consumerPack.disabled
                    ? t('consumer.isFromShare')
                    : ''}
                </Typography>
                <Divider />
              </React.Fragment>
            )}
          </div>
        )}
      </ObjectLevelPermissionProvider>
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
    rightButtonsContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(2),
    },
  });

export default compose<any, Props>(
  withTranslation(['paymentPack']),
  withStyles(styles),
  withWidth(),
  React.memo,
)(ConsumerPackRowItem);
