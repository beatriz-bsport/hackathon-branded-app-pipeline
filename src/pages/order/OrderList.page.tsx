import React from 'react';

import { compose } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import { push as pushRouter } from 'connected-react-router';
import { withTranslation } from 'react-i18next';
import OrderTable from '#libs/order/components/OrderTable.component';
import { fetchOrders } from '#libs/order/api';
import withTitle from '#hocs/with-title.hoc';

type Props = ConnectedProps<typeof connector>;

export const OrderList: React.FC<Props> = (props: Props) => {
  return (
    <OrderTable
      title=""
      fetch={fetchOrders}
      onOrderClick={props.goToOrderPage}
    />
  );
};

const connector = connect(null, {
  goToOrderPage: (id: string) => pushRouter(`/order/${id}/`),
});

export default compose(
  connector,
  withTranslation(),
  withTitle(({ t }) => t('titles:order.orderList')),
)(OrderList);
