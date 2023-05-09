import React from 'react';

import { BsportRequestFromHeaderValue } from '../constants';

import useSaasRouterTracker from '../hooks/useSaasRouterTracker';

const WidgetTracker: React.FC<{ isBackofficePreview?: boolean }> = ({
  isBackofficePreview,
}) => {
  useSaasRouterTracker(
    BsportRequestFromHeaderValue.WIDGET,
    isBackofficePreview,
  );

  return <div />;
};

export default WidgetTracker;
