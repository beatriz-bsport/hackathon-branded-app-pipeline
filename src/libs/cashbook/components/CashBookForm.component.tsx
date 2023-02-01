import React from 'react';

import Button from '@material-ui/core/Button';
import { compose } from 'recompose';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { Form, withFormik } from 'formik';
import moment from 'moment-timezone';
import { Typography } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import type { Theme } from '@material-ui/core/styles';
import { PriceField, Submit } from '../../../components/forms';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import { CashBook, CashBookUpdate, Transaction } from '../types';
import { RolePermission } from '#libs/role/types';
import { OptionCallback } from '../../../state/types';

type Props = {
  isSubmitting: boolean;
  setOpenCash: (oepnCash: boolean) => void;
  initial: CashBook;
  handleOpenOnSpotPaymentReport: () => void;
  permissions: RolePermission;
};

export const CashBookForm = (props: Props) => {
  const {
    isSubmitting,
    setOpenCash,
    initial,
    handleOpenOnSpotPaymentReport,
    permissions,
  } = props;
  const classes = useStyles();
  const { t } = useTranslation('navigation');
  return (
    <Form className={classes.container}>
      <div className={classes.field}>
        <PriceField
          name="todayStartAmount"
          fullWidth
          variant="outlined"
          disabled={initial && initial.today_start_amount}
          label={t('backofficeMenu.cashBook.todayStartAmount')}
        />
      </div>
      <div className={classes.field}>
        <Typography>
          {`${t(
            'backofficeMenu.cashBook.amount',
          )} ${getCurrencyDisplayWithPrice(initial.amount_received)}`}
        </Typography>
        <Typography>
          {`${t(
            'backofficeMenu.cashBook.expectedAmount',
          )} ${getCurrencyDisplayWithPrice(
            initial.today_start_amount + initial.amount_received,
          )}`}
        </Typography>
      </div>
      <div className={classes.field}>
        <PriceField
          variant="outlined"
          name="todayEndAmount"
          fullWidth
          label={t('backofficeMenu.cashBook.todayEndAmount')}
        />
      </div>
      <div className={classes.field}>
        <Typography variant="caption" color="textSecondary">
          {`${t('backofficeMenu.cashBook.lastUpdated')} :  ${moment(
            initial.date_last_update,
          ).format('LLLL')}`}
        </Typography>
      </div>
      {permissions?.navigationMenu?.reporting && (
        <div className={classes.fieldCenter}>
          <Button
            variant="outlined"
            onClick={() => {
              handleOpenOnSpotPaymentReport();
              setOpenCash(false);
            }}
          >
            {t('backofficeMenu.cashBook.onSpotPaymentReport')}
          </Button>
        </div>
      )}
      <div className={classes.buttonContainer}>
        <Button
          onClick={() => {
            setOpenCash(false);
          }}
        >
          {t('backofficeMenu.cashBook.close')}
        </Button>
        <Submit disabled={isSubmitting}>
          {t('backofficeMenu.cashBook.save')}
        </Submit>
      </div>
    </Form>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  field: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  fieldCenter: {
    marginBottom: theme.spacing(1),
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
}));

export const CashBookSchema = Yup.object().shape({
  todayStartAmount: Yup.number().required(),
});

type FormProps = Props & {
  onSubmit: (data: CashBookUpdate, options: OptionCallback) => void;
};

export const CashBookFormikHOC = withFormik<FormProps, Transaction>({
  mapPropsToValues: ({ initial }) => {
    return {
      todayStartAmount: initial.today_start_amount,
      todayEndAmount: initial.today_end_amount,
      amount: initial.amount_received,
    };
  },
  validationSchema: CashBookSchema,
  handleSubmit: (
    values,
    { props: { onSubmit, setOpenCash }, setSubmitting },
  ) => {
    onSubmit(
      { ...values, dateUpdated: moment().format() },
      {
        onSuccess: () => setSubmitting(false),
        onError: () => setSubmitting(false),
      },
    );
    setOpenCash(false);
  },
});

export default compose<Props, Props & FormProps>(CashBookFormikHOC)(
  CashBookForm,
);
