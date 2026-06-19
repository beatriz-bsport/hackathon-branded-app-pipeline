import type {
  AgeFilter,
  CreateAgeFilterPayload,
} from "@bsport/api-cdp/smartlist";

import type { SegmentFilterCardProps } from "../segment-filters-registry/types";
import type { AgeFilterNumberTypeValue } from "./constants";

export type AgeFilterNumberType = AgeFilterNumberTypeValue;

export type AgeFilterFormValue = {
  id?: number;
  smartlist: number;
  type: AgeFilterNumberType;
  value: number;
  secondValue: number | null;
};

export type AgeFilterDirtyPatchPayload = Partial<
  Omit<AgeFilter, "id" | "company" | "smartlist" | "filter_identifier">
>;

export type AgeFilterCreatePayload = CreateAgeFilterPayload;

export type AgeFilterCardProps = SegmentFilterCardProps<AgeFilterFormValue>;
