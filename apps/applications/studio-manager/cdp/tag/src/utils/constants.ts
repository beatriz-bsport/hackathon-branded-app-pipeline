export const TAG_GROUP_NAME_ALREADY_EXIST_ERROR_CODE = "124004";
export const TAG_NAME_ALREADY_EXIST_ERROR_CODE = "124003";

export const BASE_TAG_GROUP_KIND = 0;

export const TAG_LIST_ITEM_ID_PREFIX = "list-item-tag";
export const TAG_LIST_ITEM_ACTION_DELETE_SUFFIX = "delete-button";
export const TAG_GROUP_LIST_HEADER_ID_PREFIX = "main-tag-list";
export const TAG_GROUP_LIST_HEADER_ACTION_PREFIX = "list-header-tag-group";
export const TAG_GROUP_LIST_HEADER_ACTION_EDIT_SUFFIX =
  "rename-main-tag-button";
export const TAG_GROUP_LIST_HEADER_ACTION_DELETE_SUFFIX =
  "delete-main-tag-button";
export const TAG_GROUP_LIST_HEADER_ACTION_ADD_SUB_TAG_SUFFIX =
  "add-sub-tag-button";

export const TAG_LIST_ITEM_ID = (tagId: number) =>
  `${TAG_LIST_ITEM_ID_PREFIX}-${tagId}`;
export const TAG_LIST_ITEM_DELETE_ACTION_BUTTON_ID = (tagId: number) =>
  `${TAG_LIST_ITEM_ID_PREFIX}-${tagId}-${TAG_LIST_ITEM_ACTION_DELETE_SUFFIX}`;
export const TAG_GROUP_LIST_HEADER_ID = (tagGroupId: number) =>
  `${TAG_GROUP_LIST_HEADER_ID_PREFIX}-${tagGroupId}`;
export const TAG_GROUP_LIST_HEADER_DELETE_ACTION_BUTTON_ID = (
  tagGroupId: number,
) =>
  `${TAG_GROUP_LIST_HEADER_ID_PREFIX}-${tagGroupId}-${TAG_GROUP_LIST_HEADER_ACTION_DELETE_SUFFIX}`;
export const TAG_GROUP_LIST_HEADER_EDIT_ACTION_BUTTON_ID = (
  tagGroupId: number,
) =>
  `${TAG_GROUP_LIST_HEADER_ID_PREFIX}-${tagGroupId}-${TAG_GROUP_LIST_HEADER_ACTION_EDIT_SUFFIX}`;
export const TAG_GROUP_LIST_HEADER_ADD_SUB_TAG_ACTION_BUTTON_ID = (
  tagGroupId: number,
) =>
  `${TAG_GROUP_LIST_HEADER_ID_PREFIX}-${tagGroupId}-${TAG_GROUP_LIST_HEADER_ACTION_ADD_SUB_TAG_SUFFIX}`;
