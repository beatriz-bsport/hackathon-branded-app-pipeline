import { type FC } from "react";

import { Chip, type IconName } from "@bsport/kaizen-primitive-core";

import type { PassFlags } from "#src/types";
import { useTranslation } from "#src/utils/i18n";

type PassFlagChipsProps = {
  pass: PassFlags;
};

type ChipDef = { label: string; iconLeft: IconName };

export const PassFlagChips: FC<PassFlagChipsProps> = ({ pass }) => {
  const { t } = useTranslation("class-detail");

  const chips: ChipDef[] = [];

  if (pass.linked_private_pass !== null)
    chips.push({
      label: t("classDetail.compatiblePasses.flags.universal"),
      iconLeft: "globe-02",
    });
  if (pass.manager_only)
    chips.push({
      label: t("classDetail.compatiblePasses.flags.unlisted"),
      iconLeft: "eye-off",
    });
  if (!pass.is_usable_by_staff)
    chips.push({
      label: t("classDetail.compatiblePasses.flags.staffRestricted"),
      iconLeft: "package-x",
    });
  if (pass.new_member_only)
    chips.push({
      label: t("classDetail.compatiblePasses.flags.newMembersOnly"),
      iconLeft: "user-plus-01",
    });

  if (!chips.length) return null;

  return (
    <div className="flex gap-xs">
      {chips.map((chip) => (
        <Chip
          key={chip.label}
          type="weak"
          color="default"
          size="lg"
          rounded="lg"
          iconLeft={chip.iconLeft}
          label={chip.label}
        />
      ))}
    </div>
  );
};
