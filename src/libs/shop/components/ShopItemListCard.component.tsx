// @flow
import React from 'react';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Analytics from '../../../components/analytics/Analytics.component';
import type { ShopItem } from '../types';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';

type Props = {
  shopitem: ShopItem;
  onClick: () => void;
  addToOrder: (id: number) => void;
  isExcludingTax: boolean;
};

export const ShopItemListCard = (props: Props) => {
  const classes = useStyles();
  const { shopitem } = props;
  return (
    <div className={classes.container}>
      <div className={classes.imageWrapper}>
        <div
          role="button"
          tabIndex={shopitem.id}
          onClick={props.onClick}
          onKeyDown={props.onClick}
          className={classes.media}
        >
          {shopitem.cover ? (
            <img
              src={shopitem.cover}
              alt={shopitem.name}
              className={classes.media}
            />
          ) : (
            <div className={classNames(classes.noImage, classes.media)}>
              <PhotoLibraryIcon className={classes.photoIcon} />
            </div>
          )}
        </div>
      </div>
      <div className={classes.productDetails}>
        <Typography variant="h6" className={classes.fontWeight}>
          {shopitem.name}
        </Typography>
        <Typography
          variant="body1"
          component="div"
          className={classes.subtitle}
        >
          {shopitem.subtitle}
        </Typography>
        <div className={classes.actions}>
          <Typography variant="h6" className={classes.fontWeight}>
            {getCurrencyDisplayWithPrice(
              shopitem.price,
              props.isExcludingTax,
              shopitem.tva,
            )}
          </Typography>
          <div>
            <IconButton>
              <VisibilityIcon onClick={props.onClick} />
            </IconButton>
            <IconButton
              color="primary"
              onClick={(ev) => {
                ev.stopPropagation();
                props.addToOrder(shopitem.id);
                Analytics.addShopItemToCart(shopitem);
              }}
            >
              <AddShoppingCartIcon />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  imageWrapper: {
    position: 'relative',
    '&:hover': {
      opacity: '0.7',
    },
    minHeight: 162,
    borderRadius: 6,
  },
  media: {
    objectFit: 'cover',
    width: '100%',
    height: '100%',
    maxHeight: 162,
    transition: 'all .3s',
    '&:hover': {
      opacity: '0.7',
    },
    borderRadius: 6,
  },
  productDetails: {
    paddingTop: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },
  subtitle: {
    color: 'rgba(0, 0, 0, 0.38)',
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noImage: {
    background: '#C4C4C4',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    minHeight: 162,
  },
  photoIcon: {
    fontSize: 38,
    color: 'rgba(0, 0, 0, 0.54)',
  },
  fontWeight: {
    fontWeight: 400,
  },
}));

export default ShopItemListCard;
