// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { Form, FormikProps } from 'formik';

import SubscriptionContractFields, {
  SubscriptionContractFormHoc,
} from './SubscriptionContractForm.component';
import {
  withFormTrackingHOC,
  WithSegmentAnalyticsFormTrackerHandlers,
  SEGMENT_ANALYTICS_FORM_OBJECT_IDENTIFIER_ENUM,
} from '#components/analytics/segment';
import type { Subscription } from '../types';

type Props = {
  t: TFunction;
  open: boolean;
  onClose: () => void;
  isSubmitting: boolean;
  initial: Subscription;
} & WithSegmentAnalyticsFormTrackerHandlers &
  FormikProps<Subscription>;
export const SubscriptionContractFormDialog = (props: Props) => {
  const { t } = props;
  return (
    <Dialog open={props.open}>
      <Form>
        <DialogTitle>{props.t('contract.form.title')}</DialogTitle>
        <DialogContent>
          <SubscriptionContractFields {...props} />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              props.formCancel &&
                props.formCancel(
                  props.initial && props.initial.id
                    ? { subscription_id: props.initial.id }
                    : {},
                );
              props.onClose();
            }}
          >
            {t('cancel')}
          </Button>
          <Button
            onClick={() => {
              props.formSubmitIntent &&
                props.formSubmitIntent(
                  props.initial && props.initial.id
                    ? { subscription_id: props.initial.id }
                    : {},
                );
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
    </Dialog>
  );
};

const styles = () => ({
  container: {},
});

export default compose<any, Props>(
  withFormTrackingHOC({
    object_identifier:
      SEGMENT_ANALYTICS_FORM_OBJECT_IDENTIFIER_ENUM.SUBSCRIPTION,
  }),
  withTranslation(['subscription']),
  withStyles(styles),
  SubscriptionContractFormHoc,
)(SubscriptionContractFormDialog);
