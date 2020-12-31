// @flow
import React from 'react';

import { compose } from 'recompose';
import { connect } from 'react-redux';
import { push as pushRouter } from 'connected-react-router';
import { withTranslation } from 'react-i18next';
import OrderTable from '../../libs/order/components/OrderTable.component';
import { fetchOrders } from '../../libs/order/api';
import withTitle from '../../hocs/with-title.hoc';

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
  connect(null, { goToOrderPage: (id: string) => pushRouter(`/order/${id}/`) }),
  withTranslation(),
  withTitle(({ t }) => t('titles:order.orderList')),
)(OrderList);
