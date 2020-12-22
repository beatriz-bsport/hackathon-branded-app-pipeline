// @flow
import React, { Component } from 'react';

import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import MUIDataTable from 'mui-datatables';
import type { TFunction } from 'react-i18next';
import { withTranslation } from 'react-i18next';
import {
  ORDER_STATE_CANCELLED,
  ORDER_STATE_ONSITEDELIVERY,
} from '@bsport/common/lib/master-data/order-states';
import { formatAsDatetime } from '../../../datetime';

import type { OrderWithProducts } from '../types';

type PaginatedResponse = {
  data: {
    results: Array<*>,
    count: number,
    next_page: ?number,
  },
};
type Props = {
  title: string,
  onOrderClick: (id: string) => void,
  fetch: (page: number) => Promise<PaginatedResponse>,
  t: TFunction,
};

type State = {
  orders: Array<OrderWithProducts>,
  loading: boolean,
  count: number,
  tableState: {
    page: number,
  },
};

const ORDER_PER_PAGE = 50;

const renderRows = (orders: Array<OrderWithProducts>, t: TFunction) => {
  return orders.map((order) => renderRow(order, t));
};

const renderRow = (order: OrderWithProducts, t: TFunction) => {
  const {
    updated_at,
    created_at,
    product_lines,
    first_name,
    last_name,
    state,
  } = order;
  return {
    name: `${first_name || ''} ${last_name || ''}`,
    updated_at: formatAsDatetime(updated_at),
    created_at: formatAsDatetime(created_at),
    state: renderState(state, t),
    qty: product_lines.reduce((acc, v) => acc + v.quantity, 0),
  };
};

const renderState = (state: number, t: TFunction) => {
  let color = 'primary';
  if (state === ORDER_STATE_CANCELLED.id) {
    color = 'error';
  }
  if (state === ORDER_STATE_ONSITEDELIVERY.id) {
    color = 'secondary';
  }
  return <Typography color={color}>{t(`state.${state}`)}</Typography>;
};

const getColumnData = (t: TFunction) => {
  return [
    {
      name: 'name',
      label: t('table.name'),
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: 'state',
      label: t('table.state'),
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: 'updated_at',
      label: t('table.updated_at'),
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: 'created_at',
      label: t('table.created_at'),
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: 'qty',
      label: t('table.qty'),
      options: {
        filter: false,
        sort: false,
      },
    },
  ];
};

export class OrderTable extends Component<Props, State> {
  state = {
    orders: [],
    loading: true,
    count: 0,
    tableState: {
      page: 1,
    },
  };

  fetchPage = (page: number) => {
    if (this.state.tableState.page !== this.state.tableState.page) {
      this.doFetch(page);
    }
  };

  doFetch = (page) => {
    this.props
      .fetch(page)
      .then((response) => {
        this.setState((prevState) => ({
          orders: response.data.results,
          count: response.data.count,
          loading: false,
          tableState: {
            ...prevState.tableState,
            page,
          },
        }));
      })
      .catch((err) => {
        console.error(err);
        this.setState({ loading: false });
      });
  };

  componentDidMount() {
    this.doFetch(1);
  }

  onRowClick = (rowData: *, { rowIndex }: { rowIndex: number }) => {
    this.props.onOrderClick(this.state.orders[rowIndex].id);
  };

  render() {
    const options = {
      onRowClick: this.onRowClick,
      serverSide: true,
      rowsPerPage: ORDER_PER_PAGE,
      rowsPerPageOptions: [ORDER_PER_PAGE],
      loading: this.state.loading,
      count: this.state.count,
      tableState: this.state.tableState,
      filter: false,
      search: false,
      sort: false,
      responsive: 'scroll',
      selectableRows: false,
      download: false,
      print: false,
      viewColumns: false,
      downloadOptions: {
        filename: 'orders.csv',
        separator: ',',
      },
      textLabels: {
        body: {
          noMatch: this.state.loading ? (
            <CircularProgress />
          ) : (
            'Sorry, there is no order data to display'
          ),
        },
      },
      onTableChange: (action, tableState) => {
        this.fetchPage(tableState.page + 1);
      },
    };
    return (
      <MUIDataTable
        data={renderRows(this.state.orders, this.props.t)}
        columns={getColumnData(this.props.t)}
        options={options}
        title={this.props.title}
      />
    );
  }
}

export default withTranslation(['order'])(OrderTable);
