// @flow

import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { push as pushRouter } from 'react-router-redux';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import withDrawer from '../../hocs/with-drawer.hoc';

import api from '../../libs/subscription/api';

import SubscriptionTable from '../../libs/subscription/SubscriptionTable.component';

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
  withDrawer(({ t }: { t: TFunction }) => t('appbar.title.subscriptions')),
  connect(
    null,
    (dispatch) => ({
      goToSubscription(id) {
        dispatch(pushRouter(`/subscription/${id}`));
      },
    }),
  ),
)(SubscriptionList);
