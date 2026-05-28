import type { ReactElement } from "react";
import { useMemo } from "react";

import type { Appointment } from "@bsport/api-book/appointments";
import { type FieldValues, FormField } from "@bsport/form";
import {
  AutocompleteControlled,
  type AutocompleteControlledProps,
} from "@bsport/kaizen-primitive-core";

import { i18nInstance, useTranslation } from "#src/i18n";
import type { NumberListFieldPath } from "#src/utils/form-types";

import type { AppointmentCompatibility, CompatibilityFieldPath } from "./types";

// eslint-disable-next-line react-refresh/only-export-components
export const DEFAULT_PROPS: Partial<AutocompleteControlledProps> = {
  debounceValue: 10,
  popoverPlacement: "bottom-right",
  withSelectedInBase: false,
  withChips: false,
  searchMode: "local",
  multiSelect: true,
  fullWidth: true,
  className: "max-w-component-select",
};

export type AppointmentsSelectorProps<
  TFormValues extends FieldValues,
  TPrivateServicesField extends
    NumberListFieldPath<TFormValues> = NumberListFieldPath<TFormValues>,
  TCompatibilityField extends
    CompatibilityFieldPath<TFormValues> = CompatibilityFieldPath<TFormValues>,
> = {
  id: string;
  appointments: Appointment[];
  isLoading: boolean;
  privateServicesFieldName: TPrivateServicesField;
  compatibilityFieldName: TCompatibilityField;
  required?: boolean;
} & Omit<
  AutocompleteControlledProps,
  | "items"
  | "value"
  | "onChange"
  | "textfieldProps"
  | "loadingProps"
  | "multiSelect"
>;

/**
 * Reconciles the compatibility array with a new list of appointment ids:
 * keeps existing entries whose ids are still selected, and adds default
 * entries (no excluded slots) for newly added ids.
 */
const buildNextCompatibility = (
  previous: AppointmentCompatibility[],
  nextIds: number[],
): AppointmentCompatibility[] => {
  const survivors = previous.filter((entry) =>
    nextIds.includes(entry.private_service),
  );
  const survivorIds = new Set(survivors.map((entry) => entry.private_service));
  const additions = nextIds
    .filter((id) => !survivorIds.has(id))
    .map<AppointmentCompatibility>((id) => ({
      private_service: id,
      excluded_slot_ids: [],
    }));
  return [...survivors, ...additions];
};

export const AppointmentsSelector = <
  TFormValues extends FieldValues,
  TPrivateServicesField extends
    NumberListFieldPath<TFormValues> = NumberListFieldPath<TFormValues>,
  TCompatibilityField extends
    CompatibilityFieldPath<TFormValues> = CompatibilityFieldPath<TFormValues>,
>({
  id,
  appointments,
  isLoading,
  privateServicesFieldName,
  compatibilityFieldName,
  required,
  ...autocompleteProps
}: AppointmentsSelectorProps<
  TFormValues,
  TPrivateServicesField,
  TCompatibilityField
>): ReactElement => {
  const { t } = useTranslation("buyables", { i18n: i18nInstance });

  const items = useMemo(
    () =>
      appointments.map((appointment) => ({
        id: appointment.id.toString(),
        label: appointment.name,
      })),
    [appointments],
  );

  return (
    <FormField<TFormValues, TPrivateServicesField, AutocompleteControlledProps>
      name={privateServicesFieldName}
      mapProps={({ defaultProps, form }) => {
        const { value, ...otherProps } = defaultProps;
        const privateServices = (value as number[] | null) ?? [];

        const onChange: AutocompleteControlledProps["onChange"] = (
          nextValue,
        ) => {
          const nextIds = nextValue.map((stringId) => parseInt(stringId, 10));

          form.setValue(
            privateServicesFieldName,
            nextIds as TFormValues[TPrivateServicesField],
            { shouldDirty: true, shouldValidate: true },
          );

          const currentCompatibility = (form.getValues(
            compatibilityFieldName,
          ) ?? []) as AppointmentCompatibility[];
          form.setValue(
            compatibilityFieldName,
            buildNextCompatibility(
              currentCompatibility,
              nextIds,
            ) as TFormValues[TCompatibilityField],
            { shouldDirty: true, shouldValidate: true },
          );
        };

        return {
          ...otherProps,
          value: privateServices.map((appointmentId) =>
            appointmentId.toString(),
          ),
          onChange,
          multiSelect: true,
          textfieldProps: {
            id: `${id}-textfield`,
            label: t(
              "appointmentPassForm.compatibleAppointmentsSelector.label",
            ),
            placeholder: t(
              "appointmentPassForm.compatibleAppointmentsSelector.placeholder",
            ),
            status: otherProps.status,
            statusText: otherProps.statusText,
            iconRight: "chevron-down",
            required,
          },
        };
      }}
    >
      {/** @ts-expect-error Props are provided by the wrapper */}
      <AutocompleteControlled
        key={id}
        items={items}
        {...DEFAULT_PROPS}
        {...autocompleteProps}
        loadingProps={{
          isLoading,
          message: t(
            "appointmentPassForm.compatibleAppointmentsSelector.loadingMessage",
          ),
        }}
      />
    </FormField>
  );
};

AppointmentsSelector.displayName = "KaizenAppointmentsSelector";
