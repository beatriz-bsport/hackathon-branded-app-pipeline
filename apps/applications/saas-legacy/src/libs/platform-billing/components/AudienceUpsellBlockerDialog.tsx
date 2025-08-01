import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '@material-ui/core/Button';
import CheckCircle from '@material-ui/icons/CheckCircle';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';

import { BLOCKER_FRAME_ID } from '#src/libs/platform-billing/constant';
import { rudderStackFormTrackingFunctionsRegistry } from '#src/components/analytics/rudderstack/utils';
import { SegmentAnalyticsFormObjectIdentifier } from '#src/components/analytics/segment';
import FeatureRequestDialog from '#src/libs/platform-billing/components/FeatureRequestDialog.component';
import YoutubeEmbedVideo from '#src/libs/video/components/YoutubeEmbedVideo';

const { trackFormSubmitIntent: trackFormSubmitIntentUpsellRequest } =
  rudderStackFormTrackingFunctionsRegistry(
    SegmentAnalyticsFormObjectIdentifier.UpsellRequest,
  );

const useStyles = makeStyles((theme) => ({
  blockerFrame: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 100000 /* some high z-index */,
    width: '100%',
    height: '100%',
    backdropFilter: 'blur(3px)',
    userSelect:
      'none' /* prevents double clicking from highlighting entire page */,
  },
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
  upsellIdentifier: number;
  redirectTo(page: string): void;
  requestUpsellPackage: (upsellIdentifier: number) => void;
};

export const AudienceUpsellBlockerDialog = ({
  upsellIdentifier,
  redirectTo,
  requestUpsellPackage,
}: Props) => {
  const classes = useStyles();
  const { t } = useTranslation('platformBilling');

  // Here we need to force the rerender of the component because the Dialog is
  // rendered before its parent which then makes the body his container
  const [_, setForceRerender] = React.useState(false);

  const [isFeatureRequestDialogOpen, setIsFeatureRequestDialogOpen] =
    React.useState(false);

  const benefits = t('upsellPackage.audienceLockDialog.benefits', {
    returnObjects: true,
  }) as string[];

  const closeFeatureRequestDialog = () => {
    setIsFeatureRequestDialogOpen(false);
  };

  const handleRequestUpsellPackage = () => {
    trackFormSubmitIntentUpsellRequest(upsellIdentifier, {
      source_component: 'AudienceUpsellBlockerDialog',
    });
    requestUpsellPackage(upsellIdentifier);
    setIsFeatureRequestDialogOpen(true);
  };

  const redirectToCalendar = () => {
    redirectTo('/calendar');
  };

  return (
    <div
      ref={() => setForceRerender(true)}
      className={classes.blockerFrame}
      id={BLOCKER_FRAME_ID}
    >
      <Dialog
        open
        BackdropProps={{ invisible: true }}
        container={document.getElementById(BLOCKER_FRAME_ID)}
        PaperProps={{
          elevation: 3,
          className: classes.paperRoot,
        }}
      >
        <div className={classes.innerPaper}>
          <Typography variant="h6">
            {t('upsellPackage.audienceLockDialog.title')}
          </Typography>
          <YoutubeEmbedVideo
            url={t('upsellPackage.audienceLockDialog.videoLink')}
          />
          <Typography variant="body1">
            {t(`upsellPackage.audienceLockDialog.description`)}
          </Typography>
          <div className={classes.benefitsContainer}>
            {benefits.map((benefit: string, index: number) => (
              <div key={index} className={classes.benefitItem}>
                <CheckCircle className={classes.checkCircleIcon} />
                <Typography variant="body2">{benefit}</Typography>
              </div>
            ))}
          </div>
          <Typography color="textSecondary" variant="body2">
            {t(`upsellPackage.audienceLockDialog.explain`)}
          </Typography>
          {!!requestUpsellPackage && handleRequestUpsellPackage && (
            <Button
              color="primary"
              onClick={handleRequestUpsellPackage}
              variant="contained"
            >
              {t('upsellPackage.audienceLockDialog.showInterest')}
            </Button>
          )}
          <Button color="primary" onClick={redirectToCalendar}>
            {t('upsellPackage.audienceLockDialog.goHome')}
          </Button>
        </div>
      </Dialog>
      <FeatureRequestDialog
        content={t('featureRequest.interestMessage')}
        onClose={closeFeatureRequestDialog}
        open={isFeatureRequestDialogOpen}
      />
    </div>
  );
};

export default React.memo(AudienceUpsellBlockerDialog);
