import React from 'react';

import { useTranslation } from 'react-i18next';

import {
  Avatar,
  Chip,
  Typography,
  lighten,
  makeStyles,
} from '@material-ui/core';
import {
  Adjust,
  CreditCard,
  HourglassFull,
  LocationOn,
  Person,
} from '@material-ui/icons';

import { OFFER_BOOKABLE_STATUS_BOOKABLE } from '@bsport/common/lib/master-data/bookable-status';
import { OFFER_WAITING_LIST_STATUS_OPEN } from '@bsport/common/lib/master-data/waiting-list-status';
import { OFFER_WAITING_LIST_STATUS_FULL } from '@bsport/common/src/master-data/error-codes/buyable-item-can-not-be-bought';
import { MarketPlaceCoachDisplay } from '@bsport/common/lib/master-data/personalization';

import { formatAsDateWithWeekday } from '../../../utils/datetime';
import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';
import { getTaxPrice } from '#libs/theme/utils';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

import { MetaActivity } from '#libs/meta-activity/types';
import { Establishment } from '#libs/establishment/types';
import { Coach } from '#libs/associated-coach/types';
import { DEFAULT_AVATAR } from '#libs/associated-coach/utils';
import { Offer, OfferStatus } from '#libs/offer/types';
import { CompanyTheme } from '#libs/theme/types';

import BookingConfirmButton from '#libs/booking/components/BookingConfirmButton.component';
import MarketplaceBroadcastCSSOnly from '#libs/marketplace/components/MarketplaceBroadcastCSSOnly';
import { OfferSummarySkeleton } from '.';

export type Props = {
  metaActivity: MetaActivity;
  establishment: Establishment;
  coach?: Coach;
  coachOverride?: Coach;
  offer: Offer;
  spotId?: number;
  price?: string;
  onConfirm: () => void;
  disableButton?: boolean;
  confirmLoading?: boolean;
  offerStatus: OfferStatus;
  loading: boolean;
  variant: 'default' | 'basket';
  tax: number;
  theme: CompanyTheme;
};

const OfferSummary: React.FC<Props> = (props) => {
  const {
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
  } = props;

  const classes = useStyles(props);

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
      <div className={classes.columnGap2}>
        <div className={classes.columnGap1}>
          <Typography variant="h6">{metaActivity?.name}</Typography>

          <Typography className={classes.grey}>
            {formatAsDateWithWeekday(
              offer?.date_start,
              theme,
              t,
              'LLL',
              offer?.timezone_name,
            )}
          </Typography>
        </div>
        <div className={classes.columnGap2}>
          {(metaActivity?.is_broadcast || waitlistExists) && (
            <div className={classes.lineGap1}>
              {metaActivity?.is_broadcast && <MarketplaceBroadcastCSSOnly />}
              {waitlistExists && (
                <Chip
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
                  className={classes.waitlistChip}
                />
              )}
            </div>
          )}

          {establishment && theme?.show_establishment && (
            <div className={classes.lineGap1}>
              <LocationOn className={classes.icon} />
              <Typography>{`${establishment?.title} - ${establishment?.location?.address}`}</Typography>
            </div>
          )}

          {coach && !theme?.hideCoach && variant === 'default' && (
            <div className={classes.itemWithIcon}>
              {displayCoachPicture ? (
                <Avatar className={classes.avatar}>
                  src=
                  {relevantCoach?.photo ?? DEFAULT_AVATAR}
                </Avatar>
              ) : (
                <Person className={classes.icon} />
              )}
              <Typography>{coachName}</Typography>
            </div>
          )}

          {spotId !== undefined && variant === 'default' && (
            <div className={classes.itemWithIcon}>
              <Adjust className={classes.icon} />
              <Typography>{`${t(`booking:place`)} ${spotId}`}</Typography>
            </div>
          )}

          {offer && variant === 'default' && (
            <div className={classes.itemWithIcon}>
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
      {!isWaitlistFull && onConfirm && variant === 'default' && (
        <div className={classes.columnGap2}>
          {displayTax && (
            <div className={classes.columnGap1}>
              <div className={classes.price}>
                <Typography variant="body2" className={classes.grey}>
                  {t(`checkout:payment.taxExcluded`)}
                </Typography>
                <Typography variant="body2">
                  {getCurrencyDisplayWithPrice(price, true, tax)}
                </Typography>
              </div>
              <div className={classes.price}>
                <Typography variant="body2" className={classes.grey}>
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
          <BookingConfirmButton
            value={
              isWaitlistOpen
                ? t(`booking:offer.mainButton.registerWaitingList`)
                : t(`booking:notification.form.submit`)
            }
            disabled={
              (offerStatus && !isBookable && !isWaitlistOpen) ||
              disableButton ||
              confirmLoading ||
              loading
            }
            onClick={onConfirm}
            buttonLoading={confirmLoading}
          />
        </div>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  grid: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '374px',
    padding: theme.spacing(2),
    gap: theme.spacing(3),
    justifyContent: 'flex-start',
    backgroundColor: theme.palette.background.paper,
    border: (props: Props) =>
      props.variant === 'default' && '2px solid #F1F3F4',
    borderRadius: '8px',
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
  waitlistChip: (props: Props) => ({
    borderRadius: '4px',
    color:
      props.offerStatus?.waiting_list_status === OFFER_WAITING_LIST_STATUS_FULL
        ? theme.palette.error.dark
        : theme.palette.grey[800],
    backgroundColor:
      props.offerStatus?.waiting_list_status === OFFER_WAITING_LIST_STATUS_FULL
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
}));

export const OfferSummaryForStorybook = marketplaceCssHoc()(OfferSummary);

export default OfferSummary;
