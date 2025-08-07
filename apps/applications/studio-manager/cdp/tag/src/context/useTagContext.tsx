import { createContext, useContext, useRef, useState } from "react";

import type { Tag, TagGroup } from "@bsport/store-cdp-tag";

type PageCurrentAction =
  | "create-tag-group"
  | "edit-tag-group"
  | "create-tag"
  | "edit-tag"
  | "delete-tag-group"
  | "delete-tag"
  | "batch-tag-member"
  | "batch-untag-member"
  | null;

type UpdateMemberTagBatchParams = {
  tag: Tag;
  totalImpactedMembers: number;
  updateMode?: "tag" | "untag";
  onSuccessCallback?: () => void;
};

interface TagsPageContextValue {
  // State values
  pageCurrentAction: PageCurrentAction;
  selectedTagGroup: TagGroup | null;
  selectedTag: Tag | null;
  preselectedTagGroupId: number | null;
  totalImpactedMembers: number;
  onBatchUpdateMemberTagSuccessCallback: () => void;

  // Actions
  handleCreateTagGroup: () => void;
  handleEditTagGroup: (tagGroup: TagGroup) => void;
  handleDeleteTagGroup: (tagGroup: TagGroup) => void;
  handleCreateTag: (associatedGroupId?: number) => void;
  handleEditTag: (tag: Tag) => void;
  handleDeleteTag: (tag: Tag) => void;
  handleUnselectAction: () => void;
  handleUpdateTagAllMember: ({
    tag,
    totalImpactedMembers,
    updateMode,
    onSuccessCallback,
  }: UpdateMemberTagBatchParams) => void;
  setPageCurrentAction: (action: PageCurrentAction) => void;
  setSelectedTagGroup: (tagGroup: TagGroup | null) => void;
  setSelectedTag: (tag: Tag | null) => void;
}

const TagsPageContext = createContext<TagsPageContextValue | undefined>(
  undefined,
);

interface TagsPageProviderProps {
  children: React.ReactNode;
}

export const TagsPageProvider: React.FC<TagsPageProviderProps> = ({
  children,
}: TagsPageProviderProps) => {
  const [pageCurrentAction, setPageCurrentAction] =
    useState<PageCurrentAction>(null);
  const [selectedTagGroup, setSelectedTagGroup] = useState<TagGroup | null>(
    null,
  );
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [preselectedTagGroupId, setPreselectedTagGroupId] = useState<
    number | null
  >(null);
  const [totalImpactedMembers, setTotalImpactedMembers] = useState<number>(0);
  const onBatchUpdateMemberTagSuccessCallback = useRef<() => void>();

  const handleCreateTagGroup = () => {
    setPageCurrentAction("create-tag-group");
    setSelectedTagGroup(null);
  };

  const handleEditTagGroup = (tagGroup: TagGroup) => {
    setPageCurrentAction("edit-tag-group");
    setSelectedTagGroup(tagGroup);
  };

  const handleDeleteTagGroup = (tagGroup: TagGroup) => {
    setPageCurrentAction("delete-tag-group");
    setSelectedTagGroup(tagGroup);
  };

  const handleCreateTag = (associatedGroupId?: number) => {
    setPageCurrentAction("create-tag");
    if (associatedGroupId) {
      setPreselectedTagGroupId(associatedGroupId);
    } else {
      setPreselectedTagGroupId(null);
    }
    setSelectedTag(null);
  };

  const handleEditTag = (tag: Tag) => {
    setPageCurrentAction("edit-tag");
    setSelectedTag(tag);
  };

  const handleDeleteTag = (tag: Tag) => {
    setPageCurrentAction("delete-tag");
    setSelectedTag(tag);
  };

  const handleUpdateTagAllMember = ({
    tag,
    totalImpactedMembers,
    updateMode,
    onSuccessCallback,
  }: UpdateMemberTagBatchParams) => {
    const mode =
      updateMode === "tag" ? "batch-tag-member" : "batch-untag-member";
    setPageCurrentAction(mode);
    setSelectedTag(tag);
    setTotalImpactedMembers(totalImpactedMembers);
    onBatchUpdateMemberTagSuccessCallback.current = onSuccessCallback;
  };

  const handleUnselectAction = () => {
    setPageCurrentAction(null);
    if (selectedTagGroup) {
      setSelectedTagGroup(null);
    }
    if (selectedTag) {
      setSelectedTag(null);
    }
    if (preselectedTagGroupId) {
      setPreselectedTagGroupId(null);
    }
    if (totalImpactedMembers) {
      setTotalImpactedMembers(0);
    }
    if (typeof onBatchUpdateMemberTagSuccessCallback.current === "function") {
      onBatchUpdateMemberTagSuccessCallback.current = () => {};
    }
  };

  const value: TagsPageContextValue = {
    // State values
    pageCurrentAction,
    selectedTagGroup,
    selectedTag,
    preselectedTagGroupId,
    totalImpactedMembers,
    onBatchUpdateMemberTagSuccessCallback:
      onBatchUpdateMemberTagSuccessCallback.current ?? (() => {}),

    // Actions
    handleCreateTagGroup,
    handleEditTagGroup,
    handleDeleteTagGroup,
    handleCreateTag,
    handleEditTag,
    handleDeleteTag,
    handleUnselectAction,
    handleUpdateTagAllMember,
    setPageCurrentAction,
    setSelectedTagGroup,
    setSelectedTag,
  };

  return (
    <TagsPageContext.Provider value={value}>
      {children}
    </TagsPageContext.Provider>
  );
};

export const useTagContext = (): TagsPageContextValue => {
  const context = useContext(TagsPageContext);
  if (context === undefined) {
    throw new Error("useTagContext must be used within a TagsPageProvider");
  }
  return context;
};
