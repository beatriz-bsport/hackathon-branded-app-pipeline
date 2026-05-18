import { useQuery } from "@tanstack/react-query";
import { type FC, useMemo } from "react";

import { type Teacher, fetchFlatTeachers, teacherKeys } from "@bsport/api-core";
import { fetchRoleDefinitionsQueryOptions } from "@bsport/api-staff-management/role";
import { FormField, useFormContext } from "@bsport/form";
import {
  Body,
  DropdownMultiSelect,
  type DropdownMultiSelectProps,
  Title,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

import type { StaffFormData } from "../types";

const TEACHERS_STALE_TIME = 2 * 60 * 1000;

type TeacherOption = {
  name: string;
};

export const StaffFormTeachers: FC = () => {
  const { t } = useTranslation("staff-form");
  const companyId = dataAccessLayer.useCompanyTheme()?.company;
  const { watch } = useFormContext<StaffFormData>();
  const selectedRoleId = watch("role");

  const { data: roles = [] } = useQuery(
    fetchRoleDefinitionsQueryOptions(fetch),
  );

  const { data: teachers = [], isFetching: isFetchingTeachers } = useQuery({
    queryKey: teacherKeys.list({ company: companyId }),
    queryFn: () =>
      companyId !== undefined
        ? fetchFlatTeachers(fetch, { company: companyId })
        : Promise.resolve([] as Teacher[]),
    staleTime: TEACHERS_STALE_TIME,
  });

  const selectedRole = roles.find((role) => String(role.id) === selectedRoleId);
  const isCustomRole = selectedRole?.editable === true;

  const teacherOptions = useMemo(
    () =>
      teachers.map((teacher) => ({
        id: String(teacher.id),
        children: teacher.name,
        name: teacher.name,
      })),
    [teachers],
  );

  if (!isCustomRole) {
    return null;
  }

  return (
    <div className="flex flex-col gap-sm">
      <div className="flex flex-col gap-2xs">
        <Title htmlVariant="h4" weight="strong">
          {t("formFields.teachers.heading")}
        </Title>
        <Body htmlVariant="p" size="sm" color="weak">
          {t("formFields.teachers.description")}
        </Body>
      </div>
      <FormField<
        StaffFormData,
        "coachesInRoleIds",
        DropdownMultiSelectProps<TeacherOption>
      >
        name="coachesInRoleIds"
        mapProps={({ field, form }) => ({
          value: field.value ?? [],
          onChange: (values) => {
            form.setValue("coachesInRoleIds", values, {
              shouldDirty: true,
              shouldValidate: true,
            });
          },
          options: teacherOptions,
          isLoading: isFetchingTeachers,
          anchorLabel: t("formFields.teachers.placeholder"),
          label: t("formFields.teachers.label"),
          mapOptionToChip: (option) => ({
            id: option.id,
            color: "default",
            type: "weak",
            size: "lg",
            label: option.name,
          }),
        })}
      >
        {/** @ts-expect-error props are provided by the wrapper */}
        <DropdownMultiSelect<TeacherOption> className="max-w-md" withSearch />
      </FormField>
    </div>
  );
};
