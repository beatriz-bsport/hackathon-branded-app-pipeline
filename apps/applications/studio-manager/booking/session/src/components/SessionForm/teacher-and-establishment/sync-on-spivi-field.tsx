import { FC } from "react";

import { FormField, useFormContext } from "@bsport/form";
import { Toggle } from "@bsport/kaizen-primitive-core";

import { useFetchRoomBlueprints } from "#src/hooks/use-fetch-room-blueprint";
import { SessionCreationFormData } from "#src/stores/session-creation/types";
import { useTranslation } from "#src/utils/i18n";
import {
  ADD_ON_IDENTIFIER_SPIVI,
  useCheckCompanyAddOn,
} from "#src/utils/permission";

export const SyncOnSpiviField: FC<{ fieldIdPrefix: string }> = ({
  fieldIdPrefix,
}) => {
  const { t } = useTranslation("sessionCreation");

  const { watch } = useFormContext<SessionCreationFormData>();

  const isChecked = watch("sync_on_spivi") ?? false;

  const selectedEstablishmentId = watch("establishment");

  const selectedBlueprintId = watch("room_blueprint");

  const hasSpiviAddOn = useCheckCompanyAddOn(ADD_ON_IDENTIFIER_SPIVI);

  const { data: roomBlueprints, isLoading } = useFetchRoomBlueprints({
    establishment: selectedEstablishmentId ?? undefined,
  });

  const selectedBlueprintHasSpiviBox =
    !isLoading &&
    !!roomBlueprints?.find(({ id }) => id === selectedBlueprintId)
      ?.spivi_box_id;

  if (!hasSpiviAddOn || !selectedBlueprintHasSpiviBox) return null;

  return (
    <FormField<SessionCreationFormData, "sync_on_spivi"> name="sync_on_spivi">
      <Toggle
        checked={isChecked}
        id={`${fieldIdPrefix}-sync_on_spivi-session-field`}
        label={t(
          "addSessionModal.steps.configureSession.settings.teacherAndEstablishment.syncOnSpivi",
        )}
      />
    </FormField>
  );
};
