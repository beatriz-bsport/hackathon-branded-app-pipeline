import React from 'react';
import { compose } from 'recompose';

import { Form, FormikProps } from 'formik';

import { useTranslation } from 'react-i18next';

import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';

import { makeStyles } from '@material-ui/core';
import { SegmentAnalyticsFormObjectIdentifier } from '#src/components/analytics/segment';
import type { PaymentCombo } from '#src/libs/payment-combo/types';
import GenericResponsiveDrawer from '#src/components/genericDrawer/GenericResponsiveDrawer.component';
import { rudderStackFormTrackingFunctionsRegistry } from '#src/components/analytics/rudderstack/utils';
import type { BookkeepingAccount } from '#src/libs/payment/types';
import PaymentComboFields, {
  PaymentComboFormHoc,
} from './PaymentComboForm.component';

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
  bookkeepingAccounts: BookkeepingAccount[];
  bookkeepingAccountById: Record<number, BookkeepingAccount>;
} & FormikProps<PaymentCombo>;

export function PaymentComboFormDrawer(props: Props) {
  const { open, handleClose, isSubmitting } = props;
  const classes = useStyles();
  const { t } = useTranslation('paymentCombo');
  return (
    <GenericResponsiveDrawer
      onClose={handleClose}
      open={open}
      subtitle={props.initial?.name}
      title={t('form.title')}
      trackingObjectId={props.initial?.id}
      trackingObjectIdentifier={
        SegmentAnalyticsFormObjectIdentifier.PaymentCombo
      }
    >
      <Form>
        <div className={classes.content}>
          {/* @ts-expect-error */}
          {open ? <PaymentComboFields {...props} /> : null}
          <DialogActions>
            <Button
              disabled={isSubmitting}
              onClick={() => {
                props.handleClose();
                trackFormCancel(props.initial?.id);
              }}
            >
              {t('form.actions.cancel')}
            </Button>
            <Button
              color="primary"
              disabled={isSubmitting}
              onClick={() => {
                trackFormSubmitIntent(props.initial?.id);
                props.handleSubmit();
              }}
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
