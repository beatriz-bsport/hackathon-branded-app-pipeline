import type { FC } from "react";

import { FormField } from "@bsport/form";
import { TextField, TextFieldProps } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useFetchZoomApp } from "#src/hooks/use-fetch-zoom-app";
import { SessionCreationFormData } from "#src/stores/session-creation/types";
import { useTranslation } from "#src/utils/i18n";
import {
  ADD_ON_IDENTIFIER_ZOOM_APP,
  useCheckCompanyAddOn,
} from "#src/utils/permission";

export const BroadcastLinkField: FC<{
  fieldIdPrefix: string;
}> = ({ fieldIdPrefix }) => {
  const { t } = useTranslation("sessionCreation");

  const companyId = dataAccessLayer.useCompanyTheme()?.company;

  const { data: zoomApp } = useFetchZoomApp(companyId);

  const hasZoomAppAddOn = useCheckCompanyAddOn(ADD_ON_IDENTIFIER_ZOOM_APP);

  const isZoomAppActive = hasZoomAppAddOn && !!zoomApp && !zoomApp.is_disabled;

  const DEFAULT_PLACEHOLDER = "https://zoom.us/123456789";

  return (
    <FormField<SessionCreationFormData, "broadcast_link", TextFieldProps>
      name="broadcast_link"
      mapProps={({ defaultProps, field, form }) => ({
        ...defaultProps,
        onClear: () => {
          form.setValue("broadcast_link", "", { shouldDirty: true });
          field.onBlur();
        },
      })}
    >
      <TextField
        id={`${fieldIdPrefix}-broadcast-link-field`}
        placeholder={DEFAULT_PLACEHOLDER}
        disabled={isZoomAppActive}
        helperText={
          isZoomAppActive
            ? t(
                "addSessionModal.steps.configureSession.settings.broadcast.helperText",
              )
            : undefined
        }
        label={t(
          "addSessionModal.steps.configureSession.settings.broadcast.label",
        )}
      />
    </FormField>
  );
};
