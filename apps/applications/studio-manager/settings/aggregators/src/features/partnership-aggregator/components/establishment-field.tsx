import { type FC, useMemo } from "react";

import { type Establishment } from "@bsport/api-core";
import { FormField } from "@bsport/form";
import {
  Autocomplete,
  type AutocompleteProps,
} from "@bsport/kaizen-primitive-core";

import { groupEstablishmentsByAddress } from "#src/utils/group-establishments-by-address";

type BaseSchema = { establishmentIds: number[] };

type Props = {
  label: string;
  placeholder: string;
  establishments: Establishment[];
  disabledEstablishmentIds: Set<number>;
  fieldIdPrefix: string;
  initialSelectedIds: number[];
  selectorKey: string;
};

export const EstablishmentField: FC<Props> = ({
  label,
  placeholder,
  establishments,
  disabledEstablishmentIds,
  fieldIdPrefix,
  initialSelectedIds,
  selectorKey,
}) => {
  const enabledEstablishments = useMemo(
    () => establishments.filter((e) => !e.disabled),
    [establishments],
  );

  const groupedItems = useMemo(
    () =>
      groupEstablishmentsByAddress(
        enabledEstablishments,
        disabledEstablishmentIds,
      ),
    [enabledEstablishments, disabledEstablishmentIds],
  );

  return (
    <FormField<BaseSchema, "establishmentIds", AutocompleteProps>
      name="establishmentIds"
      mapProps={({ form, field, fieldState, formState }) => ({
        defaultSelectedIds: (formState.isDirty
          ? field.value
          : initialSelectedIds
        ).map(String),
        onSelect: (selectedIds: string[]) => {
          form.setValue("establishmentIds", selectedIds.map(Number), {
            shouldDirty: true,
            shouldValidate: true,
          });
        },
        status: fieldState.error ? "error" : "default",
        statusText: fieldState.error?.message,
      })}
    >
      <Autocomplete
        key={selectorKey}
        multiSelect
        items={groupedItems}
        fullWidth
        showSelectedItemsInBase
        textfieldProps={{
          id: `${fieldIdPrefix}-establishment-selector`,
          label,
          placeholder,
        }}
        menuProps={{
          className: "max-h-component-select overflow-y-auto",
        }}
      />
    </FormField>
  );
};
