import { useState } from "react";

import {
  Button,
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
  const [selectedOption, setSelectedOption] = useState<TagSegments>("tagged");
  const { t } = useTranslation("tags");
  const { isLoading, memberList, paginationParams, fetchMemberPage } =
    useFetchMembers({
      relatedTagId: tag?.id || 0,
      isTagged: selectedOption === "tagged",
    });

  if (!tag) return null;

  const handleBatchAction = () => {
    handleUpdateTagAllMember({
      tag,
      totalImpactedMembers: paginationParams.totalItems,
      updateMode: selectedOption === "tagged" ? "untag" : "tag",
      onSuccessCallback: () => {
        fetchMemberPage({
          tagId: tag.id,
          tagged: false,
        });
      },
    });
  };

  return (
    <div className="w-[450px]">
      <div className="flex flex-col gap-md">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-sm">
            <div
              className={`w-[20px] h-[20px] rounded-sm`}
              style={{ backgroundColor: tag.color }}
            ></div>
            <Title htmlVariant="h2">{tag.name}</Title>
          </div>
          <Tooltip
            label={t("tagsDetails.tooltip.editTag")}
            placement="bottom-right"
          >
            <Button
              iconLeft="edit-02"
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
          onChangeValue={(value) => {
            if (!isTagSegment(value)) return;
            setSelectedOption(value);
          }}
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
