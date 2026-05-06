import { useQuery } from "@tanstack/react-query";
import {
  type RefObject,
  startTransition,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";

import { fetchRoleDefinitionsQueryOptions } from "@bsport/api-staff-management/role";
import type {
  FilterElementState,
  FilterProps,
} from "@bsport/kaizen-primitive-core";
import {
  DEFAULT_PAGE,
  usePaginationQueryParams,
} from "@bsport/use-pagination-query-params";

import type { StaffActiveFilters } from "#src/hooks/api/use-staff-list-query";
import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

const FIELD_ROLE = "role";
const FILTER_IS = "is";
const ROLE_ALL = "all";

const getFieldValue = (
  filters: FilterElementState[],
  field: string,
): string | undefined =>
  filters.find((filter) => filter.field === field)?.valueIds?.[0];

const toActiveFilters = (filters: FilterElementState[]): StaffActiveFilters => {
  const roleId = getFieldValue(filters, FIELD_ROLE);

  if (!roleId || roleId === ROLE_ALL) {
    return {};
  }

  const parsed = /^\d+$/.test(roleId) ? parseInt(roleId, 10) : NaN;

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return {};
  }

  return {
    role__in: [parsed],
  };
};

export const useStaffFilters = (): {
  activeFilters: StaffActiveFilters;
  filterConfig: FilterProps;
  filterRef: RefObject<{ resetFilters: () => void } | null>;
  resetFilters: () => void;
} => {
  const { t } = useTranslation("staff-list");
  const { currentPageSize, setPageSettings } = usePaginationQueryParams();
  const filterRef = useRef<{ resetFilters: () => void } | null>(null);
  const [activeFilters, setActiveFilters] = useState<StaffActiveFilters>({});

  const { data: roles = [] } = useQuery(
    fetchRoleDefinitionsQueryOptions(fetch),
  );

  const roleValues = useMemo(
    () => [
      { id: ROLE_ALL, label: t("filters.role.all") },
      ...roles.map((role) => ({ id: role.id.toString(), label: role.name })),
    ],
    [roles, t],
  );

  const onFilterChange = useCallback(
    (filters: FilterElementState[]) => {
      startTransition(() => {
        setActiveFilters(toActiveFilters(filters));
      });
      setPageSettings(DEFAULT_PAGE, currentPageSize);
    },
    [currentPageSize, setPageSettings],
  );

  const filterConfig: FilterProps = useMemo(
    () => ({
      fields: {
        [FIELD_ROLE]: {
          id: FIELD_ROLE,
          label: t("filters.role.label"),
          availableFilters: [FILTER_IS],
          multiSelect: false,
          values: roleValues,
        },
      },
      filters: [{ id: FILTER_IS, label: t("filters.is") }],
      onFilterChange,
      selectFieldLabel: t("filters.label"),
      singleField: true,
    }),
    [t, onFilterChange, roleValues],
  );

  const resetFilters = () => {
    filterRef.current?.resetFilters();
    startTransition(() => {
      setActiveFilters({});
    });
    setPageSettings(DEFAULT_PAGE, currentPageSize);
  };

  return {
    activeFilters,
    filterConfig,
    filterRef,
    resetFilters,
  };
};
