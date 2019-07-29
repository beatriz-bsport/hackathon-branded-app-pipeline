// @flow
import React, { Component } from 'react';

import MUIDataTable from 'mui-datatables';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import { formatAsDate } from '../../datetime';
import type { Subscription } from './types';

const renderRows = (subscriptions) => {
  return subscriptions.map((sub) => ({
    member: sub.memberName,
    name: sub.name,
    nb_interval: parseInt(sub.nb_interval, 10),
    date_created: formatAsDate(sub.date_created),
    recurrent_price_with_voucher: `${(
      parseFloat(sub.recurrent_price) - parseFloat(sub.recurrent_voucher)
    ).toFixed(2)}  €`,
  }));
};

const getColumnData = (t: TFunction, showOnlyCoreColumns: boolean) => {
  const coreColumns = [
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
  fetch: (page: number, page_size: number) => void,
  goToSubscription: (id: number) => void,
  t: TFunction,
};

type State = {
  subscriptions: Array<Subscription>,
  loading: boolean,
  tableState: {
    page: number,
  },
  count: number,
};

const PAGE_SIZE = 10;

export class SubscriptionTable extends Component<Props, State> {
  onRowClick = (rowData: Array<*>, { rowIndex }: { rowIndex: number }) => {
    this.props.goToSubscription(this.state.subscriptions[rowIndex].id);
  };

  state = {
    subscriptions: [],
    loading: true,
    tableState: {
      page: 1,
    },
    count: 0,
  };

  fetchSubscriptionPage = (page: number) => {
    this.props
      .fetch(page, PAGE_SIZE)
      .then((response) =>
        this.setState({
          subscriptions: response.data.results,
          loading: false,
          count: response.data.count,
        }),
      )
      .catch((err) => {
        console.error(err);
        this.setState({ loading: false });
      });
  };

  componentDidMount() {
    this.fetchSubscriptionPage(1);
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
      count: this.state.count,
      tableState: this.state.tableState,
      onTableChange: (action, tableState) => {
        this.fetchSubscriptionPage(tableState.page + 1);
      },
      textLabels: {
        body: {
          noMatch: this.state.loading ? (
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
        data={renderRows(this.state.subscriptions)}
        columns={getColumnData(this.props.t, !!this.props.showOnlyCore)}
        options={options}
      />
    );
  }
}

export default withNamespaces(['subscription'])(SubscriptionTable);
