import React from 'react';

import { withTranslation, WithTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';

import {
  Avatar,
  Chip,
  Grid,
  Theme,
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
    variant,
    theme,
    t,
  } = props;
  const classes = useStyles(props);
  return (
    <Grid container direction="column" className={classes.grid}>
      <Grid container item direction="column" className={classes.list}>
        <Typography variant="h6">
          {loading && !metaActivity?.name ? (
            <Skeleton animation="wave" />
          ) : (
            metaActivity?.name
          )}
        </Typography>

        <Typography variant="body2" className={classes.grey}>
          {loading && !offer ? (
            <Skeleton animation="wave" />
          ) : (
            formatAsDateWithWeekday(
              offer?.date_start,
              theme,
              t,
              'LLL',
              offer?.timezone_name,
            )
          )}
        </Typography>
        <Grid container item className={classes.itemWithIcon}>
          {metaActivity?.is_broadcast && <MarketplaceBroadcastCSSOnly />}
          {offerStatus?.bookable_status !== OFFER_BOOKABLE_STATUS_BOOKABLE &&
            (offerStatus?.waiting_list_status ===
              OFFER_WAITING_LIST_STATUS_OPEN ||
              offerStatus?.waiting_list_status ===
                OFFER_WAITING_LIST_STATUS_FULL) && (
              <Chip
                icon={<HourglassFull fontSize="small" />}
                label={
                  offerStatus?.waiting_list_status ===
                  OFFER_WAITING_LIST_STATUS_FULL
                    ? t(`booking:offer.offerStatus.waiting_list_status.6002`)
                    : t(`booking:offer.offerStatus.waiting_list_status.0`)
                }
                size="small"
                className={classes.waitlistChip}
              />
            )}
        </Grid>

        {!establishment && loading && (
          <Grid container item className={classes.itemWithIcon}>
            <Skeleton
              animation="wave"
              variant="circle"
              className={classes.avatar}
            />
            <Skeleton animation="wave" width="50%" />
          </Grid>
        )}
        {establishment && (
          <Grid container item className={classes.itemWithIcon}>
            <LocationOn className={classes.icon} />
            <Typography>{establishment?.title}</Typography>
          </Grid>
        )}

        {!coach && loading && (
          <Grid container item className={classes.itemWithIcon}>
            <Skeleton
              animation="wave"
              variant="circle"
              className={classes.avatar}
            />
            <Skeleton animation="wave" width="50%" />
          </Grid>
        )}
        {coach && (
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
            {!spotId && loading ? (
              <Skeleton
                animation="wave"
                variant="circle"
                className={classes.avatar}
              />
            ) : (
              <Adjust className={classes.icon} />
            )}
            <Typography>{`${t(`booking:place`)} ${spotId}`}</Typography>
          </Grid>
        )}

        {!offer && loading && (
          <Grid container item className={classes.itemWithIcon}>
            <Skeleton
              animation="wave"
              variant="circle"
              className={classes.avatar}
            />
            <Skeleton animation="wave" width="50%" />
          </Grid>
        )}
        {offer && variant === 'default' && (
          <Grid container item className={classes.itemWithIcon}>
            <CreditCard className={classes.icon} />
            <Typography>
              {offer?.credit_price > 1
                ? `${offer?.credit_price} ${t(`booking:creditConsumed_plural`)}`
                : `${offer?.credit_price} ${t(`booking:creditConsumed`)}`}
            </Typography>
          </Grid>
        )}
      </Grid>

      {offerStatus?.waiting_list_status !== OFFER_WAITING_LIST_STATUS_FULL &&
        onConfirm &&
        variant === 'default' && (
          <Grid item container direction="column" className={classes.list}>
            {!price && loading ? (
              <Skeleton animation="wave" />
            ) : (
              <Grid item container className={classes.price}>
                <Typography variant="h6">
                  {t(`checkout:payment.globalTotal`)}
                </Typography>
                <Typography variant="h6" className={classes.grey}>
                  {getCurrencyDisplayWithPrice(price)}
                </Typography>
              </Grid>
            )}
            {loading ? (
              <Skeleton animation="wave" height="50px" />
            ) : (
              <BookingConfirmButton
                value={
                  offerStatus?.waiting_list_status ===
                  OFFER_WAITING_LIST_STATUS_OPEN
                    ? t(`booking:offer.mainButton.registerWaitingList`)
                    : t(`booking:notification.form.submit`)
                }
                disabled={
                  (offerStatus &&
                    offerStatus?.bookable_status !==
                      OFFER_BOOKABLE_STATUS_BOOKABLE &&
                    offerStatus?.waiting_list_status !==
                      OFFER_WAITING_LIST_STATUS_OPEN) ||
                  disableButton ||
                  confirmLoading
                }
                onClick={onConfirm}
                buttonLoading={confirmLoading}
              />
            )}
          </Grid>
        )}
    </Grid>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  grid: {
    display: 'flex',
    maxWidth: '374px',
    padding: theme.spacing(2),
    gap: theme.spacing(4),
    justifyContent: 'flex-start',
    backgroundColor: theme.palette.background.paper,
    border: (props: Props) =>
      props.variant === 'default' ? '2px solid #F1F3F4' : 'none',
    borderRadius: '8px',
  },
  list: {
    display: 'flex',
    gap: theme.spacing(2),
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
  itemWithIcon: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
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
])(OfferSummary);

export const OfferSummaryForStorybook = marketplaceCssHoc()(
  OfferSummaryTranslations,
);

export default OfferSummaryTranslations;
