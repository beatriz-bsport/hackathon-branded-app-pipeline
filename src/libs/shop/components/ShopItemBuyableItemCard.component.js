// @flow

import React from 'react';
import { compose } from 'recompose';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import classname from 'classnames';

import { getCurrencyDisplay } from '../../theme/selectors';

import type { ShopItem } from '../types';

const ShopItemBuyableItemCard = (props: {
  shopitem: ShopItem,
  addToOrder: ?(id: number) => void,
  classes: Object,
  fullHeight?: boolean,
}) => {
  if (!props.shopitem) {
    return <div />;
  }
  return (
    <Paper
      className={classname([
        props.classes.container,
        props.fullHeight ? props.classes.fullHeight : null,
      ])}
    >
      {props.shopitem.cover ? (
        <div className={props.classes.coverContainer}>
          <img
            alt={props.shopitem.name}
            className={props.classes.cover}
            component="img"
            src={props.shopitem.cover}
          />
        </div>
      ) : null}
      <div
        className={classname([
          props.classes.innerContainer,
          props.shopitem.cover
            ? props.classes.innerWithImage
            : props.classes.innerWithoutImage,
        ])}
      >
        <div className={props.classes.header}>
          <Typography variant="h6" component="h3">
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
            onClick={() => props.addToOrder(props.shopitem.id)}
          >
            <AddShoppingCartIcon className={props.classes.leftIcon} />
            {`${props.shopitem.price}${getCurrencyDisplay()}`}
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
    height: '50%',
  },
  cover: {
    height: '100%',
    width: '100%',
    objectFit: 'cover',
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
