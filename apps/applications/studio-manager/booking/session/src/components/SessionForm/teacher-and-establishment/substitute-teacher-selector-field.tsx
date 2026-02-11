import { FC, useMemo } from "react";

import { FormField, useFormContext } from "@bsport/form";
import {
  Autocomplete,
  AutocompleteProps,
  MenuOption,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useFetchTeachers } from "#src/hooks/use-fetch-teachers";
import { useTranslation } from "#src/utils/i18n";

import { SessionEditFormData } from "../types";

export const SubstituteTeacherSelectorField: FC<{
  fieldIdPrefix: string;
}> = ({ fieldIdPrefix }) => {
  const { t } = useTranslation("sessionEdit");

  const { watch } = useFormContext<SessionEditFormData>();

  const assignedTeacher = watch("coach");

  const substituteTeacher = watch("coach_override");

  const restrictedTeachers = dataAccessLayer.useUserRestrictedTeachers();

  const companyId = dataAccessLayer.useCompanyTheme()?.company;

  const { data: teachers, isLoading } = useFetchTeachers({
    ...(restrictedTeachers.length > 0 ? { id__in: restrictedTeachers } : {}),
    company: companyId,
    disabled: false,
  });

  const teacherItems: MenuOption[] = useMemo(() => {
    return (teachers ?? [])
      .filter((teacher) => teacher.id !== assignedTeacher)
      .map((teacher) => ({
        id: teacher.id.toString(),
        label: teacher.name,
      }));
  }, [teachers, assignedTeacher]);

  const defaultSelectedIds = useMemo(() => {
    return substituteTeacher != null ? [substituteTeacher.toString()] : [];
  }, [substituteTeacher]);

  const selectedSubstituteTeacherItem = useMemo(() => {
    return teacherItems.find(
      (teacher) => teacher.id === substituteTeacher?.toString(),
    );
  }, [substituteTeacher, teacherItems]);

  return (
    <FormField<SessionEditFormData, "coach_override", AutocompleteProps>
      name="coach_override"
      mapProps={({ form: { setValue } }) => ({
        onSelect: (selectedTeacherId: string) => {
          if (!selectedTeacherId) return;
          setValue(
            "coach_override",
            selectedTeacherId ? Number(selectedTeacherId) : null,
            { shouldValidate: true, shouldDirty: true },
          );
        },
        onClear: () => {
          setValue("coach_override", null, {
            shouldValidate: true,
            shouldDirty: true,
          });
        },
      })}
    >
      <Autocomplete
        clearOnSelect
        items={teacherItems}
        textfieldProps={{
          id: `${fieldIdPrefix}-substitute-teacher-selector`,
          label: t("editSessionForm.content.substituteTeacherLabel"),
          placeholder:
            selectedSubstituteTeacherItem?.label ??
            t("editSessionForm.content.substituteTeacherPlaceholder"),
        }}
        loadingProps={{ isLoading: isLoading }}
        defaultSelectedIds={defaultSelectedIds}
      />
    </FormField>
  );
};
