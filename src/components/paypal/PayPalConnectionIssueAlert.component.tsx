import AlertTitle from '@material-ui/lab/AlertTitle';
import React from 'react';

import { useTranslation } from 'react-i18next';

import { createStyles, makeStyles } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import {
  PAYPAL_SIGNIN_URL,
  PAYPAL_STATUS_PRODUCTION_URL,
} from '#src/libs/company/constants';

const useStyles = makeStyles(() =>
  createStyles({
    link: {
      textDecoration: 'underline',
      color: 'inherit',
      '&:visited': {
        color: 'inherit',
      },
      '&:hover': {
        color: 'inherit',
      },
    },
    alert: {
      display: 'flex',
      alignItems: 'center',
    },
    column: {
      display: 'flex',
      flexDirection: 'column',
    },
  }),
);

type Props = {
  status: string;
  isStatusUnknown: boolean;
};

export const PayPalConnectionIssueAlert: React.FC<Props> = (props: Props) => {
  const { status, isStatusUnknown }: Props = props;
  const translationKey = isStatusUnknown ? 'isStatusUnknown' : status;
  const href = isStatusUnknown
    ? PAYPAL_STATUS_PRODUCTION_URL
    : PAYPAL_SIGNIN_URL;

  const { t } = useTranslation(['settings']);
  const classes = useStyles();
  return (
    <Alert className={classes.alert} severity="error" variant="standard">
      <AlertTitle>
        {t(`company.paypal.alert.error.${translationKey}.title`)}
      </AlertTitle>
      <div className={classes.column}>
        {t(`company.paypal.alert.error.${translationKey}.content`)}
        <a
          className={classes.link}
          href={href}
          rel="noreferrer"
          target="_blank"
        >
          {t(`company.paypal.alert.error.${translationKey}.goToPayPal`)}
        </a>
      </div>
    </Alert>
  );
};

export default PayPalConnectionIssueAlert;
