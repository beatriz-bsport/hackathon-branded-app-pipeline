import { Body, Divider } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

/**
 * Visual separator between filters or sub-filters: divider — AND — divider.
 */
export const FilterAndSeparator = () => {
  const { t } = useTranslation("filters");

  return (
    <div role="separator" className="flex items-center gap-sm">
      <Divider className="flex-1" />
      <Body
        htmlVariant="span"
        size="lg"
        weight="stronger"
        color="weak"
        className="shrink-0 uppercase"
      >
        {t("shared.operators.and")}
      </Body>
      <Divider className="flex-1" />
    </div>
  );
};
