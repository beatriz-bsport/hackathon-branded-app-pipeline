import { Body } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

export const PrebuiltSegmentPage = () => {
  const { t } = useTranslation("list");

  return <Body size="md">{t("prebuilt.details.segmentPlaceholder")}</Body>;
};

export default PrebuiltSegmentPage;
