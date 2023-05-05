import React from 'react';

import {
  BSPORT_REQUEST_FROM_HEADER_STORAGE_LOCATION,
  BsportRequestFromHeaderValue,
} from '../constants';

const storage = window.sessionStorage;

const WidgetTracker: React.FC<{ isBackofficePreview?: boolean }> = ({
  isBackofficePreview,
}) => {
  React.useEffect(() => {
    if (!isBackofficePreview) {
      storage?.setItem(
        BSPORT_REQUEST_FROM_HEADER_STORAGE_LOCATION,
        BsportRequestFromHeaderValue.WIDGET,
      );
    }

    return () => {
      if (!isBackofficePreview) {
        storage?.removeItem(BSPORT_REQUEST_FROM_HEADER_STORAGE_LOCATION);
      }
    };
  }, [isBackofficePreview]);

  return <div />;
};

export default WidgetTracker;
