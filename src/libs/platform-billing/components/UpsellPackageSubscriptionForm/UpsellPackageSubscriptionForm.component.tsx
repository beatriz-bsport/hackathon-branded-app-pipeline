import React, { useCallback } from 'react';

import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  Button,
  Checkbox,
  Divider,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { useTranslation } from 'react-i18next';
import { Alert } from '@material-ui/lab';

import { rudderStackFormTrackingFunctionsRegistry } from '#components/analytics/rudderstack/utils';
import { SegmentAnalyticsFormObjectIdentifier } from '#components/analytics/segment';
import { UpsellPackage } from '#libs/company/types';
import { MAP_UPSELL_IDENTIFIER_TO_ICON_COMPONENT } from '../UpsellPackage.component';
import { getUpsellPriceString } from '#libs/platform-billing/utils';

export type Props = {
  onClose: () => void;
  onSubscribe: (upsellPackage: UpsellPackage) => void;
  onKnowMore: (upsellIdentifier: number) => void;
  upsellPackage: UpsellPackage;
  loading: boolean;
  trackingObjectId?: number;
  trackingObjectIdentifier?: SegmentAnalyticsFormObjectIdentifier;
};

const UpsellPackageSubscriptionForm: React.FC<Props> = ({
  onClose,
  onSubscribe,
  onKnowMore,
  upsellPackage,
  loading,
  trackingObjectId,
  trackingObjectIdentifier,
}) => {
  const classes = useStyles();
  const { t } = useTranslation(['platformBilling', 'common']);
  const [confirmChecked, setConfirmChecked] = React.useState(false);

  const handleConfirmChecked = useCallback(() => {
    setConfirmChecked(!confirmChecked);
  }, [confirmChecked]);

  const handleSubscribe = useCallback(() => {
    onSubscribe(upsellPackage);
  }, [onSubscribe, upsellPackage]);

  const closeAndTrack = useCallback(() => {
    onClose();
    if (trackingObjectIdentifier) {
      const { trackFormCancel } = rudderStackFormTrackingFunctionsRegistry(
        trackingObjectIdentifier,
      );
      trackFormCancel(trackingObjectId);
    }
  }, [trackingObjectIdentifier, trackingObjectId, onClose]);

  const closeAndKnowMore = useCallback(() => {
    onClose();
    onKnowMore(upsellPackage.upsell_identifier);
  }, [onKnowMore, onClose, upsellPackage]);

  const UpsellCustomIcon =
    MAP_UPSELL_IDENTIFIER_TO_ICON_COMPONENT[
      upsellPackage.upsell_identifier as keyof typeof MAP_UPSELL_IDENTIFIER_TO_ICON_COMPONENT
    ] || null;

  return (
    <div className={classes.root}>
      <div className={classes.mainForm}>
        <div className={classes.header}>
          {UpsellCustomIcon && (
            <UpsellCustomIcon className={classes.upsellIcon} />
          )}
          <Typography variant="h6">{upsellPackage.name}</Typography>
        </div>
        <div className={classes.description}>{upsellPackage.description}</div>
        <div className={classes.priceContainer}>
          <Typography variant="body1">
            {t('upsellPackage.subscriptionForm.priceHelper')}
          </Typography>
          <Typography variant="h5">
            {getUpsellPriceString(upsellPackage, t)}
          </Typography>
        </div>
        <Alert severity="info" variant="outlined">
          {t('upsellPackage.subscriptionForm.commitmentMessage')}
        </Alert>
        <div className={classes.confirmContainer}>
          <Typography variant="body1">
            {t('upsellPackage.subscriptionForm.confirmHelper')}
          </Typography>
          <div className={classes.confirmCheckbox}>
            <Checkbox
              checked={confirmChecked}
              color="primary"
              onChange={handleConfirmChecked}
            />
            <Typography variant="body1">
              {t('confirm', { ns: 'common' })}
            </Typography>
          </div>
        </div>
        <Divider className={classes.divider} />
        <div className={classes.informationContainer}>
          <Typography variant="body1">
            {t('upsellPackage.subscriptionForm.infoHelper')}
          </Typography>
          <div className={classes.moreInfoButton}>
            <Button
              className={classes.infoButton}
              onClick={closeAndKnowMore}
              variant="outlined"
            >
              <InfoOutlinedIcon className={classes.infoIcon} />
              <Typography variant="body1">
                {t('upsellPackage.subscriptionForm.info')}
              </Typography>
            </Button>
          </div>
        </div>
      </div>
      <Divider className={classes.divider} />
      <div className={classes.actionButtons}>
        <Button
          className={classes.button}
          onClick={closeAndTrack}
          variant="outlined"
        >
          {t('cancel', { ns: 'common' })}
        </Button>
        <Button
          className={classes.button}
          color="primary"
          disabled={!confirmChecked}
          onClick={handleSubscribe}
          variant="contained"
        >
          {loading ? (
            <Typography variant="body1">
              <CircularProgress color="inherit" size={20} />
            </Typography>
          ) : (
            <Typography variant="body1">
              {t('confirm', { ns: 'common' })}
            </Typography>
          )}
        </Button>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  mainForm: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(3),
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2),
  },
  header: {
    marginBottom: theme.spacing(3),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  upsellIcon: {
    marginRight: theme.spacing(1),
  },
  description: {
    marginBottom: theme.spacing(3),
    color: theme.palette.text.secondary,
    fontSize: '1rem',
    fontStyle: 'normal',
    fontWeight: 400,
  },
  priceContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
  },
  confirmContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(6),
  },
  confirmCheckbox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing(1),
  },
  informationContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  moreInfoButton: {
    marginTop: theme.spacing(1),
  },
  text: {
    fontSize: '1rem',
    fontStyle: 'normal',
    fontWeight: 400,
  },
  priceInfo: {
    fontSize: '1.5rem',
    fontStyle: 'normal',
    fontWeight: 400,
  },
  actionButtons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: theme.spacing(3),
  },
  infoButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: theme.spacing(1),
  },
  button: {
    marginLeft: theme.spacing(2),
  },
  divider: {
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(3),
  },
}));

export default React.memo(UpsellPackageSubscriptionForm);
