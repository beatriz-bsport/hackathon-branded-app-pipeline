import React from 'react';

import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { Form, withFormik, FormikProps } from 'formik';
import { DateTime } from 'luxon';
import { Typography } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import type { Theme } from '@material-ui/core/styles';
// @ts-expect-error
import { RolePermission } from '#libs/role/types';
import { PriceField, Submit } from '../../../components/forms';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import { CashBook, CashBookUpdate, Transaction } from '../types';
import { OptionCallback } from '../../../state/types';
import { formatAsDatetimeAdapted } from '../../../utils/datetime';

type Props = {
  setOpenCash: (oepnCash: boolean) => void;
  initial: CashBook;
  handleOpenOnSpotPaymentReport: () => void;
  permissions: RolePermission;
};

export const CashBookForm: React.FC<Props & FormikProps<Transaction>> = ({
  isSubmitting,
  setOpenCash,
  initial,
  handleOpenOnSpotPaymentReport,
  permissions,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('navigation');
  return (
    <Form className={classes.container}>
      <div className={classes.field}>
        <PriceField
          fullWidth
          disabled={initial && initial.today_start_amount}
          label={t('backofficeMenu.cashBook.todayStartAmount')}
          name="todayStartAmount"
          variant="outlined"
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
          fullWidth
          label={t('backofficeMenu.cashBook.todayEndAmount')}
          name="todayEndAmount"
          variant="outlined"
        />
      </div>
      <div className={classes.field}>
        <Typography color="textSecondary" variant="caption">
          {`${t(
            'backofficeMenu.cashBook.lastUpdated',
          )} :  ${formatAsDatetimeAdapted(initial.date_last_update, 'DDDD t')}`}
        </Typography>
      </div>
      {permissions?.navigationMenu?.reporting && (
        <div className={classes.fieldCenter}>
          <Button
            onClick={() => {
              handleOpenOnSpotPaymentReport();
              setOpenCash(false);
            }}
            variant="outlined"
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
      { ...values, dateUpdated: DateTime.now().toISO() },
      {
        onSuccess: () => setSubmitting(false),
        onError: () => setSubmitting(false),
      },
    );
    setOpenCash(false);
  },
});

export default CashBookFormikHOC(CashBookForm);
