import React from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { Theme, lighten, makeStyles } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import Adjust from '@material-ui/icons/Adjust';
import CreditCard from '@material-ui/icons/CreditCard';
import HourglassFull from '@material-ui/icons/HourglassFull';
import LocationOn from '@material-ui/icons/LocationOn';
import Person from '@material-ui/icons/Person';

import { OFFER_BOOKABLE_STATUS_BOOKABLE } from '@bsport/common/lib/master-data/bookable-status';
import { OFFER_WAITING_LIST_STATUS_OPEN } from '@bsport/common/lib/master-data/waiting-list-status';
import { OFFER_WAITING_LIST_STATUS_FULL } from '@bsport/common/lib/master-data/error-codes/buyable-item-can-not-be-bought';
import { MarketPlaceCoachDisplay } from '@bsport/common/lib/master-data/personalization';

import { ImmutableObject } from 'seamless-immutable';
import PersonAdd from '@material-ui/icons/PersonAdd';
import { formatAsDateWithWeekday } from '../../../utils/datetime';
import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';
import { getTaxPrice } from '#libs/theme/utils';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

import { MetaActivity } from '#libs/meta-activity/types';
import { Establishment } from '#libs/establishment/types';
import { Coach } from '#libs/associated-coach/types';
import {
  type OfferStatus,
  type Offer_FULL,
  type Offer,
  OfferSummaryVariant,
} from '#libs/offer/types';
import DEFAULT_PROFILE_PICTURE_URL from '../../../assets/constants';
import { CompanyTheme } from '#libs/theme/types';

import BookingConfirmButton from '#libs/booking/components/BookingConfirmButton.component';
import MarketplaceBroadcastCSSOnly from '#marketplacecomponents/@Broadcast/MarketplaceBroadcastCSSOnly';
import { OfferSummarySkeleton } from '.';

export type Props = {
  metaActivity: MetaActivity | ImmutableObject<MetaActivity<number>>;
  establishment: Establishment | ImmutableObject<Establishment>;
  coach?: Coach;
  coachOverride?: Coach;
  offer:
    | Offer
    | Offer<
        number,
        Establishment,
        MetaActivity<number>,
        number,
        number,
        number,
        number
      >
    | ImmutableObject<
        Offer<
          number,
          Establishment,
          MetaActivity<number>,
          number,
          number,
          number,
          number
        >
      >
    | Offer_FULL;

  spotId?: number;
  price?: string;
  onConfirm?: () => void;
  disableButton?: boolean;
  confirmLoading?: boolean;
  offerStatus?: OfferStatus;
  loading?: boolean;
  variant: OfferSummaryVariant;
  tax?: number;
  theme: CompanyTheme;
  isBookingButtonHidden?: boolean;
  noStyledContainer?: boolean;
  isGuestBooking?: boolean;
  guestName?: string;
};

