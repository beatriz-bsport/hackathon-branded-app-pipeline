import React from 'react';
import { useTranslation } from 'react-i18next';
import compose from 'recompose/compose';
import { makeStyles } from '@material-ui/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Form, withFormik } from 'formik';
import Typography from '@material-ui/core/Typography';
import WarningIcon from '@material-ui/icons/Warning';
import * as Yup from 'yup';
import { Theme } from '@material-ui/core';
import { OptionCallback } from '../../../state/types';
import { CheckboxField, Submit, PriceField } from '#components/forms';
import { type Subscription, PlannedInvoice } from '../types';

type Props = {
  open: boolean;
  onCancel: () => void;
  subscription: Subscription;
  isSubmitting?: boolean;
  plannedInvoiceUpdateLoading: boolean;
};

export const PlannedInvoicePriceUpdater = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation('subscription');
  return (
    <Dialog open={props.open}>
      {props.plannedInvoiceUpdateLoading && <LinearProgress />}
      <Form>
        <DialogTitle>{t('plannedInvoice.priceUpdater.title')}</DialogTitle>
        <DialogContent>
          <PriceField
            name="price"
            label={t('plannedInvoice.priceUpdater.price')}
            required
            fullWidth
            disabled={props.isSubmitting || props.plannedInvoiceUpdateLoading}
          />
          {!!props.subscription && props.subscription.is_v2 ? (
            <>
              <CheckboxField
                label={t('plannedInvoice.priceUpdater.updateAll')}
                name="update_all"
                disabled={
                  props.isSubmitting || props.plannedInvoiceUpdateLoading
                }
              />
              <CheckboxField
                label={t('plannedInvoice.priceUpdater.updateRecurrentPrice')}
                name="update_recurrent_price"
                disabled={
                  props.isSubmitting || props.plannedInvoiceUpdateLoading
                }
              />
            </>
          ) : (
            <div className={classes.row}>
              <WarningIcon className={classes.leftIcon} color="error" />
              <Typography>
                {t('plannedInvoice.priceUpdater.explain')}
              </Typography>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button disabled={props.isSubmitting} onClick={props.onCancel}>
            {t('plannedInvoice.priceUpdater.cancel')}
          </Button>
          <Submit disabled={props.isSubmitting}>
            {t('plannedInvoice.priceUpdater.submit')}
          </Submit>
        </DialogActions>
      </Form>
    </Dialog>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing(1),
    backgroundColor: '#EFEFEF',
    borderRadius: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
}));

export const PriceUpdaterSchema = Yup.object().shape({
  planned_invoice: Yup.number().required(),
  price: Yup.number().required(),
  update_all: Yup.boolean().nullable(),
  update_recurrent_price: Yup.boolean().nullable(),
});

interface FormikProps {
  plannedInvoice: PlannedInvoice;
  onSubmit: (
    data: {
      planned_invoice: number;
      price: number;
      update_all?: boolean;
      update_recurrent_price?: boolean;
    },
    options: OptionCallback,
  ) => void;
}

interface FormikValues {
  planned_invoice: number;
  price: number;
}

export const PriceUpdateFormikHOC = withFormik<FormikProps, FormikValues>({
  mapPropsToValues: ({ plannedInvoice }) => ({
    price: plannedInvoice.price,
    planned_invoice: plannedInvoice.id,
  }),
  validationSchema: PriceUpdaterSchema,
  handleSubmit: (values, { props: { onSubmit }, setSubmitting }) => {
    setSubmitting(true);
    onSubmit(values, {
      onSuccess: () => setSubmitting(false),
      onError: () => setSubmitting(false),
    });
  },
});

export default compose<any, Props & FormikProps>(PriceUpdateFormikHOC)(
  PlannedInvoicePriceUpdater,
);
