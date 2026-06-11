import { useMemo, useState } from "react";

import { dataAccessLayer } from "@bsport/sm-backbone";

import { useSmartlistFiltersQuery } from "#src/api/use-smartlist-filters-query";
import { QueryBoundary } from "#src/components/QueryBoundary/QueryBoundary";
import { useTranslation } from "#src/utils/i18n";

import { ActivePassesFilterCard } from "./active-passes-filter/components/active-passes-filter-card";
import { ActivePassesFilterCardSkeleton } from "./active-passes-filter/components/active-passes-filter-card-skeleton";
import { createDefaultActivePassesFilter } from "./active-passes-filter/default-value";
import { mapActivePassesFilterToFormValue } from "./active-passes-filter/mappers/api-to-form-value";
import type { ActivePassesFilterFormValue } from "./active-passes-filter/types";
import { AgeFilterCard } from "./age-filter/components/age-filter-card";
import { createDefaultAgeFilter } from "./age-filter/default-value";
import { mapAgeFilterToFormValue } from "./age-filter/mappers/api-to-form-value";
import type { AgeFilterFormValue } from "./age-filter/types";
import { AppointmentPassFilterCardSkeleton } from "./appointment-pass-filter/components/appointment-pass-filter-card-skeleton";
import { AppointmentPassFilterCardWithData } from "./appointment-pass-filter/components/appointment-pass-filter-card-with-data";
import { createDefaultAppointmentPassFilter } from "./appointment-pass-filter/default-value";
import { mapPrivatePassFilterToFormValue } from "./appointment-pass-filter/mappers/api-to-form-value";
import type { AppointmentPassFilterFormValue } from "./appointment-pass-filter/types";
import { BasketAbandonmentFilterCard } from "./basket-abandonment-filter/components/basket-abandonment-filter-card";
import { createDefaultBasketAbandonmentFilter } from "./basket-abandonment-filter/default-value";
import { mapBasketAbandonmentFilterToFormValue } from "./basket-abandonment-filter/mappers/api-to-form-value";
import type { BasketAbandonmentFilterFormValue } from "./basket-abandonment-filter/types";
import { BookingMilestoneFilterCard } from "./booking-milestone/components/booking-milestone-filter-card";
import { BookingMilestoneFilterCardSkeleton } from "./booking-milestone/components/booking-milestone-filter-card-skeleton";
import { createDefaultBookingMilestoneFilter } from "./booking-milestone/default-value";
import { mapBookingMilestoneFilterToFormValue } from "./booking-milestone/mappers/api-to-form-value";
import type { BookingMilestoneFilterFormValue } from "./booking-milestone/types";
import { CreditAccountFilterCard } from "./credit-account/components/credit-account-filter-card";
import { createDefaultCreditAccountFilter } from "./credit-account/default-value";
import { mapCreditAccountFilterToFormValue } from "./credit-account/mappers/api-to-form-value";
import type { CreditAccountFilterFormValue } from "./credit-account/types";
import { FilterManager } from "./filter-manager";
import {
  type FilterSelectorOption,
  FilterSelectorPopover,
} from "./filter-selector-popover";
import { FILTER_SELECTOR_CATEGORIES } from "./filter-selector.constants";
import { FirstPurchaseFilterCard } from "./first-purchase-filter/components/first-purchase-filter-card";
import { FirstPurchaseFilterCardSkeleton } from "./first-purchase-filter/components/first-purchase-filter-card-skeleton";
import { createDefaultFirstPurchaseFilter } from "./first-purchase-filter/default-value";
import { mapFirstPurchaseFilterToFormValue } from "./first-purchase-filter/mappers/api-to-form-value";
import type { FirstPurchaseFilterFormValue } from "./first-purchase-filter/types";
import { GenderFilterCard } from "./gender-filter/components/gender-filter-card";
import { GenderFilterCardSkeleton } from "./gender-filter/components/gender-filter-card-skeleton";
import { createDefaultGenderFilter } from "./gender-filter/default-value";
import { mapGenderFilterToFormValue } from "./gender-filter/mappers/api-to-form-value";
import type { GenderFilterFormValue } from "./gender-filter/types";
import { HasPhoneFilterCard } from "./has-phone-filter/components/has-phone-filter-card";
import { createDefaultHasPhoneFilter } from "./has-phone-filter/default-value";
import { mapHasPhoneFilterToFormValue } from "./has-phone-filter/mappers/api-to-form-value";
import type { HasPhoneFilterFormValue } from "./has-phone-filter/types";
import { InternalNotesFilterCard } from "./internal-notes-filter/components/internal-notes-filter-card";
import { createDefaultInternalNotesFilter } from "./internal-notes-filter/default-value";
import { mapInternalNotesFilterToFormValue } from "./internal-notes-filter/mappers/api-to-form-value";
import type { InternalNotesFilterFormValue } from "./internal-notes-filter/types";
import { LastBookingFilterCard } from "./last-booking-filter/components/last-booking-filter-card";
import { createDefaultLastBookingFilter } from "./last-booking-filter/default-value";
import { mapLastBookingFilterToFormValue } from "./last-booking-filter/mappers/api-to-form-value";
import type { LastBookingFilterFormValue } from "./last-booking-filter/types";
import { LiabilityWaiverFilterCard } from "./liability-waiver-filter/components/liability-waiver-filter-card";
import { createDefaultLiabilityWaiverFilter } from "./liability-waiver-filter/default-value";
import { mapLiabilityWaiverFilterToFormValue } from "./liability-waiver-filter/mappers/api-to-form-value";
import type { LiabilityWaiverFilterFormValue } from "./liability-waiver-filter/types";
import { MarketingNotificationFilterCard } from "./marketing-notification-filter/components/marketing-notification-filter-card";
import { createDefaultMarketingNotificationFilter } from "./marketing-notification-filter/default-value";
import { mapMarketingNotificationFilterToFormValue } from "./marketing-notification-filter/mappers/api-to-form-value";
import type { MarketingNotificationFilterFormValue } from "./marketing-notification-filter/types";
import { MemberSignUpDateFilterCard } from "./member-sign-up-date-filter/components/member-sign-up-date-filter-card";
import { createDefaultMemberSignUpDateFilter } from "./member-sign-up-date-filter/default-value";
import { mapMemberDateJoinedFilterToFormValue } from "./member-sign-up-date-filter/mappers/api-to-form-value";
import type { MemberSignUpDateFilterFormValue } from "./member-sign-up-date-filter/types";
import { PassesFilterCardSkeleton } from "./passes-filter/components/passes-filter-card-skeleton";
import { PassesFilterCardWithData } from "./passes-filter/components/passes-filter-card-with-data";
import { createDefaultPassesFilter } from "./passes-filter/default-value";
import { mapApiFilterToFormValue as mapPaymentPackFilterToFormValue } from "./passes-filter/mappers/api-to-form-value";
import type { PassesFilterFormValue } from "./passes-filter/types";
import { PurchaseHistoryFilterCard } from "./purchase-history-filter/components/purchase-history-filter-card";
import { PurchaseHistoryFilterCardSkeleton } from "./purchase-history-filter/components/purchase-history-filter-card-skeleton";
import { createDefaultPurchaseHistoryFilter } from "./purchase-history-filter/default-value";
import { mapPurchaseHistoryFilterToFormValue } from "./purchase-history-filter/mappers/api-to-form-value";
import type { PurchaseHistoryFilterFormValue } from "./purchase-history-filter/types";
import { ReferredMembersFilterCard } from "./referred-members-filter/components/referred-members-filter-card";
import { ReferredMembersFilterCardSkeleton } from "./referred-members-filter/components/referred-members-filter-card-skeleton";
import { createDefaultReferredMembersFilter } from "./referred-members-filter/default-value";
import { mapReferredMemberFilterToFormValue } from "./referred-members-filter/mappers/api-to-form-value";
import type { ReferredMembersFilterFormValue } from "./referred-members-filter/types";
import {
  SMARTLIST_FILTERS_MANAGER_FILTER_TYPES,
  type SmartlistFiltersManagerFilterType,
  isSmartlistFiltersManagerFilterType,
} from "./shared/types-guards";
import { TagFilterCard } from "./tag-filter/components/tag-filter-card";
import { TagFilterCardSkeleton } from "./tag-filter/components/tag-filter-card-skeleton";
import { createDefaultTagFilterFormValue } from "./tag-filter/default-value";
import { mapTagFilterToFormValue } from "./tag-filter/mappers/api-to-form-value";
import type { TagFilterFormValue } from "./tag-filter/types";
import { TermsAndConditionsFilterCard } from "./terms-and-conditions-filter/components/terms-and-conditions-filter-card";
import { createDefaultTermsAndConditionsFilter } from "./terms-and-conditions-filter/default-value";
import { mapTermsAndConditionsFilterToFormValue } from "./terms-and-conditions-filter/mappers/api-to-form-value";
import type { TermsAndConditionsFilterFormValue } from "./terms-and-conditions-filter/types";
import { TotalAppointmentsFilterCardSkeleton } from "./total-appointments/components/total-appointments-filter-card-skeleton";
import { TotalAppointmentsNumberFilterCard } from "./total-appointments/components/total-appointments-number-filter-card";
import { createDefaultTotalAppointmentsNumberFilter } from "./total-appointments/default-value";
import { mapTotalAppointmentsFilterToFormValue } from "./total-appointments/mappers/api-to-form-value";
import type { TotalAppointmentsNumberFilterFormValue } from "./total-appointments/types";
import { TotalBookingFilterCardSkeleton } from "./total-booking/components/total-booking-filter-card-skeleton";
import { TotalBookingNumberFilterCard } from "./total-booking/components/total-booking-number-filter-card";
import { createDefaultTotalBookingNumberFilter } from "./total-booking/default-value";
import { mapTotalBookingFilterToFormValue } from "./total-booking/mappers/api-to-form-value";
import type { TotalBookingNumberFilterFormValue } from "./total-booking/types";