const OfferSummary: React.FC<Props> = ({
  metaActivity,
  offer,
  coach,
  coachOverride,
  establishment,
  spotId,
  price,
  onConfirm,
  disableButton,
  confirmLoading,
  loading,
  offerStatus,
  tax,
  variant,
  theme,
  isBookingButtonHidden,
  noStyledContainer,
  isGuestBooking,
  guestName,
}) => {
  const classes = useStyles({ variant, offerStatus, noStyledContainer });

  const { t } = useTranslation(['datetime', 'booking', 'checkout']);

  const isBookable =
    offerStatus?.bookable_status === OFFER_BOOKABLE_STATUS_BOOKABLE;
  const isWaitlistOpen =
    offerStatus?.waiting_list_status === OFFER_WAITING_LIST_STATUS_OPEN;
  const isWaitlistFull =
    offerStatus?.waiting_list_status === OFFER_WAITING_LIST_STATUS_FULL;
  const waitlistExists = isWaitlistOpen || isWaitlistFull;

  const displayTax = theme?.is_tax_excluded_in_marketplace === false;

  const relevantCoach = coachOverride ?? coach;

  let coachName = relevantCoach?.name;
  let displayCoachPicture = true;

  switch (theme?.coach_display) {
    case MarketPlaceCoachDisplay.ONLY_FIRST_NAME:
      coachName = relevantCoach?.firstname;
      displayCoachPicture = false;
      break;
    case MarketPlaceCoachDisplay.FIRST_NAME_WITH_PICTURE:
      coachName = relevantCoach?.firstname;
      break;
    case MarketPlaceCoachDisplay.FULL_NAME_WITHOUT_PICTURE:
      displayCoachPicture = false;
      break;
    default:
      break;
  }

  if (loading) {
    return <OfferSummarySkeleton classes={classes} />;
  }

  return (
    <div className={classes.grid}>
      <div className={classes.columnGap1}>
        {isGuestBooking && (
          <div className={classes.bookingGuestContainer}>
            <PersonAdd className={classes.grey} />
            <Typography className={classes.bookingGuestName} variant="body1">
              {t('booking:offer.bookingFor')}
              <i>{` ${guestName}`}</i>
            </Typography>
          </div>
        )}
        <div className={classes.columnGap1}>
          <Typography variant="h6">
            {offer?.name_override || metaActivity?.name}
          </Typography>

          {offer?.date_start && (
            <Typography className={classes.grey}>
              {formatAsDateWithWeekday(
                offer.date_start,
                theme,
                'DDD t',
                offer?.timezone_name,
              )}
            </Typography>
          )}
        </div>
        <div className={classes.columnGap2}>
          {(metaActivity?.is_broadcast || waitlistExists) && (
            <div className={classes.lineGap1}>
              {metaActivity?.is_broadcast && <MarketplaceBroadcastCSSOnly />}
              {waitlistExists && offer.full && (
                <Chip
                  className={classes.waitlistChip}
                  icon={<HourglassFull fontSize="small" />}
                  label={
                    isWaitlistFull
                      ? t(
                          `booking:offer.offerStatus.waiting_list_status.${OFFER_WAITING_LIST_STATUS_FULL}`,
                        )
                      : t(
                          `booking:offer.offerStatus.waiting_list_status.${OFFER_WAITING_LIST_STATUS_OPEN}`,
                        )
                  }
                  size="small"
                />
              )}
            </div>
          )}

          {establishment && theme?.show_establishment && (
            <div className={classes.lineGap1}>
              <LocationOn className={classes.icon} />
              <Typography>
                {variant === OfferSummaryVariant.DEFAULT
                  ? `${establishment?.title} - ${establishment?.location?.address}`
                  : `${establishment?.title}`}
              </Typography>
            </div>
          )}

          {relevantCoach &&
            !theme?.hideCoach &&
            variant !== OfferSummaryVariant.BASKET && (
              <div
                className={classNames(classes.itemWithIcon, {
                  [classes.hiddenOnMobile]:
                    variant !== OfferSummaryVariant.DEFAULT,
                })}
              >
                {displayCoachPicture ? (
                  <Avatar
                    className={classes.avatar}
                    src={relevantCoach.photo || DEFAULT_PROFILE_PICTURE_URL}
                  />
                ) : (
                  <Person className={classes.icon} />
                )}
                <Typography>{coachName}</Typography>
              </div>
            )}

          {spotId !== undefined && spotId !== null && (
            <div className={classNames(classes.itemWithIcon)}>
              <Adjust className={classes.icon} />
              <Typography>{`${t(`booking:place`)} ${spotId}`}</Typography>
            </div>
          )}

          {offer && variant === OfferSummaryVariant.DEFAULT && (
            <div
              className={classNames(classes.itemWithIcon, {
                [classes.hiddenOnMobile]:
                  variant !== OfferSummaryVariant.DEFAULT,
              })}
            >
              <CreditCard className={classes.icon} />
              <Typography>
                {offer?.credit_price > 1
                  ? `${offer?.credit_price} ${t(
                      `booking:creditConsumed_plural`,
                    )}`
                  : `${offer?.credit_price} ${t(`booking:creditConsumed`)}`}
              </Typography>
            </div>
          )}
        </div>
      </div>
      {(!isWaitlistFull || isBookable) &&
        !isBookingButtonHidden &&
        onConfirm &&
        variant !== OfferSummaryVariant.BASKET && (
          <div className={classes.columnGap2}>
            {!!price && (
              <>
                {displayTax && (
                  <div className={classes.columnGap1}>
                    <div className={classes.price}>
                      <Typography className={classes.grey} variant="body2">
                        {t(`checkout:payment.taxExcluded`)}
                      </Typography>
                      <Typography variant="body2">
                        {getCurrencyDisplayWithPrice(price, true, tax)}
                      </Typography>
                    </div>
                    <div className={classes.price}>
                      <Typography className={classes.grey} variant="body2">
                        {t(`checkout:payment.tax`)}
                      </Typography>
                      <Typography variant="body2">
                        {getCurrencyDisplayWithPrice(getTaxPrice(price, tax))}
                      </Typography>
                    </div>
                  </div>
                )}
                <div className={classes.price}>
                  <Typography variant="h6">
                    {t(`checkout:payment.globalTotal`)}
                  </Typography>
                  <Typography variant="h6">
                    {getCurrencyDisplayWithPrice(price)}
                  </Typography>
                </div>
              </>
            )}
            <BookingConfirmButton
              buttonLoading={confirmLoading}
              disabled={
                (offerStatus && !isBookable && !isWaitlistOpen) ||
                disableButton ||
                confirmLoading ||
                loading
              }
              onClick={onConfirm}
              value={
                !offer.full
                  ? t(`booking:notification.form.submit`)
                  : t(`booking:offer.mainButton.registerWaitingList`)
              }
            />
          </div>
        )}
    </div>
  );
};

