// @flow
import React, { Component } from 'react';

import MUIDataTable from 'mui-datatables';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import AddIcon from '@material-ui/icons/Add';
import RedButton from '../../../components/button/RedButton.component';

import { formatAsDate } from '../../../datetime';
import type { Subscription } from '../types';

const BILLING_PLAN_STATUS_HAS_STARTED = 2;
const BILLING_PLAN_STATUS_HAS_STOPPED = 3;
const BILLING_PLAN_STATUS_HAS_ENDED = 4;

const getStatus = (status, t) => {
  if (status === BILLING_PLAN_STATUS_HAS_STARTED) return t('status.hasStarted');
  if (status === BILLING_PLAN_STATUS_HAS_ENDED) return t('status.hasEnded');
  if (status === BILLING_PLAN_STATUS_HAS_STOPPED) return t('status.hasStopped');
  return t('status.hasNotStartedYet');
};
const renderRows = (subscriptions, t) => {
  return subscriptions.map((sub) => ({
    key: sub.id,
    member: sub.memberName,
    name: sub.name,
    nb_interval: parseInt(sub.nb_interval, 10),
    first_billing_date: formatAsDate(sub.first_billing_date),
    status: getStatus(sub.status, t),
    recurrent_price: `${parseFloat(sub.recurrent_price).toFixed(2)}  €`,
    paymentMethodInfo: {
      id: sub.payment_method,
      subscriptionId: sub.id,
      hasEnded: sub.has_ended || !!sub.canceled_at,
    },
  }));
};

const getColumnData = (
  t: TFunction,
  showOnlyCoreColumns: boolean,
  addPayment,
) => {
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
      name: 'status',
      label: t('parameters.status'),
    },
    {
      name: 'nb_interval',
      label: t('parameters.nbInterval'),
    },
    {
      name: 'recurrent_price',
      label: t('parameters.recurrent_price'),
    },
    {
      name: 'paymentMethodInfo',
      label: t('parameters.payment_method.label'),
      options: {
        customBodyRender: (value) => {
          if (value.id === 2) {
            return (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  '&>*': { marginRight: 8 },
                }}
              >
                {addPayment && !value.hasEnded ? (
                  <RedButton
                    variant="outlined"
                    onClick={(ev) => {
                      ev.stopPropagation();
                      addPayment(value.subscriptionId);
                    }}
                  >
                    <AddIcon />
                    {t(`parameters.payment_method.${value.id}`)}
                  </RedButton>
                ) : (
                  t(`parameters.payment_method.${value.id}`)
                )}
              </div>
            );
          }
          return 'Paiement en ligne';
        },
      },
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

  addPayment: (id: number) => void,
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

  handlePageChange = (newPage: number) => {
    if (newPage !== this.state.tableState.page) {
      this.props.onPageChange(newPage);
    }
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
      count: this.props.count,
      tableState: this.state.tableState,
      onTableChange: (action, tableState) => {
        const ordering = tableState.columns.reduce((acc, v) => {
          if (v.sortDirection === 'asc') {
            return v.name;
          }
          if (v.sortDirection === 'desc') {
            return `-${v.name}`;
          }
          return acc;
        }, '');
        this.handlePageChange(tableState.page + 1, { ordering });
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
        data={
          this.props.loading
            ? []
            : renderRows(this.props.subscriptionList, this.props.t)
        }
        columns={getColumnData(
          this.props.t,
          !!this.props.showOnlyCore,
          this.props.addPayment,
        )}
        options={options}
      />
    );
  }
}

export default withTranslation(['subscription'])(SubscriptionTable);
