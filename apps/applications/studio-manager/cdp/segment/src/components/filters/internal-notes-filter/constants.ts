import { NoteCondition } from "@bsport/api-cdp/smartlist";

/**
 * Radio `value` strings for note type (Kaizen `FormRadioGroup`).
 * Order matches product UI: Essential → Medical → Both.
 */
export const NOTE_TYPE_OPTIONS = {
  essentialNonMedical: "essential_non_medical",
  medical: "medical",
  both: "both",
} as const;

export type NoteTypeOption =
  (typeof NOTE_TYPE_OPTIONS)[keyof typeof NOTE_TYPE_OPTIONS];

const NOTE_TYPE_OPTION_VALUES = Object.values(NOTE_TYPE_OPTIONS);

/**
 * Narrows a string to a known note type radio option.
 */
export const isNoteTypeOption = (value: string): value is NoteTypeOption =>
  NOTE_TYPE_OPTION_VALUES.includes(value as NoteTypeOption);

const NOTE_TYPE_TO_API: Record<NoteTypeOption, NoteCondition> = {
  [NOTE_TYPE_OPTIONS.essentialNonMedical]: NoteCondition.NON_MEDICAL_NOTE,
  [NOTE_TYPE_OPTIONS.medical]: NoteCondition.MEDICAL_NOTE,
  [NOTE_TYPE_OPTIONS.both]: NoteCondition.ANY_NOTE,
};

const API_TO_NOTE_TYPE: Record<NoteCondition, NoteTypeOption> = {
  [NoteCondition.ANY_NOTE]: NOTE_TYPE_OPTIONS.both,
  [NoteCondition.MEDICAL_NOTE]: NOTE_TYPE_OPTIONS.medical,
  [NoteCondition.NON_MEDICAL_NOTE]: NOTE_TYPE_OPTIONS.essentialNonMedical,
};

/**
 * Maps a note type radio option to the API `note_condition` value.
 */
export const mapNoteTypeToApi = (noteType: NoteTypeOption): NoteCondition =>
  NOTE_TYPE_TO_API[noteType];

/**
 * Maps an API `note_condition` to the note type radio option.
 * Legacy `null` ("no notes") maps to Both per product policy.
 */
export const mapApiNoteConditionToNoteType = (
  noteCondition: NoteCondition | null,
): NoteTypeOption => API_TO_NOTE_TYPE[noteCondition ?? NoteCondition.ANY_NOTE];
