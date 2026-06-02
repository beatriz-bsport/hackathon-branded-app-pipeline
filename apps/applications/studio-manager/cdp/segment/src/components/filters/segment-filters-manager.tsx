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
import { MemberSignUpDateFilterCard } from "./member-sign-up-date-filter/components/member-sign-up-date-filter-card";
import { createDefaultMemberSignUpDateFilter } from "./member-sign-up-date-filter/default-value";
import { mapMemberDateJoinedFilterToFormValue } from "./member-sign-up-date-filter/mappers/api-to-form-value";
import type { MemberSignUpDateFilterFormValue } from "./member-sign-up-date-filter/types";
import { PassesFilterCardSkeleton } from "./passes-filter/components/passes-filter-card-skeleton";
import { PassesFilterCardWithData } from "./passes-filter/components/passes-filter-card-with-data";
import { createDefaultPassesFilter } from "./passes-filter/default-value";
import { mapApiFilterToFormValue as mapPaymentPackFilterToFormValue } from "./passes-filter/mappers/api-to-form-value";
import type { PassesFilterFormValue } from "./passes-filter/types";
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
  gender: GenderFilterFormValue;
  memberSignUpDate: MemberSignUpDateFilterFormValue;
  passes: PassesFilterFormValue;
  totalBookingNumber: TotalBookingNumberFilterFormValue;
  totalAppointmentsNumber: TotalAppointmentsNumberFilterFormValue;
  bookingMilestone: BookingMilestoneFilterFormValue;
  tags: TagFilterFormValue;
  activePasses: ActivePassesFilterFormValue;
  firstPurchase: FirstPurchaseFilterFormValue;
  creditAccount: CreditAccountFilterFormValue;
};

type DraftFilter =
  | {
      clientId: string;
      filterType: "gender";
      value: FilterValueByType["gender"];
    }
  | {
      clientId: string;
      filterType: "memberSignUpDate";
      value: FilterValueByType["memberSignUpDate"];
    }
  | {
      clientId: string;
      filterType: "totalBookingNumber";
      value: FilterValueByType["totalBookingNumber"];
    }
  | {
      clientId: string;
      filterType: "totalAppointmentsNumber";
      value: FilterValueByType["totalAppointmentsNumber"];
    }
  | {
      clientId: string;
      filterType: "bookingMilestone";
      value: FilterValueByType["bookingMilestone"];
    }
  | {
      clientId: string;
      filterType: "tags";
      value: FilterValueByType["tags"];
    }
  | {
      clientId: string;
      filterType: "activePasses";
      value: FilterValueByType["activePasses"];
    }
  | {
      clientId: string;
      filterType: "passes";
      value: FilterValueByType["passes"];
    }
  | {
      clientId: string;
      filterType: "firstPurchase";
      value: FilterValueByType["firstPurchase"];
    }
  | {
      clientId: string;
      filterType: "creditAccount";
      value: FilterValueByType["creditAccount"];
    };

