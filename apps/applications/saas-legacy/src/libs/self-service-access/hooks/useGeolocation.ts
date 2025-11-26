import { useEffect, useRef, useState } from 'react';
import i18next from 'i18next';
import {
  GeolocationCoordinates,
  GeolocationError,
  GeolocationErrorCode,
} from '../types';

type UseGeolocationReturn = {
  userLocation: GeolocationCoordinates | null;
  error: GeolocationError | null;
  loading: boolean;
};

function geoLocationErrorCodeToMessage(
  errorCode: GeolocationErrorCode,
): string {
  switch (errorCode) {
    case GeolocationErrorCode.PERMISSION_DENIED:
      return i18next.t('openDoorButton.error.permissionDenied', {
        ns: 'b2c_accessControl',
      });
    case GeolocationErrorCode.POSITION_UNAVAILABLE:
      return i18next.t('openDoorButton.error.positionUnavailable', {
        ns: 'b2c_accessControl',
      });
    case GeolocationErrorCode.TIMEOUT:
      return i18next.t('openDoorButton.error.timeout', {
        ns: 'b2c_accessControl',
      });
    case GeolocationErrorCode.NOT_SUPPORTED:
    default:
      return i18next.t('openDoorButton.error.geolocationNotSupported', {
        ns: 'b2c_accessControl',
      });
  }
}

export const useGeolocation = (): UseGeolocationReturn => {
  const [error, setError] = useState<GeolocationError | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const watchIdRef = useRef<number | null>(null);
  const [userLocation, setUserLocation] =
    useState<GeolocationCoordinates | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError({
        code: GeolocationErrorCode.NOT_SUPPORTED,
        message: i18next.t('openDoorButton.error.geolocationNotSupported', {
          ns: 'b2c_accessControl',
        }),
      });
      setLoading(false);
      return;
    }

    const success = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      setError(null);
      setUserLocation({ latitude, longitude });
      setLoading(false);
    };

    const failure = (geoLocationError: GeolocationPositionError) => {
      setUserLocation(null);
      const errorCode = geoLocationError.code as GeolocationErrorCode;
      setError({
        code: errorCode,
        message: geoLocationErrorCodeToMessage(errorCode),
      });
      setLoading(false);
    };

    watchIdRef.current = navigator.geolocation.watchPosition(success, failure, {
      timeout: 10_000,
    });

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return { userLocation, loading, error };
};
