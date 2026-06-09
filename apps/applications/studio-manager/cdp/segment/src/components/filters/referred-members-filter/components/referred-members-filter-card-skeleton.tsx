import {
  Body,
  Button,
  Card,
  FormRadioGroup,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { REFERRED_MEMBER_STATUS } from "../constants";

/**
 * Skeleton placeholder for the referred members filter card.
 */
export const ReferredMembersFilterCardSkeleton = () => {
  const { t } = useTranslation("filters");

  return (
    <div role="status" aria-busy="true">
      <Card className="w-full animate-pulse" padding="default">
        <div className="flex flex-col gap-sm">
          <div className="flex items-start justify-between">
            <Body size="lg" weight="stronger">
              {t("filters.30.title")}
            </Body>
            <Button
              kind="icon-button"
              icon="trash-01"
              size="md"
              label={t("filters.30.actions.deleteFilter")}
              intent="flat"
              color="default"
              disabled={true}
            />
          </div>

          <FormRadioGroup
            id="referred-members-filter-skeleton-status"
            options={[
              {
                value: REFERRED_MEMBER_STATUS.referred,
                label: t("filters.30.fields.isReferredMember"),
              },
              {
                value: REFERRED_MEMBER_STATUS.notReferred,
                label: t("filters.30.fields.isNotReferredMember"),
              },
            ]}
            value={REFERRED_MEMBER_STATUS.referred}
            disabled={true}
            onChange={() => undefined}
          />

          <div className="flex justify-end">
            <Button
              label={t("filters.30.actions.save")}
              size="sm"
              color="main"
              intent="default"
              iconLeft="check"
              disabled={true}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};
