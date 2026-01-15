export type AccessControlProvider = {
  id: number;
  provider_type: 'kisi';
  geofencing_protection_enabled: boolean;
  geofencing_protection_radius: number;
  proximity_proof_protection_enabled: boolean;
  timezone: string;
};

export type GeolocationCoordinates = {
  latitude: number;
  longitude: number;
};

// See https://developer.mozilla.org/en-US/docs/Web/API/GeolocationPositionError/code
export const GeolocationErrorCode = {
  PERMISSION_DENIED: 1,
  POSITION_UNAVAILABLE: 2,
  TIMEOUT: 3,
  NOT_SUPPORTED: 0,
} as const;

export type GeolocationErrorCode =
  (typeof GeolocationErrorCode)[keyof typeof GeolocationErrorCode];

export type GeolocationError = {
  code: GeolocationErrorCode;
  message: string;
};

export type Door = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  description: string;
};

export type Doors = {
  doors: Door[];
};

export type DoorUnlockOutput = {
  message: string;
  success: boolean;
  provider_response: string;
  provider_status_code: number;
};
