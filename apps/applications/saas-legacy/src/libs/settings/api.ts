import {
  getAuth,
  postAuth,
  putAuth,
  patchAuth,
  deleteAuth,
  get,
} from '../../http';
import type {
  CustomAppNavigationTabsNames,
  CustomMobilePopupCreateOrEditData,
  CustomShopRedirection,
} from './types';
import Config from '../../config';

const API_V1_URI = Config.REACT_APP_BASE_URI_MEMBER_EXPERIENCE_V1;

export const fetchCustomShopRedirections = async () =>
  getAuth(`${API_V1_URI}/mobile_app/custom_shop_redirection/`);

export const fetchCustomPrivacyPolicy = async (id: number) =>
  get(`${API_V1_URI}/mobile_app/custom_privacy_policy/${id}/`);

export const createCustomShopRedirection = async (
  data: Omit<CustomShopRedirection, 'id'>,
) => postAuth(`${API_V1_URI}/mobile_app/custom_shop_redirection/`, data);

export const editCustomShopRedirection = async (
  id: string,
  data: CustomShopRedirection,
) => putAuth(`${API_V1_URI}/mobile_app/custom_shop_redirection/${id}/`, data);

export const deleteCustomShopRedirection = async (id: string) =>
  deleteAuth(`${API_V1_URI}/mobile_app/custom_shop_redirection/${id}/`);

export const fetchMobilePopups = () => {
  return getAuth(`${API_V1_URI}/mobile_app/manager/custom_popup_links/`);
};

export const createCustomMobilePopup = async (
  data: CustomMobilePopupCreateOrEditData,
) => postAuth(`${API_V1_URI}/mobile_app/manager/custom_popup_links/`, data);

export const editCustomMobilePopup = async (
  id: string,
  data: CustomMobilePopupCreateOrEditData,
) =>
  patchAuth(`${API_V1_URI}/mobile_app/manager/custom_popup_links/${id}/`, data);

export const deleteCustomMobilePopup = async (id: number) =>
  deleteAuth(`${API_V1_URI}/mobile_app/manager/custom_popup_links/${id}/`);

export const fetchCustomNavigationTabsNames = (companyId: number) => {
  return getAuth<CustomAppNavigationTabsNames>(
    `${API_V1_URI}/mobile_app/custom_app_configuration/${companyId}/fetch_custom_navigation_tabs_names/`,
  );
};
