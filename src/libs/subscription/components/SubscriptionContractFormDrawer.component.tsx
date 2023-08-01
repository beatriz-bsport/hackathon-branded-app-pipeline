import React from 'react';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import { useTranslation } from 'react-i18next';
import { Form } from 'formik';
import { makeStyles } from '@material-ui/core';
import SubscriptionContractFields, {
  SubscriptionContractFormDrawerProps,
  SubscriptionContractFormHoc,
} from './SubscriptionContractForm.component';
import { SegmentAnalyticsFormObjectIdentifier } from '#components/analytics/segment';
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';
import { rudderStackFormTrackingFunctionsRegistry } from '#components/analytics/rudderstack/utils';

const { trackFormSubmitIntent, trackFormCancel } =
  rudderStackFormTrackingFunctionsRegistry(
    SegmentAnalyticsFormObjectIdentifier.Subscription,
  );

export const SubscriptionContractFormDrawer = (
  props: SubscriptionContractFormDrawerProps,
) => {
  const { t } = useTranslation('subscription');
  const classes = useStyles();

  const { onClose, resetForm } = props;
  const onDrawerClose = React.useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  return (
    <GenericResponsiveDrawer
      withoutPadding
      onClose={onDrawerClose}
      open={props.open}
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
            disabled={props.isSubmitting}
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

export default SubscriptionContractFormHoc(SubscriptionContractFormDrawer);