type SegmentFiltersManagerProps = {
  smartlistId: string;
};

const FILTER_TYPES = SMARTLIST_FILTERS_MANAGER_FILTER_TYPES;

type FilterType = SmartlistFiltersManagerFilterType;
type FilterValueByType = {
  age: AgeFilterFormValue;
  creditAccount: CreditAccountFilterFormValue;
  gender: GenderFilterFormValue;
  tags: TagFilterFormValue;
  memberSignUpDate: MemberSignUpDateFilterFormValue;
  passes: PassesFilterFormValue;
  bookingMilestone: BookingMilestoneFilterFormValue;
  totalBookingNumber: TotalBookingNumberFilterFormValue;
  appointmentPass: AppointmentPassFilterFormValue;
  totalAppointmentsNumber: TotalAppointmentsNumberFilterFormValue;
  activePasses: ActivePassesFilterFormValue;
  firstPurchase: FirstPurchaseFilterFormValue;
  basketAbandonment: BasketAbandonmentFilterFormValue;
  purchaseHistory: PurchaseHistoryFilterFormValue;
  referredMembers: ReferredMembersFilterFormValue;
  marketingNotification: MarketingNotificationFilterFormValue;
  hasPhone: HasPhoneFilterFormValue;
  termsAndConditions: TermsAndConditionsFilterFormValue;
  liabilityWaiver: LiabilityWaiverFilterFormValue;
  lastBooking: LastBookingFilterFormValue;
  internalNotes: InternalNotesFilterFormValue;
};

