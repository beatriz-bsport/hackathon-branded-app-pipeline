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
import isEqual from 'lodash/isEqual';

import { withTranslation, TFunction } from 'react-i18next';
import ButtonBase from '@material-ui/core/ButtonBase';
import CircularProgress from '@material-ui/core/CircularProgress';

import type { Recipient } from '../types';
import { formatAsDatetimeAdapted } from '../../../utils/datetime';

const renderRows = (recipientList, t, setShowLinkOpened) => {
  return recipientList.map((r) => renderRow(r, t, setShowLinkOpened));
};
const getColumnData = (t) => {
  return [
    {
      name: 'recipient_raw_address',
      label: t('recipient.table.columns.email'),
      options: {
        sort: false,
      },
    },
    {
      name: 'read_count',
      label: t('recipient.table.columns.readCount'),
      options: {
        sort: false,
      },
    },
    {
      name: 'last_read',
      label: t('recipient.table.columns.lastRead'),
      options: {
        sort: false,
      },
    },
    {
      name: 'links_opened_count',
      label: t('recipient.table.columns.clicked'),
      options: {
        sort: false,
      },
    },
    {
      name: 'status',
      label: t('recipient.table.columns.status'),
      options: {
        sort: false,
      },
    },
  ];
};

const renderRow = (recipient, t, setShowLinkOpened) => {
  return {
    recipient_raw_address: recipient.email,
    read_count: recipient.read_count,
    last_read: recipient.last_read
      ? formatAsDatetimeAdapted(
          recipient.last_read,
          'DDDD t',
          '',
          typeof recipient.last_read === 'number',
        )
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
  goToMember?: (id: number) => void,
  setShowLinkOpened: (data: { [link: string]: number }) => void,
  showLinkOpened: { [link: string]: number },
};

export class RecipientTable extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchRecipientList(1, { ordering: '' });
  }

  fetchRecipientList = (page, params) => {
    const isTryingToLoadSamePage = page === this.props.recipientState.page;
    const hasDifferentParamsThanBefore = !isEqual(
      params,
      this.props.recipientState.params,
    );
    if (!isTryingToLoadSamePage || hasDifferentParamsThanBefore) {
      this.props.fetchRecipientList(page, params);
    }
  };

  onRowClick = (rowData, { rowIndex }) => {
    // We don't want to go to member for franchise campaigns
    if (this.props.goToMember) {
      this.props.goToMember(this.props.recipientList[rowIndex].member);
    }
  };

  render() {
    const { t, recipientState } = this.props;
    const { page, loading, count, error } = recipientState;
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
          noMatch: loading && !error ? <CircularProgress /> : 'No recipient',
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
        if (!error) this.fetchRecipientList(tableState.page + 1, { ordering });
      },
    };
    return (
      <div>
        <MUIDataTable
          columns={getColumnData(t)}
          data={renderRows(
            this.props.recipientList,
            t,
            this.props.setShowLinkOpened,
          )}
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
  React.memo,
)(RecipientTable);
