import { FormRadioGroup } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import {
  NOTE_TYPE_OPTIONS,
  type NoteTypeOption,
  isNoteTypeOption,
} from "../constants";

type NoteTypeRadioGroupProps = {
  id: string;
  value: NoteTypeOption;
  onChange: (nextValue: NoteTypeOption) => void;
  disabled?: boolean;
};

/**
 * Essential / Medical / Both note type selector backed by Kaizen `FormRadioGroup`.
 */
export const NoteTypeRadioGroup = ({
  id,
  value,
  onChange,
  disabled = false,
}: NoteTypeRadioGroupProps) => {
  const { t } = useTranslation("filters");

  const noteTypeOptions = [
    {
      value: NOTE_TYPE_OPTIONS.essentialNonMedical,
      label: t("filters.104.fields.noteType.essential"),
    },
    {
      value: NOTE_TYPE_OPTIONS.medical,
      label: t("filters.104.fields.noteType.medical"),
    },
    {
      value: NOTE_TYPE_OPTIONS.both,
      label: t("filters.104.fields.noteType.both"),
    },
  ];

  return (
    <FormRadioGroup
      id={id}
      options={noteTypeOptions}
      value={value}
      disabled={disabled}
      onChange={(event) => {
        const nextValue = event.target.value;
        if (isNoteTypeOption(nextValue)) {
          onChange(nextValue);
        }
      }}
    />
  );
};
