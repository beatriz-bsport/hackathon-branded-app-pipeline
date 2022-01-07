// @flow

import React, { Component } from 'react';

import { connect } from 'react-redux';
import { withTranslation, TFunction, WithTranslation } from 'react-i18next';
import { compose, withHandlers, withStateHandlers } from 'recompose';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles } from '@material-ui/core/styles';
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';
import { OptionCallback } from '../../state/types';
import { MaterialStyleType, WithHandlerType } from '../../utils/types';
import { RootState } from '../../reducers';
import { getExpenseList, withUsers } from '#libs/expense/selectors';
import {
  fetchExpenseList,
  fetchFutureExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getCategories,
  getSuppliers,
} from '#libs/expense/actions';

import withTitle from '#hocs/with-title.hoc';

import ExpenseTable from '#libs/expense/components/ExpenseTable.component';
import ExpenseFilters from '#libs/expense/components/ExpenseFilters.component';
import themeSelectors from '#libs/theme/selectors';
import BottomActionsButton from '#components/button/BottomActionsButton.component';
import IsEmptyList from '#components/navigation/IsEmptyList.component';
import { ExpenseForm } from '#libs/expense/components/ExpenseForm.component';
import { Expense, ExpenseFormValues } from '#libs/expense/types';
import { getUsers } from '#libs/role/selectors';
import { fetchCompanyUserRoles } from '#libs/role/actions';
import { UserRole } from '#libs/role/types';

type StateHandlerInit = {
  expenseFormOpen: boolean;
  selectedExpense: number;
  deleteDialogOpen: boolean;
  selectedCategories: Array<{ value: string; label: string }>;
  selectedStaff: Array<{ value: number; label: string }>;
  selectedSuppliers: Array<{ value: string; label: string }>;
  editChoice: string | null;
  showFuture: boolean;
  page: number;
};
type StateHandlerType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;
type OwnProps = {};
type ConnectedProps = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;
type OwnAndConnectedProps = OwnProps & ConnectedProps & StateHandlerType;
type Props = OwnAndConnectedProps &
  WithHandlerType<typeof mapWithHandlers> &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

export const PAGE_SIZE = 20;
export class ExpenseList extends Component<Props> {
  onPageChange = (page: number) => {
    this.props.setPage(page);
    const fetch = this.props.showFuture
      ? this.props.fetchFutureExpenses
      : this.props.fetchExpenseList;
    fetch({
      page,
      page_size: PAGE_SIZE,
      category_in: this.props.selectedCategories?.map(
        (cat: { value: string; label: string }) => cat.value,
      ),
      supplier_in: this.props.selectedSuppliers?.map(
        (sup: { value: string; label: string }) => sup.value,
      ),
      staff_in: this.props.selectedStaff?.map(
        (s: { value: number; label: string }) => s.value,
      ),
    });
  };

  handleClose = () => {
    this.props.setExpenseFormOpen(false);
    this.props.setSelectedExpense(null);
    this.props.setEditChoice(null);
  };

  componentDidMount(): void {
    this.onPageChange(1);
    this.props.fetchCompanyUserRoles();
    this.props.getCategories();
    this.props.getSuppliers();
  }

  componentDidUpdate(prevProps: Props): void {
    if (
      prevProps.selectedCategories !== this.props.selectedCategories ||
      prevProps.selectedSuppliers !== this.props.selectedSuppliers ||
      prevProps.selectedStaff !== this.props.selectedStaff ||
      prevProps.showFuture !== this.props.showFuture
    ) {
      this.onPageChange(1);
    }
  }

