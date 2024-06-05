import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import makeStyles from '@material-ui/core/styles/makeStyles';
import useTheme from '@material-ui/core/styles/useTheme';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip from '@material-ui/core/Tooltip';

import DeleteIcon from '@material-ui/icons/Delete';

import { CustomChip } from '#src/components/chip/CustomChip.component';
import { getShopItemName } from '#src/libs/shop/utils';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';

import type { ShopItemTemplate } from '#src/libs/shop/types';

type Props = {
  className?: string;
  shopItemTemplate: ShopItemTemplate;
  handleDelete?: (shopItemTemplateId: number) => void;
  goToShopItemTemplate: (shopItemTemplateId: number) => void;
};

const FranchiseShopItemTemplateListItem: React.FC<Props> = ({
  className,
  shopItemTemplate,
  handleDelete,
  goToShopItemTemplate,
}) => {
  const { t } = useTranslation(['common', 'shop']);

  const theme = useTheme();

  const classes = useStyles();

  const handleDeleteShopItemTemplate = useCallback(() => {
    handleDelete?.(shopItemTemplate.id);
  }, [handleDelete, shopItemTemplate.id]);

  const handleGoToShopItemTemplate = useCallback(() => {
    goToShopItemTemplate(shopItemTemplate.id);
  }, [goToShopItemTemplate, shopItemTemplate.id]);

  const itemPrice = (() => {
    const isStandaloneItem = !!shopItemTemplate?.is_standalone_item;
    const allVariantsHaveSamePrice =
      !!shopItemTemplate?.all_variants_follow_base_price;
    const price = shopItemTemplate?.price;

    // Standalone item OR base item with same price for all variants
    if (isStandaloneItem || allVariantsHaveSamePrice) {
      return getCurrencyDisplayWithPrice(price);
    }

    const lowestVariantPrice = parseFloat(
      (shopItemTemplate?.lowest_variant_price ?? 0).toString(),
    ).toFixed(2);
    // Base item with dynamic variant prices
    return t('shop:startingAtWithPrice', {
      price: getCurrencyDisplayWithPrice(lowestVariantPrice),
    });
  })();

  return (
    <ListItem
      button
      className={classNames(className)}
      onClick={handleGoToShopItemTemplate}
    >
      {shopItemTemplate.cover && (
        <ListItemAvatar>
          <Avatar src={shopItemTemplate.cover} />
        </ListItemAvatar>
      )}

      <ListItemText
        primary={getShopItemName({
          name: shopItemTemplate.name ?? '',
          price: itemPrice,
          variantCount:
            shopItemTemplate.number_of_variants &&
            t('shop:variantCount', {
              count: shopItemTemplate.number_of_variants,
            }),
        })}
        secondary={shopItemTemplate.subtitle}
      />

      <ListItemSecondaryAction className={classes.listItemSecondaryActions}>
        {shopItemTemplate.marketplace_enabled ? (
          <CustomChip
            displayedValue={t('shop:shopList.tab.products.online')}
            icon="Phonelink"
            iconColor={theme.palette.success.main}
            mainColor={theme.palette.success.main}
          />
        ) : (
          <CustomChip
            displayedValue={t('shop:shopList.tab.products.storeOnly')}
            icon="PhonelinkOff"
            iconColor={theme.palette.info.main}
            mainColor={theme.palette.info.main}
          />
        )}

        {!!handleDelete && (
          <Tooltip title={t('common:delete')}>
            <IconButton onClick={handleDeleteShopItemTemplate}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}
      </ListItemSecondaryAction>
    </ListItem>
  );
};

const useStyles = makeStyles((theme) => ({
  listItemSecondaryActions: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
}));

export default React.memo(FranchiseShopItemTemplateListItem);
