// @flow
import React from 'react';

import { compose } from 'recompose';
import { connect } from 'react-redux';
import { push as pushRouter } from 'react-router-redux';
import { withNamespaces } from 'react-i18next';
import OrderTable from '../../libs/order/components/OrderTable.component';
import { fetchOrders } from '../../libs/order/api';
import withDrawer from '../../hocs/with-drawer.hoc';

type Props = {
  goToOrderPage: (page: number) => void,
};

export const OrderList = (props: Props) => {
  return (
    <OrderTable
      title=""
      fetch={fetchOrders}
      onOrderClick={props.goToOrderPage}
    />
  );
};

export default compose(
  connect(
    null,
    { goToOrderPage: (id: string) => pushRouter(`/order/${id}/`) },
  ),
  withNamespaces(),
  withDrawer(({ t }) => t('appbar.title.orderList')),
)(OrderList);
