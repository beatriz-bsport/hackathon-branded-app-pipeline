import type { FC } from "react";

import { useFormContext } from "@bsport/form";
import { Title } from "@bsport/kaizen-primitive-core";

import { selectSelectedGroupActivity } from "#src/stores/session-creation/selectors";
import { useSessionCreationStore } from "#src/stores/session-creation/store";
import { SessionCreationFormData } from "#src/stores/session-creation/types";
import { useTranslation } from "#src/utils/i18n";

import { EstablishmentSelectorField } from "./establishment-selector-field";
import { OverridePayrollRuleToggle } from "./override-payroll-rule-toggle";
import { RoomBlueprintSelectorField } from "./room-blueprint-selector-field";
import { SyncOnSpiviField } from "./sync-on-spivi-field";
import { TeacherPaymentRuleSelectorField } from "./teacher-payment-rule-selector-field";
import { TeacherSelectorField } from "./teacher-selector-field";
import { WellhubProductSelectorField } from "./wellhub-product-selector-field";

export const SessionTeacherAndEstablishment: FC<{
  fieldIdPrefix: string;
  isWorkshop?: boolean;
  showPayrollOverrideToggle?: boolean;
  showSpiviField?: boolean;
  showWellhubField?: boolean;
}> = ({
  fieldIdPrefix,
  isWorkshop,
  showPayrollOverrideToggle = true,
  showSpiviField = true,
  showWellhubField = true,
}) => {
  const { t } = useTranslation("sessionCreation");

  const { watch } = useFormContext<SessionCreationFormData>();

  const shouldOverrideTeacherPayrollRule =
    showPayrollOverrideToggle && watch("overrideTeacherPayrollRule");

  const selectedGroupActivity = useSessionCreationStore(
    selectSelectedGroupActivity,
  );

  return (
    <section className="flex flex-col gap-md">
      <Title htmlVariant="h5" weight="stronger">
        {t(
          "addSessionModal.steps.configureSession.settings.teacherAndEstablishment.title",
        )}
      </Title>
      <TeacherSelectorField fieldIdPrefix={fieldIdPrefix} />
      {showPayrollOverrideToggle ? (
        <>
          <OverridePayrollRuleToggle
            fieldIdPrefix={fieldIdPrefix}
            label={t(
              "addSessionModal.steps.configureSession.settings.teacherAndEstablishment.payroll.overrideLabel",
            )}
            helperText={t(
              "addSessionModal.steps.configureSession.settings.teacherAndEstablishment.payroll.overrideDescription",
            )}
          />
          {shouldOverrideTeacherPayrollRule && (
            // Indent matches the toggle's label text (switch w-xl + label pl-xs).
            <div className="ml-xl pl-xs">
              <TeacherPaymentRuleSelectorField
                fieldIdPrefix={fieldIdPrefix}
                isWorkshop={isWorkshop}
              />
            </div>
          )}
        </>
      ) : (
        <TeacherPaymentRuleSelectorField
          fieldIdPrefix={fieldIdPrefix}
          isWorkshop={isWorkshop}
        />
      )}
      <EstablishmentSelectorField fieldIdPrefix={fieldIdPrefix} />
      <RoomBlueprintSelectorField fieldIdPrefix={fieldIdPrefix} />
      {showWellhubField && (
        <WellhubProductSelectorField
          fieldIdPrefix={fieldIdPrefix}
          isLivestream={selectedGroupActivity?.is_broadcast || false}
        />
      )}
      {showSpiviField && <SyncOnSpiviField fieldIdPrefix={fieldIdPrefix} />}
    </section>
  );
};
