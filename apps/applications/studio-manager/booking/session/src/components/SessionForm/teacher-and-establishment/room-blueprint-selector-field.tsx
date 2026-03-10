import { FC, useEffect, useMemo } from "react";

import type { RoomBlueprint } from "@bsport/api-book";
import { FormField, useFormContext } from "@bsport/form";
import { Autocomplete, AutocompleteProps } from "@bsport/kaizen-primitive-core";

import { useFetchRoomBlueprints } from "#src/hooks/use-fetch-room-blueprint";
import { SessionCreationFormData } from "#src/stores/session-creation/types";
import { useTranslation } from "#src/utils/i18n";

/**
 * Counts the number of spots in a room blueprint.
 * A spot is identified by having type "spot" either at the element level or in the data.
 */
const getSpotCount = (roomBlueprint: RoomBlueprint | undefined): number => {
  if (!roomBlueprint?.canvas?.elements) return 0;
  return roomBlueprint.canvas.elements.filter((element) => {
    const dataType = (element?.data as { type?: string } | undefined)?.type;
    return element?.type === "spot" || dataType === "spot";
  }).length;
};

export const RoomBlueprintSelectorField: FC<{
  fieldIdPrefix: string;
}> = ({ fieldIdPrefix }) => {
  const { t } = useTranslation("sessionCreation");

  const { watch, setValue, trigger } =
    useFormContext<SessionCreationFormData>();

  const establishmentId = watch("establishment");
  const roomBlueprintId = watch("room_blueprint");
  const effectif = watch("effectif");

  useEffect(() => {
    setValue("room_blueprint", null);
    setValue("roomBlueprintCapacity", null);
    trigger("effectif");
  }, [establishmentId, setValue, trigger]);

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
    return roomBlueprintId !== null ? [roomBlueprintId.toString()] : [];
  }, [roomBlueprintId]);

  const selectedRoomBlueprint = useMemo(() => {
    return roomBlueprintsItems.find(
      (blueprint) => blueprint.id === roomBlueprintId?.toString(),
    );
  }, [roomBlueprintId, roomBlueprintsItems]);

  if (hasNoRoomBlueprints) return null;

  return (
    <FormField<SessionCreationFormData, "room_blueprint", AutocompleteProps>
      name="room_blueprint"
      mapProps={({ form: { setValue, trigger } }) => ({
        onSelect: (selectedRoomBlueprintId: string) => {
          if (!selectedRoomBlueprintId) return;
          const selectedBlueprint = roomBlueprints?.find(
            (blueprint) => blueprint.id === Number(selectedRoomBlueprintId),
          );
          const capacity = getSpotCount(selectedBlueprint);
          setValue("room_blueprint", Number(selectedRoomBlueprintId), {
            shouldValidate: true,
            shouldDirty: true,
          });
          setValue("roomBlueprintCapacity", capacity > 0 ? capacity : null);
          if (!effectif) {
            // Only setting effectif if it's not already set, to avoid overwriting user's input
            setValue("effectif", capacity, {
              shouldValidate: true,
              shouldDirty: true,
            });
          }
        },
        onClear: () => {
          setValue("room_blueprint", null, { shouldValidate: true });
          setValue("roomBlueprintCapacity", null);
          trigger("effectif");
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
          placeholder:
            selectedRoomBlueprint?.label ??
            t(
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
