import uniqBy from "lodash/uniqBy";
import { FC, useMemo } from "react";

import { FormField, useFormContext } from "@bsport/form";
import { Autocomplete, AutocompleteProps } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import {
  useFetchAllEstablishments,
  useFetchEstablishment,
} from "#src/hooks/use-fetch-establishments";
import { useGroupedEstablishments } from "#src/hooks/use-grouped-establishments";
import { SessionCreationFormData } from "#src/stores/session-creation/types";
import { useTranslation } from "#src/utils/i18n";

export const EstablishmentSelectorField: FC<{
  fieldIdPrefix: string;
}> = ({ fieldIdPrefix }) => {
  const { t } = useTranslation("sessionCreation");

  const { watch } = useFormContext<SessionCreationFormData>();

  const establishmentId = watch("establishment");
  const company = dataAccessLayer.useCompanyTheme()?.company;

  const { data: allEstablishments, isLoading: isLoadingAllEstablishments } =
    useFetchAllEstablishments({
      company,
      disabled_establishments: false,
    });

  const {
    data: selectedEstablishment,
    isLoading: isLoadingSelectedEstablishment,
  } = useFetchEstablishment(establishmentId ?? undefined);

  const isLoading =
    isLoadingAllEstablishments || isLoadingSelectedEstablishment;

  const groupedEstablishments = useGroupedEstablishments(
    uniqBy(
      [
        ...(selectedEstablishment ? [selectedEstablishment] : []),
        ...(allEstablishments ?? []),
      ],
      "id",
    ),
  );

  const defaultSelectedIds = useMemo(() => {
    return establishmentId != null ? [establishmentId.toString()] : [];
  }, [establishmentId]);

  const selectedEstablishmentItem = useMemo(() => {
    return groupedEstablishments
      .flatMap((group) => group.options)
      ?.find(
        (establishment) => establishment.id === establishmentId?.toString(),
      );
  }, [establishmentId, groupedEstablishments]);

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
        showSelectedItemsInBase
        textfieldProps={{
          id: `${fieldIdPrefix}-establishment-selector`,
          label: t(
            "addSessionModal.steps.configureSession.settings.teacherAndEstablishment.establishment.label",
          ),
          placeholder:
            selectedEstablishmentItem?.label ??
            t(
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
