// @flow
import React, { Component } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withTranslation } from 'react-i18next';
import withTitle from '../../hocs/with-title.hoc';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import { getOrder, withMember } from '../../libs/order/selectors';

import { fetchMember } from '../../libs/member/actions';
import { fetchOrder, patchOrder } from '../../libs/order/actions';
import { fetchByQueryInvoice } from '../../actions/invoice.actions';
import OrderDetailComponent from '../../libs/order/components/OrderDetail.component';
import { fetchAll as fetchAllAlerting } from '../../libs/alerting/actions';
import { mailMembers as mailMemberAction } from '../../libs/communication/actions';

import type { OrderWithProducts } from '../../libs/order/types';

type Props = {
  order: ?OrderWithProducts,
  fetchOrder: (id: string, options: OptionCallback) => void,
  fetchByQueryInvoice: (params: *) => void,
  fetchAllAlerting: () => void,
  onInvoiceClick: (uuid: string) => void,
  goToMember: (id: number) => void,
  patchOrder: (id: string, data: *) => void,
  orderId: string,
  mailMemberAction: () => void,
  fetchMember: (id: number) => void,

  invoice: ?Invoice,
};

export class OrderDetail extends Component<Props> {
  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    const { orderId } = this.props;
    this.props.fetchOrder(this.props.orderId, {
      onSuccess: (order) => this.props.fetchMember(order.member),
    });
    this.props.fetchByQueryInvoice({ order: orderId });
  };

  componentDidUpdate(prevProps: Props) {
    if (prevProps.orderId !== this.props.orderId) {
      this.fetchData();
    }
  }

  render() {
    const { order, invoice, goToMember, onInvoiceClick } = this.props;
    if (!order) {
      return <LinearProgress />;
    }
    return (
      <div>
        <OrderDetailComponent
          order={order}
          invoice={invoice}
          onInvoiceClick={onInvoiceClick}
          goToMember={goToMember}
          updateOrderState={(state) =>
            this.props.patchOrder(
              order.id,
              { state },
              { onSuccess: () => this.props.fetchAllAlerting() },
            )
          }
          mailMember={this.props.mailMemberAction}
        />
      </div>
    );
  }
}

export default compose(
  routerParamsToProps({ id: 'orderId' }),
  connect(
    (state, { orderId }) => ({
      order: withMember(getOrder)(state, orderId),
      invoice: state.invoice.invoice,
    }),
    {
      fetchByQueryInvoice,
      fetchMember,
      fetchOrder,
      patchOrder,
      fetchAllAlerting,
      mailMemberAction,
      goToMember: (id: number) => push(`/member/${id}/`),
      onInvoiceClick: (uuid: string) => push(`/invoice/${uuid}`),
    },
  ),
  withTranslation(),
  withTitle(({ t }) => t('titles:order.orderDetail')),
)(OrderDetail);
