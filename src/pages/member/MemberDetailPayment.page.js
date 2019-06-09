// @flow

import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import { push } from 'connected-react-router';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import InvoiceTable from '../invoice/InvoiceTable.component';

import subscriptionApi from '../../libs/subscription/api';
import SubscriptionTable from '../../libs/subscription/SubscriptionTable.component';
import type { Subscription } from '../../libs/subscription/types';

type Props = {
  id: number,
  goToInvoice: (uuid: string) => void,
  goToSubscription: (id: number) => void,
  t: TFunction,
};

type State = {
  subscriptions: Array<Subscription>,
  subscriptionLoading: boolean,
};

export class MemberDetailPayment extends Component<Props, State> {
  state = {
    subscriptions: [],
    subscriptionLoading: true,
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.id !== this.props.id) {
      this.fetchData();
    }
  }

  fetchData = () => {
    if (this.props.id) {
      subscriptionApi
        .fetchAll(`memberId=${this.props.id}`)
        .then((response) =>
          this.setState({
            subscriptions: response.data,
            subscriptionLoading: false,
          }),
        )
        .catch((err) => console.error(err));
    }
  };

  render() {
    return (
      <Grid container spacing={16}>
        <Grid item xs={12} lg={6}>
          <InvoiceTable
            onInvoiceClick={this.props.goToInvoice}
            finalizeInvoice={() => {}}
            downloadInvoice={() => {}}
            showOnlyCore
            queryParams={`memberId=${this.props.id}`}
            title={this.props.t('invoiceTitle')}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <SubscriptionTable
            subscriptions={this.state.subscriptions}
            loading={this.state.subscriptionLoading}
            goToSubscription={this.props.goToSubscription}
            title={this.props.t('subscriptionTitle')}
            showOnlyCore
          />
        </Grid>
      </Grid>
    );
  }
}

export default compose(
  routerParamsToProps({ id: 'id:number' }),
  withNamespaces(['member']),
  connect(
    null,
    {
      goToInvoice: (uuid) => push(`/invoice/${uuid}`),
      goToSubscription: (id: number) => push(`/subscription/${id}`),
    },
  ),
)(MemberDetailPayment);
