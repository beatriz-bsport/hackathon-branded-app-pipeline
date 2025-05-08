import { Body, Loader } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

export const Loading = () => {
  const { t } = useTranslation("list");

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-md">
      <Loader size="xl" />
      <Body htmlVariant="p">{t("loading")}</Body>
    </div>
  );
};
