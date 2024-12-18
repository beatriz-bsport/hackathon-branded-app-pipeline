import { useEffect } from 'react';

import {
  BSPORT_REQUEST_FROM_HEADER_STORAGE_LOCATION,
  BsportRequestFromHeaderValue,
} from '../constants';

const useSaasRouterTracker = (
  origin: BsportRequestFromHeaderValue,
  isBackofficePreview?: boolean,
) => {
  useEffect(() => {
    if (!isBackofficePreview)
      window?.sessionStorage?.setItem(
        BSPORT_REQUEST_FROM_HEADER_STORAGE_LOCATION,
        origin,
      );

    return () => {
      if (!isBackofficePreview)
        window?.sessionStorage?.removeItem(
          BSPORT_REQUEST_FROM_HEADER_STORAGE_LOCATION,
        );
    };
  }, [origin, isBackofficePreview]);
};
export default useSaasRouterTracker;
