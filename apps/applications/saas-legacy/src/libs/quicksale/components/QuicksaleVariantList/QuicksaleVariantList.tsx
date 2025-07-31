import React, { useMemo } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';

import { Theme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';

import useStyle from '#src/libs/quicksale/components/QuicksaleConfigurationItemList/styles';
import QuicksaleItemCard from '#src/libs/quicksale/components/QuicksaleItemCard/QuicksaleItemCard.component';
import QuicksaleItemCardSkeleton from '#src/libs/quicksale/components/QuicksaleConfigurationItemList/QuicksaleItemCardSkeleton';
import type { QuicksaleCardInfo } from '#src/libs/quicksale/types';
import { getCardInfoFromBuyableItem } from '../../utils';
import { QuicksaleBasketItem } from '@bsport/common/lib/master-data/buyable-items';
import { useFetchShopItemVariants } from '../../hooks/useFetchShopItemVariants';
import { useTranslation } from 'react-i18next';

type Props = {
  isExcludingTax?: boolean;
  onItemClick: (item: QuicksaleCardInfo) => void;
  currentSectionId: string;
  variantList?: Array<{ variant_id: number; color?: string }>;
  currentVariantItemId: number;
};

const QuicksaleVariantList: React.FC<Props> = ({
  isExcludingTax,
  onItemClick,
  currentSectionId,
  variantList,
  currentVariantItemId,
}) => {
  const { t } = useTranslation('quicksale');

  const classes = useStyle({ isQuicksaleInterfaceView: true });

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('xs'),
  );

  const { loading, variants, error } =
    useFetchShopItemVariants(currentVariantItemId);

  const variantCardsInfo = useMemo(() => {
    if (!variantList?.length || !variants?.length) return [];
    return variantList.reduce<QuicksaleCardInfo[]>((acc, variant) => {
      const buyableItem = variants.find(
        (item) => item.id === variant.variant_id,
      );
      if (!buyableItem) return acc;

      const cardInfo = getCardInfoFromBuyableItem(
        {
          buyableItem,
          buyableItemIdentifier: QuicksaleBasketItem.ShopItemIdentifier,
        },
        t,
        variant.color,
        currentSectionId,
        (buyableItem.current_stock ?? 0) <= 0 &&
          (buyableItem.number_of_variants ?? 0) === 0,
        false,
        undefined,
        `${buyableItem.color ?? ''}${
          buyableItem.size ? ' ' + buyableItem.size : ''
        }`,
      );

      return [...acc, cardInfo];
    }, []);
  }, [variants, variantList, currentSectionId, t]);

  if (error) return null;

  return (
    <div className={classes.autoSizerContainer}>
      <AutoSizer>
        {(autoSizerProps: { height: number; width: number }) => (
          <Grid
            container
            className={classes.itemContainer}
            spacing={isMobile ? 2 : 3}
            style={{
              maxHeight: autoSizerProps.height,
              width: autoSizerProps.width,
            }}
          >
            {loading
              ? [...Array(16).keys()].map((index) => (
                  <Grid key={index} item lg={3} md={4} sm={6} xs={12}>
                    <QuicksaleItemCardSkeleton />
                  </Grid>
                ))
              : (variantCardsInfo ?? []).map((item) => (
                  <Grid
                    key={item.id}
                    item
                    className={classes.item}
                    lg={3}
                    md={4}
                    sm={6}
                    xs={12}
                  >
                    <QuicksaleItemCard
                      addToBasket={onItemClick}
                      isExcludingTax={isExcludingTax ?? false}
                      item={item}
                      outOfStock={item.outOfStock ?? false}
                      restrictedPurchase={item.restricted ?? false}
                    />
                  </Grid>
                ))}
          </Grid>
        )}
      </AutoSizer>
    </div>
  );
};

export default React.memo(QuicksaleVariantList);
