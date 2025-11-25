import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Typography } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { countries } from '#src/i18n/utils/countries';
import type { PlatformCustomerEntityRepresentative } from '#src/libs/platform-billing/type';

type VerifactuRepresentativeDetailsProps = {
  representative: PlatformCustomerEntityRepresentative | null;
  onEdit: () => void;
};

const VerifactuRepresentativeDetails: React.FC<
  VerifactuRepresentativeDetailsProps
> = ({ representative, onEdit }) => {
  const classes = useStyles();
  const { t } = useTranslation('b2b_invoice');

  const fullName = useMemo(
    () =>
      representative
        ? `${representative.first_name} ${representative.last_name}`.trim()
        : '',
    [representative],
  );
  const address = representative?.address_street || '';
  const countryName = useMemo(() => {
    if (!representative?.address_country_code) return '-';
    return (
      countries.find(
        (country) => country.code === representative.address_country_code,
      )?.label || representative.address_country_code
    );
  }, [representative]);

  if (!representative) {
    return null;
  }

  return (
    <>
      <div className={classes.header}>
        <Typography className={classes.title} variant="h5">
          {t('configuration.verifactu.signed_agreement.details_title')}
        </Typography>
        <Button color="primary" onClick={onEdit} size="small">
          {t('configuration.verifactu.signed_agreement.edit')}
        </Button>
      </div>

      <div className={classes.detailsBlock}>
        <div className={classes.detailRows}>
          <Typography className={classes.label} variant="body2">
            {t('configuration.verifactu.signed_agreement.full_name')}
          </Typography>
          <Typography className={classes.label} variant="body2">
            {t('configuration.verifactu.signed_agreement.dni_nie')}
          </Typography>
          <Typography className={classes.label} variant="body2">
            {t('configuration.verifactu.signed_agreement.address')}
          </Typography>
          <Typography className={classes.label} variant="body2">
            {t('configuration.verifactu.signed_agreement.municipality')}
          </Typography>
          <Typography className={classes.label} variant="body2">
            {t('configuration.verifactu.signed_agreement.country')}
          </Typography>
        </div>

        <div className={classes.detailRows}>
          <Typography className={classes.value} variant="body2">
            {fullName}
          </Typography>
          <Typography className={classes.value} variant="body2">
            {representative.identification_number}
          </Typography>
          <Typography className={classes.value} variant="body2">
            {address}
          </Typography>
          <Typography className={classes.value} variant="body2">
            {representative.address_municipality}
          </Typography>
          <Typography className={classes.value} variant="body2">
            {countryName}
          </Typography>
        </div>
      </div>
    </>
  );
};

const useStyles = makeStyles<Theme>((theme) => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  title: {
    fontWeight: 590,
    fontSize: theme.spacing(2),
  },
  detailsBlock: {
    display: 'flex',
    gap: theme.spacing(4),
    backgroundColor: '#fafafa',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  detailRows: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  label: {
    color: theme.palette.text.secondary,
  },
  value: {
    color: theme.palette.text.primary,
  },
}));

export default VerifactuRepresentativeDetails;
