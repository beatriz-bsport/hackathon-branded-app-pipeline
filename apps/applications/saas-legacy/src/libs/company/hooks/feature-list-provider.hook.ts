import React from 'react';
import { useSelector } from 'react-redux';
import {
  UPSELL_IDENTIFIER_SPIVI,
  UPSELL_IDENTIFIER_STRIPE_TERMINAL,
  UPSELL_IDENTIFIER_WELLHUB,
  UPSELL_IDENTIFIER_ZOOM_APP,
  UPSELL_URBAN_SPORTS_CLUB_IDENTIFIER,
} from '#src/libs/platform-billing/upsell-identifiers';
import Config from '#src/config';

import { getCompanyFeatureState } from '#src/libs/company/selectors';
import type { State } from '#src/state/types';

// Use a hook to determine the availability of features, taking into account the company and environment settings.
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

  const stripeTerminalEnabled = React.useMemo(() => {
    return !!feature.data.upsell.find(
      (f) => f.upsell_identifier === UPSELL_IDENTIFIER_STRIPE_TERMINAL,
    );
  }, [feature]);

  const spiviEnabled = React.useMemo(() => {
    return feature.data.upsell.some(
      (f) => f.upsell_identifier === UPSELL_IDENTIFIER_SPIVI,
    );
  }, [feature]);

  const USCEnabled = React.useMemo(() => {
    return feature.data.upsell.some(
      (f) => f.upsell_identifier === UPSELL_URBAN_SPORTS_CLUB_IDENTIFIER,
    );
  }, [feature]);

  const wellhubEnabled = React.useMemo(() => {
    return feature.data.upsell.some(
      (f) => f.upsell_identifier === UPSELL_IDENTIFIER_WELLHUB,
    );
  }, [feature]);

  return {
    pushNotificationEnabled,
    smsEnabled,
    zoomAppEnabled,
    stripeTerminalEnabled,
    spiviEnabled,
    USCEnabled,
    wellhubEnabled,
    featuresLoading: feature.loading,
  };
};

export default useFeaturesProvider;
