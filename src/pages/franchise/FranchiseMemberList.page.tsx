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
  getFranchiseCompanyById,
  getFranchiseId,
  getFranchiseUserCount,
  getFranchiseUserPage,
  getFranchiseUsers,
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
    companiesById,
    classes,
    fetchFranchiseUsers,
    fetchFranchise,
    push,
  } = props;

  const [page, setPage] = useState(defaultPage ?? 1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchFranchise();
  }, [fetchFranchise]);

  useEffect(() => {
    fetchFranchiseUsers({ page, page_size: rowsPerPage });
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
        usersCount={usersCount}
        rowsPerPage={rowsPerPage}
        page={page}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        goToMember={navigateToUser}
        users={users.map((user) => ({
          id: user.id,
          name: user.name,
          companies: user.companies.map((companyId) => {
            const company = companiesById?.[companyId];
            return company;
          }),
        }))}
      />
    </div>
  );
};

const connector = connect(
  (state: RootState) => ({
    users: getFranchiseUsers(state),
    franchiseId: getFranchiseId(state),
    usersCount: getFranchiseUserCount(state),
    companiesById: getFranchiseCompanyById(state),
    defaultPage: getFranchiseUserPage(state),
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
