import { type FC, useMemo } from "react";

import { type Establishment } from "@bsport/api-core";
import { FormField } from "@bsport/form";
import {
  Autocomplete,
  type AutocompleteProps,
} from "@bsport/kaizen-primitive-core";

import { groupEstablishmentsByAddress } from "#src/utils/group-establishments-by-address";
import { useTranslation } from "#src/utils/i18n";

import { type WellhubFormSchema } from "./schema";

type Props = {
  establishments: Establishment[];
  disabledEstablishmentIds: Set<number>;
  fieldIdPrefix: string;
  initialSelectedIds: number[];
  selectorKey: string;
};

export const WellhubEstablishmentField: FC<Props> = ({
  establishments,
  disabledEstablishmentIds,
  fieldIdPrefix,
  initialSelectedIds,
  selectorKey,
}) => {
  const { t } = useTranslation("common");

  const enabledEstablishments = useMemo(
    () => establishments.filter((establishment) => !establishment.disabled),
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
    <FormField<WellhubFormSchema, "establishmentIds", AutocompleteProps>
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
          label: t("wellhub.form.fields.establishments.label"),
          placeholder: t("wellhub.form.fields.establishments.placeholder"),
        }}
        menuProps={{
          className: "max-h-component-select overflow-y-auto",
        }}
      />
    </FormField>
  );
};