  render() {
    if (this.props.loading) {
      return <LinearProgress />;
    }
    const { t } = this.props;

    const categoryOptions = [
      ...this.props.categories.map((cat: string) => {
        return cat
          ? { value: cat, label: cat }
          : {
              value: 'no_category',
              label: t('filters.noCategory'),
            };
      }),
    ];

    const staffOptions = [
      ...this.props.staffList.map((s: UserRole) => {
        return {
          value: s.id,
          label:
            s.first_name && s.last_name
              ? `${s.first_name} ${s.last_name}`
              : s.email,
        };
      }),
    ];
    staffOptions.push({ value: 0, label: t('filters.noStaff') });

    return (
      <React.Fragment>
        <div className={this.props.classes.container}>
          {this.props.expenseList.length === 0 && !this.props.loading ? (
            <IsEmptyList
              text={t('noExpenses')}
              button={t('addButton')}
              onCreate={() => this.props.setExpenseFormOpen(true)}
              onCreateLabel={t('addButton')}
            />
          ) : (
            <React.Fragment>
              <ExpenseFilters
                categoryOptions={categoryOptions.filter(
                  (opt) => opt.label !== null,
                )}
                staffOptions={staffOptions}
                supplierOptions={[
                  ...this.props.suppliers.map((sup: string) => {
                    return { value: sup, label: sup };
                  }),
                ]}
                categoryFilterOnChange={this.props.setSelectedCategories}
                staffFilterOnChange={this.props.setSelectedStaff}
                supplierFilterOnChange={this.props.setSelectedSuppliers}
                categoryValue={this.props.selectedCategories}
                staffValue={this.props.selectedStaff}
                supplierValue={this.props.selectedSuppliers}
                showFuture={this.props.showFuture}
                setShowFuture={this.props.setShowFuture}
              />
              <ExpenseTable
                expenseList={this.props.expenseList}
                page={this.props.page}
                count={this.props.count}
                onPageChange={this.onPageChange}
                onDelete={this.props.deleteExpense}
                onEdit={() => this.props.setExpenseFormOpen(true)}
                selectedExpense={this.props.selectedExpense}
                setSelectedExpense={this.props.setSelectedExpense}
                deleteDialogOpen={this.props.deleteDialogOpen}
                setDeleteDialogOpen={this.props.setDeleteDialogOpen}
                setExpenseFormOpen={this.props.setExpenseFormOpen}
                setEditChoice={this.props.setEditChoice}
              />
              <BottomActionsButton
                onCreateLabel={t('addButton')}
                onCreate={() => this.props.setExpenseFormOpen(true)}
              />
            </React.Fragment>
          )}
        </div>

        <GenericResponsiveDrawer
          open={this.props.expenseFormOpen}
          onClose={this.handleClose}
        >
          <ExpenseForm
            onClose={this.handleClose}
            staffList={this.props.staffList}
            initial={this.props.expenseList?.find(
              (exp: Expense) => exp.id === this.props.selectedExpense,
            )}
            onCreateSubmit={this.props.createExpense}
            onUpdateSubmit={this.props.updateExpense}
            editChoice={this.props.editChoice}
            setEditChoice={this.props.setEditChoice}
          />
        </GenericResponsiveDrawer>
      </React.Fragment>
    );
  }
}

const styles = () => ({
  container: {
    maxWidth: '100vw',
  },
});

