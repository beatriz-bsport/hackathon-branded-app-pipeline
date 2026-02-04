import type { FC } from "react";

import { Title } from "@bsport/kaizen-primitive-core";

import {
  selectSelectedGroupActivity,
  selectStepFormData,
} from "#src/stores/session-creation/selectors";
import {
  SESSION_CREATION_STEPS,
  useSessionCreationStore,
} from "#src/stores/session-creation/store";
import { SessionCreationFormData } from "#src/stores/session-creation/types";
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

  const { coach, coach_payment_rule, establishment, room_blueprint } =
    useSessionCreationStore(
      selectStepFormData(SESSION_CREATION_STEPS.CONFIGURE_SESSION),
    ) as SessionCreationFormData;

  const selectedGroupActivity = useSessionCreationStore(
    selectSelectedGroupActivity,
  );

  return (
    <section className="flex flex-col gap-md pb-md">
      <Title htmlVariant="h5">
        {t(
          "addSessionModal.steps.configureSession.settings.teacherAndEstablishment.title",
        )}
      </Title>
      <TeacherSelectorField
        fieldIdPrefix={fieldIdPrefix}
        defaultSelectedId={coach}
      />
      <TeacherPaymentRuleSelectorField
        fieldIdPrefix={fieldIdPrefix}
        defaultSelectedId={coach_payment_rule}
      />
      <EstablishmentSelectorField
        fieldIdPrefix={fieldIdPrefix}
        defaultSelectedId={establishment}
      />
      <RoomBlueprintSelectorField
        fieldIdPrefix={fieldIdPrefix}
        defaultSelectedId={room_blueprint}
      />
      <WellhubProductSelectorField
        fieldIdPrefix={fieldIdPrefix}
        isLivestream={selectedGroupActivity?.is_broadcast || false}
      />
      <SyncOnSpiviField fieldIdPrefix={fieldIdPrefix} />
    </section>
  );
};
