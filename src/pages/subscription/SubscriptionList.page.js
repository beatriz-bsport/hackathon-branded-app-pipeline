// @flow

import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { push as pushRouter } from 'react-router-redux';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import withTitle from '../../hocs/with-title.hoc';

import api from '../../libs/subscription/api';

import SubscriptionTable from '../../libs/subscription/components/SubscriptionTable.component';

type Props = {
  goToSubscription: (id: number) => void,
};

export const SubscriptionList = (props: Props) => (
  <SubscriptionTable
    goToSubscription={props.goToSubscription}
    fetch={api.fetchAll}
  />
);

export default compose(
  withNamespaces(['', 'subscription']),
  withTitle(({ t }: { t: TFunction }) =>
    t('titles:subscription.subscriptions'),
  ),
  connect(
    null,
    (dispatch) => ({
      goToSubscription(id) {
        dispatch(pushRouter(`/subscription/${id}`));
      },
    }),
  ),
)(SubscriptionList);
