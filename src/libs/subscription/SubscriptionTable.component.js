// @flow
import React, { Component } from 'react';

import MUIDataTable from 'mui-datatables';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import { formatAsDate } from '../../datetime';
import type { Subscription } from './types';

const renderRows = (subscriptions, members) => {
  return subscriptions.map((sub) => ({
    member: (members.find((m) => m.id === sub.member) || {}).name,
    name: sub.name,
    nb_interval: parseInt(sub.nb_interval, 10),
    date_created: formatAsDate(sub.date_created),
    recurrent_price_with_voucher: `${(
      parseFloat(sub.recurrent_price) - parseFloat(sub.recurrent_voucher)
    ).toFixed(2)}  €`,
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
      name: 'date_created',
      label: t('parameters.dateCreated'),
    },
    {
      name: 'nb_interval',
      label: t('parameters.nbInterval'),
    },
    {
      name: 'recurrent_price_with_voucher',
      label: t('parameters.recurrent_price'),
    },
  ];
};

type Props = {
  loading: boolean,
  subscriptions: Array<Subscription>,
  members: Array<Member>,
  goToSubscription: (id: number) => void,
  t: TFunction,
};

export class SubscriptionTable extends Component<Props> {
  onRowClick = (rowData: Array<*>, { rowIndex }: { rowIndex: number }) => {
    this.props.goToSubscription(this.props.subscriptions[rowIndex].id);
  };

  render() {
    const options = {
      onRowClick: this.onRowClick,
      serverSide: true,
      filter: false,
      search: false,
      sort: true,
      download: false,
      responsive: 'scroll',
      selectableRows: false,
      textLabels: {
        body: {
          noMatch: this.props.loading ? (
            <CircularProgress />
          ) : (
            this.props.t('table.noContent')
          ),
        },
      },
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
