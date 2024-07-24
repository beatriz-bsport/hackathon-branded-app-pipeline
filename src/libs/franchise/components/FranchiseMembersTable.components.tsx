import React, { useCallback } from 'react';

import {
  createStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Theme,
  WithStyles,
  withStyles,
  Button,
  LinearProgress,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { WithTranslation, withTranslation } from 'react-i18next';
import { compose } from 'recompose';

import { FranchiseCompany } from '../types';
// import CompanyChip from '../../../components/franchise/CompanyChip.component';
import FranchiseCompanyChipList from '../../../components/franchise/FranchiseCompanyChipList.component';

export type OwnProps = {
  users: {
    id: number;
    name: string;
    companies: FranchiseCompany[];
  }[];
  usersCount: number;
  rowsPerPage: number;
  page: number;
  handleChangePage: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  goToMember: (userId: number) => () => void;
  loading: boolean;
};

type Props = OwnProps & WithStyles<typeof styles> & WithTranslation;

const FranchiseMembersTable = (props: Props) => {
  const {
    users,
    classes,
    usersCount,
    rowsPerPage,
    page,
    handleChangePage,
    handleChangeRowsPerPage,
    goToMember,
    t,
    loading,
  } = props;

  const formatPagination = (values: {
    from: number;
    to: number;
    count: number;
  }) => {
    const { from, to, count } = values;

    return t('pagination.outOf', {
      from,
      to,
      count,
    });
  };

  const handlePageChange = useCallback(
    (_, newPage: number): void => {
      handleChangePage(_, newPage + 1);
    },
    [handleChangePage],
  );

  return (
    <div className={classes.table}>
      {!!loading && <LinearProgress />}
      <Table aria-labelledby="tableTitle">
        <TableHead>
          <TableRow>
            <TableCell>{t('membersList.name')}</TableCell>
            <TableCell>{t('membersList.franchised')}</TableCell>
            <TableCell>{t('membersList.actions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => {
            if (!user) return null;

            return (
              <TableRow
                key={user.id}
                hover
                className={classes.row}
                onClick={goToMember(user.id)}
              >
                <TableCell>{user?.name}</TableCell>
                <TableCell>
                  <FranchiseCompanyChipList companies={user.companies} />
                  {/* user.companies.map((company) => (
                    <CompanyChip
                      key={`${user.id}-${company?.id}`}
                      className={classes.chip}
                      company={company}
                    />
                    )) */}
                </TableCell>
                <TableCell>
                  <Link to={`/f/members/${user.id}/member`}>
                    <Button>{t('membersList.see')}</Button>
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <TablePagination
        backIconButtonProps={{
          'aria-label': t('pagination.previousPage'),
        }}
        component="div"
        count={usersCount ?? 0}
        labelDisplayedRows={formatPagination}
        labelRowsPerPage={t('pagination.rowPerPage')}
        nextIconButtonProps={{
          'aria-label': t('pagination.nextPage'),
        }}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleChangeRowsPerPage}
        page={page - 1}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
      />
    </div>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    table: {
      backgroundColor: theme.palette.common.white,
      borderRadius: 5,
      boxShadow: theme.shadows[2],
    },
    row: {
      cursor: 'pointer',
    },
    chip: {
      marginRight: theme.spacing(1),
    },
  });

export default compose<Props, OwnProps>(
  withRouter,
  withStyles(styles, { withTheme: true }),
  withTranslation(['franchise']),
)(FranchiseMembersTable);
