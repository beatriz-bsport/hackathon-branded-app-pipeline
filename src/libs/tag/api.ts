// @ts-nocheck
import {
  API_URI,
  deleteAuth,
  getAuth,
  postAuth,
  putAuth,
  buildUrlParams,
} from '../../http';

const TAG_URI = `${API_URI}/tagging/tag/`;
const TAG_GROUP_URI = `${API_URI}/tagging/tag-group/`;

const fetchAllGroups = async () => {
  return getAuth(TAG_GROUP_URI);
};

const fetchAllTags = async () => {
  return getAuth(TAG_URI);
};

const deleteTag = async (id: number) => {
  return deleteAuth(`${TAG_URI}${id}/`);
};

const deleteTagGroup = async (id: number) => {
  return deleteAuth(`${TAG_GROUP_URI}${id}/`);
};

const createTagGroup = async (data: any) => {
  return postAuth(TAG_GROUP_URI, data);
};

const createTag = async (data: any) => {
  return postAuth(TAG_URI, data);
};

const updateTag = async (data: any) => {
  return putAuth(`${TAG_URI}${data.id}/`, data);
};

const updateTagGroup = async (data: any) => {
  return putAuth(`${TAG_GROUP_URI}${data.id}/`, data);
};
const fetchTagUsage = async () => {
  return getAuth(`${TAG_URI}usage/`);
};

const fetchMemberTagList = async (companyId: number) => {
  return getAuth(
    `${TAG_URI}get_member_tag_list/${buildUrlParams({
      company: companyId,
    })}`,
  );
};

// Franchise stuff (aka templates)

const TAG_TEMPLATE_URI = `${API_URI}/tagging/tag-template/`;
const TAG_GROUP_TEMPLATE_URI = `${API_URI}/tagging/tag-group-template/`;

const fetchAllGroupTemplates = async () => {
  return getAuth(TAG_GROUP_TEMPLATE_URI);
};

const fetchAllTagTemplates = async () => {
  return getAuth(TAG_TEMPLATE_URI);
};

const deleteTagTemplate = async (id: number) => {
  return deleteAuth(`${TAG_TEMPLATE_URI}${id}/`);
};

const deleteTagGroupTemplate = async (id: number) => {
  return deleteAuth(`${TAG_GROUP_TEMPLATE_URI}${id}/`);
};

const createTagGroupTemplate = async (data: any) => {
  return postAuth(TAG_GROUP_TEMPLATE_URI, data);
};

const createTagTemplate = async (data: any) => {
  return postAuth(TAG_TEMPLATE_URI, data);
};

const updateTagTemplate = async (data: any) => {
  return putAuth(`${TAG_TEMPLATE_URI}${data.id}/`, data);
};

const updateTagGroupTemplate = async (data: any) => {
  return putAuth(`${TAG_GROUP_TEMPLATE_URI}${data.id}/`, data);
};
const fetchTagTemplateUsage = async () => {
  return getAuth(`${TAG_TEMPLATE_URI}usage/`);
};

export default {
  fetchAllGroups,
  fetchAllTags,
  createTag,
  createTagGroup,
  updateTag,
  updateTagGroup,
  deleteTag,
  deleteTagGroup,
  fetchTagUsage,
  fetchMemberTagList,
  fetchAllGroupTemplates,
  fetchAllTagTemplates,
  createTagTemplate,
  createTagGroupTemplate,
  updateTagTemplate,
  updateTagGroupTemplate,
  deleteTagTemplate,
  deleteTagGroupTemplate,
  fetchTagTemplateUsage,
};
