import { uniqBy } from "lodash";
import { FC, useMemo } from "react";

import { FormField, useFormContext } from "@bsport/form";
import {
  Autocomplete,
  AutocompleteProps,
  MenuOption,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import {
  useFetchTeacher,
  useFetchTeachers,
} from "#src/hooks/use-fetch-teachers";
import { SessionCreationFormData } from "#src/stores/session-creation/types";
import { useTranslation } from "#src/utils/i18n";

export const TeacherSelectorField: FC<{
  fieldIdPrefix: string;
}> = ({ fieldIdPrefix }) => {
  const { t } = useTranslation("sessionCreation");
  const { watch } = useFormContext<SessionCreationFormData>();

  const coach = watch("coach");

  const restrictedTeachers = dataAccessLayer.useUserRestrictedTeachers();

  const companyId = dataAccessLayer.useCompanyTheme()?.company;

  const { data: allTeachers, isLoading: isLoadingAllTeachers } =
    useFetchTeachers({
      ...(restrictedTeachers.length > 0 ? { id__in: restrictedTeachers } : {}),
      company: companyId,
      disabled: false,
    });

  const { data: selectedTeacher, isLoading: isLoadingSelectedTeacher } =
    useFetchTeacher(coach ?? undefined);

  const isLoading = isLoadingAllTeachers || isLoadingSelectedTeacher;

  const teacherItems: MenuOption[] = uniqBy(
    [...(selectedTeacher ? [selectedTeacher] : []), ...(allTeachers ?? [])],
    "id",
  ).map((teacher) => ({
    id: teacher.id.toString(),
    label: teacher.name,
  }));

  const defaultSelectedIds = useMemo(() => {
    return coach !== null ? [coach.toString()] : [];
  }, [coach]);

  const selectedTeacherItem = useMemo(() => {
    return teacherItems.find((teacher) => teacher.id === coach?.toString());
  }, [coach, teacherItems]);

  return (
    <FormField<SessionCreationFormData, "coach", AutocompleteProps>
      name="coach"
      mapProps={({ form }) => ({
        onSelect: (selectedTeacherId: string) => {
          if (!selectedTeacherId) return;
          form.setValue(
            "coach",
            selectedTeacherId ? Number(selectedTeacherId) : null,
            { shouldValidate: true, shouldDirty: true },
          );
        },
      })}
    >
      <Autocomplete
        items={teacherItems}
        fullWidth
        textfieldProps={{
          id: `${fieldIdPrefix}-teacher-selector`,
          label: t(
            "addSessionModal.steps.configureSession.settings.teacherAndEstablishment.teacher.label",
          ),
          placeholder:
            selectedTeacherItem?.label ??
            t(
              "addSessionModal.steps.configureSession.settings.teacherAndEstablishment.teacher.placeholder",
            ),
          required: true,
          className: "max-w-component-select",
        }}
        menuProps={{
          className: "max-h-component-select overflow-y-auto",
        }}
        loadingProps={{ isLoading }}
        defaultSelectedIds={defaultSelectedIds}
      />
    </FormField>
  );
};
