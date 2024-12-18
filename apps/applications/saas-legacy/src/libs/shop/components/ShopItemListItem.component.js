// @flow
import React from 'react';

import { useTranslation } from 'react-i18next';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import ConditionalWrapper from '#src/components/ConditionnalWrapper.component';

import { getCurrencyDisplayWithPrice } from '../../theme/selectors';

import { getShopItemName } from '../utils';

type Props = {
  shopitem: ShopItem,
  divider?: boolean,
  onClick?: () => void,
  onDelete?: () => void,
  additionalActions?: any,
  dense?: boolean,
  isFocused?: boolean,
  isPaperVariant?: boolean,
};

export default (props: Props) => {
  const { t } = useTranslation('shop');

  const itemName = props.shopitem?.name ?? '';

  const itemSubtitle = props.shopitem?.subtitle ?? '';

  const itemPrice = (() => {
    const isStandaloneItem = !!props.shopitem?.is_standalone_item;
    const isVariantItem = !!props.shopitem?.base_item;
    const lowestVariantPrice = parseFloat(
      props.shopitem?.lowest_variant_price,
    ).toFixed(2);
    const allVariantsHaveSamePrice =
      !!props.shopitem?.all_variants_follow_base_price;
    const price = props.shopitem?.price;

    // Standalone item OR base item with same price for all variants
    if (isStandaloneItem || allVariantsHaveSamePrice || isVariantItem) {
      return getCurrencyDisplayWithPrice(price);
    }
    // Base item with dynamic variant prices
    return t('startingAtWithPrice', {
      price: getCurrencyDisplayWithPrice(lowestVariantPrice ?? ''),
    });
  })();

  const shopItemName = getShopItemName({
    name: props.shopitem?.name ?? '',
    size: props.shopitem?.size ?? '',
    color: props.shopitem?.color ?? '',
    variantCount:
      props.shopitem?.number_of_variants &&
      t('variantCount', { count: props.shopitem?.number_of_variants }),
    price: itemPrice,
  });

  if (!props.shopitem) {
    return (
      <ConditionalWrapper
        condition={props.isPaperVariant}
        WrapperComponent={Paper}
      >
        <ListItem dense={props.dense} divider={props.divider}>
          <CircularProgress />
        </ListItem>
      </ConditionalWrapper>
    );
  }
  return (
    <ConditionalWrapper
      condition={props.isPaperVariant}
      WrapperComponent={Paper}
    >
      <ListItem
        divider
        button={!!props.onClick}
        dense={props.dense}
        onClick={props.onClick}
        style={props.isFocused ? { backgroundColor: '#EFEFEF' } : {}}
      >
        {!!props.shopitem?.cover && (
          <ListItemIcon>
            <Avatar
              src={props.shopitem?.cover}
              style={{ height: 60, width: 60, marginRight: 8 }}
            />
          </ListItemIcon>
        )}
        <ListItemText
          primary={shopItemName}
          secondary={itemSubtitle || itemName}
        />
        {props.additionalActions}
        {props.onDelete ? (
          <ListItemSecondaryAction>
            <IconButton onClick={props.onDelete}>
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        ) : null}
      </ListItem>
    </ConditionalWrapper>
  );
};
