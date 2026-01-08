import { getAuth, postAuth } from '../../http';
import Config from '../../config';
import {
  AccessControlProvider,
  Doors,
  DoorUnlockOutput,
  GeolocationCoordinates,
} from './types';
import { AxiosRequestConfig } from 'axios';
import { AxiosLockOptions } from '#src/http/types';

const API_V1_URI = Config.REACT_APP_BASE_URI_CORE_V1;
const DEFAULT_TOKEN: string | undefined = undefined;
const DEFAULT_CANCEL_TOKEN: AxiosRequestConfig['cancelToken'] | undefined =
  undefined;
const DEFAULT_LOCK_OPTION: AxiosLockOptions | undefined = undefined;

export async function getAccessControlProvider(companyId: number) {
  return getAuth<AccessControlProvider>(
    `${API_V1_URI}/self-service-access/access-control-provider/${companyId}`,
  );
}

export async function fetchDoorsNearby(
  companyId: number,
  { latitude, longitude }: GeolocationCoordinates,
) {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
  });
  return getAuth<Doors>(
    `${API_V1_URI}/self-service-access/door/?${params}`,
    DEFAULT_TOKEN,
    DEFAULT_CANCEL_TOKEN,
    DEFAULT_LOCK_OPTION,
    { 'X-BSPORT-COMPANY-ID': companyId },
  );
}

export async function unlockDoor(
  companyId: number,
  doorId: string,
  { latitude, longitude }: GeolocationCoordinates,
) {
  return postAuth<DoorUnlockOutput>(
    `${API_V1_URI}/self-service-access/door/${doorId}/unlock/`,
    { latitude, longitude },
    DEFAULT_TOKEN,
    DEFAULT_CANCEL_TOKEN,
    DEFAULT_LOCK_OPTION,
    { 'X-BSPORT-COMPANY-ID': companyId },
  );
}
