export const INTERNAL_NOTES_SUB_FILTER_IDS = {
  noteCreationDate: "noteCreationDate",
} as const;

export type InternalNotesSubFilterId =
  (typeof INTERNAL_NOTES_SUB_FILTER_IDS)[keyof typeof INTERNAL_NOTES_SUB_FILTER_IDS];

export type InternalNotesSubFilterField = "noteCreationDate";

export const internalNotesSubFilterFieldMap: Record<
  InternalNotesSubFilterId,
  InternalNotesSubFilterField
> = {
  [INTERNAL_NOTES_SUB_FILTER_IDS.noteCreationDate]: "noteCreationDate",
};
