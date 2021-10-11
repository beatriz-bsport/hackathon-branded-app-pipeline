import React from 'react';
import { Typography } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ButtonBase from '@material-ui/core/ButtonBase';
import CardMedia from '@material-ui/core/CardMedia';
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
    <ButtonBase
      className={classes.imageWrapper}
      onClick={() => props.onClick(giftcard.id)}
    >
      {giftcard.cover ? (
        <CardMedia alt="" image={giftcard.cover} className={classes.image} />
      ) : (
        <CardMedia alt="" className={classes.image} />
      )}
      <Typography variant="h6">{giftcard.name}</Typography>
      <Typography color="primary">
        {getCurrencyDisplayWithPrice(giftcard.price)}
      </Typography>
    </ButtonBase>
  );
}

const useStyles = makeStyles((theme) => ({
  imageWrapper: {
    position: 'relative',
    // paddingBottom: '56.2%',
    overflow: 'hidden',
    border: '1px solid transparent',
    borderRadius: theme.spacing(1),
  },
  image: {
    backgroundColor: 'grey',
    height: 240,
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
