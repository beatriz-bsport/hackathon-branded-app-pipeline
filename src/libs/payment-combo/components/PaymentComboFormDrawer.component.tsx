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
import { SegmentAnalyticsFormObjectIdentifier } from '#components/analytics/segment';
import type { PaymentCombo } from '#libs/payment-combo/types';
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';
import { rudderStackFormTrackingFunctionsRegistry } from '#components/analytics/rudderstack/utils';

const { trackFormSubmitIntent, trackFormCancel } =
  rudderStackFormTrackingFunctionsRegistry(
    SegmentAnalyticsFormObjectIdentifier.PaymentCombo,
  );

type Props = {
  open: boolean;
  provincialTax: number;

  handleClose: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  initial: PaymentCombo;
} & FormikProps<PaymentCombo>;

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
      trackingObjectIdentifier={
        SegmentAnalyticsFormObjectIdentifier.PaymentCombo
      }
      trackingObjectId={props.initial?.id}
    >
      <Form>
        <div className={classes.content}>
          {open ? <PaymentComboFields {...props} /> : null}
          <DialogActions>
            <Button
              onClick={() => {
                props.handleClose();
                trackFormCancel(props.initial?.id);
              }}
              disabled={isSubmitting}
            >
              {t('form.actions.cancel')}
            </Button>
            <Button
              onClick={() => {
                trackFormSubmitIntent(props.initial?.id);
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
    paddingBottom: theme.spacing(4),
  },
}));

export default compose<any, Props>(PaymentComboFormHoc)(PaymentComboFormDrawer);
