import React from 'react';
import { Typography } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ButtonBase from '@material-ui/core/ButtonBase';
import clsx from 'clsx';
import { Giftcard } from '../types';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';

type Props = {
  giftcard: Giftcard;
  onClick: (id: number) => void;
};

export function GiftcardMarketplace(props: Props) {
  const { giftcard } = props;
  const classes = useStyles();
  return (
    <>
      <ButtonBase
        className={clsx(
          'bs-marketplace-giftcard__item__button',
          classes.imageWrapper,
        )}
        onClick={() => props.onClick(giftcard.id)}
      >
        {giftcard.cover ? (
          <img
            alt="Giftcard"
            className={clsx(
              'bs-marketplace-giftcard__item__button__image',
              classes.image,
            )}
            src={giftcard.cover}
          />
        ) : (
          <div
            className={clsx(
              'bs-marketplace-giftcard__item__button__image',
              classes.image,
            )}
          />
        )}
      </ButtonBase>
      <Typography className="bs-marketplace-giftcard__item__name" variant="h6">
        {giftcard.name}
      </Typography>
      <Typography
        className="bs-marketplace-giftcard__item__price"
        color="primary"
      >
        {getCurrencyDisplayWithPrice(giftcard.price)}
      </Typography>
    </>
  );
}

const useStyles = makeStyles((theme) => ({
  imageWrapper: {
    width: '100%',
    // paddingBottom: '56.2%',
    height: 240,
    borderRadius: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  image: {
    backgroundColor: 'grey',
    height: '100%',
    width: '100%',
    borderRadius: 10,
    boxShadow: '0px 4px 4px -1px #A59997',
    objectFit: 'cover',
    transition: 'all .3s',
    '&:hover': {
      opacity: '0.7',
    },
  },
}));

export default GiftcardMarketplace;
