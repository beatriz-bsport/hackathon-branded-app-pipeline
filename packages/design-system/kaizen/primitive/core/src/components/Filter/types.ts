import type { Dispatch, SetStateAction } from "react";

import type { DropdownMenuSearchConfig } from "#src/components/DropdownMenu/DropdownMenu";

export type FilterElementState = {
  id: number;
  field: string | null;
  filter: string | null;
  valueIds: string[];
};

export type FilterField = {
  id: string;
  label: string;
  availableFilters: string[];
  values: { id: string; label: string }[];
  multiSelect: boolean;
  searchConfig?: DropdownMenuSearchConfig;
};

export type FilterProps = {
  filters: {
    id: string;
    label: string;
  }[];
  fields: {
    [key: string]: FilterField;
  };
  selectFieldLabel: string;
  onFilterChange: (filters: FilterElementState[]) => void;
  singleField?: boolean;
};

export type ResponsiveFilterProps = Omit<FilterProps, "onFilterChange"> & {
  filterElements: FilterElementState[];
  setFilterElements: Dispatch<SetStateAction<FilterElementState[]>>;
  resetFilters: () => void;
};
