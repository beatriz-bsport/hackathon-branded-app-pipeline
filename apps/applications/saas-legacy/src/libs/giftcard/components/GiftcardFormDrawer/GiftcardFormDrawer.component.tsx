import React from 'react';
import { useTranslation } from 'react-i18next';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { makeStyles, Theme } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Form } from 'formik';

import { SegmentAnalyticsFormObjectIdentifier } from '#src/components/analytics/segment';
import GenericResponsiveDrawer from '#src/components/genericDrawer/GenericResponsiveDrawer.component';

import { GiftcardForm } from './GiftcardForm.component';
import { GiftcardFormHOC } from './GiftcardFormHOC';
import { trackFormSubmitIntent, trackFormCancel } from './trackers';
import type { GiftcardFormDrawerProps } from './types';

const GiftcardFormDrawer = (props: GiftcardFormDrawerProps) => {
  const { t } = useTranslation('giftcard');
  const classes = useStyles();

  const isSharedGiftcard =
    props.initial && 'is_shared_giftcard' in props.initial
      ? props.initial.is_shared_giftcard
      : false;

  const handleClose = () => {
    // Reset Formik errors and status
    props.setErrors({});
    props.setStatus(undefined);
    props.setSubmitting(false);

    props.onClose();
  };

  return (
    <GenericResponsiveDrawer
      onClose={handleClose}
      open={props.open}
      subtitle={props.initial?.name}
      title={t('form.giftcard.title')}
      trackingObjectId={props.initial?.id}
      trackingObjectIdentifier={SegmentAnalyticsFormObjectIdentifier.Giftcard}
    >
      {isSharedGiftcard && (
        <Alert
          classes={{ root: classes.alertOverride }}
          className={classes.alert}
          severity="warning"
          variant="outlined"
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
            color="primary"
            disabled={props.isSubmitting || isSharedGiftcard}
            onClick={() => {
              trackFormSubmitIntent(props.initial?.id);
              props.handleSubmit();
            }}
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

export default GiftcardFormHOC(GiftcardFormDrawer);
