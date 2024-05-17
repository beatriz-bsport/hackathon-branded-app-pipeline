import React, { Component } from 'react';

import { connect, ConnectedProps } from 'react-redux';
// @ts-expect-error
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
import routerParamsToProps from '#hocs/router-params-to-props.hoc';

import ExpenseTable from '#libs/expense/components/ExpenseTable.component';
import ExpenseFilters from '#libs/expense/components/ExpenseFilters.component';
import themeSelectors from '#libs/theme/selectors';
import BottomActionsButton from '#components/button/BottomActionsButton.component';
import ExpenseForm from '#libs/expense/components/ExpenseForm.component';
import { Expense, ExpenseFormValues } from '#libs/expense/types';
import { getUsers } from '#libs/role/selectors';
import { fetchCompanyUserRoles } from '#libs/role/actions';
import { UserRole } from '#libs/role/types';

import { rudderStackFormTrackingFunctionsRegistry } from '#components/analytics/rudderstack/utils';
import { SegmentAnalyticsFormObjectIdentifier } from '#components/analytics/segment';

const { trackFormCancel } = rudderStackFormTrackingFunctionsRegistry(
  SegmentAnalyticsFormObjectIdentifier.Expense,
);

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
  expenseId?: number;
};

type StateHandlerType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;

type OwnProps = {};

type OwnAndConnectedProps = OwnProps &
  ConnectedProps<typeof connector> &
  StateHandlerType;

type Props = OwnAndConnectedProps &
  WithHandlerType<typeof mapWithHandlers> &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

export const PAGE_SIZE = 15;

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
    this.props.fetchCompanyUserRoles();
    this.props.getCategories();
    this.props.getSuppliers();
    this.props.fetchExpenseList(
      {
        page: this.props.expenseId ? null : 1,
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
        current_item_id: this.props.expenseId,
      },
      {
        onSuccess: (result) => {
          if (this.props.expenseId) {
            this.props.setSelectedExpense(this.props.expenseId);
            this.props.setExpenseFormOpen(true);
          }
          // @ts-expect-error
          this.props.setPage(result.page);
        },
      },
    );
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
      <>
        <div className={this.props.classes.container}>
          <ExpenseFilters
            categoryFilterOnChange={this.props.setSelectedCategories}
            categoryOptions={categoryOptions.filter(
              (opt) => opt.label !== null,
            )}
            categoryValue={this.props.selectedCategories}
            setShowFuture={this.props.setShowFuture}
            showFuture={this.props.showFuture}
            staffFilterOnChange={this.props.setSelectedStaff}
            staffOptions={staffOptions}
            staffValue={this.props.selectedStaff}
            supplierFilterOnChange={this.props.setSelectedSuppliers}
            supplierOptions={[
              ...this.props.suppliers.map((sup: string) => {
                return { value: sup, label: sup };
              }),
            ]}
            supplierValue={this.props.selectedSuppliers}
          />
          {this.props.loading && <LinearProgress />}
          <ExpenseTable
            // @ts-expect-error
            count={this.props.count}
            deleteDialogOpen={this.props.deleteDialogOpen}
            expenseList={this.props.expenseList}
            onDelete={this.props.deleteExpense}
            onEdit={() => this.props.setExpenseFormOpen(true)}
            onPageChange={this.onPageChange}
            page={this.props.page}
            selectedExpense={this.props.selectedExpense}
            setDeleteDialogOpen={this.props.setDeleteDialogOpen}
            setEditChoice={this.props.setEditChoice}
            setExpenseFormOpen={this.props.setExpenseFormOpen}
            setSelectedExpense={this.props.setSelectedExpense}
          />
          <BottomActionsButton
            onCreate={() => this.props.setExpenseFormOpen(true)}
            onCreateLabel={t('addButton')}
          />
        </div>

        <GenericResponsiveDrawer
          onClose={() => {
            trackFormCancel(
              // @ts-expect-error
              this.props.expenseList?.find(
                (exp: Expense) => exp.id === this.props.selectedExpense,
              )?.id,
            );
            this.handleClose();
          }}
          open={this.props.expenseFormOpen}
          title={
            // @ts-expect-error
            this.props.expenseList?.find(
              (exp: Expense) => exp.id === this.props.selectedExpense,
            )
              ? t('form.titleEdit')
              : t('form.titleAdd')
          }
        >
          {/* @ts-expect-error */}
          <ExpenseForm
            isInDrawer
            editChoice={this.props.editChoice}
            // @ts-expect-error
            initial={this.props.expenseList?.find(
              (exp: Expense) => exp.id === this.props.selectedExpense,
            )}
            onClose={this.handleClose}
            onCreateSubmit={this.props.createExpense}
            onUpdateSubmit={this.props.updateExpense}
            setEditChoice={this.props.setEditChoice}
            staffList={this.props.staffList}
          />
        </GenericResponsiveDrawer>
      </>
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
          const fetch = props.showFuture
            ? props.fetchFutureExpenses
            : props.fetchExpenseList;
          fetch({ page: 1, page_size: PAGE_SIZE });
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

const connector = connect(mapStateToProps, mapDispatchToProps);

export default compose<any, Props>(
  routerParamsToProps({ expenseId: 'expenseId:number' }),
  withTranslation('expense'),
  withStyles(styles),
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
  connector,
  withHandlers(mapWithHandlers),
  withTitle(({ t }: { t: TFunction }) => t('titles:expense.expenseList')),
)(ExpenseList);
