import { FormRadioGroup } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import {
  REFERRED_MEMBER_STATUS,
  type ReferredMemberStatusOption,
} from "../constants";

type ReferredStatusRadioGroupProps = {
  id: string;
  value: ReferredMemberStatusOption;
  onChange: (nextValue: ReferredMemberStatusOption) => void;
  disabled?: boolean;
};

const isReferredMemberStatusOption = (
  value: string,
): value is ReferredMemberStatusOption =>
  value === REFERRED_MEMBER_STATUS.referred ||
  value === REFERRED_MEMBER_STATUS.notReferred;

/**
 * Referred / not referred selector backed by Kaizen `FormRadioGroup`.
 */
export const ReferredStatusRadioGroup = ({
  id,
  value,
  onChange,
  disabled = false,
}: ReferredStatusRadioGroupProps) => {
  const { t } = useTranslation("filters");

  const referredStatusOptions = [
    {
      value: REFERRED_MEMBER_STATUS.referred,
      label: t("filters.30.fields.isReferredMember"),
    },
    {
      value: REFERRED_MEMBER_STATUS.notReferred,
      label: t("filters.30.fields.isNotReferredMember"),
    },
  ];

  return (
    <FormRadioGroup
      id={id}
      options={referredStatusOptions}
      value={value}
      disabled={disabled}
      onChange={(event) => {
        const nextValue = event.target.value;
        if (isReferredMemberStatusOption(nextValue)) {
          onChange(nextValue);
        }
      }}
    />
  );
};
