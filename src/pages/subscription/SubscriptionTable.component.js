// @flow
import React, { Component } from 'react';

import MUIDataTable from 'mui-datatables';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import { formatAsDate } from '../../datetime';
import type { Subscription } from './types';

const renderRows = (subscriptions, members) => {
  return subscriptions.map((sub) => ({
    member: (members.find((m) => m.id === sub.member) || {}).name,
    name: sub.name,
    nb_interval: parseInt(sub.nb_interval, 10),
    billing_anchor: formatAsDate(sub.billing_anchor),
    recurrent_price: `${parseFloat(sub.recurrent_price).toFixed(2)}  €`,
  }));
};

const getColumnData = (t: TFunction) => {
  return [
    {
      name: 'member',
      label: t('parameters.member'),
    },
    {
      name: 'name',
      label: t('parameters.name'),
    },
    {
      name: 'billing_anchor',
      label: t('parameters.billingAnchor'),
    },
    {
      name: 'nb_interval',
      label: t('parameters.nbInterval'),
    },
    {
      name: 'recurrent_price',
      label: t('parameters.recurrent_price'),
    },
  ];
};

type Props = {
  subscriptions: Array<Subscription>,
  members: Array<Member>,
  t: TFunction,
};

export class SubscriptionTable extends Component<Props> {
  onRowClick = () => {
    alert('clic');
  };

  render() {
    const options = {
      onRowClick: this.onRowClick,
      serverSide: true,
      filter: false,
      search: false,
      sort: true,
      download: false,
      selectableRows: false,
    };
    return (
      <MUIDataTable
        data={renderRows(this.props.subscriptions, this.props.members)}
        columns={getColumnData(this.props.t)}
        options={options}
      />
    );
  }
}

export default withNamespaces(['subscription'])(SubscriptionTable);
