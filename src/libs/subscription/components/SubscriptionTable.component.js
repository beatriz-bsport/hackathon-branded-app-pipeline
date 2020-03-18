// @flow
import React, { Component } from 'react';

import MUIDataTable from 'mui-datatables';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import { formatAsDate } from '../../../datetime';
import type { Subscription } from '../types';

const renderRows = (subscriptions) => {
  return subscriptions.map((sub) => ({
    key: sub.id,
    member: sub.memberName,
    name: sub.name,
    nb_interval: parseInt(sub.nb_interval, 10),
    first_billing_date: formatAsDate(sub.first_billing_date),
    recurrent_price_with_voucher: `${parseFloat(sub.recurrent_price).toFixed(
      2,
    )}  €`,
  }));
};

const getColumnData = (t: TFunction, showOnlyCoreColumns: boolean) => {
  const coreColumns = [
    {
      name: 'name',
      label: t('parameters.name'),
    },
    {
      name: 'first_billing_date',
      label: t('parameters.dateStart'),
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

  if (showOnlyCoreColumns) {
    return coreColumns;
  }

  return [
    {
      name: 'member',
      label: t('parameters.member'),
    },
    ...coreColumns,
  ];
};

type Props = {
  showOnlyCore: ?boolean,
  title?: string,
  onPageChange: (page: number) => void,
  goToSubscription: (id: number) => void,
  subscriptionList: Array<Subscription>,
  t: TFunction,
  loading: boolean,

  count: number,
};

type State = {
  tableState: {
    page: number,
  },
};

export class SubscriptionTable extends Component<Props, State> {
  onRowClick = (rowData: Array<*>, { rowIndex }: { rowIndex: number }) => {
    if (this.props.goToSubscription) {
      return this.props.goToSubscription(
        this.props.subscriptionList[rowIndex].id,
      );
    }
    return null;
  };

  state = {
    tableState: {
      page: 1,
    },
  };

  componentDidMount() {
    this.props.onPageChange(1);
  }

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
      count: this.props.count,
      tableState: this.state.tableState,
      onTableChange: (action, tableState) => {
        this.props.onPageChange(tableState.page + 1);
      },
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
        title={this.props.title}
        data={this.props.loading ? [] : renderRows(this.props.subscriptionList)}
        columns={getColumnData(this.props.t, !!this.props.showOnlyCore)}
        options={options}
      />
    );
  }
}

export default withNamespaces(['subscription'])(SubscriptionTable);
