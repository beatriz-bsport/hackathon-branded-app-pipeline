import { useState } from 'react';
import { unlockDoor as unlockDoorApi } from '../api';
import { DoorUnlockOutput, GeolocationCoordinates } from '../types';
import i18next from 'i18next';

type UnlockDoorState = {
  success: boolean;
  error: string | null;
  loading: boolean;
};

type UseUnlockDoorReturn = UnlockDoorState & {
  unlockDoor: (
    doorId: string,
    geolocation: GeolocationCoordinates,
  ) => Promise<DoorUnlockOutput | null>;
  reset: () => void;
};

export default function useUnlockDoor(companyId: number): UseUnlockDoorReturn {
  const [state, setState] = useState<UnlockDoorState>({
    success: false,
    error: null,
    loading: false,
  });

  const unlockDoor = async (
    doorId: string,
    geolocation: GeolocationCoordinates,
  ): Promise<DoorUnlockOutput | null> => {
    setState({ success: false, error: null, loading: true });

    try {
      const result = await unlockDoorApi(companyId, doorId, geolocation);
      const doorUnlockOutput = result.data;

      if (!doorUnlockOutput.success) {
        setState({
          success: false,
          error:
            doorUnlockOutput.message ||
            i18next.t('openDoorButton.error.failedToUnlock', {
              ns: 'b2c_accessControl',
            }),
          loading: false,
        });
        return null;
      }

      setState({ success: true, error: null, loading: false });
      return doorUnlockOutput;
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        i18next.t('openDoorButton.error.unknownError', {
          ns: 'b2c_accessControl',
        });
      setState({ success: false, error: errorMessage, loading: false });
      return null;
    }
  };

  const reset = () => {
    setState({ success: false, error: null, loading: false });
  };

  return {
    ...state,
    unlockDoor,
    reset,
  };
}
