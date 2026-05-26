import { useOutletContext } from "react-router";

import { Body } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import {
  type PrebuiltSegmentDetailOutletContext,
  PrebuiltSegmentTabLayout,
} from "./prebuilt-segment-detail-page";

export const PrebuiltCampaignsPage = () => {
  const { t } = useTranslation("list");
  const { prebuiltSegmentId } =
    useOutletContext<PrebuiltSegmentDetailOutletContext>();

  return (
    <PrebuiltSegmentTabLayout
      layout="details"
      prebuiltSegmentId={prebuiltSegmentId}
    >
      <Body size="md">{t("prebuilt.details.campaignsPlaceholder")}</Body>
    </PrebuiltSegmentTabLayout>
  );
};

export default PrebuiltCampaignsPage;
