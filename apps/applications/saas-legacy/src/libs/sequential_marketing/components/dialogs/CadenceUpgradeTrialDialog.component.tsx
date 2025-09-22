import React from 'react';
import { useTranslation } from 'react-i18next';

// eslint-disable-next-line bsport/no-redux-in-component
import { connect, ConnectedProps } from 'react-redux';

import Button from '@material-ui/core/Button';
import CheckCircle from '@material-ui/icons/CheckCircle';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';

import { requestUpsellPackage as requestUpsellPackageAction } from '#src/libs/platform-billing/actions';

import { rudderStackFormTrackingFunctionsRegistry } from '#src/components/analytics/rudderstack/utils';
import { SegmentAnalyticsFormObjectIdentifier } from '#src/components/analytics/segment';
import { UPSELL_IDENTIFIER_CADENCE } from '#src/libs/platform-billing/upsell-identifiers';
import {
  AudienceUpgradeTrialDialogType,
  DIALOG_CLOSE_DELAY_MS,
} from '#src/libs/sequential_marketing/constants';
import FeatureRequestDialog from '#src/libs/platform-billing/components/FeatureRequestDialog.component';
import AUDIENCE_PREVIEW from '#src/libs/sequential_marketing/images/audience-preview.svg';

import type { Dispatch } from '#src/state/types';

const { trackFormSubmitIntent: trackFormSubmitIntentUpsellRequest } =
  rudderStackFormTrackingFunctionsRegistry(
    SegmentAnalyticsFormObjectIdentifier.UpsellRequest,
  );

const useStyles = makeStyles((theme) => ({
  paperRoot: {
    padding: `${theme.spacing(4)}px ${theme.spacing(3)}px`,
  },
  innerPaper: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  benefitsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  benefitItem: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(1),
    alignItems: 'center',
  },
  checkCircleIcon: {
    color: theme.palette.primary.main,
  },
}));

type Props = {
  isOpen: boolean;
  dialogType?: AudienceUpgradeTrialDialogType | null; // default type is BANNER_CLICKED
  closeDialog: () => void;
} & ConnectedProps<typeof connector>;

const CadenceUpgradeTrialDialog = ({
  isOpen,
  dialogType: propsDialogType = null,
  closeDialog,
  requestUpsellPackage,
}: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['marketing', 'platformBilling']);

  const [isFeatureRequestDialogOpen, setIsFeatureRequestDialogOpen] =
    React.useState(false);

  // Internal state to delay unmount so the dialog closing animation is visible
  const [delayedOpen, setDelayedOpen] = React.useState(false);

  const dialogType =
    propsDialogType ?? AudienceUpgradeTrialDialogType.BANNER_CLICKED;

  const title = t(
    `marketing:audience.freeTrial.upgradeDialog.${dialogType}.title`,
  );

  const description = t(
    `marketing:audience.freeTrial.upgradeDialog.${dialogType}.description`,
  );

  const benefits = t('marketing:audience.freeTrial.upgradeDialog.benefits', {
    returnObjects: true,
  }) as string[];

  const closeFeatureRequestDialog = () => {
    setIsFeatureRequestDialogOpen(false);
    closeDialog();
  };

  const handleRequestUpsellPackage = () => {
    trackFormSubmitIntentUpsellRequest(UPSELL_IDENTIFIER_CADENCE, {
      source_component: `CadenceUpgradeTrialDialog-${dialogType}`,
    });
    requestUpsellPackage(UPSELL_IDENTIFIER_CADENCE);
    setIsFeatureRequestDialogOpen(true);
  };

  React.useEffect(() => {
    if (isOpen) {
      // opening → immediate sync
      setDelayedOpen(true);
    } else {
      // closing → wait before updating
      setTimeout(() => setDelayedOpen(false), DIALOG_CLOSE_DELAY_MS);
    }
  }, [isOpen]);

  if (!delayedOpen) {
    return null;
  }

  return (
    <>
      <Dialog
        fullWidth
        open={isOpen}
        PaperProps={{ className: classes.paperRoot }}
      >
        <div className={classes.innerPaper}>
          <Typography variant="h6">{title}</Typography>
          <Typography variant="body1">{description}</Typography>
          <img alt="audience preview" src={AUDIENCE_PREVIEW} />
          <div className={classes.benefitsContainer}>
            {benefits.map((benefit: string, index: number) => (
              <div key={index} className={classes.benefitItem}>
                <CheckCircle className={classes.checkCircleIcon} />
                <Typography variant="body2">{benefit}</Typography>
              </div>
            ))}
          </div>
          {!!requestUpsellPackage && handleRequestUpsellPackage && (
            <Button
              color="primary"
              onClick={handleRequestUpsellPackage}
              variant="contained"
            >
              {t('marketing:audience.freeTrial.upgradeDialog.upgrade')}
            </Button>
          )}
          <Button color="primary" onClick={closeDialog}>
            {t('marketing:audience.freeTrial.upgradeDialog.close')}
          </Button>
        </div>
      </Dialog>
      <FeatureRequestDialog
        content={t('platformBilling:featureRequest.interestMessage')}
        onClose={closeFeatureRequestDialog}
        open={isFeatureRequestDialogOpen}
      />
    </>
  );
};

const connector = connect(null, (dispatch: Dispatch) => ({
  requestUpsellPackage(upsellIdentifier: number) {
    dispatch(requestUpsellPackageAction(upsellIdentifier));
  },
}));

export default connector(React.memo(CadenceUpgradeTrialDialog));
