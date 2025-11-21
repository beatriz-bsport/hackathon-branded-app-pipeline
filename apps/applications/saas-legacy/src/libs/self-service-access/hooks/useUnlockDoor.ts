import { useState } from 'react';
import { unlockDoor as unlockDoorApi } from '../api';
import { DoorUnlockOutput } from '../types';
import i18next from 'i18next';

type UnlockDoorState = {
  success: boolean;
  error: string | null;
  loading: boolean;
};

type UseUnlockDoorReturn = UnlockDoorState & {
  unlockDoor: (doorId: string) => Promise<DoorUnlockOutput | null>;
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
  ): Promise<DoorUnlockOutput | null> => {
    setState({ success: false, error: null, loading: true });

    try {
      const result = await unlockDoorApi(companyId, doorId);
      const doorUnlockOutput = result.data;

      if (!doorUnlockOutput.success) {
        setState({
          success: false,
          error:
            doorUnlockOutput.message ||
            i18next.t(
              'consumerSpace:reworked.selfServiceAccess.error.failedToUnlock',
            ),
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
        i18next.t(
          'consumerSpace:reworked.selfServiceAccess.error.unknownError',
        );
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
