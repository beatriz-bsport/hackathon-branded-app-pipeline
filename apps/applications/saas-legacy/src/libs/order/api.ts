import { AxiosResponse } from 'axios';
import type {
  DeliveryConfiguration,
  DeliveryFee,
  DeliveryFeeCreationOrUpdatePayload,
  Order,
  OrderWithProducts,
} from '#src/libs/order/types';
import { PaginatedResponse } from '../../state/types';
import { postAuth, getAuth, patchAuth } from '../../http';

import Config from '../../config';

const API_V1_URI = Config.REACT_APP_BASE_URI_BUYABLE_V1;

export async function fetchOrders(
  page: number,
  companyId?: number,
  state?: number,
): Promise<AxiosResponse<PaginatedResponse<OrderWithProducts>>> {
  let urlParams = '';
  if (companyId) {
    urlParams += `&company=${companyId}`;
  }
  if (state) {
    urlParams += `&state=${state}`;
  }
  return getAuth(`${API_V1_URI}/order/?page=${page}${urlParams}`);
}

export async function fetchOrder(
  orderId: string,
): Promise<AxiosResponse<OrderWithProducts>> {
  return getAuth(`${API_V1_URI}/order/${orderId}/`);
}

export async function patchOrder(
  orderId: string,
  data: Partial<Order>,
): Promise<AxiosResponse<OrderWithProducts>> {
  return patchAuth(`${API_V1_URI}/order/${orderId}/`, data);
}

export async function patchConfiguration(
  data: DeliveryConfiguration,
): Promise<AxiosResponse<DeliveryConfiguration>> {
  return patchAuth(`${API_V1_URI}/order/configuration/me/`, data);
}

export async function fetchConfiguration(): Promise<
  AxiosResponse<DeliveryConfiguration>
> {
  return getAuth(`${API_V1_URI}/order/configuration/me/`);
}

export async function fetchAllDeliveryFee(): Promise<
  AxiosResponse<Array<DeliveryFee>>
> {
  return getAuth(`${API_V1_URI}/order/delivery-fee/`);
}

export async function createDeliveryFee(
  data: DeliveryFeeCreationOrUpdatePayload,
): Promise<AxiosResponse<DeliveryFee>> {
  return postAuth(`${API_V1_URI}/order/delivery-fee/`, data);
}

export async function updateDeliveryFee(
  data: DeliveryFeeCreationOrUpdatePayload,
): Promise<AxiosResponse<DeliveryFee>> {
  return patchAuth(`${API_V1_URI}/order/delivery-fee/${data.id}/`, data);
}
