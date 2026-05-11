import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';

import { FiskalyOnboardingRequirement } from '#src/libs/invoice/types';
import FiskalyOnboardingChips from '#src/libs/invoice/sign-es/fiskaly/components/FiskalyOnboardingChips.component';
import FiskalyOnboardingRequirementsAlerts from '#src/libs/invoice/sign-es/fiskaly/components/FiskalyOnboardingRequirementsAlerts.component';
import TicketbaiTerritoryBanner from '#src/libs/invoice/sign-es/ticketbai/components/TicketbaiTerritoryBanner.component';
import type { TicketbaiTerritory } from '#src/libs/invoice/sign-es/ticketbai/types';
import type { PlatformCustomerEntity } from '#src/libs/platform-billing/type';

type Props = {
  territory: TicketbaiTerritory;
  platformCustomerEntity: PlatformCustomerEntity | null | undefined;
  requirements: FiskalyOnboardingRequirement[];
  onboardLoading: boolean;
  criticalRequirementsMet: boolean;
  handleConfigureTicketbai: () => void;
};

const TicketbaiOnboardingEntryStep: React.FC<Props> = ({
  territory,
  platformCustomerEntity,
  requirements,
  onboardLoading,
  criticalRequirementsMet,
  handleConfigureTicketbai,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('b2b_invoice');

  return (
    <div>
      <TicketbaiTerritoryBanner
        platformCustomerEntity={platformCustomerEntity}
        territory={territory}
      />
      <FiskalyOnboardingChips
        requirements={requirements}
        translationPrefix="configuration.ticketbai.form"
      />

      <FiskalyOnboardingRequirementsAlerts
        requirements={requirements}
        translationPrefix="configuration.ticketbai.form"
      />

      <div className={classes.actions}>
        <Button
          color="primary"
          disabled={onboardLoading || !criticalRequirementsMet}
          onClick={handleConfigureTicketbai}
          variant="contained"
        >
          {onboardLoading
            ? t('configuration.ticketbai.onboarding.register_processing')
            : t('configuration.ticketbai.onboarding.configure_ticketbai')}
        </Button>
        <Button
          color="primary"
          href="https://support.fiskaly.com/hc/es/articles/12429833140380-SIGN-ES-C%C3%B3mo-registrar-el-certificado-de-dispositivo-en-el-Pa%C3%ADs-Vasco"
          rel="noopener noreferrer"
          target="_blank"
          variant="text"
        >
          {t('configuration.ticketbai.onboarding.info_euskadi')}
        </Button>
      </div>
    </div>
  );
};

const useStyles = makeStyles<Theme>((theme) => ({
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
}));

export default TicketbaiOnboardingEntryStep;