const useStyles = makeStyles<
  Theme,
  Pick<Props, 'variant' | 'offerStatus' | 'noStyledContainer'>
>((theme) => ({
  grid: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '374px',
    gap: theme.spacing(3),
    justifyContent: 'flex-start',
    backgroundColor: theme.palette.background.paper,
    border: ({ variant, noStyledContainer }) =>
      variant !== OfferSummaryVariant.BASKET &&
      !noStyledContainer &&
      '2px solid #F1F3F4',
    borderRadius: ({ noStyledContainer }) => (noStyledContainer ? 0 : '8px'),
    [theme.breakpoints.down('xs')]: {
      maxWidth: '100%',
      borderRadius: 0,
      gap: theme.spacing(1),
    },
  },
  columnGap2: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      gap: theme.spacing(1),
    },
  },
  columnGap1: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      gap: 0,
    },
  },
  grey: {
    color: '#687586',
  },
  waitlistChip: ({ offerStatus }) => ({
    borderRadius: '4px',
    color:
      offerStatus?.waiting_list_status === OFFER_WAITING_LIST_STATUS_FULL
        ? theme.palette.error.dark
        : theme.palette.grey[800],
    backgroundColor:
      offerStatus?.waiting_list_status === OFFER_WAITING_LIST_STATUS_FULL
        ? lighten(theme.palette.error.light, 0.8)
        : theme.palette.grey[100],
    '&>*': {
      color: 'inherit',
    },
  }),
  lineGap1: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  itemWithIcon: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  hiddenOnMobile: {
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  icon: {
    color: theme.palette.action.active,
  },
  avatar: {
    height: 24,
    width: 24,
  },
  price: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  bookingGuestContainer: {
    display: 'flex',
    marginBottom: 4,
    gap: theme.spacing(1),
  },
  bookingGuestName: {
    color: '#2D3748',
  },
}));

export const OfferSummaryForStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof OfferSummary>>()(OfferSummary);

export default React.memo(OfferSummary);
