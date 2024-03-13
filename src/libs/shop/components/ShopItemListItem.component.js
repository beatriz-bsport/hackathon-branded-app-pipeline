// @flow
import React, { useMemo } from 'react';

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
import ConditionalWrapper from '#components/ConditionnalWrapper.component';

import type { ShopItem } from '../types';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';

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

  const itemName = props.shopitem.name;

  const itemVariantsCount = props.shopitem.number_of_variants
    ? t('variantCount', { count: props.shopitem.number_of_variants })
    : '';

  const itemPrice = getCurrencyDisplayWithPrice(
    props.shopitem.lowest_variant_price ?? props.shopitem.price,
  );

  const listItemPrimaryText = useMemo(
    () =>
      [itemName, itemVariantsCount, itemPrice]
        .filter((text) => !!text)
        .join(' - '),
    [itemName, itemPrice, itemVariantsCount],
  );

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
        {!!props.shopitem.cover && (
          <ListItemIcon>
            <Avatar
              src={props.shopitem.cover}
              style={{ height: 60, width: 60, marginRight: 8 }}
            />
          </ListItemIcon>
        )}
        <ListItemText
          primary={listItemPrimaryText}
          secondary={props.shopitem.subtitle || props.shopitem.name}
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
