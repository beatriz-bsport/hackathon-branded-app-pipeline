import { RRule } from 'rrule';
import Immutable from 'seamless-immutable';
import { UserRole } from '#libs/role/types';
import { ErrorAndLoading } from '../../state/types';

export type Expense = {
  id: number;
  company: number;
  date_due: string;
  date_created: string;
  assigned_staff: number;
  category: string;
  amount: number;
  supplier: string;
  description: string;
  rrule: RRule;
};

export type ExpenseWithUser = Expense & {
  assigned_staff: UserRole;
};

export type ExpenseFormValues = {
  id?: number;
  date_due: string;
  assigned_staff?: number;
  category?: string;
  amount: number;
  supplier: string;
  description: string;
  rrule?: RRule;
};

export type ExpenseState = Immutable.Immutable<{
  expense: ErrorAndLoading & {
    byId: { [id: number]: Expense };
    allIds: Array<number>;
    loading: boolean;
    error: Error | null;
    page: number;
    count: number;
    categories: Array<string>;
    suppliers: Array<string>;
  };
}>;
