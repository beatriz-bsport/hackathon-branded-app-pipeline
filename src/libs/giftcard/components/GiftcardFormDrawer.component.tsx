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
import { SegmentAnalyticsFormObjectIdentifier } from '#components/analytics/segment';
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';
import { rudderStackFormTrackingFunctionsRegistry } from '#components/analytics/rudderstack/utils';
import { Tag, TagGroup } from '#libs/tag/types';
import type { BookkeepingAccount } from '#libs/payment/types';

const { trackFormSubmitIntent, trackFormCancel } =
  rudderStackFormTrackingFunctionsRegistry(
    SegmentAnalyticsFormObjectIdentifier.Giftcard,
  );

type OwnProps = {
  open: boolean;
  onSubmit: (
    data: GiftcardDataAPI,
    options: OptionCallback<Giftcard | GiftcardTemplate>,
  ) => void;
  onClose: () => void;
  initial?: Giftcard | GiftcardTemplate;
  tagList?: Array<Tag<TagGroup>>;
  bookkeepingAccounts?: BookkeepingAccount[];
  bookkeepingAccountById?: Record<number, BookkeepingAccount>;
};
type Props = OwnProps & FormikProps<GiftcardDataAPI>;

const GiftcardFormDrawer = (props: Props) => {
  const { t } = useTranslation('giftcard');
  const classes = useStyles();
  // @ts-expect-error
  const isSharedGiftcard = !!props.initial?.is_shared_giftcard;
  return (
    <GenericResponsiveDrawer
      onClose={props.onClose}
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

export default compose<any, OwnProps>(GiftcardFormFieldHOC)(GiftcardFormDrawer);
