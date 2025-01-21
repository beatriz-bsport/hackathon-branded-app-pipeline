import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import VisibilityIcon from '@material-ui/icons/Visibility';
import type { ShopItem } from '../types';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import analyticsUtils from '#src/components/analytics/analytics';

type Props = {
  shopitem: ShopItem;
  onClick: () => void;
  addToOrder: (id: number) => void;
  isExcludingTax: boolean;
};

export const ShopItemListCard = (props: Props) => {
  const classes = useStyles();
  const { shopitem, onClick } = props;

  const handleClick = React.useCallback(() => {
    analyticsUtils.viewBuyableItem(shopitem);
    onClick();
  }, [onClick, shopitem]);

  return (
    <div className={classes.container}>
      <div className={classes.imageWrapper}>
        <div
          className={classes.media}
          onClick={handleClick}
          onKeyDown={handleClick}
          role="button"
          tabIndex={shopitem.id}
        >
          {shopitem.cover ? (
            <img
              alt={shopitem.name}
              className={classes.media}
              src={shopitem.cover}
            />
          ) : (
            <div className={clsx(classes.noImage, classes.media)}>
              <PhotoLibraryIcon className={classes.photoIcon} />
            </div>
          )}
        </div>
      </div>
      <div className={classes.productDetails}>
        <Typography className={classes.fontWeight} variant="h6">
          {shopitem.name}
        </Typography>
        <Typography
          className={classes.subtitle}
          component="div"
          variant="body1"
        >
          {shopitem.subtitle}
        </Typography>
        <div className={classes.actions}>
          <Typography className={classes.fontWeight} variant="h6">
            {getCurrencyDisplayWithPrice(
              shopitem.price,
              props.isExcludingTax,
              shopitem.tva,
            )}
          </Typography>
          <div>
            <IconButton>
              <VisibilityIcon onClick={handleClick} />
            </IconButton>
            <IconButton
              color="primary"
              onClick={(ev) => {
                ev.stopPropagation();
                props.addToOrder(shopitem.id);
                analyticsUtils.addItemToCart(shopitem);
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