type DraftFilter =
  | {
      clientId: string;
      filterType: "age";
      value: FilterValueByType["age"];
    }
  | {
      clientId: string;
      filterType: "referredMembers";
      value: FilterValueByType["referredMembers"];
    }
  | {
      clientId: string;
      filterType: "creditAccount";
      value: FilterValueByType["creditAccount"];
    }
  | {
      clientId: string;
      filterType: "gender";
      value: FilterValueByType["gender"];
    }
  | {
      clientId: string;
      filterType: "tags";
      value: FilterValueByType["tags"];
    }
  | {
      clientId: string;
      filterType: "memberSignUpDate";
      value: FilterValueByType["memberSignUpDate"];
    }
  | {
      clientId: string;
      filterType: "passes";
      value: FilterValueByType["passes"];
    }
  | {
      clientId: string;
      filterType: "bookingMilestone";
      value: FilterValueByType["bookingMilestone"];
    }
  | {
      clientId: string;
      filterType: "totalBookingNumber";
      value: FilterValueByType["totalBookingNumber"];
    }
  | {
      clientId: string;
      filterType: "appointmentPass";
      value: FilterValueByType["appointmentPass"];
    }
  | {
      clientId: string;
      filterType: "totalAppointmentsNumber";
      value: FilterValueByType["totalAppointmentsNumber"];
    }
  | {
      clientId: string;
      filterType: "activePasses";
      value: FilterValueByType["activePasses"];
    }
  | {
      clientId: string;
      filterType: "firstPurchase";
      value: FilterValueByType["firstPurchase"];
    }
  | {
      clientId: string;
      filterType: "marketingNotification";
      value: FilterValueByType["marketingNotification"];
    }
  | {
      clientId: string;
      filterType: "basketAbandonment";
      value: FilterValueByType["basketAbandonment"];
    }
  | {
      clientId: string;
      filterType: "purchaseHistory";
      value: FilterValueByType["purchaseHistory"];
    }
  | {
      clientId: string;
      filterType: "creditAccount";
      value: FilterValueByType["creditAccount"];
    }
  | {
      clientId: string;
      filterType: "hasPhone";
      value: FilterValueByType["hasPhone"];
    }
  | {
      clientId: string;
      filterType: "termsAndConditions";
      value: FilterValueByType["termsAndConditions"];
    }
  | {
      clientId: string;
      filterType: "liabilityWaiver";
      value: FilterValueByType["liabilityWaiver"];
    }
  | {
      clientId: string;
      filterType: "lastBooking";
      value: FilterValueByType["lastBooking"];
    }
  | {
      clientId: string;
      filterType: "internalNotes";
      value: FilterValueByType["internalNotes"];
    };

type SavedFilter =
  | {
      key: string;
      filterType: "age";
      value: FilterValueByType["age"];
    }
  | {
      key: string;
      filterType: "creditAccount";
      value: FilterValueByType["creditAccount"];
    }
  | {
      key: string;
      filterType: "gender";
      value: FilterValueByType["gender"];
    }
  | {
      key: string;
      filterType: "tags";
      value: FilterValueByType["tags"];
    }
  | {
      key: string;
      filterType: "memberSignUpDate";
      value: FilterValueByType["memberSignUpDate"];
    }
  | {
      key: string;
      filterType: "passes";
      value: FilterValueByType["passes"];
    }
  | {
      key: string;
      filterType: "bookingMilestone";
      value: FilterValueByType["bookingMilestone"];
    }
  | {
      key: string;
      filterType: "totalBookingNumber";
      value: FilterValueByType["totalBookingNumber"];
    }
  | {
      key: string;
      filterType: "appointmentPass";
      value: FilterValueByType["appointmentPass"];
    }
  | {
      key: string;
      filterType: "totalAppointmentsNumber";
      value: FilterValueByType["totalAppointmentsNumber"];
    }
  | {
      key: string;
      filterType: "activePasses";
      value: FilterValueByType["activePasses"];
    }
  | {
      key: string;
      filterType: "firstPurchase";
      value: FilterValueByType["firstPurchase"];
    }
  | {
      key: string;
      filterType: "marketingNotification";
      value: FilterValueByType["marketingNotification"];
    }
  | {
      key: string;
      filterType: "referredMembers";
      value: FilterValueByType["referredMembers"];
    }
  | {
      key: string;
      filterType: "creditAccount";
      value: FilterValueByType["creditAccount"];
    }
  | {
      key: string;
      filterType: "basketAbandonment";
      value: FilterValueByType["basketAbandonment"];
    }
  | {
      key: string;
      filterType: "purchaseHistory";
      value: FilterValueByType["purchaseHistory"];
    }
  | {
      key: string;
      filterType: "creditAccount";
      value: FilterValueByType["creditAccount"];
    }
  | {
      key: string;
      filterType: "hasPhone";
      value: FilterValueByType["hasPhone"];
    }
  | {
      key: string;
      filterType: "termsAndConditions";
      value: FilterValueByType["termsAndConditions"];
    }
  | {
      key: string;
      filterType: "liabilityWaiver";
      value: FilterValueByType["liabilityWaiver"];
    }
  | {
      key: string;
      filterType: "lastBooking";
      value: FilterValueByType["lastBooking"];
    }
  | {
      key: string;
      filterType: "internalNotes";
      value: FilterValueByType["internalNotes"];
    };

type RenderFilterParams<TFilterType extends FilterType> = {
  key: string;
  value: FilterValueByType[TFilterType];
  onDeleteUnsavedFilter?: () => void;
  onSaveSuccess?: () => void;
};

let draftCounter = 0;
const createDraftClientId = (filterType: FilterType): string => {
  draftCounter += 1;
  return `${filterType}-filter-draft-${draftCounter}-${Date.now()}`;
};

/**
 * Central manager for all smartlist filter types.
 * Every filter family shares the same draft management and rendering flow.
 */
