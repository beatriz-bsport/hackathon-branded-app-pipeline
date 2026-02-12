import { FC, useMemo } from "react";

import { FormField } from "@bsport/form";
import { Autocomplete, AutocompleteProps } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useFetchAllEstablishments } from "#src/hooks/use-fetch-all-establishments";
import { useGroupedEstablishments } from "#src/hooks/use-grouped-establishments";
import { SessionCreationFormData } from "#src/stores/session-creation/types";
import { useTranslation } from "#src/utils/i18n";

export const EstablishmentSelectorField: FC<{
  fieldIdPrefix: string;
  defaultSelectedId: number | null;
}> = ({ fieldIdPrefix, defaultSelectedId }) => {
  const { t } = useTranslation("sessionCreation");

  const company = dataAccessLayer.useCompanyTheme()?.company;

  const { data: establishments, isLoading } = useFetchAllEstablishments({
    company,
    disabled_establishments: false,
  });

  const groupedEstablishments = useGroupedEstablishments(establishments);

  const defaultSelectedIds = useMemo(() => {
    return defaultSelectedId !== null ? [defaultSelectedId.toString()] : [];
  }, [defaultSelectedId]);

  return (
    <FormField<SessionCreationFormData, "establishment", AutocompleteProps>
      name="establishment"
      mapProps={({ form }) => ({
        onSelect: (selectedEstablishmentId: string) => {
          if (!selectedEstablishmentId) return;
          form.setValue(
            "establishment",
            selectedEstablishmentId ? Number(selectedEstablishmentId) : null,
            { shouldValidate: true, shouldDirty: true },
          );
        },
      })}
    >
      <Autocomplete
        items={groupedEstablishments}
        fullWidth
        textfieldProps={{
          id: `${fieldIdPrefix}-establishment-selector`,
          label: t(
            "addSessionModal.steps.configureSession.settings.teacherAndEstablishment.establishment.label",
          ),
          placeholder: t(
            "addSessionModal.steps.configureSession.settings.teacherAndEstablishment.establishment.placeholder",
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
