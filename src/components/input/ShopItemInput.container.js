// @flow
import React from 'react';
import { connect } from 'react-redux';

import ShopItemSelector from '../../libs/shop/shop-item/ShopItemSelector.component';

type Props = {
  shopItems: Array<ShopItem>,
};

export function ShopItemInputContained(props: Props) {
  return <ShopItemSelector shopItems={props.shopItems} {...props} />;
}

function mapStateToProps(state) {
  return {
    shopItems: (state.shop.all || []).filter((si) => si.subshop),
  };
}

export default connect(mapStateToProps)(ShopItemInputContained);
