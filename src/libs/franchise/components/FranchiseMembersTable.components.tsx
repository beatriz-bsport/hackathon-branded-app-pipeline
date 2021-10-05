// @flow
import React from 'react';
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
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { WithTranslation, withTranslation } from 'react-i18next';
import { compose } from 'recompose';

import { FranchiseCompany } from '../types';
import CompanyChip from '../../../components/franchise/CompanyChip.component';

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

  return (
    <div className={classes.table}>
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
                hover
                key={user.id}
                onClick={goToMember(user.id)}
                className={classes.row}
              >
                <TableCell>{user?.name}</TableCell>
                <TableCell>
                  {user.companies.map((company) => (
                    <CompanyChip
                      key={`${user.id}-${company?.id}`}
                      className={classes.chip}
                      company={company}
                    />
                  ))}
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
        component="div"
        count={usersCount ?? 0}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        labelRowsPerPage={t('pagination.rowPerPage')}
        labelDisplayedRows={formatPagination}
        page={page}
        backIconButtonProps={{
          'aria-label': t('pagination.previousPage'),
        }}
        nextIconButtonProps={{
          'aria-label': t('pagination.nextPage'),
        }}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
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

export default compose(
  withRouter,
  withStyles(styles, { withTheme: true }),
  withTranslation(['franchise']),
)(FranchiseMembersTable);
