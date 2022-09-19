import React from 'react';
import { compose } from 'recompose';
import { useTranslation } from 'react-i18next';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

import { makeStyles, Theme } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Form, FormikProps } from 'formik';
import GiftcardForm, { GiftcardFormFieldHOC } from './GiftcardForm.component';
import { OptionCallback } from '../../../state/types';
import { GiftcardDataAPI, Giftcard, GiftcardTemplate } from '../types';
import { SEGMENT_ANALYTICS_FORM_OBJECT_IDENTIFIER_ENUM } from '#components/analytics/segment';
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';
import { rudderStackFormTrackingFunctionsRegistry } from '#components/analytics/rudderstack/utils';

const { trackFormSubmitIntent, trackFormCancel } =
  rudderStackFormTrackingFunctionsRegistry(
    SEGMENT_ANALYTICS_FORM_OBJECT_IDENTIFIER_ENUM.GIFTCARD,
  );

type OwnProps = {
  open: boolean;
  onSubmit: (
    data: GiftcardDataAPI,
    options: OptionCallback<Giftcard | GiftcardTemplate>,
  ) => void;
  onClose: () => void;
  initial?: Giftcard | GiftcardTemplate;
};
type Props = OwnProps & FormikProps<GiftcardDataAPI>;

const GiftcardFormDrawer = (props: Props) => {
  const { t } = useTranslation('giftcard');
  const classes = useStyles();
  // @ts-ignore
  const isSharedGiftcard = !!props.initial?.is_shared_giftcard;
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
      {isSharedGiftcard && (
        <Alert
          variant="outlined"
          severity="warning"
          className={classes.alert}
          classes={{ root: classes.alertOverride }}
        >
          {t('form.canNotUpdateBecauseShared')}
        </Alert>
      )}
      <Form>
        <GiftcardForm
          {...props}
          disabledSharedGiftcardUpdate={isSharedGiftcard}
        />
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
            disabled={props.isSubmitting || isSharedGiftcard}
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

const useStyles = makeStyles((theme: Theme) => ({
  alert: {
    marginBottom: theme.spacing(2),
  },
  alertOverride: {
    alignItems: 'center',
  },
}));

export default compose<any, OwnProps>(GiftcardFormFieldHOC)(GiftcardFormDrawer);
