// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import { compose } from 'recompose';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import * as Yup from 'yup';
import { Form, withFormik } from 'formik';
import moment from 'moment-timezone';
import { Typography } from '@material-ui/core';
import { PriceField, Submit } from '../../../components/forms';

type Props = {
  t: TFunction,
  isSubmitting: boolean,
  classes: Object,
  setOpenCash: () => void,
  initial: ?{
    today_start_amount: number,
    today_end_amount: number,
    amount_received: number,
  },
  handleOpenOnSpotPaymentReport: () => void,
};

export const CashBookForm = (props: Props) => {
  const {
    t,
    classes,
    isSubmitting,
    setOpenCash,
    initial,
    handleOpenOnSpotPaymentReport,
  } = props;
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
          {`${t('backofficeMenu.cashBook.amount')} ${
            initial.amount_received
          } €`}
        </Typography>
        <Typography>
          {`${t('backofficeMenu.cashBook.expectedAmount')} ${
            initial.today_start_amount + initial.amount_received
          } €`}
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

const styles = (theme) => ({
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
});

export const CashBookSchema = Yup.object().shape({
  todayStartAmount: Yup.number().required(),
});

export const CashBookFormikHOC = withFormik({
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

export default compose(
  withTranslation(['navigation']),
  withStyles(styles),
  CashBookFormikHOC,
)(CashBookForm);
