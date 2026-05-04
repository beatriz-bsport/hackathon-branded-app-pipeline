import type { FC } from "react";

import { type ReplacementRequestConfiguration } from "@bsport/api-core";
import { ControlledForm } from "@bsport/form";
import { Alert, Button, Divider } from "@bsport/kaizen-primitive-core";

import { useReplacementRequestConfiguration } from "#src/hooks/api/use-replacement-request-configuration";
import { useReplacementRequestSettingsForm } from "#src/hooks/use-replacement-request-settings-form";
import { useTeacherAccessSettingsForm } from "#src/hooks/use-teacher-access-settings-form";
import { useTranslation } from "#src/utils/i18n";

import { AccessSection } from "./access-section";
import { ReplacementRequestSettingsSection } from "./replacement-request-settings-section";
import { RestrictionsSection } from "./restrictions-section";

type ReplacementRequestFormProps = {
  companyId: number | undefined;
  hasSubteacherUpsell: boolean;
  replacementRequestConfiguration?: ReplacementRequestConfiguration;
};

const ReplacementRequestForm: FC<ReplacementRequestFormProps> = ({
  companyId,
  hasSubteacherUpsell,
  replacementRequestConfiguration,
}) => {
  const replacementForm = useReplacementRequestSettingsForm({
    companyId,
    hasSubteacherUpsell,
    replacementRequestConfiguration,
  });

  return (
    <ControlledForm
      id="teacher-view-settings-replacement-form"
      onSubmit={replacementForm.handleSubmit}
      {...replacementForm.methods}
    >
      <ReplacementRequestSettingsSection
        hasSubteacherUpsell={hasSubteacherUpsell}
        isSaving={replacementForm.isSaving}
      />
    </ControlledForm>
  );
};

const SuspendedReplacementRequestForm: FC<{
  companyId: number;
}> = ({ companyId }) => {
  const { data } = useReplacementRequestConfiguration();

  return (
    <ReplacementRequestForm
      companyId={companyId}
      hasSubteacherUpsell
      replacementRequestConfiguration={data}
    />
  );
};

export const TeacherViewSettings: FC = () => {
  const { t } = useTranslation("common");
  const {
    methods: themeMethods,
    handleSubmit: handleThemeSubmit,
    isLoading: isThemeSaving,
    hasSubteacherUpsell,
    companyId,
  } = useTeacherAccessSettingsForm();
  const canSaveTheme =
    themeMethods.formState.isDirty &&
    themeMethods.formState.isValid &&
    !isThemeSaving;

  return (
    <div className="flex flex-col gap-lg max-w-[800px]">
      <ControlledForm
        id="teacher-view-settings-theme-form"
        onSubmit={handleThemeSubmit}
        {...themeMethods}
      >
        <div className="flex flex-col items-start gap-lg">
          <Alert status="info" layout="inline">
            {t("teacherViewSettings.description")}
          </Alert>
          <AccessSection />
          <RestrictionsSection />
          <Button
            id="teacher-view-settings-theme-submit-button"
            type="submit"
            label={t("teacherViewSettings.save")}
            intent="call-to-action"
            color="main"
            size="md"
            disabled={!canSaveTheme}
            loading={isThemeSaving}
          />
        </div>
      </ControlledForm>

      <Divider className="w-full" />
      {hasSubteacherUpsell && companyId != null ? (
        <SuspendedReplacementRequestForm companyId={companyId} />
      ) : (
        <ReplacementRequestForm
          companyId={companyId}
          hasSubteacherUpsell={hasSubteacherUpsell}
        />
      )}
    </div>
  );
};
