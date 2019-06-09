// @flow

import MUIDataTable from 'mui-datatables';
import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import Button from '@material-ui/core/Button';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';

import type { TFunction } from 'react-i18next';
import { formatAsDate } from '../../datetime';

const MEMBER_PER_PAGE = 50;

const renderRows = (members, t, goToMember) => {
  return members.map((member) => renderRow(member, t, goToMember));
};
const getColumnData = (t) => {
  return [
    {
      name: 'name',
      label: t('common.name'),
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: 'date_joined',
      label: t('member.date_joined'),
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: 'credit_account_balance',
      label: t('member.creditAccountBalance'),
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: 'actions',
      label: t('member.row.headers.actions'),
      options: {
        filter: false,
        sort: false,
      },
    },
  ];
};

const renderCreditAccountBalance = (credit_account_balance: number) => (
  <Typography color={credit_account_balance >= 0 ? 'primary' : 'error'}>
    {credit_account_balance.toFixed(2)} €
  </Typography>
);

const renderActions = (id, goToMemberPage, t) => (
  <Button onClick={() => goToMemberPage(id)} color="primary">
    {t('common.show')}
  </Button>
);
const renderRow = (member, t, goToMemberPage) => {
  const { credit_account_balance, date_joined, name, id } = member;
  return {
    name,
    date_joined: formatAsDate(date_joined),
    credit_account_balance: renderCreditAccountBalance(credit_account_balance),
    actions: renderActions(id, goToMemberPage, t),
  };
};

type Props = {
  t: TFunction,
  classes: Object,
  fetch: ({ page: number, page_size: number }) => void,
  goToMember: (id: number) => void,
  addMember: () => void,
  tagsExcluded: Array<Tag>,
  tagsIncluded: Array<Tag>,
  customToolBar: () => any,
};

type State = {
  members: Array<Member>,
  loading: boolean,
  count: number,
  tableState: { page: number },
};

export class InvoiceTable extends Component<Props, State> {
  state = {
    members: [],
    loading: true,
    count: 0,
    tableState: {
      page: 1,
    },
  };

  fetchMemberPage = (page: number) => {
    this.props
      .fetch({
        page,
        page_size: MEMBER_PER_PAGE,
        tags_included: this.props.tagsIncluded,
        tags_excluded: this.props.tagsExcluded,
      })
      .then((response) => {
        this.setState((prevState) => ({
          members: response.data.results,
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
    this.fetchMemberPage(1, MEMBER_PER_PAGE);
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.tagsIncluded !== this.props.tagsIncluded ||
      prevProps.tagsExcluded !== this.props.tagsExcluded
    ) {
      this.setState({ loading: true });
      this.fetchMemberPage(1);
    }
  }

  refreshPage = (id: number) => {
    this.setState((prevState) => ({
      processing: [...prevState.processing, id],
    }));
    this.fetchMemberPage(this.state.tableState.page, MEMBER_PER_PAGE);
  };

  onRowClick = (rowData, { rowIndex }) => {
    this.props.goToMember(this.state.members[rowIndex].id);
  };

  render() {
    const { t } = this.props;
    const { loading } = this.state;
    const options = {
      onRowClick: this.onRowClick,
      serverSide: true,
      rowsPerPage: MEMBER_PER_PAGE,
      rowsPerPageOptions: [MEMBER_PER_PAGE],
      loading,
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
        filename: 'members.csv',
        separator: ',',
      },
      textLabels: {
        body: {
          noMatch: loading ? (
            <CircularProgress />
          ) : (
            'Sorry, there is no member data to display'
          ),
        },
      },
      onTableChange: (action, tableState) => {
        this.fetchMemberPage(tableState.page + 1);
      },
      customToolbar: this.props.customToolBar,
      customFooter: (
        count,
        page,
        rowsPerPage,
        changeRowsPerPage,
        changePage,
      ) => (
        <TableFooter>
          <TableRow>
            <div className={this.props.classes.footerContainer}>
              <Button
                onClick={this.props.addMember}
                color="primary"
                variant="outlined"
              >
                <AddIcon className={this.props.classes.leftIcon} />
                {t('member.addMember')}
              </Button>
              <TablePagination
                count={count}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={(_, page_) => changePage(page_)}
                onChangeRowsPerPage={(event) =>
                  changeRowsPerPage(event.target.value)
                }
                rowsPerPageOptions={[10, 15, 100]}
              />
            </div>
          </TableRow>
        </TableFooter>
      ),
    };

    return (
      <MUIDataTable
        data={renderRows(this.state.members, t, this.props.goToMember)}
        columns={getColumnData(t)}
        options={options}
      />
    );
  }
}

const styles = (theme) => ({
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  footerContainer: {
    justifyContent: 'space-between',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing.unit,
  },
});

export default compose(
  withStyles(styles),
  withNamespaces(),
)(InvoiceTable);
