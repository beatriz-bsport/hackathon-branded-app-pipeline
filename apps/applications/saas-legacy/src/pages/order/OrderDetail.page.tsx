import React, { Component } from 'react';
import { compose, withState, withHandlers } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import { push } from 'connected-react-router';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withTranslation } from 'react-i18next';

import { getInvoice } from '#src/libs/invoice/selectors';
import type { Invoice } from '#src/libs/invoice/types';

import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';

import { getOrder, withMember } from '#src/libs/order/selectors';

import { fetchMember } from '#src/libs/member/actions';
import {
  fetchOrder,
  patchOrder,
  refreshNewOrderAlerting,
} from '#src/libs/order/actions';
import { fetchByQueryInvoice as fetchByQueryInvoiceAction } from '#src/libs/invoice/actions';
import OrderDetailComponent from '#src/libs/order/components/OrderDetail.component';

import { getLocaleCountry } from '#src/utils/language';
import withTitle from '../../hocs/with-title.hoc';
import { WithHandlerType } from '../../utils/types';
import type { RootState } from '../../reducers';

type OwnProps = {
  orderId: string;
};

type OrderDetailConnectedProps = ConnectedProps<typeof connector>;

type Props = OwnProps &
  OrderDetailConnectedProps &
  WithHandlerType<typeof mapWithHandlers>;

type WithStateProps = { setRelatedInvoice: (uuid: string) => void };

export class OrderDetail extends Component<Props> {
  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    const { orderId } = this.props;
    this.props.fetchOrder(this.props.orderId, {
      onSuccess: (order) => {
        this.props.fetchMember(order.member);
      },
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
          companyCountry={this.props.companyCountry}
          goToMember={goToMember}
          invoice={invoice}
          onInvoiceClick={onInvoiceClick}
          // @ts-expect-error
          order={order}
          updateOrderState={(state) =>
            this.props.patchOrder(
              // @ts-expect-error
              order.id,
              { state },
              {
                onSuccess: () => this.props.refreshNewOrderAlerting(),
              },
            )
          }
        />
      </div>
    );
  }
}

const connector = connect(
  (
    state: RootState,
    { orderId, relatedInvoice }: { orderId: string; relatedInvoice: string },
  ) => ({
    // @ts-expect-error
    order: withMember(getOrder)(state, orderId),
    invoice: getInvoice(state, relatedInvoice),
    companyCountry: getLocaleCountry(state.theme.theme.locale),
  }),
  {
    fetchByQueryInvoice: fetchByQueryInvoiceAction,
    fetchMember,
    fetchOrder,
    patchOrder,
    refreshNewOrderAlerting,
    goToMember: (id: number) => push(`/member/${id}/`),
    onInvoiceClick: (uuid: string) => push(`/invoice/${uuid}`),
  },
);

const mapWithHandlers = {
  fetchByQueryInvoice:
    ({
      fetchByQueryInvoice,
      setRelatedInvoice,
    }: OrderDetailConnectedProps & WithStateProps) =>
    (params: { order: string }) => {
      // @ts-expect-error
      fetchByQueryInvoice(params, {
        onSuccess: (inv: Invoice) => setRelatedInvoice(inv.uuid),
      });
    },
};

export default compose(
  // @ts-expect-error
  routerParamsToProps({ id: 'orderId' }),
  withState('relatedInvoice', 'setRelatedInvoice', null),
  connector,
  withHandlers(mapWithHandlers),
  withTranslation(),
  withTitle(({ t }) => t('titles:order.orderDetail')),
)(OrderDetail);
