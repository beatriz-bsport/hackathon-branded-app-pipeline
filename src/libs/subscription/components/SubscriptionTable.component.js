// @flow
import React, { Component } from 'react';

import MUIDataTable from 'mui-datatables';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import RedButton from '../../../components/button/RedButton.component';

import { formatAsDate } from '../../../utils/datetime';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import type { Subscription } from '../types';
import { getStatus } from '../utils';

const renderRows = (subscriptions, t) => {
  return subscriptions.map((sub) => ({
    key: sub.id,
    member: renderMemberName(
      {
        memberName: sub.memberName,
        memberArchived: sub.memberArchived,
      },
      t,
    ),
    name: sub.name,
    nb_interval: parseInt(sub.nb_interval, 10),
    first_billing_date: formatAsDate(sub.first_billing_date),
    status: getStatus(sub.status, t),
    recurrent_price: `${getCurrencyDisplayWithPrice(
      parseFloat(sub.recurrent_price).toFixed(2),
    )}`,
    paymentMethodInfo: {
      id: sub.payment_method,
      subscriptionId: sub.id,
      hasEnded: sub.has_ended || !!sub.canceled_at,
      is_v2: sub.is_v2,
      payment_method_identifier: sub.payment_method_identifier,
    },
  }));
};

const renderMemberName = (
  {
    memberName,
    memberArchived,
  }: {
    memberName: string,
    memberArchived: string,
  },
  t: TFunction,
) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Typography>{memberName || ''}</Typography>
      {memberArchived && (
        <Typography variant="caption" color="secondary">
          {`${'\u00A0'}(${t('member:archived')})`}
        </Typography>
      )}
    </div>
  );
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
                    {t(
                      `parameters.payment_method_group.${value.payment_method_identifier}`,
                    )}
                  </RedButton>
                ) : (
                  t(
                    `parameters.payment_method_group.${value.payment_method_identifier}`,
                  )
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

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevState.tableState.page !== this.state.tableState.page) {
      this.props.onPageChange(this.state.tableState.page);
    }
  }

  handlePageChange = (newPage: number) => {
    if (newPage !== this.state.tableState.page) {
      this.setState((prevState) => ({
        ...prevState,
        tableState: { ...prevState.tableState, page: newPage },
      }));
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
