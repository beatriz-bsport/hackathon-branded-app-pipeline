import React, { PureComponent, JSX } from 'react';
import { compose } from 'recompose';
import type { TFunction } from 'i18next';
import type { AxiosResponse } from 'axios';

import MUIDataTable, {
  MUIDataTableState,
  Responsive,
  SelectableRows,
} from 'mui-datatables';
import { withTranslation, WithTranslation } from 'react-i18next';

import type { Theme, WithStyles } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import VisibilityIcon from '@material-ui/icons/Visibility';
import withStyles from '@material-ui/core/styles/withStyles';

import { formatAsDate } from '#utils/datetime';
import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';
import ObjectLevelPermissionProvider from '#libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import ObjectLevelPermissionWrapper from '#libs/role/permission-utils/ObjectLevelPermissionWrapper.component';

import type { MemberMinimal } from '#libs/member/types';
import type { Tag } from '#libs/tag/types';
import type { GenericPaginationResults } from '#libs/types';

const MEMBER_PER_PAGE = 50;

type MemberRowActionsProps = {
  id: number;
  interrogateMemberStatus: (id: number) => void;
  goToMemberPage?: (id: number) => void;
};
const MemberRowActions: React.FC<MemberRowActionsProps> = React.memo(
  ({ id, interrogateMemberStatus, goToMemberPage }) => {
    const handleGoToMemberPage = React.useCallback(
      () => goToMemberPage?.(id),
      [goToMemberPage, id],
    );
    const handleInterrogateMemberStatus = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        interrogateMemberStatus?.(id);
      },
      [interrogateMemberStatus, id],
    );

    return (
      <>
        <ObjectLevelPermissionWrapper
          forcedBehavior="disabled"
          requiredPermission="member.allowed_actions.accessProfile"
        >
          <IconButton color="primary" onClick={handleGoToMemberPage}>
            <VisibilityIcon />
          </IconButton>
        </ObjectLevelPermissionWrapper>
        {!!interrogateMemberStatus && (
          <ObjectLevelPermissionWrapper
            forcedBehavior="hidden"
            requiredPermission="member.allowed_actions.delete"
          >
            <IconButton color="primary" onClick={handleInterrogateMemberStatus}>
              <DeleteIcon />
            </IconButton>
          </ObjectLevelPermissionWrapper>
        )}
      </>
    );
  },
);

type CreditAccountBalanceProps = { credit_account_balance: number };
const CreditAccountBalance: React.FC<CreditAccountBalanceProps> = React.memo(
  ({ credit_account_balance }) => (
    <Typography color={credit_account_balance >= 0 ? 'primary' : 'error'}>
      {`${getCurrencyDisplayWithPrice(credit_account_balance.toFixed(2))}`}
    </Typography>
  ),
);

const renderRows = (
  members: MemberMinimal[],
  t: TFunction,
  interrogateMemberStatus: (id: number) => void,
  goToMember?: (id: number) => void,
) => {
  return members.map((member) =>
    renderRow(member, t, interrogateMemberStatus, goToMember),
  );
};

const renderRow = (
  member: MemberMinimal,
  t: TFunction,
  interrogateMemberStatus: (id: number) => void,
  goToMemberPage?: (id: number) => void,
) => {
  const { credit_account_balance, email, date_joined, name, id, accept_email } =
    member;
  return {
    name,
    date_joined: formatAsDate(date_joined),
    email,
    credit_account_balance: (
      <CreditAccountBalance credit_account_balance={credit_account_balance} />
    ),
    actions: (
      <MemberRowActions
        goToMemberPage={goToMemberPage}
        id={id}
        interrogateMemberStatus={interrogateMemberStatus}
      />
    ),
    accept_email: (
      <Typography color={accept_email ? 'primary' : 'error'}>
        {accept_email ? t('row.yes') : t('row.no')}
      </Typography>
    ),
  };
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
      name: 'email',
      label: t('email'),
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
  goToMember?: (id: number) => void;
  addMember?: () => void;
  tagsExcluded?: Array<Tag['id']>;
  tagsIncluded?: Array<Tag['id']>;
  customToolBar?: () => JSX.Element;
  onValueChangeActiveMemberFetch?: boolean;
  hideAddButton?: boolean;
  interrogateMemberStatus?: (id: number) => void;
  disabledMemberId?: Array<number>;
  noDataText?: string;
  snackbarError?: (message: string) => void;
  // temporary props for transition to new permissions
  useOldPermissions?: boolean;
  oldCreateMemberPermission?: boolean;
};

type Props = OwnProps & WithTranslation & WithStyles;

type State = {
  members: Array<MemberMinimal>;
  loading: boolean;
  count: number;
  tableState: { page: number };
  memberPerPage: number;
  error: boolean;
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
    error: false,
  };

  fetchMemberPage = (page: number, force?: boolean) => {
    if (
      (force || page !== this.state.tableState.page) &&
      !this.state.loading &&
      !this.state.error
    ) {
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
            error: false,
          }));
        })
        .catch((err) => {
          console.error(err);
          this.props.snackbarError?.('smartlistGetMembers.error');
          this.setState((prevState) => ({
            loading: false,
            tableState: {
              ...prevState.tableState,
              // set page to 1 to avoid infinite loop
              // onTableChange is automatically triggered when tableState.page === 0
              page: 1,
            },
            error: true,
            members: [],
          }));
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
    this.props.goToMember?.(this.state.members[rowIndex].id);
  };

  render() {
    const { t } = this.props;
    const { loading } = this.state;

    const noMember = this.props.noDataText
      ? this.props.noDataText
      : t('noMember');

    // If an error occured, display a generic error message instead of the noMember message
    const messageNoMatch = this.state.error ? t('memberTable.error') : noMember;

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
          noMatch: loading ? null : messageNoMatch,
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
                <ObjectLevelPermissionProvider requiredPermission="member.allowed_actions.create">
                  {(hasNewPermission) => {
                    // Temporary while former and new set of permissions coexist
                    const hasPermission = this.props.useOldPermissions
                      ? this.props.oldCreateMemberPermission
                      : hasNewPermission;
                    return this.props.hideAddButton || !hasPermission ? (
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
                    );
                  }}
                </ObjectLevelPermissionProvider>
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
          this.props.interrogateMemberStatus,
          this.props.goToMember,
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
  React.memo,
)(MemberTable);
