export const PREBUILT_SEGMENT_IDS = [
  "customers",
  "active_members",
  "active_trials",
] as const;

export type PrebuiltSegmentId = (typeof PREBUILT_SEGMENT_IDS)[number];

export function isPrebuiltSegmentId(value: string): value is PrebuiltSegmentId {
  return PREBUILT_SEGMENT_IDS.includes(value as PrebuiltSegmentId);
}
