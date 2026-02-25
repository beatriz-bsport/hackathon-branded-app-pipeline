import type { FC } from "react";

import { Title } from "@bsport/kaizen-primitive-core";

import { selectSelectedGroupActivity } from "#src/stores/session-creation/selectors";
import { useSessionCreationStore } from "#src/stores/session-creation/store";
import { useTranslation } from "#src/utils/i18n";

import { EstablishmentSelectorField } from "./establishment-selector-field";
import { RoomBlueprintSelectorField } from "./room-blueprint-selector-field";
import { SyncOnSpiviField } from "./sync-on-spivi-field";
import { TeacherPaymentRuleSelectorField } from "./teacher-payment-rule-selector-field";
import { TeacherSelectorField } from "./teacher-selector-field";
import { WellhubProductSelectorField } from "./wellhub-product-selector-field";

export const SessionTeacherAndEstablishment: FC<{
  fieldIdPrefix: string;
}> = ({ fieldIdPrefix }) => {
  const { t } = useTranslation("sessionCreation");

  const selectedGroupActivity = useSessionCreationStore(
    selectSelectedGroupActivity,
  );

  return (
    <section className="flex flex-col gap-md">
      <Title htmlVariant="h5">
        {t(
          "addSessionModal.steps.configureSession.settings.teacherAndEstablishment.title",
        )}
      </Title>
      <TeacherSelectorField fieldIdPrefix={fieldIdPrefix} />
      <TeacherPaymentRuleSelectorField fieldIdPrefix={fieldIdPrefix} />
      <EstablishmentSelectorField fieldIdPrefix={fieldIdPrefix} />
      <RoomBlueprintSelectorField fieldIdPrefix={fieldIdPrefix} />
      <WellhubProductSelectorField
        fieldIdPrefix={fieldIdPrefix}
        isLivestream={selectedGroupActivity?.is_broadcast || false}
      />
      <SyncOnSpiviField fieldIdPrefix={fieldIdPrefix} />
    </section>
  );
};
