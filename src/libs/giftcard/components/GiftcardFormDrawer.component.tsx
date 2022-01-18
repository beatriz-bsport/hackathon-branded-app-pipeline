import React from 'react';
import { compose } from 'recompose';
import { useTranslation } from 'react-i18next';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

import { Form, FormikProps } from 'formik';
import { makeStyles } from '@material-ui/core';
import GiftcardForm, { GiftcardFormFieldHOC } from './GiftcardForm.component';
import { OptionCallback } from '../../../state/types';
import { GiftcardData } from '../types';
import {
  withFormTrackingHOC,
  WithSegmentAnalyticsFormTrackerHandlers,
  SEGMENT_ANALYTICS_FORM_OBJECT_IDENTIFIER_ENUM,
} from '#components/analytics/segment';
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';

type Props = {
  open: boolean;
  onSubmit: (data: GiftcardData, options: OptionCallback) => void;
  onClose: () => void;
  initial: GiftcardData;
} & WithSegmentAnalyticsFormTrackerHandlers &
  FormikProps<GiftcardData>;

const GiftcardFormDrawer = (props: Props) => {
  const { t } = useTranslation(['giftcard']);
  const classes = useStyles();
  return (
    <GenericResponsiveDrawer
      open={props.open}
      title={t('form.giftcard.title')}
      subtitle={props.initial?.name}
      onClose={() => {
        props.onClose();
        props.formCancel &&
          props.formCancel(
            props.initial && props.initial.id
              ? { giftcard_id: props.initial.id }
              : {},
          );
      }}
    >
      <div className={classes.content}>
        <Form>
          <GiftcardForm {...props} />
          <DialogActions>
            <Button
              onClick={() => {
                props.onClose();
                props.formCancel &&
                  props.formCancel(
                    props.initial && props.initial.id
                      ? { giftcard_id: props.initial.id }
                      : {},
                  );
              }}
            >
              {t('form.giftcard.actions.cancel')}
            </Button>
            <Button
              onClick={() => {
                props.formSubmitIntent &&
                  props.formSubmitIntent(
                    props.initial && props.initial.id
                      ? { giftcard_id: props.initial.id }
                      : {},
                  );
                props.handleSubmit();
              }}
              disabled={props.isSubmitting}
              color="primary"
              variant="contained"
            >
              {t('form.giftcard.actions.submit')}
            </Button>
          </DialogActions>
        </Form>
      </div>
    </GenericResponsiveDrawer>
  );
};

export default compose<any, Props>(
  withFormTrackingHOC({
    object_identifier: SEGMENT_ANALYTICS_FORM_OBJECT_IDENTIFIER_ENUM.GIFTCARD,
  }),
  GiftcardFormFieldHOC,
)(GiftcardFormDrawer);

const useStyles = makeStyles((theme) => ({
  content: {
    paddingBottom: theme.spacing(4),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
}));
