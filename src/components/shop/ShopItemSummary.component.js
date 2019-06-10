// @flow
import React, { Component } from 'react';

import { ListItem, ListItemText } from '@material-ui/core';
import { withNamespaces } from 'react-i18next';

type Props = {
  // t: (x: string) => string,
  shopItem: ShopItem,
  noDivider: boolean,
  button: boolean,
  selected?: boolean,
  isFocused?: boolean,
};

export class ShopItemSummary extends Component<Props> {
  render() {
    const { noDivider, isFocused, button } = this.props;
    const {
      price,
      name,
      subtitle,
      // current_stock,
    } = this.props.shopItem;
    // secondary={`${t('form.shop.item.provisions')} : ${current_stock}`}
    return (
      <ListItem
        selected={!!this.props.selected}
        divider={!noDivider}
        button={!!button}
        dense
        style={isFocused ? { backgroundColor: '#EFEFEF' } : {}}
      >
        <ListItemText primary={name} secondary={subtitle || ''} />
        <ListItemText
          primary={`${price} € `}
          primaryTypographyProps={{ align: 'right' }}
          secondaryTypographyProps={{ align: 'right' }}
        />
      </ListItem>
    );
  }
}

export default withNamespaces()(ShopItemSummary);
