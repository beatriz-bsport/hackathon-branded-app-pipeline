// @flow
import React, { Component } from 'react';

import { withNamespaces } from 'react-i18next';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import { compose } from 'recompose';
import { goBack } from 'react-router-redux';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import ConsumerModalContainer from '../../components/consumer/ConsumerModalContainer.component';
import type { OrderWithProducts } from '../../libs/order/types';
import ConsumerMenu from '../../components/navigation/ConsumerMenu.component';
import { getOrCreateCurrentOrder as getOrCreateCurrentOrderAction } from '../../libs/order/actions';

import { snackbarSuccess } from '../../actions/snackbar.actions';
import OrderPaymentForm from './order/OrderPaymentForm.component';

type Props = {
  loading: boolean,
  companyId: number,
  order: OrderWithProducts,
  goBack: () => void,
  fetchCurrentOrder: (companyId: number) => void,
  onPaymentSuccess: () => void,
};

export class OrderPaymentPage extends Component<Props> {
  componentDidMount() {
    this.props.fetchCurrentOrder(this.props.companyId);
  }

  render() {
    const { order, loading } = this.props;
    if (!order) {
      return (
        <ConsumerMenu>
          <CircularProgress />
        </ConsumerMenu>
      );
    }

    return (
      <ConsumerModalContainer>
        <OrderPaymentForm
          loading={loading}
          order={order}
          goBack={this.props.goBack}
          onPaymentSuccess={this.props.onPaymentSuccess}
        />
      </ConsumerModalContainer>
    );
  }
}

export default compose(
  withNamespaces(),
  routerParamsToProps({ companyId: 'companyId:number' }),
  connect(
    (state) => ({
      order: state.order.order.current.data,
      loading: state.payment.loading,
    }),
    {
      fetchCurrentOrder: getOrCreateCurrentOrderAction,
      onPaymentSuccess: () => snackbarSuccess('payment:order.success'),
      goBack,
    },
  ),
)(OrderPaymentPage);
