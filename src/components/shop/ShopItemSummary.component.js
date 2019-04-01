// @flow
import React, { Component } from 'react';

import { ListItem, ListItemText } from '@material-ui/core';
import { withNamespaces } from 'react-i18next';

type Props = {
  t: (x: string) => string,
  shopItem: ShopItem,
};

export class ShopItemSummary extends Component<Props> {
  render() {
    const { t } = this.props;
    const { price, name, subtitle, current_stock } = this.props.shopItem;

    return (
      <ListItem divider>
        <ListItemText primary={name} secondary={subtitle || ''} />
        <ListItemText
          primary={`${t('form.shop.item.provisions')} : ${current_stock}`}
          primaryTypographyProps={{ align: 'right' }}
          secondaryTypographyProps={{ align: 'right' }}
          secondary={`${price} € `}
        />
      </ListItem>
    );
  }
}

export default withNamespaces()(ShopItemSummary);
