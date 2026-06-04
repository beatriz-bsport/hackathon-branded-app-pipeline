import type { PrebuiltSegmentId } from "@bsport/api-cdp/prebuilt-segment";

export type { PrebuiltSegmentId } from "@bsport/api-cdp/prebuilt-segment";

export const PREBUILT_SEGMENT_IDS = [
  "customers",
  "active_members",
  "active_trials",
] as const satisfies readonly PrebuiltSegmentId[];

const PREBUILT_SEGMENT_ID_SET: ReadonlySet<string> = new Set(
  PREBUILT_SEGMENT_IDS,
);

export function isPrebuiltSegmentId(value: string): value is PrebuiltSegmentId {
  return PREBUILT_SEGMENT_ID_SET.has(value);
}
