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
  onEdit: () => void;
  agreementUrl?: string | null;
  certificateUrl?: string | null;
};

const VerifactuActive: React.FC<VerifactuActiveProps> = ({
  representative,
  onEdit,
  agreementUrl,
  certificateUrl,
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

  const handleCertificateLink = () => {
    if (certificateUrl) {
      window.open(certificateUrl, '_blank');
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
        <Button
          color="primary"
          disabled={!certificateUrl}
          onClick={handleCertificateLink}
          size="small"
          startIcon={<LinkIcon />}
          variant="outlined"
        >
          {t('configuration.verifactu.active.certificate_link')}
        </Button>
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
}));

export default VerifactuActive;
