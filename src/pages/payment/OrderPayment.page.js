// @flow
import React, { Component } from 'react';

import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import { compose } from 'recompose';
import { goBack } from 'connected-react-router';
import withStyles from '@material-ui/core/styles/withStyles';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
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
  classes: Object,
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
      <div className={this.props.classes.container}>
        <OrderPaymentForm
          loading={loading}
          order={order}
          goBack={this.props.goBack}
          onPaymentSuccess={this.props.onPaymentSuccess}
        />
      </div>
    );
  }
}
const styles = (theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    paddingTop: theme.spacing(4),
    width: '100vw',
  },
});

export default compose(
  withStyles(styles),
  withTranslation(),
  routerParamsToProps({ companyId: 'companyId:number' }),
  connect(
    (state) => ({
      order: state.order.order.current.data,
      loading: state.payment.loading,
    }),
    {
      fetchCurrentOrder: getOrCreateCurrentOrderAction,
      onPaymentSuccess: () => snackbarSuccess('order.success'),
      goBack,
    },
  ),
)(OrderPaymentPage);
