import { type FC } from "react";

import { useFormContext } from "@bsport/form";
import { Accordion, Divider, Title } from "@bsport/kaizen-primitive-core";

import { CustomRestrictionsSection } from "#src/components/class-editor/sections/custom-restrictions-section";
import { EditBasicInfoSection } from "#src/components/class-editor/sections/edit-basic-info-section";
import { AutomaticCancellationSection } from "#src/components/class-form/booking-rules-step/automatic-cancellation-section";
import { BookingWindowSection } from "#src/components/class-form/booking-rules-step/booking-window-section";
import { type ClassFormValues } from "#src/utils/class-form";
import { useTranslation } from "#src/utils/i18n";

export const ClassEditorForm: FC = () => {
  const { t } = useTranslation("class-detail");
  const { watch } = useFormContext<ClassFormValues>();
  const customRules = watch("custom_restriction_rule");
  const advancedInitiallyOpen = (customRules?.length ?? 0) > 0;

  return (
    <div className="flex flex-col gap-xl p-md">
      <EditBasicInfoSection />
      <Divider orientation="horizontal" weight="thin" />
      <BookingWindowSection />
      <Divider orientation="horizontal" weight="thin" />
      <AutomaticCancellationSection />
      <Divider orientation="horizontal" weight="thin" />
      <Accordion>
        <Accordion.Item
          header={
            <Title htmlVariant="h4" weight="strong">
              {t("classDetail.editor.advanced.title")}
            </Title>
          }
          ariaLabel={t("classDetail.editor.advanced.title")}
          initiallyOpen={advancedInitiallyOpen}
        >
          <div className="p-xl">
            <CustomRestrictionsSection />
          </div>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};
