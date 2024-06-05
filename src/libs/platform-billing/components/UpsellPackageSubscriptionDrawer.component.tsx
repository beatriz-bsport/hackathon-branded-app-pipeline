import React from 'react';

import makeStyles from '@material-ui/core/styles/makeStyles';
import type { Theme } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

import { SegmentAnalyticsFormObjectIdentifier } from '#src/components/analytics/segment';
import GenericResponsiveDrawer from '#src/components/genericDrawer/GenericResponsiveDrawer.component';
import type { UpsellPackage } from '#src/libs/company/types';
import UpsellPackageSubscriptionForm from './UpsellPackageSubscriptionForm';
import UpsellSubscriptionConfirmationDialog from './UpsellSubscriptionConfirmationDialog/UpsellSubscriptionConfirmationDialog.component';

type Props = {
  loading: boolean;
  open: boolean;
  openDialog: boolean;
  upsellPackage: UpsellPackage | null;
  onClose: () => void;
  onCloseDialog: () => void;
  onKnowMore: (upsellIdentifier: number) => void;
  onSubscribe: (upsellPackage: UpsellPackage) => void;
};

const useStyles = makeStyles((theme: Theme) => ({
  responsiveDrawerHeader: {
    marginBottom: theme.spacing(3),
  },
  responsiveDrawerContent: {
    padding: 0,
  },
}));

const UpsellPackageSubscriptionDrawer: React.FC<Props> = ({
  loading,
  open,
  openDialog,
  upsellPackage,
  onClose,
  onCloseDialog,
  onKnowMore,
  onSubscribe,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('platformBilling');

  return (
    <>
      <GenericResponsiveDrawer
        customClasses={{
          content: classes.responsiveDrawerContent,
          header: classes.responsiveDrawerHeader,
        }}
        onClose={onClose}
        open={open}
        title={t('upsellPackage.subscriptionForm.title')}
        trackingObjectId={upsellPackage?.id}
        trackingObjectIdentifier={
          SegmentAnalyticsFormObjectIdentifier.UpsellSubscription
        }
      >
        <UpsellPackageSubscriptionForm
          loading={loading}
          onClose={onClose}
          onKnowMore={onKnowMore}
          onSubscribe={onSubscribe}
          trackingObjectId={upsellPackage?.id}
          trackingObjectIdentifier={
            SegmentAnalyticsFormObjectIdentifier.UpsellSubscription
          }
          upsellPackage={upsellPackage}
        />
      </GenericResponsiveDrawer>
      <UpsellSubscriptionConfirmationDialog
        onClose={onCloseDialog}
        open={openDialog}
        upsellPackageName={upsellPackage?.name}
      />
    </>
  );
};

export default React.memo(UpsellPackageSubscriptionDrawer);
