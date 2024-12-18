import React, { useCallback } from 'react';
import { useTranslation, withTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { ConnectedProps, connect } from 'react-redux';
import { compose } from 'recompose';
import {
  Avatar,
  LinearProgress,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { push } from 'connected-react-router';
import { TFunction } from 'i18next';
import FranchiseCompanyChipList from '#src/components/franchise/FranchiseCompanyChipList.component';
import withTitle from '#src/hocs/with-title.hoc';
import { FranchiseCompany, FranchiseUser } from '#src/libs/franchise/types';
import { getFranchiseCompanyById } from '#src/libs/franchise/selectors';
import { RootState } from '../../reducers';
import { Dispatch } from '../../state/types';

type FranchiseUserTableRowProps = {
  user: FranchiseUser;
  navigateToUser: (userId: number) => void;
  getFranchiseCompanyList: (companies: number[]) => FranchiseCompany[];
};

const FranchiseUserTableRow: React.FC<FranchiseUserTableRowProps> = React.memo(
  ({ user, navigateToUser, getFranchiseCompanyList }) => {
    const classes = useStyles();
    const navigateToSelectedUser = useCallback(() => {
      navigateToUser(user.id);
    }, [navigateToUser, user.id]);
    return (
      <TableRow
        key={user.id}
        hover
        className={classes.tableRow}
        onClick={navigateToSelectedUser}
      >
        <TableCell className={classes.row}>
          <div className={classes.row}>
            <Avatar src={user.photo} />
            <div>
              <ListItemText primary={user.name} secondary={user.email} />
              <ListItemText secondary={user.phone} />
            </div>
          </div>
          <div className={classes.flexSpacer} />
          <FranchiseCompanyChipList
            companies={getFranchiseCompanyList(user.companies)}
          />
        </TableCell>
      </TableRow>
    );
  },
);

type Props = ConnectedProps<typeof connector>;

const FranchiseUserSearch: React.FC<Props> = ({
  companyById,
  isFranchiseUserSearchLoading,
  navigateToUser,
  searchedUsers,
}) => {
  const { t } = useTranslation('franchise');
  const classes = useStyles();
  const getFranchiseCompanyList = useCallback(
    (companies: number[]) =>
      companies.map((id) => companyById?.[id]).filter((company) => !!company),
    [companyById],
  );

  return (
    <div className={classes.table}>
      {!!isFranchiseUserSearchLoading && <LinearProgress />}
      <Table aria-labelledby="tableTitle">
        <TableHead>
          <TableRow>
            <TableCell>{t('search.usersTableTitle')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(searchedUsers ?? []).map((user) => {
            return (
              <FranchiseUserTableRow
                key={user.id}
                getFranchiseCompanyList={getFranchiseCompanyList}
                navigateToUser={navigateToUser}
                user={user}
              />
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  flexSpacer: {
    flex: '1 1 auto',
  },
  table: {
    backgroundColor: theme.palette.common.white,
    borderRadius: 5,
    boxShadow: theme.shadows[2],
  },
  row: {
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'center',
  },
  tableRow: {
    cursor: 'pointer',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
}));

const mapStateToProps = (state: RootState) => ({
  searchedUsers: state.franchise.searchedUsers.results,
  isFranchiseUserSearchLoading: state.franchise.searchedUsers.loading,
  companyById: getFranchiseCompanyById(state),
  state,
});

const mapDisPatchToProps = {
  navigateToUser: (userId: number) => {
    return (dispatch: Dispatch) => {
      dispatch(push(`/f/members/${userId}/member`));
    };
  },
};

const connector = connect(mapStateToProps, mapDisPatchToProps);

export default compose<Props, {}>(
  connector,
  withTranslation('franchise'),
  withTitle(({ t }: { t: TFunction }) => t('search.pageTitle')),
  React.memo,
)(FranchiseUserSearch);
