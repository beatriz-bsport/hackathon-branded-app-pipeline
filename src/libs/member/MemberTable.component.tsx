import React, { PureComponent, JSX } from 'react';
import MUIDataTable, {
  MUIDataTableState,
  Responsive,
  SelectableRows,
} from 'mui-datatables';
import { withTranslation, WithTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import Button from '@material-ui/core/Button';
import TableRow from '@material-ui/core/TableRow';
import LinearProgress from '@material-ui/core/LinearProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';
import { Theme, WithStyles } from '@material-ui/core';
import { AxiosResponse } from 'axios';
import { getCurrencyDisplayWithPrice } from '../theme/selectors';
import { formatAsDate } from '../../utils/datetime';

import type { MemberMinimal } from '#libs/member/types';
import type { Tag } from '#libs/tag/types';
import type { GenericPaginationResults } from '#libs/types';

const MEMBER_PER_PAGE = 50;

const renderRows = (
  members: MemberMinimal[],
  t: TFunction,
  goToMember: (id: number) => void,
  interrogateMemberStatus: (id: number) => void,
) => {
  return members.map((member) =>
    renderRow(member, t, goToMember, interrogateMemberStatus),
  );
};
const getColumnData = (t: TFunction) => {
  return [
    {
      name: 'name',
      label: t('name'),
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: 'date_joined',
      label: t('date_joined'),
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: 'credit_account_balance',
      label: t('creditAccountBalance'),
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: 'accept_email',
      label: t('row.headers.newsletter_email'),
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: 'actions',
      label: t('row.headers.actions'),
      options: {
        filter: false,
        sort: false,
      },
    },
  ];
};

const renderCreditAccountBalance = (credit_account_balance: number) => (
  <Typography color={credit_account_balance >= 0 ? 'primary' : 'error'}>
    {`${getCurrencyDisplayWithPrice(credit_account_balance.toFixed(2))}`}
  </Typography>
);

const renderActions = (
  id: number,
  goToMemberPage: (id: number) => void,
  interrogateMemberStatus: (id: number) => void,
) => (
  <>
    <IconButton color="primary" onClick={() => goToMemberPage(id)}>
      <VisibilityIcon />
    </IconButton>
    {interrogateMemberStatus && (
      <IconButton
        color="primary"
        onClick={(e) => {
          e.stopPropagation();
          interrogateMemberStatus(id);
        }}
      >
        <DeleteIcon />
      </IconButton>
    )}
  </>
);
const renderRow = (
  member: MemberMinimal,
  t: TFunction,
  goToMemberPage: (id: number) => void,
  interrogateMemberStatus: (id: number) => void,
) => {
  const { credit_account_balance, date_joined, name, id, accept_email } =
    member;
  return {
    name,
    date_joined: formatAsDate(date_joined),
    credit_account_balance: renderCreditAccountBalance(credit_account_balance),
    actions: renderActions(id, goToMemberPage, interrogateMemberStatus),
    accept_email: (
      <Typography color={accept_email ? 'primary' : 'error'}>
        {accept_email ? t('row.yes') : t('row.no')}
      </Typography>
    ),
  };
};

type OwnProps = {
  fetch: ({
    page,
    page_size,
    tags_included,
    tags_excluded,
    exclude_archived,
    email_confirmed,
  }: {
    page: number;
    page_size: number;
    tags_included?: Array<Tag['id']>;
    tags_excluded?: Array<Tag['id']>;
    exclude_archived?: boolean;
    email_confirmed?: boolean;
  }) => Promise<AxiosResponse<GenericPaginationResults<MemberMinimal>>>;
  goToMember: (id: number) => void;
  addMember?: () => void;
  tagsExcluded?: Array<Tag['id']>;
  tagsIncluded?: Array<Tag['id']>;
  customToolBar?: () => JSX.Element;
  onValueChangeActiveMemberFetch?: boolean;
  hideAddButton: boolean;
  interrogateMemberStatus?: (id: number) => void;
  disabledMemberId?: Array<number>;
  noDataText?: string;
};

type Props = OwnProps & WithTranslation & WithStyles;

type State = {
  members: Array<MemberMinimal>;
  loading: boolean;
  count: number;
  tableState: { page: number };
  memberPerPage: number;
};

export class MemberTable extends PureComponent<Props, State> {
  state = {
    members: [] as Array<MemberMinimal>,
    loading: false,
    count: 0,
    tableState: {
      page: 0,
    },
    memberPerPage: MEMBER_PER_PAGE,
  };

  fetchMemberPage = (page: number, force?: boolean) => {
    if ((force || page !== this.state.tableState.page) && !this.state.loading) {
      this.setState({ loading: true });
      this.props
        .fetch({
          page,
          page_size: this.state.memberPerPage,
          tags_included: this.props.tagsIncluded,
          tags_excluded: this.props.tagsExcluded,
          exclude_archived: true,
          email_confirmed: true,
        })
        .then((response) => {
          this.setState((prevState) => ({
            members:
              response.data.results?.filter((member) => !member.is_pos) ?? [],
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
    }
  };

  componentDidMount() {
    this.fetchMemberPage(1);
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.tagsIncluded !== this.props.tagsIncluded ||
      prevProps.tagsExcluded !== this.props.tagsExcluded ||
      prevProps.onValueChangeActiveMemberFetch !==
        this.props.onValueChangeActiveMemberFetch
    ) {
      this.fetchMemberPage(1, true);
      this.setState({ loading: true });
    }
  }

  refreshForce = () => {
    this.fetchMemberPage(1, true);
  };

  onRowClick = (rowData: string[], { rowIndex }: { rowIndex: number }) => {
    this.props.goToMember(this.state.members[rowIndex].id);
  };

  render() {
    const { t } = this.props;
    const { loading } = this.state;
    const noMember = this.props.noDataText
      ? this.props.noDataText
      : t('noMember');
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
      responsive: 'scroll' as Responsive,
      selectableRows: 'none' as SelectableRows,
      download: false,
      print: false,
      viewColumns: false,
      downloadOptions: {
        filename: 'members.csv',
        separator: ',',
      },
      textLabels: {
        body: {
          noMatch: loading ? null : noMember,
        },
      },
      onTableChange: (action: string, tableState: MUIDataTableState) => {
        this.fetchMemberPage(tableState.page + 1);
      },
      customToolbar: this.props.customToolBar,
      customFooter: (
        count: number,
        page: number,
        rowsPerPage: number,
        changeRowsPerPage: (rows: number) => void,
        changePage: (page: number) => void,
      ) => (
        <React.Fragment>
          {!!this.state.loading && <LinearProgress style={{ width: '100%' }} />}
          <TableFooter>
            <TableRow>
              <div className={this.props.classes.footerContainer}>
                {this.props.hideAddButton ? (
                  <div />
                ) : (
                  <Button
                    color="primary"
                    onClick={this.props.addMember}
                    variant="contained"
                  >
                    <AddIcon className={this.props.classes.leftIcon} />
                    {t('addMember')}
                  </Button>
                )}
                <TablePagination
                  count={count}
                  onPageChange={(_, page_) => changePage(page_)}
                  onRowsPerPageChange={(event) => {
                    this.setState(
                      { memberPerPage: parseInt(event.target.value) },
                      this.refreshForce,
                    );
                    changeRowsPerPage(parseInt(event.target.value));
                  }}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  rowsPerPageOptions={[10, 15, MEMBER_PER_PAGE, 100]}
                />
              </div>
            </TableRow>
          </TableFooter>
        </React.Fragment>
      ),
    };

    return (
      <MUIDataTable
        columns={getColumnData(t)}
        data={renderRows(
          this.state.members?.filter(
            (mem) => !this.props.disabledMemberId?.includes(mem.id),
          ),
          t,
          this.props.goToMember,
          this.props.interrogateMemberStatus,
        )}
        options={options}
        title=""
      />
    );
  }
}

const styles = (theme: Theme) => ({
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  footerContainer: {
    justifyContent: 'space-between',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(2),
  },
});

export default compose<Props, OwnProps>(
  withStyles(styles),
  withTranslation(['member']),
)(MemberTable);
