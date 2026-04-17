import type { FC } from "react";

import { VisibilityRules } from "@bsport/kaizen-business-components/buyables/visibility-rules";

import type { ContractFormData } from "../types";

type ContractFormVisibilityRulesProps = {
  formId: string;
  readonly?: boolean;
};

export const ContractFormVisibilityRules: FC<
  ContractFormVisibilityRulesProps
> = ({ formId, readonly }) => {
  return (
    <VisibilityRules<
      ContractFormData,
      "highlighted_as_recommended" | "is_usable_by_staff"
    >
      formId={formId}
      hideFromStaffField={{ name: "is_usable_by_staff", reversed: true }}
      newMembersField={{ name: null }}
      recommendedField={{ name: "highlighted_as_recommended" }}
      className="max-w-[450px]"
      disabled={readonly}
    />
  );
};
