import React from 'react';
import { compose } from 'recompose';
import { useTranslation } from 'react-i18next';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

import { Form, FormikProps } from 'formik';
import GiftcardForm, { GiftcardFormFieldHOC } from './GiftcardForm.component';
import { OptionCallback } from '../../../state/types';
import { GiftcardData } from '../types';
import { SEGMENT_ANALYTICS_FORM_OBJECT_IDENTIFIER_ENUM } from '#components/analytics/segment';
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';
import { rudderStackFormTrackingFunctionsRegistry } from '#components/analytics/rudderstack/utils';

const { trackFormSubmitIntent, trackFormCancel } =
  rudderStackFormTrackingFunctionsRegistry(
    SEGMENT_ANALYTICS_FORM_OBJECT_IDENTIFIER_ENUM.GIFTCARD,
  );

type Props = {
  open: boolean;
  onSubmit: (data: GiftcardData, options: OptionCallback) => void;
  onClose: () => void;
  initial: GiftcardData;
} & FormikProps<GiftcardData>;

const GiftcardFormDrawer = (props: Props) => {
  const { t } = useTranslation(['giftcard']);
  return (
    <GenericResponsiveDrawer
      open={props.open}
      title={t('form.giftcard.title')}
      subtitle={props.initial?.name}
      trackingObjectIdentifier={
        SEGMENT_ANALYTICS_FORM_OBJECT_IDENTIFIER_ENUM.GIFTCARD
      }
      trackingObjectId={props.initial?.id}
      onClose={props.onClose}
    >
      <Form>
        <GiftcardForm {...props} />
        <DialogActions>
          <Button
            onClick={() => {
              props.onClose();

              trackFormCancel(props.initial?.id);
            }}
          >
            {t('form.giftcard.actions.cancel')}
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
            {t('form.giftcard.actions.submit')}
          </Button>
        </DialogActions>
      </Form>
    </GenericResponsiveDrawer>
  );
};

export default compose<any, Props>(GiftcardFormFieldHOC)(GiftcardFormDrawer);
