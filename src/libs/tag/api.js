// @flow

import { API_URI, deleteAuth, getAuth, postAuth, putAuth } from '../../http.ts';

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

export default {
  fetchAllGroups,
  fetchAllTags,
  createTag,
  createTagGroup,
  updateTag,
  updateTagGroup,
  deleteTag,
  deleteTagGroup,
};
