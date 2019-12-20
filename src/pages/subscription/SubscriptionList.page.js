// @flow

import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { push as pushRouter } from 'react-router-redux';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import withTitle from '../../hocs/with-title.hoc';

import api from '../../libs/subscription/api';
import Config from '../../config';

import { getEnabled as getPaymentPackEnabled } from '../../libs/payment-packs/selectors';
import SubscriptionTable from '../../libs/subscription/components/SubscriptionTable.component';
import SubscriptionContractList from '../../libs/subscription/components/SubscriptionContractList.component';
import { getAvailableContractListWithPaymentPack } from '../../libs/subscription/selectors';
import {
  createOrUpdateContract,
  fetchContractList,
  deleteContract,
} from '../../libs/subscription/actions';

type Props = {
  goToSubscription: (id: number) => void,

  fetchContractList: () => void,
  contractLoading: boolean,
  createOrUpdateContract: (data: any, options: OptionCallback) => void,
  deleteContract: (id: number, options: OptionCallback) => void,
  paymentPacks: Array<PaymentPack>,
  contractList: Array<SubscriptionContract>,
};

export class SubscriptionList extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchContractList();
  }

  render() {
    return (
      <div>
        <SubscriptionContractList
          contractList={this.props.contractList}
          loading={this.props.contractLoading}
          createOrUpdate={(data, options) => {
            this.props.createOrUpdateContract(data, {
              onSuccess: () => {
                this.props.fetchContractList();
                if (options && options.onSuccess) {
                  options.onSuccess();
                }
              },
            });
          }}
          onDelete={(id) =>
            this.props.deleteContract(id, {
              onSuccess: this.props.fetchContractList,
            })
          }
          paymentPacks={this.props.paymentPacks}
        />
        <SubscriptionTable
          goToSubscription={this.props.goToSubscription}
          fetch={api.fetchAll}
        />
      </div>
    );
  }
}

export default compose(
  withNamespaces(['', 'subscription']),
  withTitle(({ t }: { t: TFunction }) =>
    t('titles:subscription.subscriptions'),
  ),
  connect(
    (state) => ({
      contractList: getAvailableContractListWithPaymentPack(state),
      contractLoading: state.subscription.contract.loading,
      paymentPacks: getPaymentPackEnabled(state),
    }),
    {
      fetchContractList,
      createOrUpdateContract,
      deleteContract,
      goToSubscription: (id) => pushRouter(`/subscription/${id}`),
    },
  ),
)(SubscriptionList);