const mapStateToProps = (state: RootState) => ({
  expenseList: withUsers(getExpenseList)(state),
  count: state.expense.expense.count,
  loading: state.expense.expense.loading,
  companyTheme: themeSelectors.getTheme(state),
  staffList: getUsers(state),
  categories: state.expense.expense.categories,
  suppliers: state.expense.expense.suppliers,
});
const mapDispatchToProps = {
  fetchExpenseList,
  fetchFutureExpenses,
  deleteExpenseAction: deleteExpense,
  createExpenseAction: createExpense,
  updateExpenseAction: updateExpense,
  getCategories,
  fetchCompanyUserRoles,
  getSuppliers,
};
const mapWithHandlers = {
  createExpense:
    (props: OwnAndConnectedProps) =>
    (data: ExpenseFormValues, options?: OptionCallback) => {
      props.createExpenseAction(data, {
        ...options,
        onSuccess: () => {
          options.onSuccess();
          props.fetchExpenseList({ page: 1, page_size: PAGE_SIZE });
          props.setSelectedExpense(null);
          props.getCategories();
          props.getSuppliers();
        },
        onError: () => {
          options.onError();
        },
      });
    },
  updateExpense:
    (props: OwnAndConnectedProps) =>
    (data: ExpenseFormValues, editScope: string, options?: OptionCallback) => {
      const dataWithScope = { ...data, scope: editScope };
      props.updateExpenseAction(dataWithScope, {
        ...options,
        onSuccess: () => {
          options.onSuccess();
          const fetch = props.showFuture
            ? props.fetchFutureExpenses
            : props.fetchExpenseList;
          fetch({
            page: props.page,
            page_size: PAGE_SIZE,
            category_in: props.selectedCategories?.map(
              (cat: { value: string; label: string }) => cat.label,
            ),
            supplier_in: props.selectedSuppliers?.map(
              (sup: { value: string; label: string }) => sup.label,
            ),
            staff_in: props.selectedStaff?.map(
              (s: { value: number; label: string }) => s.value,
            ),
          });
          props.setSelectedExpense(null);
          props.getCategories();
          props.getSuppliers();
          props.setEditChoice(null);
        },
        onError: () => {
          options.onError();
        },
      });
    },
  deleteExpense:
    (props: OwnAndConnectedProps) => (id: number, scope: string) => {
      props.deleteExpenseAction(
        id,
        { scope },
        {
          onSuccess: () => {
            const fetch = props.showFuture
              ? props.fetchFutureExpenses
              : props.fetchExpenseList;
            fetch({
              page: 1,
              page_size: PAGE_SIZE,
              category_in: props.selectedCategories?.map(
                (cat: { value: string; label: string }) => cat.label,
              ),
              supplier_in: props.selectedSuppliers?.map(
                (sup: { value: string; label: string }) => sup.label,
              ),
              staff_in: props.selectedStaff?.map(
                (s: { value: number; label: string }) => s.value,
              ),
            });
            props.setDeleteDialogOpen(false);
            props.setSelectedExpense(null);
            props.getCategories();
            props.getSuppliers();
          },
        },
      );
    },
};
const withStateHandlersInit: StateHandlerInit = {
  expenseFormOpen: false,
  selectedExpense: null,
  deleteDialogOpen: false,
  selectedCategories: [],
  selectedStaff: [],
  selectedSuppliers: [],
  editChoice: null,
  page: 1,
  showFuture: false,
};
const withStateHandlersSetter = {
  setExpenseFormOpen: () => (expenseFormOpen: boolean) => {
    return { expenseFormOpen };
  },
  setSelectedExpense: () => (selectedExpense: number | null) => {
    return { selectedExpense };
  },
  setDeleteDialogOpen: () => (deleteDialogOpen: boolean) => {
    return { deleteDialogOpen };
  },
  setSelectedCategories:
    () => (selectedCategories: Array<{ value: string; label: string }>) => {
      return { selectedCategories };
    },
  setSelectedStaff:
    () => (selectedStaff: Array<{ value: number; label: string }>) => {
      return { selectedStaff };
    },
  setSelectedSuppliers:
    () => (selectedSuppliers: Array<{ value: string; label: string }>) => {
      return { selectedSuppliers };
    },
  setEditChoice: () => (editChoice: string | null) => {
    return { editChoice };
  },
  setPage: () => (page: number) => {
    return { page };
  },
  setShowFuture: () => (showFuture: boolean) => {
    return { showFuture };
  },
};
export default compose<any, Props>(
  withTranslation('expense'),
  withStyles(styles),
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers(mapWithHandlers),
  withTitle(({ t }: { t: TFunction }) => t('titles:expense.expenseList')),
)(ExpenseList);
