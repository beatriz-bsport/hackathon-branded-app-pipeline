import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Typography } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import LinkIcon from '@material-ui/icons/Link';
import Alert from '@material-ui/lab/Alert';
import type { PlatformCustomerEntityRepresentative } from '#src/libs/platform-billing/type';
import VerifactuRepresentativeDetails from '#src/libs/invoice/verifactu/components/VerifactuRepresentativeDetails.component';

type VerifactuActiveProps = {
  representative: PlatformCustomerEntityRepresentative | null;
  agreementUrl?: string | null;
  onEdit: () => void;
  onGetSoftwareRegistrationUrl?: () => void;
};

const VerifactuActive: React.FC<VerifactuActiveProps> = ({
  representative,
  agreementUrl,
  onEdit,
  onGetSoftwareRegistrationUrl,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('b2b_invoice');

  if (!representative) {
    return null;
  }

  const handleAgreementLink = () => {
    if (agreementUrl) {
      window.open(agreementUrl, '_blank');
    }
  };

  return (
    <div>
      <Alert className={classes.alert} severity="success">
        {t('configuration.verifactu.active.success_message')}
      </Alert>

      <VerifactuRepresentativeDetails
        onEdit={onEdit}
        representative={representative}
      />

      <div className={classes.section}>
        <Typography className={classes.title} variant="h5">
          {t('configuration.verifactu.active.agreement_title')}
        </Typography>
        <Typography className={classes.subtitle} variant="body2">
          {t('configuration.verifactu.active.agreement_subtitle')}
        </Typography>
        <Button
          color="primary"
          disabled={!agreementUrl}
          onClick={handleAgreementLink}
          size="small"
          startIcon={<LinkIcon />}
          variant="outlined"
        >
          {t('configuration.verifactu.active.agreement_link')}
        </Button>
      </div>

      <div className={classes.section}>
        <Typography className={classes.title} variant="h5">
          {t('configuration.verifactu.active.certificate_title')}
        </Typography>
        <Typography className={classes.subtitle} variant="body2">
          {t('configuration.verifactu.active.certificate_subtitle')}
        </Typography>

        <div className={classes.buttonGroup}>
          <Button
            className={classes.button}
            color="primary"
            disabled={!onGetSoftwareRegistrationUrl}
            onClick={() => onGetSoftwareRegistrationUrl?.()}
            size="small"
            startIcon={<LinkIcon />}
            variant="outlined"
          >
            {t('configuration.verifactu.active.certificate_link')}
          </Button>
          <Button
            className={classes.button}
            color="primary"
            onClick={() =>
              window.open(
                'https://cdn.bsport.io/assets/docs/declaraci%C3%B3n_responsable_integradores_verifactu.pdf',
                '_blank',
              )
            }
            size="small"
            startIcon={<LinkIcon />}
            variant="outlined"
          >
            {t('configuration.verifactu.active.certificate_extension_link')}
          </Button>
        </div>
      </div>
    </div>
  );
};

const useStyles = makeStyles<Theme>((theme) => ({
  alert: {
    marginBottom: theme.spacing(3),
  },
  title: {
    fontWeight: 590,
    fontSize: theme.spacing(2),
  },
  section: {
    marginBottom: theme.spacing(3),
  },
  subtitle: {
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(2),
  },
  buttonGroup: {
    display: 'flex',
    gap: theme.spacing(2),
    flexWrap: 'wrap',
  },
  button: {
    flex: '0 1 auto',
  },
}));

export default VerifactuActive;
