import { Body } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

export const ClassesInformation = () => {
  const { t } = useTranslation("list");

  return (
    <div className="max-w-[340px] p-md">
      <Body htmlVariant="p" color="default" weight="weak">
        {t("list.header.information.description")}
      </Body>
    </div>
  );
};
