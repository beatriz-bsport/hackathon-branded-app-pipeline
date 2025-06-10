import { Body, Loader } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

export const AppLoader = () => {
  const { t } = useTranslation("list");
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-md">
      <Loader size="xl" />
      <Body htmlVariant="p" size="lg" color="default" weight="weak">
        {t("templateList.loading")}
      </Body>
    </div>
  );
};
