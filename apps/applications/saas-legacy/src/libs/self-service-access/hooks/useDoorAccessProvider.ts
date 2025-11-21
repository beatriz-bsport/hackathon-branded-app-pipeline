import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import i18next from 'i18next';
import { AccessControlProvider } from '../types';
import { getAccessControlProvider } from '../api';
import { snackbarError } from '#src/actions/snackbar.actions';

type UseDoorAccessProviderReturn = {
  provider: AccessControlProvider | null;
  loading: boolean;
  error: boolean;
  isAvailable: boolean;
};

export const useDoorAccessProvider = (
  companyId: number,
): UseDoorAccessProviderReturn => {
  const [provider, setProvider] = useState<AccessControlProvider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchProvider() {
      try {
        setLoading(true);
        setError(false);
        const response = await getAccessControlProvider(companyId);
        setProvider(response.data);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setProvider(null);
        } else {
          setError(true);
          dispatch(
            snackbarError(
              i18next.t(
                'consumerSpace:reworked.selfServiceAccess.error.fetchProvider',
              ),
            ),
          );
        }
      } finally {
        setLoading(false);
      }
    }

    if (companyId) {
      fetchProvider();
    }
  }, [companyId, dispatch]);

  return {
    provider,
    loading,
    error,
    isAvailable: !!provider,
  };
};
