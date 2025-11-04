import { useState } from "react";
import { useSearchParams } from "react-router";

import {
  Button,
  ColorIndicator,
  SegmentedControl,
  Title,
  Tooltip,
} from "@bsport/kaizen-primitive-core";
import type { Tag } from "@bsport/store-cdp-tag";

import { TagMemberList } from "#src/components/Tag/TagMemberList";
import { useTagContext } from "#src/context/useTagContext";
import { useFetchMembers } from "#src/hooks/api/use-fetch-members";
import { useTranslation } from "#src/utils/i18n";

type TagDetailsProps = {
  tag: Tag | null;
};

type TagSegments = "tagged" | "untagged";

function isTagSegment(value: string): value is TagSegments {
  return value === "tagged" || value === "untagged";
}

export const TagDetails = ({ tag }: TagDetailsProps) => {
  const { handleUpdateTagAllMember, handleEditTag } = useTagContext();
  const [searchParams] = useSearchParams();
  const [selectedOption, setSelectedOption] = useState<TagSegments>(
    (searchParams.get("taggedStatus") as TagSegments) || "tagged",
  );
  const { t } = useTranslation("tags");
  const { isLoading, memberList, paginationParams, fetchMemberPage } =
    useFetchMembers({
      relatedTagId: tag?.id || 0,
      isTagged: selectedOption === "tagged",
    });

  if (!tag) return null;

  const handleChangeSegmentedControl = (value: string) => {
    if (!isTagSegment(value)) return;
    setSelectedOption(value);
  };

  const handleBatchAction = () => {
    handleUpdateTagAllMember({
      tag,
      totalImpactedMembers: paginationParams.totalItems,
      updateMode: selectedOption === "tagged" ? "untag" : "tag",
      onSuccessCallback: () => {
        fetchMemberPage({
          tagId: tag.id,
          tagged: selectedOption === "tagged",
        });
      },
    });
  };

  return (
    <div className="w-[450px]">
      <div className="flex flex-col gap-md">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-sm">
            <ColorIndicator type="block" size="sm" color={tag.color} />
            <Title htmlVariant="h2" className="truncate max-w-sm">
              {tag.name}
            </Title>
          </div>
          <Tooltip
            label={t("tagsDetails.tooltip.editTag")}
            placement="bottom-right"
          >
            <Button
              id="edit-tag-button"
              kind="icon-button"
              icon="edit-02"
              label={t("tagsDetails.tooltip.editTag")}
              size="md"
              intent="default"
              color="main"
              onClick={() => handleEditTag?.(tag)}
            />
          </Tooltip>
        </div>
        <SegmentedControl
          fullWidth
          className="h-[32px]"
          id="tag-member-filter"
          urlQueryParamName="taggedStatus"
          disabled={isLoading}
          value={selectedOption}
          options={[
            {
              value: "tagged",
              label: t("tagsDetails.segmentedControl.tagged"),
            },
            {
              value: "untagged",
              label: t("tagsDetails.segmentedControl.untagged"),
            },
          ]}
          onChangeValue={handleChangeSegmentedControl}
        />
        <div className="flex flex-row items-center justify-between">
          <Title htmlVariant="h3">{t("tagsDetails.members")}</Title>
          <Button
            size="md"
            intent="default"
            color="main"
            label={
              selectedOption === "tagged"
                ? t("tagsDetails.actions.untagAll")
                : t("tagsDetails.actions.tagAll")
            }
            disabled={isLoading || memberList.length === 0}
            onClick={handleBatchAction}
          />
        </div>
        <TagMemberList
          isLoading={isLoading}
          memberList={memberList}
          paginationParams={paginationParams}
          selectedOption={selectedOption}
          tag={tag}
          refreshMemberPage={fetchMemberPage}
        />
      </div>
    </div>
  );
};
