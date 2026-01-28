import { FC, useEffect, useMemo } from "react";

import { FormField, useFormContext } from "@bsport/form";
import { Autocomplete, AutocompleteProps } from "@bsport/kaizen-primitive-core";

import { useFetchRoomBlueprints } from "#src/hooks/use-fetch-room-blueprint";
import { SessionCreationFormData } from "#src/stores/session-creation/types";
import { useTranslation } from "#src/utils/i18n";

export const RoomBlueprintSelectorField: FC<{
  fieldIdPrefix: string;
  defaultSelectedId: number | null;
}> = ({ fieldIdPrefix, defaultSelectedId }) => {
  const { t } = useTranslation("sessionCreation");

  const { watch, setValue } = useFormContext<SessionCreationFormData>();

  const establishmentId = watch("establishment");

  useEffect(() => {
    setValue("room_blueprint", null);
  }, [establishmentId, setValue]);

  const { data: roomBlueprints, isLoading } = useFetchRoomBlueprints({
    establishment: establishmentId ?? undefined,
  });

  const roomBlueprintsItems = (roomBlueprints ?? []).map((blueprint) => ({
    id: blueprint.id.toString(),
    label: blueprint.name,
  }));

  const hasNoRoomBlueprints =
    roomBlueprintsItems.length === 0 || !watch("establishment");

  const defaultSelectedIds = useMemo(() => {
    return defaultSelectedId !== null ? [defaultSelectedId.toString()] : [];
  }, [defaultSelectedId]);

  if (hasNoRoomBlueprints) return null;

  return (
    <FormField<SessionCreationFormData, "room_blueprint", AutocompleteProps>
      name="room_blueprint"
      mapProps={({ form: { setValue } }) => ({
        onSelect: (selectedRoomBlueprintId: string) => {
          setValue(
            "room_blueprint",
            selectedRoomBlueprintId ? Number(selectedRoomBlueprintId) : null,
            { shouldValidate: true },
          );
        },
        onClear: () => {
          setValue("room_blueprint", null, { shouldValidate: true });
        },
      })}
    >
      <Autocomplete
        items={roomBlueprintsItems}
        textfieldProps={{
          id: `${fieldIdPrefix}-room-blueprint-selector`,
          label: t(
            "addSessionModal.steps.configureSession.settings.teacherAndEstablishment.spotScheduling.label",
          ),
          placeholder: t(
            "addSessionModal.steps.configureSession.settings.teacherAndEstablishment.spotScheduling.placeholder",
          ),
          helperText: t(
            "addSessionModal.steps.configureSession.settings.teacherAndEstablishment.spotScheduling.helper",
          ),
        }}
        loadingProps={{ isLoading }}
        disabled={hasNoRoomBlueprints}
        defaultSelectedIds={defaultSelectedIds}
      />
    </FormField>
  );
};
