// @flow
import React, { Component } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import TableContainer from '@material-ui/core/TableContainer';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import Table from '@material-ui/core/Table';
import TablePagination from '@material-ui/core/TablePagination';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import LinearProgress from '@material-ui/core/LinearProgress';
import IconButton from '@material-ui/core/IconButton';
import moment from 'moment-timezone';
import Paper from '@material-ui/core/Paper';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import { compose } from 'recompose';
import { WithStyles, withStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import type { ExpenseWithUser } from '#libs/expense/types';
import { PAGE_SIZE } from '../../../pages/expense/ExpenseList.page';

type OwnProps = {
  expenseList: Array<ExpenseWithUser>;
  onPageChange: (page: number) => void;
  count: number;
  page: number;
  onDelete: (id: number, scope: string) => void;
  onCreateOrEdit: (id?: number) => void;
  loading: boolean;

  deleteDialogOpen: boolean;
  setDeleteDialogOpen: (open: boolean) => void;
  selectedExpense: number;
  setSelectedExpense: (id: number) => void;
  setExpenseFormOpen: (open: boolean) => void;
  setEditChoice: (editChoice: string | null) => void;
};

type Props = OwnProps & WithStyles<typeof styles> & WithTranslation;
type State = {
  deleteScope: string | null;
};
export class ExpenseTable extends Component<Props> {
  state: State = {
    deleteScope: 'current',
  };

  getStaffName = (exp: ExpenseWithUser) => {
    if (!exp.assigned_staff) {
      return '';
    }
    if (exp.assigned_staff.first_name || exp.assigned_staff.last_name) {
      return `${exp.assigned_staff.first_name} ${exp.assigned_staff.last_name}`;
    }
    return exp.assigned_staff.email;
  };

  render() {
    const { t, classes } = this.props;
    return (
      <React.Fragment>
        <Paper className={classes.paper}>
          <TableContainer>
            {!this.props.loading && (
              <Table stickyHeader aria-label="expense table">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('table.header.date_due')}</TableCell>
                    <TableCell align="center">
                      {t('table.header.description')}
                    </TableCell>
                    <TableCell align="center">
                      {t('table.header.category')}
                    </TableCell>
                    <TableCell align="center">
                      {t('table.header.amount')}
                    </TableCell>
                    <TableCell align="center">
                      {t('table.header.supplier')}
                    </TableCell>
                    <TableCell align="center">
                      {t('table.header.staff')}
                    </TableCell>
                    <TableCell align="center">
                      {t('table.header.repeat')}
                    </TableCell>
                    <TableCell align="center" />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.props.expenseList?.length ? (
                    this.props.expenseList?.map((expense: ExpenseWithUser) => (
                      <TableRow key={expense.id}>
                        <TableCell>
                          {moment(expense.date_due).format('L')}
                        </TableCell>
                        <TableCell align="center">
                          {expense.description}
                        </TableCell>
                        <TableCell align="center">{expense.category}</TableCell>
                        <TableCell align="center">
                          {getCurrencyDisplayWithPrice(expense.amount)}
                        </TableCell>
                        <TableCell align="center">{expense.supplier}</TableCell>
                        <TableCell align="center">
                          {this.getStaffName(expense)}
                        </TableCell>
                        <TableCell align="center">
                          {expense.rrule ? t('table.yes') : t('table.no')}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            color="primary"
                            onClick={() => {
                              this.props.setSelectedExpense(expense.id);
                              this.props.setExpenseFormOpen(true);
                              if (expense.rrule) {
                                this.props.setEditChoice('date_due');
                              }
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="rgba(0, 0, 0, 0.54)"
                            onClick={() => {
                              this.props.setSelectedExpense(expense.id);
                              this.props.setDeleteDialogOpen(true);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <div />
                  )}
                </TableBody>
              </Table>
            )}
            {this.props.loading && <LinearProgress />}
            <TablePagination
              rowsPerPageOptions={[PAGE_SIZE]}
              component="div"
              count={this.props.count || 0}
              rowsPerPage={PAGE_SIZE}
              page={(this.props.page || 1) - 1}
              onPageChange={(ev, page) => {
                this.props.onPageChange(page + 1);
              }}
            />
          </TableContainer>
        </Paper>
        {this.props.selectedExpense && (
          <Dialog open={this.props.deleteDialogOpen}>
            <DialogTitle>{t('dialogDeleteExpense.warning')}</DialogTitle>
            <DialogContent className={classes.dialogContent}>
              <Typography variant="body1">
                {t('dialogDeleteExpense.confirm', {
                  amount: getCurrencyDisplayWithPrice(
                    this.props.expenseList.find(
                      (e: ExpenseWithUser) =>
                        e.id === this.props.selectedExpense,
                    ).amount,
                  ),
                  date_due: moment(
                    this.props.expenseList.find(
                      (e: ExpenseWithUser) =>
                        e.id === this.props.selectedExpense,
                    ).date_due,
                  ).format('LL'),
                })}
              </Typography>
              {this.props.expenseList.find(
                (e: ExpenseWithUser) => e.id === this.props.selectedExpense,
              ).rrule && (
                <FormControl className={classes.radio}>
                  <RadioGroup
                    aria-label="edit-scope"
                    value={this.state.deleteScope}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      this.setState({ deleteScope: e.target.value });
                    }}
                  >
                    <FormControlLabel
                      value="current"
                      control={<Radio />}
                      label={t('dialogDeleteExpense.current')}
                    />
                    <FormControlLabel
                      value="future"
                      control={<Radio />}
                      label={t('dialogDeleteExpense.future')}
                    />
                    <FormControlLabel
                      value="all"
                      control={<Radio />}
                      label={t('dialogDeleteExpense.all')}
                    />
                  </RadioGroup>
                </FormControl>
              )}
            </DialogContent>
            <DialogActions>
              <div className={classes.actionButtons}>
                <Button
                  onClick={() => {
                    this.props.setSelectedExpense(null);
                    this.props.setDeleteDialogOpen(false);
                  }}
                  className={classes.cancel}
                >
                  {t('dialogDeleteExpense.cancel')}
                </Button>
                <Button
                  onClick={() =>
                    this.props.onDelete(
                      this.props.selectedExpense,
                      this.state.deleteScope,
                    )
                  }
                  color="primary"
                  variant="contained"
                >
                  {t('dialogDeleteExpense.delete')}
                </Button>
              </div>
            </DialogActions>
          </Dialog>
        )}
      </React.Fragment>
    );
  }
}

const styles = (theme: Theme): any => ({
  actionButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
    marginTop: theme.spacing(3),
  },
  paper: {
    marginBottom: theme.spacing(6),
  },
  dialogContent: {
    marginBottom: theme.spacing(3),
  },
  cancel: {
    marginRight: theme.spacing(4),
  },
  explanation: {
    color: 'rgba(0, 0, 0, 0.54)',
  },
  radio: {
    marginTop: theme.spacing(2),
  },
});

export default compose(
  withTranslation('expense'),
  withStyles(styles),
)(ExpenseTable);
