// @flow

import React from 'react';
import { compose } from 'recompose';

import { Form, FormikProps } from 'formik';

import { useTranslation } from 'react-i18next';

import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';

import { makeStyles } from '@material-ui/core';
import PaymentComboFields, {
  PaymentComboFormHoc,
} from './PaymentComboForm.component';
import {
  withFormTrackingHOC,
  WithSegmentAnalyticsFormTrackerHandlers,
  SEGMENT_ANALYTICS_FORM_OBJECT_IDENTIFIER_ENUM,
} from '#components/analytics/segment';
import type { PaymentCombo } from '#libs/payment-combo/types';
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';

type Props = {
  open: boolean;
  provincialTax: number;

  handleClose: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  initial: PaymentCombo;
} & WithSegmentAnalyticsFormTrackerHandlers &
  FormikProps<PaymentCombo>;

export function PaymentComboFormDrawer(props: Props) {
  const { open, handleClose, isSubmitting } = props;
  const classes = useStyles();
  const { t } = useTranslation('paymentCombo');
  return (
    <GenericResponsiveDrawer
      open={open}
      onClose={handleClose}
      title={t('form.title')}
      subtitle={props.initial?.name}
    >
      <Form>
        <div className={classes.content}>
          {open ? <PaymentComboFields {...props} /> : null}
          <DialogActions>
            <Button
              onClick={() => {
                props.handleClose();
                props.formCancel(
                  props.initial && props.initial.id
                    ? { payment_combo_id: props.initial.id }
                    : {},
                );
              }}
              disabled={isSubmitting}
            >
              {t('form.actions.cancel')}
            </Button>
            <Button
              onClick={() => {
                props.formSubmitIntent(
                  props.initial && props.initial.id
                    ? { payment_combo_id: props.initial.id }
                    : {},
                );
                props.handleSubmit();
              }}
              disabled={isSubmitting}
              color="primary"
              variant="contained"
            >
              {t('form.actions.submit')}
            </Button>
          </DialogActions>
        </div>
      </Form>
    </GenericResponsiveDrawer>
  );
}
const useStyles = makeStyles((theme) => ({
  content: {
    minWidth: '30vw',
    paddingTop: theme.spacing(4),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}));

export default compose<any, Props>(
  withFormTrackingHOC({
    object_identifier:
      SEGMENT_ANALYTICS_FORM_OBJECT_IDENTIFIER_ENUM.PAYMENT_COMBO,
  }),
  PaymentComboFormHoc,
)(PaymentComboFormDrawer);
