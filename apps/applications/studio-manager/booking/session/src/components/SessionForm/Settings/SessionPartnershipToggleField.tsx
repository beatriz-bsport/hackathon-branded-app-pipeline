import { FC, useCallback } from "react";

import { FormField, useFormContext } from "@bsport/form";
import { Toggle, type ToggleProps } from "@bsport/kaizen-primitive-core";

import { aggregatorToggleStatusEvent } from "#src/events/session-creation/events";
import { SessionCreationFormData } from "#src/stores/session-creation/types";
import { analyticsTrackSafeEvent } from "#src/utils/analytics-track-safe-event";
import { useTranslation } from "#src/utils/i18n";

export const SessionPartnershipToggleField: FC<{
  fieldIdPrefix: string;
}> = ({ fieldIdPrefix }) => {
  const { t } = useTranslation("sessionCreation");

  const { watch, setValue } = useFormContext<SessionCreationFormData>();

  const isChecked = watch("available_on_partnership");

  const managerOnly = watch("manager_only");

  const handleToggleChange = useCallback(
    (checked: boolean) => {
      setValue("available_on_partnership", checked, { shouldDirty: true });
      analyticsTrackSafeEvent(aggregatorToggleStatusEvent, {
        available_on_aggregators_toggle_enabled: checked,
      });
    },
    [setValue],
  );

  return (
    <FormField<SessionCreationFormData, "available_on_partnership", ToggleProps>
      name="available_on_partnership"
      mapProps={() => ({
        onToggleChange: handleToggleChange,
      })}
    >
      <Toggle
        disabled={managerOnly}
        checked={isChecked}
        id={`${fieldIdPrefix}-session-partnership-toggle`}
        label={t(
          "addSessionModal.steps.configureSession.settings.partnership.toggle",
        )}
      />
    </FormField>
  );
};
