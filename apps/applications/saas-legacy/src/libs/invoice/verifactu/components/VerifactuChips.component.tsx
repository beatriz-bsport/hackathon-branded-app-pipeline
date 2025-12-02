import React from 'react';
import { useTranslation } from 'react-i18next';
import { Chip } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { FiskalyOnboardingRequirement } from '#src/libs/invoice/types';
import type { ChipConfig } from '#src/libs/invoice/verifactu/types';

type VerifactuChipsProps = {
  requirements: FiskalyOnboardingRequirement[];
};

const chipConfigs: ChipConfig[] = [
  {
    requirement: FiskalyOnboardingRequirement.BUSINESS_VAT_ID_NOT_VERIFIED,
    validatedKey: 'configuration.verifactu.form.chips.vat_id_validated',
    missingKey: 'configuration.verifactu.form.chips.vat_id_missing',
  },
  {
    requirement: FiskalyOnboardingRequirement.BUSINESS_ADDRESS_NOT_PROVIDED,
    validatedKey:
      'configuration.verifactu.form.chips.business_address_provided',
    missingKey: 'configuration.verifactu.form.chips.business_address_missing',
  },
  {
    requirement: FiskalyOnboardingRequirement.LEGAL_IDENTIFIER_NOT_ACTIVATED,
    validatedKey:
      'configuration.verifactu.form.chips.invoice_identifiers_set_up',
    missingKey:
      'configuration.verifactu.form.chips.invoice_identifiers_not_set_up',
  },
];

const VerifactuChips: React.FC<VerifactuChipsProps> = ({ requirements }) => {
  const classes = useStyles();
  const { t } = useTranslation('b2b_invoice');

  // Filter chips: show legal identifier chip only when the requirement is present
  // (it's not always relevant), but always show VAT ID and address chips
  const chipsToShow = chipConfigs.filter((config) => {
    if (
      config.requirement ===
      FiskalyOnboardingRequirement.LEGAL_IDENTIFIER_NOT_ACTIVATED
    ) {
      return requirements.includes(config.requirement);
    }
    return true;
  });

  return (
    <div className={classes.chipsContainer}>
      {chipsToShow.map((config) => {
        // Chip is valid (green) if the requirement is NOT in the requirements list
        // (e.g., if BUSINESS_VAT_ID_NOT_VERIFIED is not present, VAT ID is validated)
        const isValid = !requirements.includes(config.requirement);
        return (
          <Chip
            key={config.requirement}
            className={isValid ? classes.successChip : classes.errorChip}
            icon={
              isValid ? (
                <CheckCircleIcon className={classes.successIcon} />
              ) : (
                <CancelIcon className={classes.errorIcon} />
              )
            }
            label={t(isValid ? config.validatedKey : config.missingKey)}
          />
        );
      })}
    </div>
  );
};

const useStyles = makeStyles<Theme>((theme) => ({
  chipsContainer: {
    display: 'flex',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  successChip: {
    backgroundColor: '#f1f9f1',
    color: '#3b873e',
  },
  successIcon: {
    color: '#3b873e',
    width: 16,
    height: 16,
  },
  errorChip: {
    backgroundColor: '#fff0ef',
    color: '#e31b0c',
  },
  errorIcon: {
    color: '#e31b0c',
    width: 16,
    height: 16,
  },
}));

export default VerifactuChips;
