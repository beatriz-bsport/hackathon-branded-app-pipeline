import {
  API_V1_URI,
  getAuth,
  postAuth,
  putAuth,
  patchAuth,
  deleteAuth,
} from '../../http';
import { CustomMobilePopup, CustomShopRedirection } from './types';

export const fetchCustomShopRedirections = async () =>
  getAuth(`${API_V1_URI}/mobile_app/custom_shop_redirection/`);

export const createCustomShopRedirection = async (
  data: Omit<CustomShopRedirection, 'id'>,
) => postAuth(`${API_V1_URI}/mobile_app/custom_shop_redirection/`, data);

export const editCustomShopRedirection = async (
  id: string,
  data: CustomShopRedirection,
) => putAuth(`${API_V1_URI}/mobile_app/custom_shop_redirection/${id}/`, data);

export const deleteCustomShopRedirection = async (id: string) =>
  deleteAuth(`${API_V1_URI}/mobile_app/custom_shop_redirection/${id}/`);

export const fetchCustomMobilePopups = async () =>
  getAuth(`${API_V1_URI}/mobile_app/custom_popup_links/`);

export const createCustomMobilePopup = async (
  data: Omit<CustomMobilePopup, 'id'>,
) => postAuth(`${API_V1_URI}/mobile_app/custom_popup_links/`, data);

export const editCustomMobilePopup = async (
  id: string,
  data: CustomMobilePopup,
) => patchAuth(`${API_V1_URI}/mobile_app/custom_popup_links/${id}/`, data);

export const deleteCustomMobilePopup = async (id: string) =>
  deleteAuth(`${API_V1_URI}/mobile_app/custom_popup_links/${id}/`);
