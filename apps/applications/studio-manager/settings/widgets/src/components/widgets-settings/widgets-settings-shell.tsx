import { Title } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

export const WidgetsSettingsShell = () => {
  const { t } = useTranslation("common");

  return (
    <section className="flex min-h-full flex-col gap-md">
      <Title htmlVariant="h5" weight="strong">
        {t("widgetsSettings.general.title")}
      </Title>
    </section>
  );
};
