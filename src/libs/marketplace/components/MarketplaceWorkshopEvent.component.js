// @flow

import React from 'react';

import { withNamespaces } from 'react-i18next';
import { compose } from 'recompose';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import withStyles from '@material-ui/core/styles/withStyles';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';

import type { TFunction } from 'react-i18next';
import TypographyWithShowMore from '../../../components/TypographyWithShowMore.component';

import { formatAsDatetime, formatMinutes } from '../../../datetime';
import { isOfferInThePast } from '../utils';

type Props = {
  offer: Offer,
  onShowMore: () => void,
  onBook: () => void,
  onBookOption: () => void,
  t: TFunction,
  classes: *,
};

const BookButton = (props: {
  t: TFunction,
  offer: Offer,
  onBook: () => void,
  onBookOption: () => void,
}) => {
  const { t, offer, onBook, onBookOption } = props;
  const disabled = !isOfferInThePast(offer) || !offer.available;
  let text = offer.is_full
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
      {text}
    </Button>
  );
};

export const MarketplaceWorkshopEvent = (props: Props) => {
  const { t, offer } = props;
  const { description } = props.offer.meta_activity;

  return (
    <Card style={{ width: '100%' }}>
      <CardMedia
        component="img"
        image={props.offer.meta_activity.cover_main}
        classes={{
          media: props.classes.media,
        }}
      />
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
          {formatAsDatetime(props.offer.date_start)}
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
            variant="body2"
            color="textSecondary"
          >
            {description}
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
        />
      </CardActions>
    </Card>
  );
};

const styles = () => ({
  media: { objectFit: 'cover', maxHeight: '60vh' },
});

export default compose(
  withStyles(styles),
  withNamespaces(['marketplace', 'datetime']),
)(MarketplaceWorkshopEvent);
