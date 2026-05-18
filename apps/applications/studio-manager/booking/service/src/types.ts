import type { Pass, PassCategory } from "@bsport/api-buyables";

export type CompatiblePass = Pick<
  Pass,
  | "id"
  | "name"
  | "price"
  | "manager_only"
  | "new_member_only"
  | "linked_private_pass"
  | "is_usable_by_staff"
  | "credits"
  | "unlimited"
  | "SCTs"
  | "metaActivities"
  | "establishments"
  | "off_peak_schedule"
>;

export type CompatiblePassGroup = {
  category: PassCategory | null;
  passes: CompatiblePass[];
};

export type PassFlags = {
  linked_private_pass: number | null;
  manager_only: boolean;
  is_usable_by_staff: boolean;
  new_member_only: boolean;
};

export type CompatibilityLookup = {
  sctNames: Map<number, string>;
  metaActivityNames: Map<number, string>;
  establishmentNames: Map<number, string>;
};
