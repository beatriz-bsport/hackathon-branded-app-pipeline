import type { UserRegistrationResponse } from '#src/libs/booker-module/types';
import { USER_REGISTRATION_RESPONSE_LOCAL_STORAGE_KEY } from '#src/libs/payment/constants';
import { getItemInStorage } from '#src/utils/storage';

export const getUserRegistrationResponse = ({
  getUserRegistrationFromStorage,
  userRegistrationResponse,
}: {
  getUserRegistrationFromStorage?: string | undefined;
  userRegistrationResponse: UserRegistrationResponse | undefined;
}) => {
  if (!getUserRegistrationFromStorage) {
    return userRegistrationResponse;
  }
  const rawUserRegistrationResponse = getItemInStorage(
    'local',
    USER_REGISTRATION_RESPONSE_LOCAL_STORAGE_KEY,
  );
  try {
    return rawUserRegistrationResponse
      ? JSON.parse(rawUserRegistrationResponse)
      : null;
  } catch (error) {
    console.error('getUserRegistrationResponse: JSON parse failed', {
      storageKey: USER_REGISTRATION_RESPONSE_LOCAL_STORAGE_KEY,
      rawData: rawUserRegistrationResponse,
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return null;
  }
};