type SavedFilter =
  | {
      key: string;
      filterType: "gender";
      value: FilterValueByType["gender"];
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
      filterType: "totalBookingNumber";
      value: FilterValueByType["totalBookingNumber"];
    }
  | {
      key: string;
      filterType: "totalAppointmentsNumber";
      value: FilterValueByType["totalAppointmentsNumber"];
    }
  | {
      key: string;
      filterType: "bookingMilestone";
      value: FilterValueByType["bookingMilestone"];
    }
  | {
      key: string;
      filterType: "tags";
      value: FilterValueByType["tags"];
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
      filterType: "creditAccount";
      value: FilterValueByType["creditAccount"];
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
  const genderFilters = smartlistFilters?.genderFilters ?? [];
  const memberDateJoinedFilters =
    smartlistFilters?.memberDateJoinedFilters ?? [];
  const paymentPackFilters = smartlistFilters?.paymentPackFilters ?? [];
  const totalBookingFilters = smartlistFilters?.totalBookingFilters ?? [];
  const totalAppointmentsFilters =
    smartlistFilters?.totalAppointmentsFilters ?? [];
  const bookingMilestoneFilters =
    smartlistFilters?.bookingMilestoneFilters ?? [];
  const tagFilters = smartlistFilters?.tagFilters ?? [];
  const activePassesFilters = smartlistFilters?.activePassesFilters ?? [];
  const firstPurchaseFilters = smartlistFilters?.firstPurchaseFilters ?? [];
  const creditAccountFilters = smartlistFilters?.creditAccountFilters ?? [];

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
    creditAccount: ({ key, value, onDeleteUnsavedFilter, onSaveSuccess }) => (
      <CreditAccountFilterCard
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
    gender: () => ({
      clientId: createDraftClientId(FILTER_TYPES.gender),
      filterType: FILTER_TYPES.gender,
      value: createDefaultGenderFilter(smartlistNumericId),
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
    totalBookingNumber: () => ({
      clientId: createDraftClientId(FILTER_TYPES.totalBookingNumber),
      filterType: FILTER_TYPES.totalBookingNumber,
      value: createDefaultTotalBookingNumberFilter(smartlistNumericId),
    }),
    totalAppointmentsNumber: () => ({
      clientId: createDraftClientId(FILTER_TYPES.totalAppointmentsNumber),
      filterType: FILTER_TYPES.totalAppointmentsNumber,
      value: createDefaultTotalAppointmentsNumberFilter(smartlistNumericId),
    }),
    bookingMilestone: () => ({
      clientId: createDraftClientId(FILTER_TYPES.bookingMilestone),
      filterType: FILTER_TYPES.bookingMilestone,
      value: createDefaultBookingMilestoneFilter(smartlistNumericId),
    }),
    tags: () => ({
      clientId: createDraftClientId(FILTER_TYPES.tags),
      filterType: FILTER_TYPES.tags,
      value: createDefaultTagFilterFormValue(smartlistNumericId),
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
    creditAccount: () => ({
      clientId: createDraftClientId(FILTER_TYPES.creditAccount),
      filterType: FILTER_TYPES.creditAccount,
      value: createDefaultCreditAccountFilter(smartlistNumericId),
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
        id: FILTER_TYPES.gender,
        label: t("filters.5.title"),
        description: t("filterSelector.options.gender.description"),
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
        id: FILTER_TYPES.totalBookingNumber,
        label: t("filters.22.title"),
        description: t("filterSelector.options.totalBookingNumber.description"),
        category: FILTER_SELECTOR_CATEGORIES.bookings,
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
        id: FILTER_TYPES.bookingMilestone,
        label: t("filters.21.title"),
        description: t("filterSelector.options.bookingMilestone.description"),
        category: FILTER_SELECTOR_CATEGORIES.bookings,
      },
      {
        id: FILTER_TYPES.tags,
        label: t("filters.11.title"),
        description: t("filterSelector.options.tags.description"),
        category: FILTER_SELECTOR_CATEGORIES.memberInformations,
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
        id: FILTER_TYPES.creditAccount,
        label: t("filters.1.title"),
        description: t("filterSelector.options.creditAccount.description"),
        category: FILTER_SELECTOR_CATEGORIES.memberInformations,
      },
    ],
    [t],
  );

  const savedFilters: SavedFilter[] = [
    ...genderFilters.map((genderFilter) => ({
      key: `saved-gender-${genderFilter.id}`,
      filterType: FILTER_TYPES.gender,
      value: mapGenderFilterToFormValue(genderFilter),
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
    ...totalBookingFilters.map((totalBookingFilter) => ({
      key: `saved-total-booking-number-${totalBookingFilter.id}`,
      filterType: FILTER_TYPES.totalBookingNumber,
      value: mapTotalBookingFilterToFormValue(totalBookingFilter),
    })),
    ...totalAppointmentsFilters.map((totalAppointmentsFilter) => ({
      key: `saved-total-appointments-number-${totalAppointmentsFilter.id}`,
      filterType: FILTER_TYPES.totalAppointmentsNumber,
      value: mapTotalAppointmentsFilterToFormValue(totalAppointmentsFilter),
    })),
    ...bookingMilestoneFilters.map((bookingMilestoneFilter) => ({
      key: `saved-booking-milestone-${bookingMilestoneFilter.id}`,
      filterType: FILTER_TYPES.bookingMilestone,
      value: mapBookingMilestoneFilterToFormValue(bookingMilestoneFilter),
    })),
    ...tagFilters.map((tagFilter) => ({
      key: `saved-tags-${tagFilter.id}`,
      filterType: FILTER_TYPES.tags,
      value: mapTagFilterToFormValue(tagFilter),
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
    ...creditAccountFilters.map((creditAccountFilter) => ({
      key: `saved-credit-account-${creditAccountFilter.id}`,
      filterType: FILTER_TYPES.creditAccount,
      value: mapCreditAccountFilterToFormValue(creditAccountFilter),
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
