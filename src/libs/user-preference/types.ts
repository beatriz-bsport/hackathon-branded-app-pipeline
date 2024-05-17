import {
  ManagerOnly,
  SortOption,
} from '../payment-packs/components/PaymentPackFilterAndSortHeader.component';
import type { OfferFilter } from '#libs/offer/types';
import { OffersGroupFilter } from '#libs/meta-activity/types';
import {
  PrivateBookingFilterParams,
  ResourceData,
} from '#libs/private-service/types';
import { Coach } from '#libs/associated-coach/types';
import { Establishment } from '#libs/establishment/types';
import {
  ReplacementRequestFilter,
  ReplacementRequestOfferHistoryFilter,
} from '#libs/replacement-request/types';

export type ScheduleFilter = {
  showOfferList: boolean;
  showPrivateBookings: boolean;
  showCustomEvents: boolean;
  hideCancelledEvents: boolean;
  timeGrid: string;
  zoomLevel: number;
  resourceFilter: {
    resourceDatatypeFilter: ResourceData;
    resourceItemsFilter: Coach[] | Establishment[] | [];
  };
};

export type UserPreference = {
  paymentPackSort: SortOption;
  paymentPackCategoryFilter: Array<number>;
  paymentPackManagerOnlyFilter: ManagerOnly;
  privatePassSort: SortOption;
  privatePassCategoryFilter: Array<number>;
  privatePassManagerOnlyFilter: ManagerOnly;
  scheduleTimerange: { begin: string; end: string };
  calendarFilter: OfferFilter;
  scheduleFilter: ScheduleFilter;
  coachesScheduleFilter: { [key: string]: ScheduleFilter };
  establishmentsScheduleFilter: { [key: string]: ScheduleFilter };
  privateServicesScheduleFilter: { [key: string]: ScheduleFilter };
  memberPrivateBookingFilter: PrivateBookingFilterParams;
  workshopGroupFilter: OffersGroupFilter;
  workshopDetailGroupFilter: OffersGroupFilter;
  shrinkResponsiveDrawer: boolean;
  replacementRequestManagerFilter: ReplacementRequestFilter;
  replacementRequestOfferHistoryFilter: ReplacementRequestOfferHistoryFilter;
  hideCoachNotAssociatedToPrivateServiceWarning: boolean;
  doNotDisplayDeleteStepDialogCadenceIds: number[];
  doNotDisplayDeleteExitDialogCadenceIds: number[];
  doNotDisplayConvertStepIntoExitDialogCadenceIds: number[];
  doNotDisplayEditingCadencePopinCadenceIds: number[];
  doNotDisplayPauseDialogCadenceIds: number[];
  doNotDisplayCadenceWelcomeDialog: boolean;
  isCheckInFilterLocked: boolean;
};
