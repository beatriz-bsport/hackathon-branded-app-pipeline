import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import { useTranslation } from 'react-i18next';
import { Form } from 'formik';

import SubscriptionContractFields, {
  SubscriptionContractFormDrawerProps,
  SubscriptionContractFormHoc,
} from './SubscriptionContractForm.component';
import { SEGMENT_ANALYTICS_FORM_OBJECT_IDENTIFIER_ENUM } from '#components/analytics/segment';
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';
import { rudderStackFormTrackingFunctionsRegistry } from '#components/analytics/rudderstack/utils';

const { trackFormSubmitIntent, trackFormCancel } =
  rudderStackFormTrackingFunctionsRegistry(
    SEGMENT_ANALYTICS_FORM_OBJECT_IDENTIFIER_ENUM.SUBSCRIPTION,
  );

export const SubscriptionContractFormDrawer = (
  props: SubscriptionContractFormDrawerProps,
) => {
  const { t } = useTranslation('subscription');
  const classes = useStyles();
  return (
    <GenericResponsiveDrawer
      open={props.open}
      onClose={props.onClose}
      title={t('contract.form.title')}
      subtitle={props.initial?.name}
      trackingObjectIdentifier={
        SEGMENT_ANALYTICS_FORM_OBJECT_IDENTIFIER_ENUM.SUBSCRIPTION
      }
      trackingObjectId={props.initial?.id}
    >
      <Form>
        <div className={classes.content}>
          <SubscriptionContractFields {...props} />
        </div>
        <DialogActions>
          <Button
            onClick={() => {
              trackFormCancel(props.initial?.id);
              props.onClose();
            }}
          >
            {t('cancel')}
          </Button>
          <Button
            onClick={() => {
              trackFormSubmitIntent(props.initial?.id);
              props.handleSubmit();
            }}
            disabled={props.isSubmitting}
            color="primary"
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
  content: {
    paddingTop: theme.spacing(4),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}));

export default SubscriptionContractFormHoc(SubscriptionContractFormDrawer);
