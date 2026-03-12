import React from 'react';
import { Link } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Share03 } from '#src/components/untitledui';
import { FiskalyOnboardingRequirement } from '#src/libs/invoice/types';

type VerifactuRequirementsAlertsProps = {
  requirements: FiskalyOnboardingRequirement[];
};

const VerifactuRequirementsAlerts: React.FC<
  VerifactuRequirementsAlertsProps
> = ({ requirements }) => {
  const classes = useStyles();
  const { t } = useTranslation('b2b_invoice');

  const hasVatIdMissing = requirements.includes(
    FiskalyOnboardingRequirement.BUSINESS_VAT_ID_NOT_VERIFIED,
  );
  const hasBusinessAddressMissing = requirements.includes(
    FiskalyOnboardingRequirement.BUSINESS_ADDRESS_NOT_PROVIDED,
  );
  const hasLegalIdentifierMissing = requirements.includes(
    FiskalyOnboardingRequirement.LEGAL_IDENTIFIER_NOT_ACTIVATED,
  );

  const showFirstCard = hasVatIdMissing || hasBusinessAddressMissing;
  const showSecondCard = hasLegalIdentifierMissing;

  if (!showFirstCard && !showSecondCard) {
    return null;
  }

  return (
    <div className={classes.container}>
      {showFirstCard && (
        <Alert severity="error">
          <div className={classes.alert}>
            <Typography className={classes.alertTitle} variant="subtitle2">
              {hasVatIdMissing && hasBusinessAddressMissing
                ? t(
                    'configuration.verifactu.form.requirements.vat_and_address_required',
                  )
                : hasVatIdMissing
                ? t('configuration.verifactu.form.requirements.vat_required')
                : t(
                    'configuration.verifactu.form.requirements.address_required',
                  )}
            </Typography>
            <Typography variant="body2">
              {hasVatIdMissing && hasBusinessAddressMissing
                ? t(
                    'configuration.verifactu.form.requirements.vat_and_address_description',
                  )
                : hasVatIdMissing
                ? t('configuration.verifactu.form.requirements.vat_description')
                : t(
                    'configuration.verifactu.form.requirements.address_description',
                  )}
            </Typography>
            <Link
              className={classes.link}
              rel="noopener noreferrer"
              target="_blank"
              to={
                // Route to Stripe onboarding if only address is missing,
                // otherwise route to company settings (for VAT ID)
                hasBusinessAddressMissing && !hasVatIdMissing
                  ? '/settings/company_onboarding'
                  : '/settings/company'
              }
            >
              {hasBusinessAddressMissing && !hasVatIdMissing
                ? t(
                    'configuration.verifactu.form.requirements.complete_stripe_onboarding',
                  )
                : t('configuration.verifactu.form.requirements.go_to_settings')}
              <Share03 className={classes.linkIcon} />
            </Link>
          </div>
        </Alert>
      )}

      {showSecondCard && (
        <Alert severity="error">
          <div className={classes.alert}>
            <Typography className={classes.alertTitle} variant="subtitle2">
              {t(
                'configuration.verifactu.form.requirements.legal_identifier_required',
              )}
            </Typography>
            <Typography variant="body2">
              <Trans
                components={[
                  <a
                    key="helpsheet-link"
                    href="https://intercom.help/bsport-helpcenter/articles/13529640-how-to-set-up-sequential-invoice-numbering"
                    rel="noopener noreferrer"
                    target="_blank"
                  />,
                ]}
                i18nKey="configuration.verifactu.form.requirements.legal_identifier_description"
                ns="b2b_invoice"
              />
            </Typography>
          </div>
        </Alert>
      )}
    </div>
  );
};

const useStyles = makeStyles<Theme>((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  alert: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.5),
  },
  alertTitle: {
    fontWeight: 590,
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    fontWeight: 700,
    color: '#611a15',
    textDecoration: 'none',
    width: 'fit-content',
    '&:hover': {
      color: '#611a15',
      textDecoration: 'underline',
    },
    marginTop: theme.spacing(1),
  },
  linkIcon: {
    marginLeft: theme.spacing(1),
    width: 16,
    height: 16,
  },
}));

export default VerifactuRequirementsAlerts;
