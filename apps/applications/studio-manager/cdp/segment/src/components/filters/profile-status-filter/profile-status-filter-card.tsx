import { useId, useState } from "react";
import { useOutletContext } from "react-router";

import { MEMBER_BASE } from "@bsport/api-cdp/smartlist";
import {
  Body,
  Button,
  Card,
  Select,
  toast,
} from "@bsport/kaizen-primitive-core";

import { useUpdateSmartlistMutation } from "#src/api/use-update-smartlist-mutation";
import { useRegisterSavedFilterDraft } from "#src/hooks/use-register-saved-filter-draft";
import type { DetailsPageOutletContext } from "#src/pages/DetailsPage/details-page-outlet-context";
import { useTranslation } from "#src/utils/i18n";

import { MEMBER_BASE_OPTIONS, parseMemberBaseSelectValue } from "./constants";

const MEMBER_BASE_OPTION_LABEL_KEYS = {
  [MEMBER_BASE.ACTIVE]: "profileStatus.options.active",
  [MEMBER_BASE.ARCHIVED]: "profileStatus.options.archived",
  [MEMBER_BASE.BOTH]: "profileStatus.options.both",
} as const;

/**
 * Mandatory profile status filter backed by `smartlist.member_base`.
 * Always shown at the top of the filter manager and cannot be deleted.
 */
export const ProfileStatusFilterCard = () => {
  const selectId = useId();
  const { t } = useTranslation("filters");
  const { smartlist } = useOutletContext<DetailsPageOutletContext>();
  const [draftMemberBase, setDraftMemberBase] = useState(smartlist.member_base);
  const isDirty = draftMemberBase !== smartlist.member_base;

  useRegisterSavedFilterDraft(smartlist.id, isDirty);

  const { updateSmartlistMutate, isLoading: isSaving } =
    useUpdateSmartlistMutation({
      onSuccess: (updatedSmartlist) => {
        setDraftMemberBase(updatedSmartlist.member_base);
        toast({
          status: "default",
          icon: "check-circle",
          title: t("profileStatus.toasts.saveSuccess"),
          buttonIcon: "x-close",
        });
      },
      onError: () => {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: t("profileStatus.toasts.saveError"),
          buttonIcon: "x-close",
        });
      },
    });

  const memberBaseItems = MEMBER_BASE_OPTIONS.map((option) => ({
    id: String(option),
    label: t(MEMBER_BASE_OPTION_LABEL_KEYS[option]),
  }));

  const handleSave = () => {
    if (!isDirty) {
      return;
    }

    updateSmartlistMutate({
      ...smartlist,
      member_base: draftMemberBase,
    });
  };

  return (
    <Card className="w-full" padding="default">
      <div className="flex flex-col gap-sm">
        <Body size="lg" weight="stronger">
          {t("profileStatus.title")}
        </Body>

        <Select
          id={selectId}
          label={t("profileStatus.helper")}
          items={memberBaseItems}
          value={String(draftMemberBase)}
          disabled={isSaving}
          fullWidth
          onChange={(nextValue) => {
            const parsedValue = parseMemberBaseSelectValue(nextValue);
            if (parsedValue === null) {
              return;
            }

            setDraftMemberBase(parsedValue);
          }}
        />

        <div className="flex justify-end">
          <Button
            label={t("profileStatus.actions.update")}
            iconLeft="check"
            size="sm"
            color="main"
            intent="default"
            loading={isSaving}
            disabled={isSaving || !isDirty}
            onClick={handleSave}
          />
        </div>
      </div>
    </Card>
  );
};
