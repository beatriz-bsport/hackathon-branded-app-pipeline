import React from 'react';

import TextField from '@material-ui/core/TextField';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Config from '../../../../config';
import CountrySelector from '#components/input/LocaleSelector.component';
import type { BillingDetails } from '#libs/marketplace/types';

// Temporary test to limit the number of 3DS required for card payments for one company (id 1416)
export const ADDRESS_REQUIRED_COMPANY_ID =
  Config.REACT_APP_SENTRY_ENVIRONMENT === 'staging' ? 6 : 1416;

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
          value={billingDetails.address.country}
          valueKey="country"
        />
        <TextField
          fullWidth
          required
          disabled={disabled}
          name="name"
          onChange={(ev) => {
            const { value } = ev.target;
            setBillingDetails({
              ...billingDetails,
              name: value,
            });
          }}
          placeholder={t('mandate.name')}
          value={billingDetails.name}
          variant="outlined"
        />
        <TextField
          fullWidth
          required
          disabled={disabled}
          name="line1"
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
          placeholder={t('mandate.address_line_1')}
          value={billingDetails.address.line1}
          variant="outlined"
        />
        <TextField
          fullWidth
          disabled={disabled}
          name="line2"
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
          placeholder={t('mandate.address_line_2')}
          value={billingDetails.address.line2}
          variant="outlined"
        />
        <TextField
          fullWidth
          disabled={disabled}
          name="city"
          onChange={(ev) => {
            const { value } = ev.target;
            setBillingDetails({
              ...billingDetails,
              address: { ...billingDetails.address, city: value },
            });
          }}
          placeholder={t('mandate.city')}
          value={billingDetails.address.city}
          variant="outlined"
        />
        <TextField
          fullWidth
          required
          disabled={disabled}
          name="postalCode"
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
          placeholder={t('mandate.address_postal_code')}
          value={billingDetails.address.postal_code}
          variant="outlined"
        />
        <TextField
          fullWidth
          disabled={disabled}
          name="state"
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
          placeholder={t('mandate.state')}
          value={billingDetails.address.state}
          variant="outlined"
        />
        <TextField
          fullWidth
          disabled={disabled}
          name="email"
          onChange={(ev) => {
            const { value } = ev.target;
            setBillingDetails({
              ...billingDetails,
              email: value,
            });
          }}
          placeholder={t('mandate.email')}
          value={billingDetails.email}
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
