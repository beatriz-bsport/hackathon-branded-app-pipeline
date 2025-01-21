// @flow

import React from 'react';
import { compose } from 'recompose';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import clsx from 'clsx';

import { getCurrencyDisplayWithPrice } from '../../theme/selectors';

import type { ShopItem } from '../types';
import analyticsUtils from '../../../components/analytics/analytics';

const ShopItemBuyableItemCard = (props: {
  shopitem: ShopItem,
  addToOrder?: (id: number) => void,
  classes: Object,
  fullHeight?: boolean,
  loading?: boolean,
  isExcludingTax?: boolean,
}) => {
  const handleAddItemToCart = () => {
    props.addToOrder(props.shopitem.id);
    analyticsUtils.addItemToCart(props.shopitem);
  };

  if (!props.shopitem) {
    return <div />;
  }
  return (
    <Paper
      className={clsx([
        props.classes.container,
        props.fullHeight ? props.classes.fullHeight : null,
      ])}
    >
      {props.shopitem.cover ? (
        <div className={props.classes.coverContainer}>
          <img
            alt={props.shopitem.name}
            className={props.classes.cover}
            // eslint-disable-next-line react/no-unknown-property
            component="img"
            src={props.shopitem.cover}
          />
        </div>
      ) : null}
      <div
        className={clsx([
          props.classes.innerContainer,
          props.shopitem.cover
            ? props.classes.innerWithImage
            : props.classes.innerWithoutImage,
        ])}
      >
        <div className={props.classes.header}>
          <Typography component="h3" variant="h6">
            {props.shopitem.name}
          </Typography>
          {props.shopitem.subtitle ? (
            <Typography color="textSecondary">
              {props.shopitem.subtitle}
            </Typography>
          ) : null}
        </div>
        <div className={props.classes.buttonRow}>
          <Button
            color="primary"
            disabled={props.loading}
            onClick={handleAddItemToCart}
          >
            <AddShoppingCartIcon className={props.classes.leftIcon} />
            {`${getCurrencyDisplayWithPrice(
              props.shopitem.price,
              props.isExcludingTax,
              props.shopitem.tva,
            )}`}
          </Button>
        </div>
      </div>
    </Paper>
  );
};

const styles = (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  header: {
    paddingLeft: theme.spacing(1),
  },
  fullHeight: {
    height: '100%',
  },
  innerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: theme.spacing(1),
  },
  innerWithImage: {
    height: '50%',
  },
  innerWithoutImage: {
    height: '100%',
  },
  coverContainer: {
    position: 'relative',
    width: '100%',
    paddingTop: '56.25%',
    height: 0,
  },
  cover: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    objectFit: 'cover',
    top: 0,
    left: 0,
  },
  description: {
    marginTop: theme.spacing(2),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  buttonRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  priceContainer: {
    marginLeft: theme.spacing(1),
  },
});

export default compose(withStyles(styles))(ShopItemBuyableItemCard);
