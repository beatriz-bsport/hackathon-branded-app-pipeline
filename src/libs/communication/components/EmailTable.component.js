// @flow

import MUIDataTable from 'mui-datatables';
import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import Typography from '@material-ui/core/Typography';

import type { TFunction } from 'react-i18next';
import { formatAsDatetime } from '../../../datetime';
import type { EmailContact } from '../types';

const CONTACT_PER_PAGE = 15;

const renderRows = (
  contacts, // , t, goToContact) =>
) => contacts.map((c) => renderRow(c)); // , t, goToContact));

const getColumnData = (t) => {
  return [
    {
      name: 'name',
      label: t('table.columns.member'),
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: 'title',
      label: t('table.columns.title'),
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: 'date_created',
      label: t('table.columns.date_created'),
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: 'status',
      label: t('table.columns.status'),
      options: {
        filter: false,
        sort: false,
      },
    },
  ];
};

// TODO
const renderStatus = (status) => (
  <Typography>{JSON.stringify(status)}</Typography>
);

const renderRow = (
  contact,
  // t: TFunction,
  // goToContact: (id: number) => void,
) => {
  const { member, date_created, data } = contact;
  return {
    name: member.name,
    date_created: formatAsDatetime(date_created),
    title: `${(data.body || '').slice(0, 20)}...`,
    status: renderStatus(data.status),
  };
};

type Props = {
  t: TFunction,
  fetch: ({ page: number, page_size: number }) => void,
  goToContact: (id: number) => void,
  loading: boolean,
  page: number,
  count: number,
  contacts: Array<EmailContact>,
};

export class InvoiceTable extends Component<Props> {
  fetchContactPage = (page: number) => {
    this.props.fetch({
      page,
      page_size: CONTACT_PER_PAGE,
    });
  };

  componentDidMount() {
    this.fetchContactPage(1);
  }

  onRowClick = (rowData: any, { rowIndex }: { rowIndex: number }) => {
    this.props.goToContact(this.props.contacts[rowIndex].member.id);
  };

  render() {
    const { t, loading } = this.props;
    const options = {
      onRowClick: this.onRowClick,
      serverSide: true,
      rowsPerPage: CONTACT_PER_PAGE,
      rowsPerPageOptions: [CONTACT_PER_PAGE],
      loading,
      count: this.props.count,
      tableState: { page: this.props.page },
      filter: false,
      search: false,
      sort: false,
      responsive: 'scroll',
      selectableRows: false,
      download: false,
      print: false,
      viewColumns: false,
      textLabels: {
        body: {
          noMatch: loading ? <CircularProgress /> : 'No data to display',
        },
      },
      onTableChange: (action, tableState) => {
        this.fetchContactPage(tableState.page + 1);
      },
    };

    return (
      <MUIDataTable
        data={renderRows(this.props.contacts)}
        columns={getColumnData(t)}
        options={options}
        title={
          <Typography variant="title">
            {this.props.loading && (
              <CircularProgress
                size={24}
                style={{ marginLeft: 15, position: 'relative', top: 4 }}
              />
            )}
          </Typography>
        }
      />
    );
  }
}

const styles = () => ({});

export default compose(
  withStyles(styles),
  withNamespaces(['communication']),
)(InvoiceTable);
