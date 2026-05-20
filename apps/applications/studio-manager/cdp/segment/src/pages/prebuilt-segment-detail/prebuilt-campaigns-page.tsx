import { Body } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

export const PrebuiltCampaignsPage = () => {
  const { t } = useTranslation("list");

  return <Body size="md">{t("prebuilt.details.campaignsPlaceholder")}</Body>;
};

export default PrebuiltCampaignsPage;
