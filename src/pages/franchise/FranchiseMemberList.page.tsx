import React, { useEffect, useState } from 'react';
import { WithStyles, createStyles, withStyles, Theme } from '@material-ui/core';
import { withTranslation, WithTranslation } from 'react-i18next';
import { push as pushAction } from 'connected-react-router';
import { TFunction } from 'i18next';
import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';

import { RootState } from '../../reducers';
import withTitle from '../../hocs/with-title.hoc';
import {
  fetchFranchise as fetchFranchiseAction,
  fetchFranchiseUsers as fetchFranchiseUsersAction,
} from '../../libs/franchise/actions';
import {
  getFranchiseId,
  getFranchiseUserCount,
  getFranchiseUserPage,
  getFranchiseUsers,
  withAllowedFranchisees,
} from '../../libs/franchise/selectors';

import FranchiseMembersTable from '../../libs/franchise/components/FranchiseMembersTable.components';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(3),
    },
  });

type Props = ConnectedProps<typeof connector> &
  WithStyles<typeof styles> &
  WithTranslation;

const FranchiseMemberList = (props: Props) => {
  const {
    defaultPage,
    users,
    usersCount,
    classes,
    fetchFranchiseUsers,
    fetchFranchise,
    push,
    loading,
  } = props;

  const [page, setPage] = useState(defaultPage ?? 1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchFranchise();
  }, [fetchFranchise]);

  useEffect(() => {
    fetchFranchiseUsers({
      page,
      page_size: rowsPerPage,
      exclude_archived: true,
      email_confirmed: true,
    });
  }, [fetchFranchiseUsers, page, rowsPerPage]);

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const navigateToUser = (userId: number) => () => {
    push(`/f/members/${userId}/member`);
  };
  return (
    <div className={classes.root}>
      <FranchiseMembersTable
        loading={loading}
        usersCount={usersCount}
        rowsPerPage={rowsPerPage}
        page={page}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        goToMember={navigateToUser}
        users={users}
      />
    </div>
  );
};

const connector = connect(
  (state: RootState) => ({
    users: withAllowedFranchisees(getFranchiseUsers)(state),
    franchiseId: getFranchiseId(state),
    usersCount: getFranchiseUserCount(state),
    defaultPage: getFranchiseUserPage(state),
    loading: state.franchise.users.loading,
  }),
  {
    fetchFranchiseUsers: fetchFranchiseUsersAction,
    fetchFranchise: fetchFranchiseAction,
    push: pushAction,
  },
);

export default compose<any, {}>(
  withTranslation(['franchise']),
  withTitle(({ t }: { t: TFunction }) => t('membersList.pageTitle')),
  withStyles(styles, { withTheme: true }),
  connector,
)(FranchiseMemberList);
