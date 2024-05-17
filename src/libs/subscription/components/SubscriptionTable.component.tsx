import React, { Component } from 'react';

import MUIDataTable from 'mui-datatables';
import CircularProgress from '@material-ui/core/CircularProgress';
import { TFunction } from 'i18next';

import { withTranslation, WithTranslation } from 'react-i18next';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import { compose } from 'recompose';
import RedButton from '../../../components/button/RedButton.component';
import ObjectLevelPermissionProviderComponent from '#libs/role/permission-utils/ObjectLevelPermissionProvider.component';

import { formatAsDate } from '../../../utils/datetime';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import type { Subscription, SubscriptionQueryParams } from '../types';

const ITEMS_PER_PAGE = 10;

const renderRows = (subscriptions: Array<Subscription>, t: TFunction) => {
  return subscriptions.map((sub) => ({
    key: sub.id,
    member: renderMemberName(
      {
        memberName: sub.memberName,
        // @ts-expect-error
        memberArchived: sub.memberArchived,
      },
      t,
    ),
    name: sub.name,
    // @ts-expect-error
    nb_interval: parseInt(sub.nb_interval, 10),
    first_billing_date: formatAsDate(sub.first_billing_date),
    status: t(`billing_plan_status.${sub.status}`),
    recurrent_price: `${getCurrencyDisplayWithPrice(
      // @ts-expect-error
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
    memberName: string;
    memberArchived: string;
  },
  t: TFunction,
) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Typography>{memberName || ''}</Typography>
      {memberArchived && (
        <Typography color="secondary" variant="caption">
          {`${'\u00A0'}(${t('member:archived')})`}
        </Typography>
      )}
    </div>
  );
};

const getColumnData = (
  t: TFunction,
  showOnlyCoreColumns: boolean,
  addPayment: (id: number) => void,
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
        customBodyRender: (value: any) => {
          if (value.id === 2) {
            return (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  // @ts-expect-error
                  '&>*': { marginRight: 8 },
                }}
              >
                {addPayment && !value.hasEnded ? (
                  <RedButton
                    onClick={(
                      ev: React.MouseEvent<HTMLLIElement, MouseEvent>,
                    ) => {
                      ev.stopPropagation();
                      addPayment(value.subscriptionId);
                    }}
                    variant="outlined"
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
          return t('parameters.payment_method.paymentOnline');
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

type OwnProps = {
  showOnlyCore?: boolean;
  title?: string;
  onPageChange: (params: SubscriptionQueryParams) => void;
  goToSubscription: (id: number) => void;
  subscriptionList: Array<Subscription>;
  loading: boolean;

  addPayment?: (id: number) => void;
  count: number;
};

type Props = OwnProps & WithTranslation;

type State = {
  tableState: SubscriptionQueryParams;
};

export class SubscriptionTable extends Component<Props, State> {
  onRowClick = (rowData: Array<any>, { rowIndex }: { rowIndex: number }) => {
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
      page_size: ITEMS_PER_PAGE,
    },
  };

  componentDidMount() {
    this.props.onPageChange({ page: 1 });
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevState.tableState !== this.state.tableState) {
      this.props.onPageChange(this.state.tableState);
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

  handleRowsPerPageChange = (newRowsPerPage: number) => {
    if (newRowsPerPage !== this.state.tableState.page_size) {
      this.setState((prevState) => ({
        ...prevState,
        tableState: { ...prevState.tableState, page_size: newRowsPerPage },
      }));
    }
  };

  render() {
    const options = {
      onRowClick: this.onRowClick,
      serverSide: true,
      filter: false,
      search: false,
      sort: false,
      download: false,
      responsive: 'scroll',
      selectableRows: false,
      count: this.props.count,
      tableState: this.state.tableState,
      onChangeRowsPerPage: (rows: number) => {
        this.handleRowsPerPageChange(rows);
      },
      // @ts-expect-error
      onTableChange: (action, tableState: SubscriptionQueryParams) => {
        this.handlePageChange(tableState.page + 1);
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
      <ObjectLevelPermissionProviderComponent requiredPermission="export.allowed_actions.subscription">
        {(hasPermission) => (
          <MUIDataTable
            columns={getColumnData(
              this.props.t,
              !!this.props.showOnlyCore,
              this.props.addPayment,
            )}
            data={
              this.props.loading
                ? []
                : renderRows(this.props.subscriptionList, this.props.t)
            }
            // @ts-expect-error
            options={{ ...options, print: hasPermission }}
            title={this.props.title}
          />
        )}
      </ObjectLevelPermissionProviderComponent>
    );
  }
}

export default compose<any, Props>(withTranslation(['subscription']))(
  SubscriptionTable,
);
