import React, { useCallback } from 'react';

import { makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import CardMedia from '@material-ui/core/CardMedia';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';

import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';

import type { ShopItem } from '#src/libs/shop/types';

type Props = {
  shopItemVariantList: ShopItem[];
  isSupplierPriceHidden?: boolean;
};

const ShopItemDetailVariantListMobile: React.FC<Props> = ({
  shopItemVariantList,
  isSupplierPriceHidden,
}) => {
  const { t } = useTranslation('shop');

  const classes = useStyles();

  const getListItemTitle = useCallback(
    (color, size, price) =>
      [color, size, getCurrencyDisplayWithPrice(price)]
        .filter((string) => !!string)
        .join(' - '),
    [],
  );

  return (
    <List className={classes.listContainer}>
      {(shopItemVariantList || []).map((variant) => (
        <ListItem className={classes.listItemContainer}>
          <CardMedia
            className={classes.variantImage}
            component="img"
            image={variant.cover}
          />
          <div className={classes.variantTextContainer}>
            <Typography variant="body1">
              {getListItemTitle(variant.color, variant.size, variant.price)}
            </Typography>

            <div className={classes.flexColumn}>
              {!isSupplierPriceHidden && (
                <Typography variant="body2">
                  {`${t(
                    'shopItemDetail.table.variants.supplierPrice',
                  )}: ${getCurrencyDisplayWithPrice(variant.supplier_price)}`}
                </Typography>
              )}
              <Typography variant="body2">
                {`${t('shopItemDetail.table.variants.sku')}: ${
                  variant.stock_keeping_unit || 'N/A'
                }`}
              </Typography>
              <Typography variant="body2">
                {`${t('shopItemDetail.table.variants.barcode')}: ${
                  variant.barcode || 'N/A'
                }`}
              </Typography>
            </div>
          </div>
        </ListItem>
      ))}
    </List>
  );
};

const useStyles = makeStyles((theme) => ({
  listContainer: {
    padding: 0,
  },
  listItemContainer: {
    gap: theme.spacing(4),
    '&:not(:last-of-type)': {
      borderBottom: `solid ${theme.palette.grey[300]} 1px`,
    },
  },
  variantTextContainer: {
    flex: 1,
  },
  variantImage: {
    width: 48,
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

export default React.memo(ShopItemDetailVariantListMobile);
