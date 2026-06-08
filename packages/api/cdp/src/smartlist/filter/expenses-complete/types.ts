import type {
  SmartlistCreditComparator,
  SmartlistDateFilterType,
  SmartlistFilterPayload,
} from "../../shared/types";

/**
 * Smartlist purchase history filter (`expenses_complete`).
 * Endpoint family: `/customer-data-platform/v1/smartlist/expenses_complete/`.
 */
export type ExpensesCompleteFilter = SmartlistFilterPayload & {
  company_id: number;
  buyable_identifiers: number[];
  comparator: SmartlistCreditComparator;
  value: number;
  value_second: number;
  date_filter_active: boolean;
  date_filter_type: SmartlistDateFilterType;
  date: string;
  date_second: string;
  duration: number | null;
  duration_second: number | null;
};

export type CreateExpensesCompleteFilterPayload = Omit<
  ExpensesCompleteFilter,
  "id" | "company_id" | "filter_identifier"
>;

export type UpdateExpensesCompleteFilterPayload = Partial<
  Omit<
    ExpensesCompleteFilter,
    "id" | "company_id" | "smartlist" | "filter_identifier"
  >
>;

export type UpsertExpensesCompleteFilterVariables = {
  filterId?: number;
  createPayload?: CreateExpensesCompleteFilterPayload;
  updatePayload?: UpdateExpensesCompleteFilterPayload;
};
