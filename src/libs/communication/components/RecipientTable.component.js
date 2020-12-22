// @flow
import React from 'react';
import { compose, withState } from 'recompose';
import MUIDataTable from 'mui-datatables';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import ButtonBase from '@material-ui/core/ButtonBase';
import moment from 'moment-timezone';
import CircularProgress from '@material-ui/core/CircularProgress';

import type { Recipient } from '../types';

const renderRows = (recipientList, t, goToMember, setShowLinkOpened) => {
  return recipientList.map((r) =>
    renderRow(r, t, goToMember, setShowLinkOpened),
  );
};
const getColumnData = (t) => {
  return [
    {
      name: 'email',
      label: t('recipient.table.columns.email'),
      options: {
        sort: true,
      },
    },
    {
      name: 'read_count',
      label: t('recipient.table.columns.readCount'),
      options: {
        sort: true,
      },
    },
    {
      name: 'last_read',
      label: t('recipient.table.columns.lastRead'),
      options: {
        sort: true,
      },
    },
    {
      name: 'links_opened_count',
      label: t('recipient.table.columns.clicked'),
      options: {
        sort: true,
      },
    },
    {
      name: 'status',
      label: t('recipient.table.columns.status'),
      options: {
        sort: true,
      },
    },
  ];
};

const renderRow = (recipient, t, goToMemberPage, setShowLinkOpened) => {
  return {
    email: recipient.email,
    read_count: recipient.read_count,
    last_read: recipient.last_read
      ? moment(recipient.last_read).format('LLLL')
      : ' - ',
    links_opened_count: recipient.links_opened_count ? (
      <ButtonBase onClick={() => setShowLinkOpened(recipient.links_opened)}>
        <Typography color="primary">{recipient.links_opened_count}</Typography>
      </ButtonBase>
    ) : (
      0
    ),
    status: t(`recipient.status.${recipient.status}`),
  };
};

type Props = {
  t: TFunction,
  fetchRecipientList: (page: number) => void,
  recipientState: Object,
  recipientList: Array<Recipient>,
  goToMember: (id: number) => void,
  setShowLinkOpened: ({ [link: string]: number }) => void,
  showLinkOpened: { [link: string]: number },
};

export class RecipientTable extends React.Component<Props> {
  componentDidMount() {
    this.fetchRecipientList(1);
  }

  fetchRecipientList = (page) => {
    if (
      page !== this.props.recipientState.page &&
      !this.props.recipientState.loading
    ) {
      this.props.fetchRecipientList(page);
    }
  };

  onRowClick = (rowData, { rowIndex }) => {
    this.props.goToMember(this.props.recipientList[rowIndex].member);
  };

  render() {
    const { t, recipientState } = this.props;
    const { loading, count, page } = recipientState;
    const options = {
      onRowClick: this.onRowClick,
      serverSide: true,
      rowsPerPage: 15,
      rowsPerPageOptions: [15],
      loading,
      count,
      tableState: { page },
      filter: false,
      search: false,
      sort: true,
      responsive: 'scroll',
      selectableRows: false,
      download: false,
      print: false,
      viewColumns: false,
      textLabels: {
        body: {
          noMatch: loading ? <CircularProgress /> : 'No recipient',
        },
      },
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
        this.fetchRecipientList(tableState.page + 1, { ordering });
      },
    };

    return (
      <div>
        <MUIDataTable
          data={renderRows(
            this.props.recipientList,
            t,
            this.props.goToMember,
            this.props.setShowLinkOpened,
          )}
          columns={getColumnData(t)}
          options={options}
        />
        <Dialog open={!!this.props.showLinkOpened}>
          <DialogContent>
            {(this.props.showLinkOpened || '').split(' // ').map((l, idx) => (
              <ListItem key={l + idx}>
                <ListItemText primary={l} />
              </ListItem>
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.props.setShowLinkOpened(null)}>
              {this.props.t('common.close')}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default compose(
  withTranslation(['communication']),
  withState('showLinkOpened', 'setShowLinkOpened', null),
)(RecipientTable);
