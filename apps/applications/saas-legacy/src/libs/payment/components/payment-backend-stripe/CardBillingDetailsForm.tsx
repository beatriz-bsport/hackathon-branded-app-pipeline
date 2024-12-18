import React from 'react';

import TextField from '@material-ui/core/TextField';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import CountrySelector from '#src/components/input/LocaleSelector.component';
import type { BillingDetails } from '#src/libs/marketplace/types';

type PropsCardBillingDetailsForm = {
  disabled: boolean;
  billingDetails: BillingDetails;
  setBillingDetails: (billingdetails: BillingDetails) => void;
};

const CardBillingDetailsForm = ({
  billingDetails,
  setBillingDetails,
  disabled,
}: PropsCardBillingDetailsForm) => {
  const { t } = useTranslation(['invoice']);
  const classes = useStyles();

  return (
    <div>
      <div className={classes.nameAndEmailContainer}>
        <CountrySelector
          distinctCountry
          fullWidth
          hideLang
          noMargin
          required
          disabled={disabled}
          label={t('mandate.country')}
          onChange={(
            ev: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
          ) => {
            const { value } = ev.target;
            setBillingDetails({
              ...billingDetails,
              address: {
                ...billingDetails.address,
                country: value,
              },
            });
          }}
          value={billingDetails?.address.country || ''}
          valueKey="country"
        />
        <TextField
          fullWidth
          required
          disabled={disabled}
          label={t('mandate.name')}
          onChange={(ev) => {
            const { value } = ev.target;
            setBillingDetails({
              ...billingDetails,
              name: value,
            });
          }}
          value={billingDetails?.name || ''}
          variant="outlined"
        />
        <TextField
          fullWidth
          required
          disabled={disabled}
          label={t('mandate.address_line_1')}
          onChange={(ev) => {
            const { value } = ev.target;
            setBillingDetails({
              ...billingDetails,
              address: {
                ...billingDetails.address,
                line1: value,
              },
            });
          }}
          value={billingDetails?.address.line1 || ''}
          variant="outlined"
        />
        <TextField
          fullWidth
          disabled={disabled}
          label={t('mandate.address_line_2')}
          onChange={(ev) => {
            const { value } = ev.target;
            setBillingDetails({
              ...billingDetails,
              address: {
                ...billingDetails.address,
                line2: value,
              },
            });
          }}
          value={billingDetails?.address.line2 || ''}
          variant="outlined"
        />
        <TextField
          fullWidth
          required
          disabled={disabled}
          label={t('mandate.city')}
          onChange={(ev) => {
            const { value } = ev.target;
            setBillingDetails({
              ...billingDetails,
              address: { ...billingDetails.address, city: value },
            });
          }}
          value={billingDetails?.address.city || ''}
          variant="outlined"
        />
        <TextField
          fullWidth
          required
          disabled={disabled}
          label={t('mandate.address_postal_code')}
          onChange={(ev) => {
            const { value } = ev.target;
            setBillingDetails({
              ...billingDetails,
              address: {
                ...billingDetails.address,
                postal_code: value,
              },
            });
          }}
          value={billingDetails?.address.postal_code || ''}
          variant="outlined"
        />
        <TextField
          fullWidth
          disabled={disabled}
          label={t('mandate.state')}
          onChange={(ev) => {
            const { value } = ev.target;
            setBillingDetails({
              ...billingDetails,
              address: {
                ...billingDetails.address,
                state: value,
              },
            });
          }}
          value={billingDetails?.address.state || ''}
          variant="outlined"
        />
        <TextField
          fullWidth
          disabled={disabled}
          label={t('mandate.email')}
          onChange={(ev) => {
            const { value } = ev.target;
            setBillingDetails({
              ...billingDetails,
              email: value,
            });
          }}
          value={billingDetails?.email || ''}
          variant="outlined"
        />
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  nameAndEmailContainer: {
    flexDirection: 'column',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: `${theme.spacing(2)}px 0px ${theme.spacing(2)}px`,
    gap: theme.spacing(2),
  },
}));

export default CardBillingDetailsForm;
