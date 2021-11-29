// @flow

import React from 'react';
import { withTranslation, TFunction } from 'react-i18next';
import { compose } from 'recompose';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import withStyles from '@material-ui/core/styles/withStyles';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import Skeleton from '@material-ui/lab/Skeleton';
import TypographyWithShowMore from '../../../components/TypographyWithShowMore.component';

import { formatAsDatetime, formatMinutes } from '../../../utils/datetime';
import { isOfferInThePast } from '../utils';

type Props = {
  offer: Offer,
  onShowMore: () => void,
  onBook: () => void,
  onBookOption: () => void,
  t: TFunction,
  classes: any,
  showOfferFilling: boolean,
};

const BookButton = (props: {
  t: TFunction,
  offer: Offer,
  onBook: () => void,
  onBookOption: () => void,
  showOfferFilling: boolean,
}) => {
  const { t, offer, onBook, onBookOption, showOfferFilling } = props;
  const disabled = !isOfferInThePast(offer) || !offer.available;
  let text = offer.full
    ? t('marketplace:workshop.card.bookOption')
    : t('marketplace:workshop.card.book');
  if (!isOfferInThePast(offer)) {
    text = t('marketplace:workshop.card.isPast');
  }
  if (!offer.available) {
    text = t('marketplace:workshop.card.notAvailable');
  }
  return (
    <Button
      color="primary"
      id={`offer-book-${offer.id}`}
      disabled={disabled}
      onClick={offer.is_full ? onBookOption : onBook}
    >
      {text +
        (showOfferFilling ? `  (${offer.tot_slots}/${offer.effectif})` : '')}
    </Button>
  );
};

export const MarketplaceWorkshopEvent = (props: Props) => {
  const { t, offer } = props;
  if (
    !offer ||
    !offer.meta_activity ||
    typeof offer.meta_activity === 'number' || // Must be changed meta activty should not appear as a number
    !offer.establishment
  ) {
    return (
      <Card style={{ width: '100%' }}>
        <div className={props.classes.mediaWrapper}>
          <Skeleton
            animation="wave"
            variant="rect"
            className={props.classes.media}
          />
        </div>
        <CardContent>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
            }}
          >
            <Skeleton animation="wave" className={props.classes.centerDiv} />
          </div>
          <Skeleton
            animation="wave"
            width="30%"
            className={props.classes.centerDiv}
          />
          <Skeleton
            animation="wave"
            width="20%"
            className={props.classes.centerDiv}
          />
          <div style={{ marginTop: 16 }}>
            <Skeleton animation="wave" className={props.classes.centerDiv} />
          </div>
        </CardContent>
        <CardActions>
          <Skeleton
            animation="wave"
            className={props.classes.buttonSkeleton}
            width="20%"
          />
        </CardActions>
      </Card>
    );
  }
  return (
    <Card style={{ width: '100%' }}>
      <div className={props.classes.mediaWrapper}>
        <CardMedia
          component="img"
          image={props.offer.meta_activity.cover_main}
          className={props.classes.media}
        />
      </div>

      <CardContent>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
          }}
        >
          <Typography variant="h5" component="h3">
            {props.offer.meta_activity.name}
          </Typography>
        </div>
        <Typography variant="h6" component="h4">
          {formatAsDatetime(
            props.offer.date_start,
            props.offer.establishment.tzname,
          )}
        </Typography>
        <Typography variant="subtitle2" component="h4">
          {t('marketplace:workshop.card.duration', {
            duration: formatMinutes(props.offer.duration_minute, t),
          })}
        </Typography>

        <div style={{ marginTop: 16 }}>
          <TypographyWithShowMore
            component="div"
            multiline
            variant="body1"
            color="textSecondary"
          >
            {props.offer.meta_activity.description}
          </TypographyWithShowMore>
        </div>
      </CardContent>
      <CardActions>
        <Button color="secondary" onClick={props.onShowMore}>
          {t('workshop.card.showMore')}
        </Button>
        <BookButton
          t={t}
          offer={offer}
          onBook={props.onBook}
          onBookOption={props.onBookOption}
          showOfferFilling={props.showOfferFilling}
        />
      </CardActions>
    </Card>
  );
};

const styles = () => ({
  mediaWrapper: {
    width: '100%',
    paddingTop: '56.25%',
    position: 'relative',
  },
  media: {
    objectFit: 'cover',
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  centerDiv: { width: '100%', display: 'flex', justifyContent: 'center' },
  buttonSkeleton: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['marketplace', 'datetime']),
)(MarketplaceWorkshopEvent);