export const SegmentFiltersManager = ({
  smartlistId,
}: SegmentFiltersManagerProps) => {
  const { t } = useTranslation("filters");
  const companyId = dataAccessLayer.useCompanyTheme()?.company;
  const smartlistNumericId = Number(smartlistId);
  const [draftFilters, setDraftFilters] = useState<DraftFilter[]>([]);

  const {
    data: smartlistFilters,
    isLoading,
    isError,
  } = useSmartlistFiltersQuery(smartlistId);
  const ageFilters = smartlistFilters?.ageFilters ?? [];
  const creditAccountFilters = smartlistFilters?.creditAccountFilters ?? [];
  const genderFilters = smartlistFilters?.genderFilters ?? [];
  const tagFilters = smartlistFilters?.tagFilters ?? [];
  const memberDateJoinedFilters =
    smartlistFilters?.memberDateJoinedFilters ?? [];
  const paymentPackFilters = smartlistFilters?.paymentPackFilters ?? [];
  const bookingMilestoneFilters =
    smartlistFilters?.bookingMilestoneFilters ?? [];
  const totalBookingFilters = smartlistFilters?.totalBookingFilters ?? [];
  const privatePassFilters = smartlistFilters?.privatePassFilters ?? [];
  const totalAppointmentsFilters =
    smartlistFilters?.totalAppointmentsFilters ?? [];
  const activePassesFilters = smartlistFilters?.activePassesFilters ?? [];
  const firstPurchaseFilters = smartlistFilters?.firstPurchaseFilters ?? [];
  const basketAbandonmentFilters =
    smartlistFilters?.basketAbandonmentFilters ?? [];
  const purchaseHistoryFilters = smartlistFilters?.purchaseHistoryFilters ?? [];
  const referredMemberFilters = smartlistFilters?.referredMemberFilters ?? [];
  const marketingNotificationFilters =
    smartlistFilters?.marketingNotificationFilters ?? [];
  const hasPhoneFilters = smartlistFilters?.hasPhoneFilters ?? [];
  const termsAndConditionsFilters =
    smartlistFilters?.termsAndConditionsFilters ?? [];
  const liabilityWaiverFilters = smartlistFilters?.liabilityWaiverFilters ?? [];
  const lastBookingFilters = smartlistFilters?.lastBookingFilters ?? [];
  const internalNotesFilters = smartlistFilters?.internalNotesFilters ?? [];

  const addDraft = (draftFilter: DraftFilter) => {
    setDraftFilters((previousDraftFilters) => [
      ...previousDraftFilters,
      draftFilter,
    ]);
  };

  const removeDraft = (clientId: string) =>
    setDraftFilters((previousDraftFilters) =>
      previousDraftFilters.filter(
        (draftFilter) => draftFilter.clientId !== clientId,
      ),
    );

  const renderFilterCardByType: {
    [Key in FilterType]: (params: RenderFilterParams<Key>) => React.JSX.Element;
  } = {
    age: ({ key, value, onDeleteUnsavedFilter, onSaveSuccess }) => (
      <AgeFilterCard
        key={key}
        smartlistId={smartlistId}
        filterValue={value}
        onDeleteUnsavedFilter={onDeleteUnsavedFilter}
        onSaveSuccess={onSaveSuccess}
      />
    ),
    creditAccount: ({ key, value, onDeleteUnsavedFilter, onSaveSuccess }) => (
      <CreditAccountFilterCard
        key={key}
        smartlistId={smartlistId}
        filterValue={value}
        onDeleteUnsavedFilter={onDeleteUnsavedFilter}
        onSaveSuccess={onSaveSuccess}
      />
    ),
    gender: ({ key, value, onDeleteUnsavedFilter, onSaveSuccess }) => (
      <QueryBoundary key={key} loadingFallback={<GenderFilterCardSkeleton />}>
        <GenderFilterCard
          smartlistId={smartlistId}
          filterValue={value}
          onDeleteUnsavedFilter={onDeleteUnsavedFilter}
          onSaveSuccess={onSaveSuccess}
        />
      </QueryBoundary>
    ),
    tags: ({ key, value, onDeleteUnsavedFilter, onSaveSuccess }) => (
      <QueryBoundary key={key} loadingFallback={<TagFilterCardSkeleton />}>
        <TagFilterCard
          smartlistId={smartlistId}
          filterValue={value}
          onDeleteUnsavedFilter={onDeleteUnsavedFilter}
          onSaveSuccess={onSaveSuccess}
        />
      </QueryBoundary>
    ),
    memberSignUpDate: ({
      key,
      value,
      onDeleteUnsavedFilter,
      onSaveSuccess,
    }) => (
      <MemberSignUpDateFilterCard
        key={key}
        smartlistId={smartlistId}
        filterValue={value}
        onDeleteUnsavedFilter={onDeleteUnsavedFilter}
        onSaveSuccess={onSaveSuccess}
      />
    ),
    passes: ({ key, value, onDeleteUnsavedFilter, onSaveSuccess }) => (
      <QueryBoundary key={key} loadingFallback={<PassesFilterCardSkeleton />}>
        <PassesFilterCardWithData
          smartlistId={smartlistId}
          filterValue={value}
          onDeleteUnsavedFilter={onDeleteUnsavedFilter}
          onSaveSuccess={onSaveSuccess}
        />
      </QueryBoundary>
    ),
    bookingMilestone: ({ key, value, onDeleteUnsavedFilter, onSaveSuccess }) =>
      typeof companyId === "number" && companyId > 0 ? (
        <QueryBoundary
          key={key}
          loadingFallback={<BookingMilestoneFilterCardSkeleton />}
        >
          <BookingMilestoneFilterCard
            smartlistId={smartlistId}
            companyId={companyId}
            filterValue={value}
            onDeleteUnsavedFilter={onDeleteUnsavedFilter}
            onSaveSuccess={onSaveSuccess}
          />
        </QueryBoundary>
      ) : (
        <BookingMilestoneFilterCardSkeleton key={key} />
      ),
    totalBookingNumber: ({
      key,
      value,
      onDeleteUnsavedFilter,
      onSaveSuccess,
    }) =>
      typeof companyId === "number" && companyId > 0 ? (
        <QueryBoundary
          key={key}
          loadingFallback={<TotalBookingFilterCardSkeleton />}
        >
          <TotalBookingNumberFilterCard
            smartlistId={smartlistId}
            companyId={companyId}
            filterValue={value}
            onDeleteUnsavedFilter={onDeleteUnsavedFilter}
            onSaveSuccess={onSaveSuccess}
          />
        </QueryBoundary>
      ) : (
        <TotalBookingFilterCardSkeleton key={key} />
      ),
    appointmentPass: ({ key, value, onDeleteUnsavedFilter, onSaveSuccess }) => (
      <QueryBoundary
        key={key}
        loadingFallback={<AppointmentPassFilterCardSkeleton />}
      >
        <AppointmentPassFilterCardWithData
          smartlistId={smartlistId}
          filterValue={value}
          onDeleteUnsavedFilter={onDeleteUnsavedFilter}
          onSaveSuccess={onSaveSuccess}
        />
      </QueryBoundary>
    ),
    totalAppointmentsNumber: ({
      key,
      value,
      onDeleteUnsavedFilter,
      onSaveSuccess,
    }) =>
      typeof companyId === "number" && companyId > 0 ? (
        <QueryBoundary
          key={key}
          loadingFallback={<TotalAppointmentsFilterCardSkeleton />}
        >
          <TotalAppointmentsNumberFilterCard
            smartlistId={smartlistId}
            companyId={companyId}
            filterValue={value}
            onDeleteUnsavedFilter={onDeleteUnsavedFilter}
            onSaveSuccess={onSaveSuccess}
          />
        </QueryBoundary>
      ) : (
        <TotalAppointmentsFilterCardSkeleton key={key} />
      ),
    activePasses: ({ key, value, onDeleteUnsavedFilter, onSaveSuccess }) => (
      <QueryBoundary
        key={key}
        loadingFallback={<ActivePassesFilterCardSkeleton />}
      >
        <ActivePassesFilterCard
          smartlistId={smartlistId}
          filterValue={value}
          onDeleteUnsavedFilter={onDeleteUnsavedFilter}
          onSaveSuccess={onSaveSuccess}
        />
      </QueryBoundary>
    ),
    firstPurchase: ({ key, value, onDeleteUnsavedFilter, onSaveSuccess }) => (
      <QueryBoundary
        key={key}
        loadingFallback={<FirstPurchaseFilterCardSkeleton />}
      >
        <FirstPurchaseFilterCard
          smartlistId={smartlistId}
          filterValue={value}
          onDeleteUnsavedFilter={onDeleteUnsavedFilter}
          onSaveSuccess={onSaveSuccess}
        />
      </QueryBoundary>
    ),
    basketAbandonment: ({
      key,
      value,
      onDeleteUnsavedFilter,
      onSaveSuccess,
    }) => (
      <BasketAbandonmentFilterCard
        key={key}
        smartlistId={smartlistId}
        filterValue={value}
        onDeleteUnsavedFilter={onDeleteUnsavedFilter}
        onSaveSuccess={onSaveSuccess}
      />
    ),
    referredMembers: ({ key, value, onDeleteUnsavedFilter, onSaveSuccess }) => (
      <QueryBoundary
        key={key}
        loadingFallback={<ReferredMembersFilterCardSkeleton />}
      >
        <ReferredMembersFilterCard
          smartlistId={smartlistId}
          filterValue={value}
          onDeleteUnsavedFilter={onDeleteUnsavedFilter}
          onSaveSuccess={onSaveSuccess}
        />
      </QueryBoundary>
    ),
    purchaseHistory: ({ key, value, onDeleteUnsavedFilter, onSaveSuccess }) => (
      <QueryBoundary
        key={key}
        loadingFallback={<PurchaseHistoryFilterCardSkeleton />}
      >
        <PurchaseHistoryFilterCard
          smartlistId={smartlistId}
          filterValue={value}
          onDeleteUnsavedFilter={onDeleteUnsavedFilter}
          onSaveSuccess={onSaveSuccess}
        />
      </QueryBoundary>
    ),
    marketingNotification: ({
      key,
      value,
      onDeleteUnsavedFilter,
      onSaveSuccess,
    }) => (
      <MarketingNotificationFilterCard
        key={key}
        smartlistId={smartlistId}
        filterValue={value}
        onDeleteUnsavedFilter={onDeleteUnsavedFilter}
        onSaveSuccess={onSaveSuccess}
      />
    ),
    hasPhone: ({ key, value, onDeleteUnsavedFilter, onSaveSuccess }) => (
      <HasPhoneFilterCard
        key={key}
        smartlistId={smartlistId}
        filterValue={value}
        onDeleteUnsavedFilter={onDeleteUnsavedFilter}
        onSaveSuccess={onSaveSuccess}
      />
    ),
    termsAndConditions: ({
      key,
      value,
      onDeleteUnsavedFilter,
      onSaveSuccess,
    }) => (
      <TermsAndConditionsFilterCard
        key={key}
        smartlistId={smartlistId}
        filterValue={value}
        onDeleteUnsavedFilter={onDeleteUnsavedFilter}
        onSaveSuccess={onSaveSuccess}
      />
    ),
    liabilityWaiver: ({ key, value, onDeleteUnsavedFilter, onSaveSuccess }) => (
      <LiabilityWaiverFilterCard
        key={key}
        smartlistId={smartlistId}
        filterValue={value}
        onDeleteUnsavedFilter={onDeleteUnsavedFilter}
        onSaveSuccess={onSaveSuccess}
      />
    ),
    lastBooking: ({ key, value, onDeleteUnsavedFilter, onSaveSuccess }) => (
      <LastBookingFilterCard
        key={key}
        smartlistId={smartlistId}
        filterValue={value}
        onDeleteUnsavedFilter={onDeleteUnsavedFilter}
        onSaveSuccess={onSaveSuccess}
      />
    ),
    internalNotes: ({ key, value, onDeleteUnsavedFilter, onSaveSuccess }) => (
      <InternalNotesFilterCard
        key={key}
        smartlistId={smartlistId}
        filterValue={value}
        onDeleteUnsavedFilter={onDeleteUnsavedFilter}
        onSaveSuccess={onSaveSuccess}
      />
    ),
  };

  const createDraftFilterByType: {
    [Key in FilterType]: () => DraftFilter;
  } = {
    age: () => ({
      clientId: createDraftClientId(FILTER_TYPES.age),
      filterType: FILTER_TYPES.age,
      value: createDefaultAgeFilter(smartlistNumericId),
    }),
    creditAccount: () => ({
      clientId: createDraftClientId(FILTER_TYPES.creditAccount),
      filterType: FILTER_TYPES.creditAccount,
      value: createDefaultCreditAccountFilter(smartlistNumericId),
    }),
    gender: () => ({
      clientId: createDraftClientId(FILTER_TYPES.gender),
      filterType: FILTER_TYPES.gender,
      value: createDefaultGenderFilter(smartlistNumericId),
    }),
    tags: () => ({
      clientId: createDraftClientId(FILTER_TYPES.tags),
      filterType: FILTER_TYPES.tags,
      value: createDefaultTagFilterFormValue(smartlistNumericId),
    }),
    memberSignUpDate: () => ({
      clientId: createDraftClientId(FILTER_TYPES.memberSignUpDate),
      filterType: FILTER_TYPES.memberSignUpDate,
      value: createDefaultMemberSignUpDateFilter(smartlistNumericId),
    }),
    passes: () => ({
      clientId: createDraftClientId(FILTER_TYPES.passes),
      filterType: FILTER_TYPES.passes,
      value: createDefaultPassesFilter(smartlistNumericId),
    }),
    bookingMilestone: () => ({
      clientId: createDraftClientId(FILTER_TYPES.bookingMilestone),
      filterType: FILTER_TYPES.bookingMilestone,
      value: createDefaultBookingMilestoneFilter(smartlistNumericId),
    }),
    totalBookingNumber: () => ({
      clientId: createDraftClientId(FILTER_TYPES.totalBookingNumber),
      filterType: FILTER_TYPES.totalBookingNumber,
      value: createDefaultTotalBookingNumberFilter(smartlistNumericId),
    }),
    appointmentPass: () => ({
      clientId: createDraftClientId(FILTER_TYPES.appointmentPass),
      filterType: FILTER_TYPES.appointmentPass,
      value: createDefaultAppointmentPassFilter(smartlistNumericId),
    }),
    totalAppointmentsNumber: () => ({
      clientId: createDraftClientId(FILTER_TYPES.totalAppointmentsNumber),
      filterType: FILTER_TYPES.totalAppointmentsNumber,
      value: createDefaultTotalAppointmentsNumberFilter(smartlistNumericId),
    }),
    activePasses: () => ({
      clientId: createDraftClientId(FILTER_TYPES.activePasses),
      filterType: FILTER_TYPES.activePasses,
      value: createDefaultActivePassesFilter(smartlistNumericId),
    }),
    firstPurchase: () => ({
      clientId: createDraftClientId(FILTER_TYPES.firstPurchase),
      filterType: FILTER_TYPES.firstPurchase,
      value: createDefaultFirstPurchaseFilter(smartlistNumericId),
    }),
    basketAbandonment: () => ({
      clientId: createDraftClientId(FILTER_TYPES.basketAbandonment),
      filterType: FILTER_TYPES.basketAbandonment,
      value: createDefaultBasketAbandonmentFilter(smartlistNumericId),
    }),
    purchaseHistory: () => ({
      clientId: createDraftClientId(FILTER_TYPES.purchaseHistory),
      filterType: FILTER_TYPES.purchaseHistory,
      value: createDefaultPurchaseHistoryFilter(smartlistNumericId),
    }),
    referredMembers: () => ({
      clientId: createDraftClientId(FILTER_TYPES.referredMembers),
      filterType: FILTER_TYPES.referredMembers,
      value: createDefaultReferredMembersFilter(smartlistNumericId),
    }),
    marketingNotification: () => ({
      clientId: createDraftClientId(FILTER_TYPES.marketingNotification),
      filterType: FILTER_TYPES.marketingNotification,
      value: createDefaultMarketingNotificationFilter(smartlistNumericId),
    }),
    hasPhone: () => ({
      clientId: createDraftClientId(FILTER_TYPES.hasPhone),
      filterType: FILTER_TYPES.hasPhone,
      value: createDefaultHasPhoneFilter(smartlistNumericId),
    }),
    termsAndConditions: () => ({
      clientId: createDraftClientId(FILTER_TYPES.termsAndConditions),
      filterType: FILTER_TYPES.termsAndConditions,
      value: createDefaultTermsAndConditionsFilter(smartlistNumericId),
    }),
    liabilityWaiver: () => ({
      clientId: createDraftClientId(FILTER_TYPES.liabilityWaiver),
      filterType: FILTER_TYPES.liabilityWaiver,
      value: createDefaultLiabilityWaiverFilter(smartlistNumericId),
    }),
    lastBooking: () => ({
      clientId: createDraftClientId(FILTER_TYPES.lastBooking),
      filterType: FILTER_TYPES.lastBooking,
      value: createDefaultLastBookingFilter(smartlistNumericId),
    }),
    internalNotes: () => ({
      clientId: createDraftClientId(FILTER_TYPES.internalNotes),
      filterType: FILTER_TYPES.internalNotes,
      value: createDefaultInternalNotesFilter(smartlistNumericId),
    }),
  };

  const renderFilterCard = <TFilterType extends FilterType>(
    filterType: TFilterType,
    params: RenderFilterParams<TFilterType>,
  ) => {
    const renderer = renderFilterCardByType[filterType] as (
      rendererParams: RenderFilterParams<TFilterType>,
    ) => React.JSX.Element;
    return renderer(params);
  };

  const addableFilterOptions = useMemo<FilterSelectorOption[]>(
    () => [
      {
        id: FILTER_TYPES.age,
        label: t("filters.101.title"),
        description: t("filterSelector.options.age.description"),
        category: FILTER_SELECTOR_CATEGORIES.memberInformations,
      },
      {
        id: FILTER_TYPES.creditAccount,
        label: t("filters.1.title"),
        description: t("filterSelector.options.creditAccount.description"),
        category: FILTER_SELECTOR_CATEGORIES.memberInformations,
      },
      {
        id: FILTER_TYPES.gender,
        label: t("filters.5.title"),
        description: t("filterSelector.options.gender.description"),
        category: FILTER_SELECTOR_CATEGORIES.memberInformations,
      },
      {
        id: FILTER_TYPES.tags,
        label: t("filters.11.title"),
        description: t("filterSelector.options.tags.description"),
        category: FILTER_SELECTOR_CATEGORIES.memberInformations,
      },
      {
        id: FILTER_TYPES.memberSignUpDate,
        label: t("filters.18.title"),
        description: t("filterSelector.options.memberSignUpDate.description"),
        category: FILTER_SELECTOR_CATEGORIES.memberInformations,
      },
      {
        id: FILTER_TYPES.passes,
        label: t("filters.19.title"),
        description: t("filterSelector.options.passes.description"),
        category: FILTER_SELECTOR_CATEGORIES.passes,
      },
      {
        id: FILTER_TYPES.basketAbandonment,
        label: t("filters.20.title"),
        description: t("filterSelector.options.basketAbandonment.description"),
        category: FILTER_SELECTOR_CATEGORIES.payments,
      },
      {
        id: FILTER_TYPES.bookingMilestone,
        label: t("filters.21.title"),
        description: t("filterSelector.options.bookingMilestone.description"),
        category: FILTER_SELECTOR_CATEGORIES.bookings,
      },
      {
        id: FILTER_TYPES.totalBookingNumber,
        label: t("filters.22.title"),
        description: t("filterSelector.options.totalBookingNumber.description"),
        category: FILTER_SELECTOR_CATEGORIES.bookings,
      },
      {
        id: FILTER_TYPES.purchaseHistory,
        label: t("filters.24.title"),
        description: t("filterSelector.options.purchaseHistory.description"),
        category: FILTER_SELECTOR_CATEGORIES.payments,
      },
      {
        id: FILTER_TYPES.appointmentPass,
        label: t("filters.25.title"),
        description: t("filterSelector.options.appointmentPass.description"),
        category: FILTER_SELECTOR_CATEGORIES.passes,
      },
      {
        id: FILTER_TYPES.totalAppointmentsNumber,
        label: t("filters.26.title"),
        description: t(
          "filterSelector.options.totalAppointmentsNumber.description",
        ),
        category: FILTER_SELECTOR_CATEGORIES.bookings,
      },
      {
        id: FILTER_TYPES.activePasses,
        label: t("filters.27.title"),
        description: t("filterSelector.options.activePasses.description"),
        category: FILTER_SELECTOR_CATEGORIES.passes,
      },
      {
        id: FILTER_TYPES.firstPurchase,
        label: t("filters.28.title"),
        description: t("filterSelector.options.firstPurchase.description"),
        category: FILTER_SELECTOR_CATEGORIES.payments,
      },
      {
        id: FILTER_TYPES.referredMembers,
        label: t("filters.30.title"),
        description: t("filterSelector.options.referredMembers.description"),
        category: FILTER_SELECTOR_CATEGORIES.memberInformations,
      },
      {
        id: FILTER_TYPES.marketingNotification,
        label: t("filters.103.title"),
        description: t(
          "filterSelector.options.marketingNotification.description",
        ),
        category: FILTER_SELECTOR_CATEGORIES.memberInformations,
      },
      {
        id: FILTER_TYPES.internalNotes,
        label: t("filters.104.title"),
        description: t("filterSelector.options.internalNotes.description"),
        category: FILTER_SELECTOR_CATEGORIES.memberInformations,
      },
      {
        id: FILTER_TYPES.hasPhone,
        label: t("filters.106.title"),
        description: t("filterSelector.options.hasPhone.description"),
        category: FILTER_SELECTOR_CATEGORIES.memberInformations,
      },
      {
        id: FILTER_TYPES.termsAndConditions,
        label: t("filters.107.title"),
        description: t("filterSelector.options.termsAndConditions.description"),
        category: FILTER_SELECTOR_CATEGORIES.memberInformations,
      },
      {
        id: FILTER_TYPES.liabilityWaiver,
        label: t("filters.410.title"),
        description: t("filterSelector.options.liabilityWaiver.description"),
        category: FILTER_SELECTOR_CATEGORIES.memberInformations,
      },
      {
        id: FILTER_TYPES.lastBooking,
        label: t("filters.501.title"),
        description: t("filterSelector.options.lastBooking.description"),
        category: FILTER_SELECTOR_CATEGORIES.bookings,
      },
    ],
    [t],
  );

  const savedFilters: SavedFilter[] = [
    ...ageFilters.map((ageFilter) => ({
      key: `saved-age-${ageFilter.id}`,
      filterType: FILTER_TYPES.age,
      value: mapAgeFilterToFormValue(ageFilter),
    })),
    ...creditAccountFilters.map((creditAccountFilter) => ({
      key: `saved-credit-account-${creditAccountFilter.id}`,
      filterType: FILTER_TYPES.creditAccount,
      value: mapCreditAccountFilterToFormValue(creditAccountFilter),
    })),
    ...genderFilters.map((genderFilter) => ({
      key: `saved-gender-${genderFilter.id}`,
      filterType: FILTER_TYPES.gender,
      value: mapGenderFilterToFormValue(genderFilter),
    })),
    ...tagFilters.map((tagFilter) => ({
      key: `saved-tags-${tagFilter.id}`,
      filterType: FILTER_TYPES.tags,
      value: mapTagFilterToFormValue(tagFilter),
    })),
    ...memberDateJoinedFilters.map((memberDateJoinedFilter) => ({
      key: `saved-member-sign-up-date-${memberDateJoinedFilter.id}`,
      filterType: FILTER_TYPES.memberSignUpDate,
      value: mapMemberDateJoinedFilterToFormValue(memberDateJoinedFilter),
    })),
    ...paymentPackFilters.map((paymentPackFilter) => ({
      key: `saved-passes-${paymentPackFilter.id}`,
      filterType: FILTER_TYPES.passes,
      value: mapPaymentPackFilterToFormValue(paymentPackFilter),
    })),
    ...bookingMilestoneFilters.map((bookingMilestoneFilter) => ({
      key: `saved-booking-milestone-${bookingMilestoneFilter.id}`,
      filterType: FILTER_TYPES.bookingMilestone,
      value: mapBookingMilestoneFilterToFormValue(bookingMilestoneFilter),
    })),
    ...totalBookingFilters.map((totalBookingFilter) => ({
      key: `saved-total-booking-number-${totalBookingFilter.id}`,
      filterType: FILTER_TYPES.totalBookingNumber,
      value: mapTotalBookingFilterToFormValue(totalBookingFilter),
    })),
    ...privatePassFilters.map((privatePassFilter) => ({
      key: `saved-appointment-pass-${privatePassFilter.id}`,
      filterType: FILTER_TYPES.appointmentPass,
      value: mapPrivatePassFilterToFormValue(privatePassFilter),
    })),
    ...totalAppointmentsFilters.map((totalAppointmentsFilter) => ({
      key: `saved-total-appointments-number-${totalAppointmentsFilter.id}`,
      filterType: FILTER_TYPES.totalAppointmentsNumber,
      value: mapTotalAppointmentsFilterToFormValue(totalAppointmentsFilter),
    })),
    ...activePassesFilters.map((activePassesFilter) => ({
      key: `saved-active-passes-${activePassesFilter.id}`,
      filterType: FILTER_TYPES.activePasses,
      value: mapActivePassesFilterToFormValue(activePassesFilter),
    })),
    ...firstPurchaseFilters.map((firstPurchaseFilter) => ({
      key: `saved-first-purchase-${firstPurchaseFilter.id}`,
      filterType: FILTER_TYPES.firstPurchase,
      value: mapFirstPurchaseFilterToFormValue(firstPurchaseFilter),
    })),
    ...basketAbandonmentFilters.map((basketAbandonmentFilter) => ({
      key: `saved-basket-abandonment-${basketAbandonmentFilter.id}`,
      filterType: FILTER_TYPES.basketAbandonment,
      value: mapBasketAbandonmentFilterToFormValue(basketAbandonmentFilter),
    })),
    ...purchaseHistoryFilters.map((purchaseHistoryFilter) => ({
      key: `saved-purchase-history-${purchaseHistoryFilter.id}`,
      filterType: FILTER_TYPES.purchaseHistory,
      value: mapPurchaseHistoryFilterToFormValue(purchaseHistoryFilter),
    })),
    ...referredMemberFilters.map((referredMemberFilter) => ({
      key: `saved-referred-members-${referredMemberFilter.id}`,
      filterType: FILTER_TYPES.referredMembers,
      value: mapReferredMemberFilterToFormValue(referredMemberFilter),
    })),
    ...creditAccountFilters.map((creditAccountFilter) => ({
      key: `saved-credit-account-${creditAccountFilter.id}`,
      filterType: FILTER_TYPES.creditAccount,
      value: mapCreditAccountFilterToFormValue(creditAccountFilter),
    })),
    ...marketingNotificationFilters.map((marketingNotificationFilter) => ({
      key: `saved-marketing-notification-${marketingNotificationFilter.id}`,
      filterType: FILTER_TYPES.marketingNotification,
      value: mapMarketingNotificationFilterToFormValue(
        marketingNotificationFilter,
      ),
    })),
    ...hasPhoneFilters.map((hasPhoneFilter) => ({
      key: `saved-has-phone-${hasPhoneFilter.id}`,
      filterType: FILTER_TYPES.hasPhone,
      value: mapHasPhoneFilterToFormValue(hasPhoneFilter),
    })),
    ...termsAndConditionsFilters.map((termsAndConditionsFilter) => ({
      key: `saved-terms-and-conditions-${termsAndConditionsFilter.id}`,
      filterType: FILTER_TYPES.termsAndConditions,
      value: mapTermsAndConditionsFilterToFormValue(termsAndConditionsFilter),
    })),
    ...liabilityWaiverFilters.map((liabilityWaiverFilter) => ({
      key: `saved-liability-waiver-${liabilityWaiverFilter.id}`,
      filterType: FILTER_TYPES.liabilityWaiver,
      value: mapLiabilityWaiverFilterToFormValue(liabilityWaiverFilter),
    })),
    ...lastBookingFilters.map((lastBookingFilter) => ({
      key: `saved-last-booking-${lastBookingFilter.id}`,
      filterType: FILTER_TYPES.lastBooking,
      value: mapLastBookingFilterToFormValue(lastBookingFilter),
    })),
    ...internalNotesFilters.map((internalNotesFilter) => ({
      key: `saved-internal-notes-${internalNotesFilter.id}`,
      filterType: FILTER_TYPES.internalNotes,
      value: mapInternalNotesFilterToFormValue(internalNotesFilter),
    })),
  ];

  return (
    <FilterManager isLoading={isLoading} isError={isError}>
      <div className="flex flex-col gap-sm w-[500px]">
        {savedFilters.map((savedFilter) =>
          renderFilterCard(savedFilter.filterType, {
            key: savedFilter.key,
            value: savedFilter.value,
          }),
        )}

        {draftFilters.map((draftFilter) =>
          renderFilterCard(draftFilter.filterType, {
            key: draftFilter.clientId,
            value: draftFilter.value,
            onDeleteUnsavedFilter: () => removeDraft(draftFilter.clientId),
            onSaveSuccess: () => removeDraft(draftFilter.clientId),
          }),
        )}

        <FilterSelectorPopover
          options={addableFilterOptions}
          onSelectOption={(selectedFilterType) => {
            if (!isSmartlistFiltersManagerFilterType(selectedFilterType)) {
              return;
            }
            addDraft(createDraftFilterByType[selectedFilterType]());
          }}
        />
      </div>
    </FilterManager>
  );
};
