import React from 'react';

import { replace } from 'connected-react-router';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import RedirectionLoading from './RedirectionLoading.component';
import { fetchShopItem } from '../../../libs/shop/actions/shopitem';
import { OptionCallback } from '../../../state/types';
import routerParamsToProps from '../../../hocs/router-params-to-props.hoc';

type Props = {
  id: number;
  replace: (path: string) => void;
  fetchShopItem: (id: number, options: OptionCallback) => void;
};

export class ShopItemPreCheckoutRedirect extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchShopItem(this.props.id, {
      onSuccess: (item: any) => {
        this.props.replace(
          `/checkout/${item.company}/pre-checkout/shop-item/${item.id}${window.location.search}`,
        );
      },
    });
  }

  render() {
    return <RedirectionLoading />;
  }
}

export default compose(
  routerParamsToProps({ id: 'id:number' }),
  connect(null, {
    replace,
    fetchShopItem,
  }),
)(ShopItemPreCheckoutRedirect);
