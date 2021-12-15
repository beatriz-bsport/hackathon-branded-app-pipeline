// @flow

import React from 'react';
import { compose } from 'recompose';

import { Form, FormikProps } from 'formik';

import { useTranslation } from 'react-i18next';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

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

type Props = {
  open: boolean;
  handleClose: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  fullScreen?: boolean;
  initial: PaymentCombo;
} & WithSegmentAnalyticsFormTrackerHandlers &
  FormikProps<PaymentCombo>;

export function PaymentComboFormDialog(props: Props) {
  const { open, handleClose, fullScreen, isSubmitting } = props;
  const classes = useStyles();
  const { t } = useTranslation('paymentCombo');
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      fullScreen={fullScreen}
      maxWidth={false}
    >
      <Form>
        <div className={classes.content}>
          <DialogTitle id="form-dialog-title">{t('form.title')}</DialogTitle>
          <DialogContent>
            {open ? <PaymentComboFields {...props} /> : null}
          </DialogContent>
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
    </Dialog>
  );
}
const useStyles = makeStyles(() => ({
  content: {
    minWidth: '30vw',
  },
}));

export default compose<any, Props>(
  withFormTrackingHOC({
    object_identifier:
      SEGMENT_ANALYTICS_FORM_OBJECT_IDENTIFIER_ENUM.PAYMENT_COMBO,
  }),
  PaymentComboFormHoc,
)(PaymentComboFormDialog);
