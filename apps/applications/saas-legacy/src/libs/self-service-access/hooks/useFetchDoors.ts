import { useEffect, useState } from 'react';
import i18next from 'i18next';
import { Door, GeolocationCoordinates } from '../types';
import { fetchDoorsNearby } from '../api';

type FetchDoorReturn = {
  doors: Door[] | null;
  loading: boolean;
  error: string | null;
};

export const useFetchDoors = (
  companyId: number,
  userLocation: GeolocationCoordinates,
): FetchDoorReturn => {
  const [doors, setDoors] = useState<Door[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDoors = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchDoorsNearby(companyId, userLocation);
        setDoors(response.data.doors);
      } catch (_) {
        const errorMessage = i18next.t(
          'consumerSpace:reworked.selfServiceAccess.error.fetchDoors',
        );
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (companyId && userLocation) {
      loadDoors();
    }
  }, [companyId, userLocation?.latitude, userLocation?.longitude]);

  return {
    doors,
    loading,
    error,
  };
};
