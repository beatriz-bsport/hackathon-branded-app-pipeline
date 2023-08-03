import React from 'react';

import TextField from '@material-ui/core/TextField';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Config from '../../../../config';

// Temporary test to limit the number of 3DS required for card payments for one company (id 1416)
export const ADDRESS_REQUIRED_COMPANY_ID =
  Config.REACT_APP_SENTRY_ENVIRONMENT === 'staging' ? 6 : 1416;

export interface BillingDetails {
  name: string;
  address: { line1: string; postal_code: string };
}

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
        <TextField
          required
          fullWidth
          value={billingDetails.name}
          variant="outlined"
          placeholder={t('mandate.name')}
          disabled={disabled}
          onChange={(ev) => {
            const { value } = ev.target;
            setBillingDetails({
              ...billingDetails,
              name: value,
            });
          }}
        />
        <TextField
          required
          fullWidth
          value={billingDetails.address.line1}
          variant="outlined"
          disabled={disabled}
          placeholder={t('mandate.address_line_1')}
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
        />
        <TextField
          required
          fullWidth
          value={billingDetails.address.postal_code}
          variant="outlined"
          name="postalCode"
          disabled={disabled}
          placeholder={t('mandate.address_postal_code')}
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
