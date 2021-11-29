// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import { withTranslation, TFunction } from 'react-i18next';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { Form, withFormik } from 'formik';
import Typography from '@material-ui/core/Typography';
import WarningIcon from '@material-ui/icons/Warning';
import * as Yup from 'yup';
import { CheckboxField, Submit, PriceField } from '../../../components/forms';

type Props = {
  t: TFunction,
  open: boolean,
  classes: Object,
  onCancel: () => void,
  subscription: ?Subscription,
  isSubmitting: boolean,
};
export const PlannedInvoicePriceUpdater = (props: Props) => {
  return (
    <Dialog open={props.open}>
      <Form>
        <DialogTitle>
          {props.t('plannedInvoice.priceUpdater.title')}
        </DialogTitle>
        <DialogContent>
          <PriceField
            name="price"
            label={props.t('plannedInvoice.priceUpdater.price')}
            required
            fullWidth
          />
          {!!props.subscription && props.subscription.is_v2 ? (
            <CheckboxField
              label={props.t('plannedInvoice.priceUpdater.updateAll')}
              name="update_all"
            />
          ) : (
            <div className={props.classes.row}>
              <WarningIcon className={props.classes.leftIcon} color="error" />
              <Typography>
                {props.t('plannedInvoice.priceUpdater.explain')}
              </Typography>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button disabled={props.isSubmitting} onClick={props.onCancel}>
            {props.t('plannedInvoice.priceUpdater.cancel')}
          </Button>
          <Submit disabled={props.isSubmitting}>
            {props.t('plannedInvoice.priceUpdater.submit')}
          </Submit>
        </DialogActions>
      </Form>
    </Dialog>
  );
};

const styles = (theme) => ({
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
});

export const PriceUpdaterSchema = Yup.object().shape({
  planned_invoice: Yup.number().required(),
  price: Yup.number().required(),
  update_all: Yup.boolean().nullable(),
});

export const PriceUpdateFormikHOC = withFormik({
  mapPropsToValues: ({ planned_invoice }) => ({
    price: planned_invoice.price,
    planned_invoice: planned_invoice.id,
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

export default compose(
  withTranslation(['subscription']),
  withStyles(styles),
  PriceUpdateFormikHOC,
)(PlannedInvoicePriceUpdater);
