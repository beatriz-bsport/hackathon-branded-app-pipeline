import React, { Component } from 'react';

import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import MUIDataTable from 'mui-datatables';
import { withTranslation, WithTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import {
  ORDER_STATE_CANCELLED,
  ORDER_STATE_ONSITEDELIVERY,
} from '@bsport/common/lib/master-data/order-states';
import type { OrderWithProducts } from '#src/libs/order/types';
import { formatAsDatetime } from '../../../utils/datetime';

type Props = {
  title: string;
  onOrderClick: (id: string) => void;
  orders: OrderWithProducts<number>[];
  loading: boolean;
  count: number | null;
  onChange: any;
} & WithTranslation;

type State = {
  tableState: { page: number };
};

export const ORDER_PER_PAGE = 50;

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
    member_archived,
  } = order;
  return {
    name: (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Typography>
          {first_name || ''} {last_name || ''}
        </Typography>
        {member_archived && (
          <Typography color="secondary" variant="caption">
            {`${'\u00A0'}(${t('member:archived')})`}
          </Typography>
        )}
      </div>
    ),
    updated_at: formatAsDatetime(updated_at),
    created_at: formatAsDatetime(created_at),
    state: renderState(state, t),
    qty: product_lines.reduce((acc, v) => acc + v.quantity, 0),
  };
};

const renderState = (state: number, t: TFunction) => {
  let color: 'primary' | 'secondary' | 'error' = 'primary';
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
    tableState: {
      page: 1,
    },
  };

  componentDidMount() {
    this.props.onChange(1);
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevState.tableState !== this.state.tableState) {
      this.props.onChange(this.state.tableState.page);
    }
  }

  handlePageChange = (newPage: number) => {
    if (newPage !== this.state.tableState.page) {
      this.setState((prevState) => ({
        tableState: { ...prevState.tableState, page: newPage },
      }));
    }
  };

  onRowClick = (rowData: any, { rowIndex }: { rowIndex: number }) => {
    this.props.onOrderClick(this.props.orders[rowIndex].id);
  };

  render() {
    const options = {
      onRowClick: this.onRowClick,
      serverSide: true,
      rowsPerPage: ORDER_PER_PAGE,
      rowsPerPageOptions: [ORDER_PER_PAGE],
      loading: this.props.loading,
      count: this.props.count,
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
          noMatch: this.props.loading ? (
            <CircularProgress />
          ) : (
            'Sorry, there is no order data to display'
          ),
        },
      },
      // @ts-expect-error
      onTableChange: (action, tableState: { page: number }) => {
        this.handlePageChange(tableState.page + 1);
      },
    };
    return (
      <MUIDataTable
        columns={getColumnData(this.props.t)}
        data={renderRows(this.props.orders, this.props.t)}
        // @ts-expect-error
        options={options}
        title={this.props.title}
      />
    );
  }
}

export default withTranslation(['order'])(OrderTable);
