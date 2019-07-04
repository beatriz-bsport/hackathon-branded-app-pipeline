// @flow

import React, { Component } from 'react';

import { compose } from 'recompose';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import { connect } from 'react-redux';

import OrderListItem from '../../libs/order/components/OrderListItem.component';

import { resetAndFetchOrders } from '../../libs/order/actions';

type Props = {
  orders: Array<Order>,
  resetAndFetchOrders: () => void,
};

type State = {
  selectedOrder: ?OrderWithProducts,
};

export class MyOrders extends Component<Props, State> {
  componentDidMount() {
    this.props.resetAndFetchOrders();
  }

  render() {
    const { orders } = this.props;
    return (
      <Grid container>
        <Grid item xs={12} md={6}>
          <Paper>
            <List dense disablePadding>
              {orders.map((o) => (
                <OrderListItem divider key={o.id} order={o} />
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} />
      </Grid>
    );
  }
}

export default compose(
  connect(
    (state) => ({
      orders: state.order.order.items.filter((o) => o.state > 0),
      loading: state.order.order.loading,
    }),
    {
      resetAndFetchOrders,
    },
  ),
)(MyOrders);
