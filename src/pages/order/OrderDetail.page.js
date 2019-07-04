// @flow
import React, { Component } from 'react';
import { withProps, compose } from 'recompose';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withNamespaces } from 'react-i18next';
import withDrawer from '../../hocs/with-drawer.hoc';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import memberSelectors from '../../libs/member/selectors';
import orderSelectors from '../../libs/order/selectors';

import { fetchByQueryMember } from '../../libs/member/actions';
import { fetchOrder, patchOrder } from '../../libs/order/actions';
import { fetchByQueryInvoice } from '../../actions/invoice.actions';
import OrderDetailComponent from '../../libs/order/components/OrderDetail.component';

import type { OrderWithProducts } from '../../libs/order/types';
import type { Member } from '../../libs/member/types';

type Props = {
  order: ?OrderWithProducts,
  fetchOrder: (id: string) => void,
  fetchByQueryMember: (params: *) => void,
  fetchByQueryInvoice: (params: *) => void,
  onInvoiceClick: (uuid: string) => void,
  goToMember: (id: number) => void,
  patchOrder: (id: string, data: *) => void,
  orderId: string,

  invoice: ?Invoice,
  member: ?Member,
};

export class OrderDetail extends Component<Props> {
  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    const { orderId } = this.props;
    this.props.fetchOrder(this.props.orderId);
    this.props.fetchByQueryInvoice({ order: orderId });
    this.props.fetchByQueryMember({ orders: orderId });
  };

  componentDidUpdate(prevProps: Props) {
    if (prevProps.orderId !== this.props.orderId) {
      this.fetchData();
    }
  }

  render() {
    const { order, invoice, member, goToMember, onInvoiceClick } = this.props;
    if (!order) {
      return <LinearProgress />;
    }
    return (
      <div>
        <OrderDetailComponent
          order={order}
          member={member}
          invoice={invoice}
          onInvoiceClick={onInvoiceClick}
          goToMember={goToMember}
          updateOrderState={(state) =>
            this.props.patchOrder(order.id, { state })
          }
        />
      </div>
    );
  }
}

export default compose(
  routerParamsToProps({ id: 'orderId' }),
  connect(
    (state, { orderId }) => ({
      getMember: (id) => memberSelectors.get(state, id),
      order: orderSelectors.get(state, orderId),
      invoice: state.invoice.invoice,
    }),
    {
      fetchByQueryInvoice,
      fetchByQueryMember,
      fetchOrder,
      patchOrder,
      goToMember: (id: number) => push(`/member/${id}/`),
      onInvoiceClick: (uuid: string) => push(`/invoice/${uuid}`),
    },
  ),
  withProps(({ getMember, order }) => ({
    member: order ? getMember(order.member) : null,
  })),
  withNamespaces(),
  withDrawer(({ t }) => t('appbar.title.orderDetail')),
)(OrderDetail);
