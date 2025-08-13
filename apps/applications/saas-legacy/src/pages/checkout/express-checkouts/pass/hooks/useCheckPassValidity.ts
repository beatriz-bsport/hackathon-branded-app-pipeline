import { useCallback, useState } from 'react';
import { DateTime } from 'luxon';
import { PassTypes } from '#src/libs/marketplace/types';
import type { PassCardData } from '#src/pages/checkout/express-checkouts/pass/context/PassCardDataContext';
import { useFetchPassData } from './useFetchPassData';

export const PASS_ERROR_INVALID = 'PASS_INVALID';

export type PassErrorCode = typeof PASS_ERROR_INVALID;

type PassValidityResponse = {
  isValid: boolean;
  shouldDisplayErrorPage: boolean;
  errorCode?: PassErrorCode;
};

const checkPassValidity = (
  passCardData: PassCardData,
): PassValidityResponse => {
  if (passCardData.passType === PassTypes.PAYMENTPACK) {
    const paymentPack = passCardData.paymentPackData?.paymentPack;

    let validityRange: { upper: string; lower: string } | null = null;
    if (paymentPack?.validity_daterange) {
      try {
        validityRange =
          typeof paymentPack.validity_daterange === 'string'
            ? JSON.parse(paymentPack.validity_daterange)
            : paymentPack.validity_daterange;
      } catch (error) {
        console.error('Failed to parse validity_daterange:', error);
        validityRange = null;
      }
    }

    const isPassOutdated = validityRange
      ? DateTime.now() > DateTime.fromISO(validityRange.upper)
      : false;

    if (
      !paymentPack ||
      paymentPack.disabled ||
      paymentPack.manager_only ||
      isPassOutdated
    ) {
      return {
        isValid: false,
        shouldDisplayErrorPage: true,
        errorCode: PASS_ERROR_INVALID,
      };
    }
  } else {
    const privatePass = passCardData.privatePassData?.privatePass;

    if (!privatePass || !privatePass.available || privatePass.manager_only) {
      return {
        isValid: false,
        shouldDisplayErrorPage: true,
        errorCode: PASS_ERROR_INVALID,
      };
    }
  }

  return {
    isValid: true,
    shouldDisplayErrorPage: false,
  };
};

const useCheckPassValidity = () => {
  const [validityState, setValidityState] =
    useState<PassValidityResponse | null>(null);

  const { refetchPassData } = useFetchPassData();

  const checkValidity = useCallback(async () => {
    const passData = await refetchPassData();
    const result = checkPassValidity(passData);
    setValidityState(result);
    return result;
  }, [refetchPassData]);

  return [validityState, checkValidity] as const;
};

export default useCheckPassValidity;
