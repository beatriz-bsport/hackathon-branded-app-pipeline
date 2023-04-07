// @ts-nocheck
import React from 'react';
import { useSelector } from 'react-redux';
import Config from '../../../config';

import { getCompanyFeatureState } from '../selectors';
import type { State } from '../../../state/types';
import { UPSELL_IDENTIFIER_ZOOM_APP } from '#libs/platform-billing/upsell-identifiers';

// Hook to provide features enabled or not based on
// company & environment settings
// To be "enriched" step by step
const useFeaturesProvider = () => {
  const feature = useSelector((state: State) => getCompanyFeatureState(state));

  const pushNotificationEnabled = React.useMemo(() => {
    return (
      Config.REACT_APP_SENTRY_ENVIRONMENT !== 'production' ||
      !feature.data.upsell ||
      !feature.data.upsell.find(
        (f) => f.readable_identifier === 'push_notification',
      )
    );
  }, [feature]);

  const smsEnabled = React.useMemo(() => {
    return (
      Config.REACT_APP_SENTRY_ENVIRONMENT !== 'production' ||
      !feature.data.upsell ||
      !feature.data.upsell.find((f) => f.readable_identifier === 'sms')
    );
  }, [feature]);

  const zoomAppEnabled = React.useMemo(() => {
    return !!feature.data.upsell.find(
      (f) => f.upsell_identifier === UPSELL_IDENTIFIER_ZOOM_APP,
    );
  }, [feature]);

  return {
    pushNotificationEnabled,
    smsEnabled,
    zoomAppEnabled,
    featuresLoading: feature.loading,
  };
};

export default useFeaturesProvider;
