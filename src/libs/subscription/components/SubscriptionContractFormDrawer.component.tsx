// @flow
import React from 'react';
import { compose } from 'recompose';
import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import { useTranslation } from 'react-i18next';
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
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';

type Props = {
  open: boolean;
  onClose: () => void;
  isSubmitting: boolean;
  initial: Subscription;
} & WithSegmentAnalyticsFormTrackerHandlers &
  FormikProps<Subscription>;
export const SubscriptionContractFormDrawer = (props: Props) => {
  const { t } = useTranslation('subscription');
  const classes = useStyles();
  return (
    <GenericResponsiveDrawer
      open={props.open}
      onClose={props.onClose}
      title={t('contract.form.title')}
      subtitle={props.initial?.name}
    >
      <Form>
        <div className={classes.content}>
          <SubscriptionContractFields {...props} />
        </div>
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

export default compose<any, Props>(
  withFormTrackingHOC({
    object_identifier:
      SEGMENT_ANALYTICS_FORM_OBJECT_IDENTIFIER_ENUM.SUBSCRIPTION,
  }),
  SubscriptionContractFormHoc,
)(SubscriptionContractFormDrawer);
