import type {
  CreatePrivateBookingsFilterPayload,
  PrivateBookingsFilter,
} from "@bsport/api-cdp/smartlist";

import type { DateFilterValue } from "#src/components/primitive-filters/date-filter/types";

import type { TotalAppointmentsNumberTypeValue } from "./constants";
import type { TotalAppointmentsSubFilterId } from "./sub-filters/total-appointments-sub-filter-id";

export type TotalAppointmentsNumberType = TotalAppointmentsNumberTypeValue;

export type TotalAppointmentsNumberFilterFormValue = {
  id?: number;
  smartlist: number;
  type: TotalAppointmentsNumberType;
  value: number;
  secondValue: number | null;
  subFilters: TotalAppointmentsSubFilterId[];
  bookingDate: DateFilterValue;
  bookingHourRange: {
    hour: string;
    hourSecond: string;
  };
  coach: {
    selectAllCoaches: boolean;
    selectedCoachIds: number[];
  };
  establishment: {
    selectAllEstablishments: boolean;
    selectedEstablishmentIds: number[];
    atHome: boolean;
  };
};

export type TotalAppointmentsNumberDirtyPatchPayload = Partial<
  Omit<PrivateBookingsFilter, "id" | "company_id" | "filter_identifier">
>;

export type TotalAppointmentsFilterCreatePayload =
  CreatePrivateBookingsFilterPayload;

export type TotalAppointmentsNumberFilterCardProps = {
  smartlistId: string;
  /** Studio tenant, resolved once by the parent smartlist screen. */
  companyId: number;
  filterValue: TotalAppointmentsNumberFilterFormValue;
  onDeleteUnsavedFilter?: () => void;
  onSaveSuccess?: () => void;
};

export type { TotalAppointmentsSubFilterId } from "./sub-filters/total-appointments-sub-filter-id";
