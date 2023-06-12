import React from 'react';

import { withTranslation, WithTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';

import {
  Avatar,
  Chip,
  Grid,
  Typography,
  lighten,
  makeStyles,
} from '@material-ui/core';
import {
  Adjust,
  CreditCard,
  HourglassFull,
  LocationOn,
} from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';

import { OFFER_BOOKABLE_STATUS_BOOKABLE } from '@bsport/common/lib/master-data/bookable-status';
import {
  OFFER_WAITING_LIST_STATUS_OPEN,
  OFFER_WAITING_LIST_STATUS_FULL,
} from '@bsport/common/lib/master-data/waiting-list-status';

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

import BookingConfirmButton from './BookingConfirmButton.component';
import MarketplaceBroadcastCSSOnly from '#libs/marketplace/components/MarketplaceBroadcastCSSOnly';

export type Props = {
  metaActivity: MetaActivity;
  establishment: Establishment;
  coach: Coach;
  coachOverride: Coach | null;
  offer: Offer;
  spotId: number | null;
  price: string;
  onConfirm: () => void;
  disableButton: boolean;
  confirmLoading: boolean;
  offerStatus: OfferStatus;
  loading: boolean;
  variant: 'default' | 'basket';
  tax: number;
  theme: CompanyTheme;
  t: TFunction;
} & WithTranslation;

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
    t,
  } = props;

  const classes = useStyles(props);

  const isBookable =
    offerStatus?.bookable_status === OFFER_BOOKABLE_STATUS_BOOKABLE;
  const isWaitlistOpen =
    offerStatus?.waiting_list_status === OFFER_WAITING_LIST_STATUS_OPEN;
  const isWaitlistFull =
    offerStatus?.waiting_list_status === OFFER_WAITING_LIST_STATUS_FULL;
  const waitlistExists = !isBookable && (isWaitlistOpen || isWaitlistFull);

  const displayTax = theme?.is_tax_excluded_in_marketplace === false;

  if (loading) {
    return (
      <Grid container direction="column" className={classes.grid}>
        <Grid container item direction="column" className={classes.columnGap2}>
          <Grid
            container
            item
            direction="column"
            className={classes.columnGap1}
          >
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
          </Grid>
          <Grid
            container
            item
            direction="column"
            className={classes.columnGap2}
          >
            <Grid container item className={classes.lineGap1}>
              <Skeleton
                animation="wave"
                variant="circle"
                className={classes.avatar}
              />
              <Skeleton animation="wave" width="50%" />
            </Grid>
            <Grid container item className={classes.lineGap1}>
              <Skeleton
                animation="wave"
                variant="circle"
                className={classes.avatar}
              />
              <Skeleton animation="wave" width="50%" />
            </Grid>
            <Grid container item className={classes.lineGap1}>
              <Skeleton
                animation="wave"
                variant="circle"
                className={classes.avatar}
              />
              <Skeleton animation="wave" width="50%" />
            </Grid>
          </Grid>
          <Grid
            container
            item
            direction="column"
            className={classes.columnGap2}
          >
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
          </Grid>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container direction="column" className={classes.grid}>
      <Grid container item direction="column" className={classes.columnGap2}>
        <Grid container item direction="column" className={classes.columnGap1}>
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
        </Grid>
        <Grid container item direction="column" className={classes.columnGap2}>
          {(metaActivity?.is_broadcast || waitlistExists) && (
            <Grid container item className={classes.lineGap1}>
              {metaActivity?.is_broadcast && <MarketplaceBroadcastCSSOnly />}
              {waitlistExists && (
                <Chip
                  icon={<HourglassFull fontSize="small" />}
                  label={
                    isWaitlistFull
                      ? t(`booking:offer.offerStatus.waiting_list_status.6002`)
                      : t(`booking:offer.offerStatus.waiting_list_status.0`)
                  }
                  size="small"
                  className={classes.waitlistChip}
                />
              )}
            </Grid>
          )}

          {establishment && theme?.show_establishment && (
            <Grid container item className={classes.lineGap1}>
              <LocationOn className={classes.icon} />
              <Typography>{establishment?.title}</Typography>
            </Grid>
          )}

          {coach && !theme?.hideCoach && (
            <Grid container item className={classes.itemWithIcon}>
              <Avatar className={classes.avatar}>
                src=
                {coachOverride?.photo ?? coach?.photo ?? DEFAULT_AVATAR}
              </Avatar>
              <Typography>{coachOverride?.name ?? coach?.name}</Typography>
            </Grid>
          )}

          {(spotId || spotId === 0) && (
            <Grid container item className={classes.itemWithIcon}>
              <Adjust className={classes.icon} />
              <Typography>{`${t(`booking:place`)} ${spotId}`}</Typography>
            </Grid>
          )}

          {offer && variant === 'default' && (
            <Grid container item className={classes.itemWithIcon}>
              <CreditCard className={classes.icon} />
              <Typography>
                {offer?.credit_price > 1
                  ? `${offer?.credit_price} ${t(
                      `booking:creditConsumed_plural`,
                    )}`
                  : `${offer?.credit_price} ${t(`booking:creditConsumed`)}`}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Grid>
      {!isWaitlistFull && onConfirm && variant === 'default' && (
        <Grid item container direction="column" className={classes.columnGap2}>
          {displayTax && (
            <Grid
              item
              container
              direction="column"
              className={classes.columnGap1}
            >
              <Grid item container className={classes.price}>
                <Typography variant="body2" className={classes.grey}>
                  {t(`checkout:payment.taxExcluded`)}
                </Typography>
                <Typography variant="body2">
                  {getCurrencyDisplayWithPrice(price, true, tax)}
                </Typography>
              </Grid>
              <Grid item container className={classes.price}>
                <Typography variant="body2" className={classes.grey}>
                  {t(`checkout:payment.tax`)}
                </Typography>
                <Typography variant="body2">
                  {getCurrencyDisplayWithPrice(getTaxPrice(price, tax))}
                </Typography>
              </Grid>
            </Grid>
          )}
          <Grid item container className={classes.price}>
            <Typography variant="h6">
              {t(`checkout:payment.globalTotal`)}
            </Typography>
            <Typography variant="h6">
              {getCurrencyDisplayWithPrice(price)}
            </Typography>
          </Grid>
          <BookingConfirmButton
            value={
              isWaitlistOpen
                ? t(`booking:offer.mainButton.registerWaitingList`)
                : t(`booking:notification.form.submit`)
            }
            disabled={
              (offerStatus && !isBookable && !isWaitlistOpen) ||
              disableButton ||
              confirmLoading
            }
            onClick={onConfirm}
            buttonLoading={confirmLoading}
          />
        </Grid>
      )}
    </Grid>
  );
};

const useStyles = makeStyles((theme) => ({
  grid: {
    display: 'flex',
    maxWidth: '374px',
    padding: theme.spacing(2),
    gap: theme.spacing(3),
    justifyContent: 'flex-start',
    backgroundColor: theme.palette.background.paper,
    border: (props: Props) =>
      props.variant === 'default' && '2px solid var(--color-grey-light)',
    borderRadius: '8px',
    [theme.breakpoints.down('xs')]: {
      maxWidth: '100%',
      borderRadius: 0,
      gap: theme.spacing(1),
    },
  },
  columnGap2: {
    display: 'flex',
    gap: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      gap: theme.spacing(1),
    },
  },
  columnGap1: {
    display: 'flex',
    gap: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      gap: 0,
    },
  },
  grey: {
    color: 'var(--color-grey-main)',
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

const OfferSummaryTranslations = withTranslation([
  'datetime',
  'marketplace',
  'booking',
  'checkout',
])(OfferSummary);

export const OfferSummaryForStorybook = marketplaceCssHoc()(
  OfferSummaryTranslations,
);

export default OfferSummaryTranslations;
