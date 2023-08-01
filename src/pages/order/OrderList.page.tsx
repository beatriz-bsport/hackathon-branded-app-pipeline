import React from 'react';

import { compose } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import { push as pushRouter } from 'connected-react-router';
import { withTranslation } from 'react-i18next';
import OrderTable from '#libs/order/components/OrderTable.component';
import { fetchOrders as fetchOrdersAction } from '#libs/order/actions';
import withTitle from '#hocs/with-title.hoc';
import {
  getAllOrdersItems,
  getOrdersListLoading,
  getOrdersListCount,
} from '#libs/order/selectors';
import { RootState } from '../../reducers';

type Props = ConnectedProps<typeof connector>;

export const OrderList: React.FC<Props> = (props: Props) => {
  const { fetchOrders, goToOrderPage, orders, count, loading } = props;
  return (
    <OrderTable
      count={count}
      loading={loading}
      onChange={fetchOrders}
      onOrderClick={goToOrderPage}
      orders={orders}
      title=""
    />
  );
};

const connector = connect(
  (state: RootState) => ({
    orders: getAllOrdersItems(state),
    count: getOrdersListCount(state),
    loading: getOrdersListLoading(state),
  }),
  {
    goToOrderPage: (id: string) => pushRouter(`/order/${id}/`),
    fetchOrders: fetchOrdersAction,
  },
);

export default compose(
  connector,
  withTranslation(),
  withTitle(({ t }) => t('titles:order.orderList')),
)(OrderList);
