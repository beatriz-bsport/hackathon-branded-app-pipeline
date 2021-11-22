import React from 'react';
import moment from 'moment';
import MUIDataTable from 'mui-datatables';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Theme } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { MaterialStyleType } from '../../../../utils/types';
import { formatAsDate } from '../../../../utils/datetime';
import type { Member } from '../../../member/types';
import type { CustomFromStatistics } from '../../types';

type MemberAPIDataPaginated = {
  data: {
    count: number;
    links: { next?: number; previous?: number };
    next_page?: number;
    results: Array<Member>;
  };
};
interface MemberStatistics extends Member {
  display_count: number;
  last_display: number;
  completed: boolean;
}
type OwnProps = {
  fetchMemberList: ({
    id__in,
    page_size,
  }: {
    id__in: Array<number>;
    page_size: number;
  }) => {};
  goToMember: (id: number) => void;
  customFormStatistic: CustomFromStatistics;
};
type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;
type State = {
  members: Array<MemberStatistics>;
  memberIds: Array<number>;
  loading: boolean;
  count: number;
  tableState: { page: number };
};
const MEMBER_PER_PAGE = 50;
const renderRows = (members: Array<MemberStatistics>, t: TFunction) => {
  return members.map((member) => renderRow(member, t));
};

const getColumnData = (t: TFunction) => {
  return [
    {
      name: 'name',
      label: t('customForm.statistics.table.column.member'),
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: 'display_count',
      label: t('customForm.statistics.table.column.display_count'),
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: 'last_display',
      label: t('customForm.statistics.table.column.last_display_date'),
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: 'completed',
      label: t('customForm.statistics.table.column.completed'),
      options: {
        filter: false,
        sort: false,
      },
    },
  ];
};
const renderCompleted = (completed: boolean, t: TFunction) => {
  return (
    <Typography color={completed ? 'primary' : 'error'}>
      {completed
        ? t('customForm.statistics.table.row.yes')
        : t('customForm.statistics.table.row.no')}
    </Typography>
  );
};
const renderDisplayAccount = (display_count: number) => (
  <Typography color={display_count >= 0 ? 'primary' : 'error'} align="left">
    {display_count}
  </Typography>
);

const renderMemberName = (name: string, archived: boolean, t: TFunction) => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <Typography>{name}</Typography>
    {archived && (
      <Typography variant="caption" color="secondary">
        {`\u00A0(${t('member:archived')})`}
      </Typography>
    )}
  </div>
);
const renderRow = (member: MemberStatistics, t: TFunction) => {
  const { display_count, last_display, completed, name, archived } = member;
  return {
    name: renderMemberName(name, archived, t),
    last_display: formatAsDate(moment.unix(last_display).format('MM/DD/YYYY')),
    display_count: renderDisplayAccount(display_count),
    completed: renderCompleted(completed, t),
  };
};

export class CutsomFormDetailByMemberPanel extends React.Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      members: [],
      memberIds: props.customFormStatistic.allMemberIds,
      loading: false,
      count: props.customFormStatistic.allMemberIds.length,
      tableState: {
        page: 0,
      },
    };
  }

  fetchMemberPage = async ({ page }: { page?: number }) => {
    const { customFormStatistic } = this.props;
    const id__in = this.state.memberIds.slice(
      (page || 0) * MEMBER_PER_PAGE,
      ((page || 0) + 1) * MEMBER_PER_PAGE,
    );
    if (id__in && page !== this.state.tableState.page && !this.state.loading) {
      this.setState({ loading: true });
      try {
        const response: MemberAPIDataPaginated =
          await this.props.fetchMemberList({
            id__in,
            page_size: MEMBER_PER_PAGE,
          });
        this.setState((prevState) => ({
          members: response.data.results
            .filter((_member: Member) =>
              customFormStatistic.allMemberIds.includes(_member.id),
            )
            .map((member: Member) => {
              return {
                ...member,
                display_count:
                  customFormStatistic.detail_by_member[member.id]
                    .display_request?.length || 0,
                last_display: customFormStatistic.detail_by_member[member.id]
                  ? [
                      ...customFormStatistic.detail_by_member[member.id]
                        .display_request,
                    ].pop()
                  : null,
                completed:
                  customFormStatistic.detail_by_member[member.id]?.completed,
              };
            }),
          loading: false,
          tableState: {
            ...prevState.tableState,
            page: page !== null ? page : prevState.tableState.page,
          },
        }));
      } catch (err) {
        console.error(err);
        this.setState({ loading: false });
      }
    }
  };

  onRowClick = (rowData, { rowIndex }: { rowIndex: number }) => {
    this.props.goToMember(this.state.members[rowIndex].id);
  };

  componentDidMount() {
    this.fetchMemberPage({});
  }

  render() {
    const { t, classes } = this.props;
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
          noMatch: loading ? null : 'Sorry, there is no member data to display',
        },
      },
      onTableChange: (action: string, tableState) => {
        switch (action) {
          case 'changePage':
            return this.fetchMemberPage({
              page: tableState.page,
            });

          default:
            return null;
        }
      },
      customFooter: (
        count: number,
        page: number,
        rowsPerPage: number,
        changeRowsPerPage: (value: string) => void,
        changePage: (page: number) => void,
      ) => (
        <React.Fragment>
          {!!this.state.loading && <LinearProgress style={{ width: '100%' }} />}
          <TableFooter>
            <TableRow>
              <div className={classes.footerContainer}>
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
        </React.Fragment>
      ),
    };
    return (
      <>
        <Typography variant="h6" className={classes.heading}>
          {t('customForm.statistics.byMember')}
        </Typography>
        <Divider className={classes.divider} />
        <MUIDataTable
          data={renderRows(this.state.members, t)}
          columns={getColumnData(t)}
          options={options}
        />
      </>
    );
  }
}
const styles = (theme: Theme) => ({
  heading: {
    paddingBottom: theme.spacing(1),
  },
  divider: {
    marginBottom: theme.spacing(2),
  },
  footerContainer: {
    justifyContent: 'space-between',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(2),
  },
});
export default compose<any, OwnProps>(
  withTranslation('marketing'),
  withStyles(styles),
)(CutsomFormDetailByMemberPanel);
