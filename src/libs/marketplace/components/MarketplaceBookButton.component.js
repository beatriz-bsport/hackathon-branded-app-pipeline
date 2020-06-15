// @flow
import React from 'react';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import CancelIcon from '@material-ui/icons/Cancel';

import { colors } from '@bsport/common/lib/colors';
import { isOfferInThePast, isOfferBookableYet } from '../utils';

type Props = {
  onClickBook: () => void,
  onClickBookOption: () => void,
  offer: Offer,
  showOfferFilling: boolean,
};

const MarketplaceBookButton = (props: Props) => {
  const { offer, onClickBook, onClickBookOption } = props;
  const classes = useStyles();
  const { t } = useTranslation();

  const onClick = offer.is_full ? onClickBookOption : onClickBook;
  let text = offer.is_full
    ? t('marketplace.bookButton.bookOption')
    : t('marketplace.bookButton.book');
  if (!isOfferInThePast(offer)) {
    text = t('marketplace.bookButton.isPast');
  }
  if (!offer.available) {
    text = t('marketplace.bookButton.notAvailable');
  }
  if (!isOfferBookableYet(offer)) {
    text = t('marketplace.bookButton.notBookableYet');
  }
  return (
    <Button
      fullWidth
      id={`offer-book-${offer.id}`}
      disabled={!offer.available || !isOfferInThePast(offer)}
      onClick={onClick}
      color="primary"
      className={
        offer.available ? classes.offerAvailable : classes.offerNonAvailable
      }
    >
      <Hidden smUp>
        <IconButton
          variant="outlined"
          color="primary"
          id={`offer-book-${offer.id}`}
          disabled={!offer.available || !isOfferInThePast(offer)}
          onClick={onClick}
        >
          {!offer.available ? (
            <CancelIcon color={colors.orange} />
          ) : (
            <PersonAddIcon />
          )}
        </IconButton>
      </Hidden>
      <Hidden xsDown>
        {text +
          (props.showOfferFilling
            ? `  (${offer.tot_slots}/${offer.effectif})`
            : '')}
      </Hidden>
    </Button>
  );
};

const useStyles = makeStyles(() => ({
  offerAvailable: {},
  offerNonAvailable: {
    '&:disabled': {
      color: colors.orange,
    },
  },
}));

export default MarketplaceBookButton;
