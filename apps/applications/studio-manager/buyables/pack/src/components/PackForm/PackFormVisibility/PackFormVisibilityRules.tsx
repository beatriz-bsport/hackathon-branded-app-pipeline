import type { FC } from "react";

import { VisibilityRules } from "@bsport/kaizen-business-components/buyables/visibility-rules";
import type { PackFormData } from "@bsport/store-buyables-pack";

type PackFormVisibilityRulesProps = {
  fieldIdPrefix: string;
};

export const PackFormVisibilityRules: FC<PackFormVisibilityRulesProps> = ({
  fieldIdPrefix,
}) => {
  return (
    <VisibilityRules<
      PackFormData,
      "highlighted_as_recommended" | "new_member_only" | "is_usable_by_staff"
    >
      formId={fieldIdPrefix}
      hideFromStaffField={{ name: "is_usable_by_staff", reversed: true }}
      newMembersField={{ name: "new_member_only" }}
      recommendedField={{ name: "highlighted_as_recommended" }}
      className="max-w-[450px]"
    />
  );
};
