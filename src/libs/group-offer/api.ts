import { AxiosResponse } from 'axios';

import { GenericPaginationResults } from '#libs/types';
import {
  API_V1_URI,
  postAuth,
  deleteAuth,
  getAuth,
  buildUrlParams,
} from '../../http';
import { Offer, OfferStatus } from '#libs/offer/types';
import { OffersGroupFilter, GroupPreviewData, OffersGroup } from './types';

export const fetchGroupsOfferList = async (
  params: OffersGroupFilter & {
    page: number;
    page_size: number;
    id__in?: number[];
  },
): Promise<AxiosResponse<GenericPaginationResults<OffersGroup>>> =>
  getAuth(`${API_V1_URI}/offer_group/${buildUrlParams(params)}`);

export const fetchGroupOffer = async (
  id: number,
): Promise<AxiosResponse<OffersGroup>> =>
  getAuth(`${API_V1_URI}/offer_group/${id}/`);

export const fetchSimilarGroupOffers = async (id: number) =>
  getAuth(
    `${API_V1_URI}/offer_group/${id}/find_similar/${buildUrlParams({
      exclude_self: true,
    })}`,
  );

export const editGroupOffer = async (
  id: number,
  data: {
    level: number;
    name: string;
    allow_booking_after_start: boolean;
    full_booking_only: boolean;
    manager_only: boolean;
  },
): Promise<AxiosResponse<OffersGroup>> =>
  postAuth(`${API_V1_URI}/offer_group/${id}/update_group/`, data);

export const deleteGroupOffer = async (
  id: number,
  data: {
    notify_if_cancelled: boolean;
    similar_group_ids: number[];
  },
): Promise<AxiosResponse<void>> =>
  deleteAuth(`${API_V1_URI}/offer_group/${id}/`, data);

export const createGroupOffers = async (data: {
  group_data_with_offers: Record<
    number,
    {
      offers_data: Offer[];
      group: OffersGroup<Offer>;
    }
  >;
}): Promise<AxiosResponse<void>> =>
  postAuth(`${API_V1_URI}/offer_group/create_groups_with_offers/`, data);

export const generateGroupOffersPreview = async (
  data: GroupPreviewData,
): Promise<
  AxiosResponse<
    Record<
      number,
      {
        group: OffersGroup;
        offers_data: Offer[];
      }
    >
  >
> => postAuth(`${API_V1_URI}/offer_group/generate_preview/`, data);

export const getGroupOfferBookableStatus = async (
  id: number,
): Promise<AxiosResponse<OfferStatus[]>> =>
  getAuth(`${API_V1_URI}/offer_group/${id}/bookable_status/`);

export const getGroupOfferFirstOfferIdToBeBooked = async (
  id: number,
): Promise<AxiosResponse<number | null>> =>
  getAuth(`${API_V1_URI}/offer_group/${id}/get_first_offer_id_to_be_booked/`);

export const listGroupOfferOffersIdsToBeBooked = async (
  id: number,
): Promise<AxiosResponse<number[]>> =>
  getAuth(`${API_V1_URI}/offer_group/${id}/list_offers_ids_to_be_booked/`);
