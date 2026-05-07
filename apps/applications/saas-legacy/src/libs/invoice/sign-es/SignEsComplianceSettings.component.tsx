import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
// eslint-disable-next-line bsport/no-redux-in-component
import { useDispatch, useSelector } from 'react-redux';
import { Typography } from '@material-ui/core';

import { FeatureFlags, useSafeFlag } from '#src/utils/feature-flag';
import { fetchPlatformCustomerEntity } from '#src/libs/platform-billing/actions';
import { isBasqueTerritory } from '#src/libs/invoice/types';
import type { RootState } from '#src/reducers';
import TicketbaiSettings from './ticketbai/TicketbaiSettings.component';
import VerifactuSettings from './verifactu/VerifactuSettings.component';

/**
 * Invoice settings entry for Spanish Sign-ES:
 * - VERI*FACTU outside the Basque provinces,
 * - TicketBAI for Araba, Bizkaia, and Gipuzkoa.
 */
const SignEsComplianceSettings: React.FC = () => {
  const { t } = useTranslation('b2b_invoice');
  const dispatch = useDispatch();
  const [fetchStarted, setFetchStarted] = useState(false);
  const isFiskalySignEsEnabled = useSafeFlag(FeatureFlags.FISKALY_SIGN_ES);

  const platformCustomerEntity = useSelector(
    (state: RootState) => state.platformBilling.platformCustomerEntity?.data,
  );
  const platformCustomerEntityLoading = useSelector(
    (state: RootState) =>
      state.platformBilling.platformCustomerEntity?.loading ?? false,
  );

  useEffect(() => {
    setFetchStarted(true);
    dispatch(fetchPlatformCustomerEntity());
  }, [dispatch]);

  if (!isFiskalySignEsEnabled) {
    return null;
  }

  const resolvingTerritory = !fetchStarted || platformCustomerEntityLoading;

  if (resolvingTerritory) {
    return (
      <Typography variant="body2">
        {t('configuration.verifactu.loading')}
      </Typography>
    );
  }

  const territory = platformCustomerEntity?.address_territory;

  if (isBasqueTerritory(territory)) {
    return <TicketbaiSettings territory={territory} />;
  }

  return <VerifactuSettings />;
};

export default SignEsComplianceSettings;
