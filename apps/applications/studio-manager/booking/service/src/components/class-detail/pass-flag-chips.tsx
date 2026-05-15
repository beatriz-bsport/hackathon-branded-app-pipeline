import { type FC } from "react";

import { Chip, type IconName, Tooltip } from "@bsport/kaizen-primitive-core";

import type { PassFlags } from "#src/types";
import { useTranslation } from "#src/utils/i18n";

type PassFlagChipsProps = {
  pass: PassFlags;
};

type ChipDef = { label: string; iconLeft: IconName; tooltip: string };

export const PassFlagChips: FC<PassFlagChipsProps> = ({ pass }) => {
  const { t } = useTranslation("class-detail");

  const chips: ChipDef[] = [];

  if (pass.linked_private_pass !== null)
    chips.push({
      label: t("classDetail.compatiblePasses.flags.universal"),
      iconLeft: "globe-02",
      tooltip: t("classDetail.compatiblePasses.flags.tooltips.universal"),
    });
  if (pass.manager_only)
    chips.push({
      label: t("classDetail.compatiblePasses.flags.unlisted"),
      iconLeft: "eye-off",
      tooltip: t("classDetail.compatiblePasses.flags.tooltips.unlisted"),
    });
  if (!pass.is_usable_by_staff)
    chips.push({
      label: t("classDetail.compatiblePasses.flags.staffRestricted"),
      iconLeft: "package-x",
      tooltip: t("classDetail.compatiblePasses.flags.tooltips.staffRestricted"),
    });
  if (pass.new_member_only)
    chips.push({
      label: t("classDetail.compatiblePasses.flags.newMembersOnly"),
      iconLeft: "user-plus-01",
      tooltip: t("classDetail.compatiblePasses.flags.tooltips.newMembersOnly"),
    });

  if (!chips.length) return null;

  return (
    <div className="flex gap-xs">
      {chips.map((chip) => (
        <Tooltip key={chip.label} label={chip.tooltip} placement="top-right">
          <Chip
            type="weak"
            color="default"
            size="lg"
            iconLeft={chip.iconLeft}
            label={chip.label}
          />
        </Tooltip>
      ))}
    </div>
  );
};
