import React from 'react';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import { useTranslation } from 'react-i18next';
import { Form } from 'formik';
import { makeStyles } from '@material-ui/core';
import { SegmentAnalyticsFormObjectIdentifier } from '#src/components/analytics/segment';
import GenericResponsiveDrawer from '#src/components/genericDrawer/GenericResponsiveDrawer.component';
import { rudderStackFormTrackingFunctionsRegistry } from '#src/components/analytics/rudderstack/utils';

import SubscriptionContractFields from './ContractForm.component';
import { SubscriptionContractFormDrawerProps } from './types';
import { SubscriptionContractFormHoc } from './hooks/SubscriptionContractFormHoc';

const { trackFormSubmitIntent, trackFormCancel } =
  rudderStackFormTrackingFunctionsRegistry(
    SegmentAnalyticsFormObjectIdentifier.Subscription,
  );

export const ContractOneObjectFormDrawer = (
  props: SubscriptionContractFormDrawerProps,
) => {
  const { t } = useTranslation('subscription');
  const classes = useStyles();

  const { onClose, resetForm, open, isSubmitting } = props;
  const onDrawerClose = React.useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  return (
    <GenericResponsiveDrawer
      withoutPadding
      onClose={onDrawerClose}
      open={open}
      title={t('contract.form.title')}
      trackingObjectId={props.initial?.id}
      trackingObjectIdentifier={
        SegmentAnalyticsFormObjectIdentifier.Subscription
      }
    >
      <Form>
        <SubscriptionContractFields {...props} />
        <DialogActions className={classes.dialogActions}>
          <Button
            onClick={() => {
              trackFormCancel(props.initial?.id);
              resetForm();
              onClose();
            }}
          >
            {t('cancel')}
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
            {t('save')}
          </Button>
        </DialogActions>
      </Form>
    </GenericResponsiveDrawer>
  );
};

const useStyles = makeStyles((theme) => ({
  dialogActions: {
    padding: theme.spacing(4),
  },
}));

export default SubscriptionContractFormHoc(ContractOneObjectFormDrawer);
