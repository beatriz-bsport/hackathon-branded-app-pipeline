// @flow
import React from 'react';
import { connect } from 'react-redux';

import ShopItemInput from './ShopItemInput.component';

type Props = {
  shopItems: Array<ShopItem>,
};

export function ShopItemInputContained(props: Props) {
  return <ShopItemInput shopItems={props.shopItems} {...props} />;
}

function mapStateToProps(state) {
  return {
    shopItems: state.shop.all,
  };
}

export default connect(mapStateToProps)(ShopItemInputContained);
