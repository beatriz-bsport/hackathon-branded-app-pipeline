import { FC, useMemo } from "react";

import { FormField } from "@bsport/form";
import {
  Autocomplete,
  AutocompleteProps,
  MenuOption,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useFetchAllTeachers } from "#src/hooks/use-fetch-all-teachers";
import { SessionCreationFormData } from "#src/stores/session-creation/types";
import { useTranslation } from "#src/utils/i18n";

export const TeacherSelectorField: FC<{
  fieldIdPrefix: string;
  defaultSelectedId: number | null;
}> = ({ fieldIdPrefix, defaultSelectedId }) => {
  const { t } = useTranslation("sessionCreation");

  const restrictedTeachers = dataAccessLayer.useUserRestrictedTeachers();

  const companyId = dataAccessLayer.useCompanyTheme()?.company;

  const { data: teachers, isLoading } = useFetchAllTeachers({
    ...(restrictedTeachers.length > 0 ? { id__in: restrictedTeachers } : {}),
    company: companyId,
  });

  const teacherItems: MenuOption[] = (teachers ?? []).map((teacher) => ({
    id: teacher.id.toString(),
    label: teacher.name,
  }));

  const defaultSelectedIds = useMemo(() => {
    return defaultSelectedId !== null ? [defaultSelectedId.toString()] : [];
  }, [defaultSelectedId]);

  return (
    <FormField<SessionCreationFormData, "coach", AutocompleteProps>
      name="coach"
      mapProps={({ form: { setValue } }) => ({
        onSelect: (selectedTeacherId: string) => {
          setValue(
            "coach",
            selectedTeacherId ? Number(selectedTeacherId) : null,
            { shouldValidate: true },
          );
        },
        onClear: () => {
          setValue("coach", null, { shouldValidate: true });
        },
      })}
    >
      <Autocomplete
        items={teacherItems}
        textfieldProps={{
          id: `${fieldIdPrefix}-teacher-selector`,
          label: t(
            "addSessionModal.steps.configureSession.settings.teacherAndEstablishment.teacher.label",
          ),
          placeholder: t(
            "addSessionModal.steps.configureSession.settings.teacherAndEstablishment.teacher.placeholder",
          ),
          required: true,
        }}
        loadingProps={{ isLoading }}
        defaultSelectedIds={defaultSelectedIds}
      />
    </FormField>
  );
};
