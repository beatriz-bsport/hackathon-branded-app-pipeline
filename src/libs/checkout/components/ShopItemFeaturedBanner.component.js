// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import classname from 'classnames';

import ShopItemBuyableItemCard from '../../shop/components/ShopItemBuyableItemCard.component';

type Props = {
  t: TFunction,
  classes: Object,
  shopItemList: Array<ShopItem>,
  onAddShopItem: (id: number) => void,
};
export const ShopItemFeaturedBanner = (props: Props) => {
  if (props.shopItemList.length === 0) {
    return null;
  }
  return (
    <div className={props.classes.container}>
      <Typography variant="h5">{props.t('myBasket.featured')}</Typography>
      <div className={props.classes.innerContainer}>
        {props.shopItemList.map((si) => (
          <div
            className={classname([
              props.classes.shopItemContainer,
              props.shopItemList.filter((si_) => si_.cover).length
                ? props.classes.shopItemContainerWithImage
                : null,
            ])}
            key={si.id}
          >
            <ShopItemBuyableItemCard
              addToOrder={() => props.onAddShopItem(si.id)}
              shopitem={si}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = (theme) => ({
  container: {
    width: '100%',
  },
  innerContainer: {
    display: 'flex',
    overflowX: 'scroll',
    overflowY: 'hidden',
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    marginBottom: theme.spacing(1),
  },
  shopItemContainer: {
    minWidth: 260,
    maxWidth: '30vw',
    margin: theme.spacing(1),
    marginLeft: 2,
  },
  shopItemContainerWithImage: {
    minHeight: 200,
  },
});

export default compose(
  withTranslation(['checkout']),
  withStyles(styles),
)(ShopItemFeaturedBanner);
