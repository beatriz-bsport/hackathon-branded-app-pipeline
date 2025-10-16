import React, { useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import type { UpsellPackage } from '#src/libs/company/types';
import {
  BETA_UPSELL_IDS,
  UNSUBSCRIBABLE_UPSELL_IDS,
} from '#src/libs/platform-billing/constant';
import getUpsellPackageComponent from './UpsellPackage.component';

import type { PlatformSubscription } from '../type';

import PlatformBillingPlanGroupCard from './PlatformBillingPlanGroupCard.component';

import { UPSELL_IDENTIFIER_CADENCE } from '../upsell-identifiers';

const UpsellPackageList = React.memo(
  (props: {
    upsellPackageList: UpsellPackage[];
    onKnowMore?: (upsellIdentifier: number) => void;
    handleSubscribe?: (upsellPackage: UpsellPackage) => void;
    is_using_bundled_pricing?: boolean;
  }) => {
    const classes = useStyles();
    return (
      <Grid container alignItems="stretch">
        {props.upsellPackageList
          .filter((up) => !!up)
          .map((up) => {
            const UpsellPackageComponent = getUpsellPackageComponent(
              up.upsell_identifier,
            );
            return (
              <Grid
                key={up.id}
                item
                className={classes.upsellPackageItemContainer}
                lg={4}
                md={6}
                sm={12}
              >
                <UpsellPackageComponent
                  handleSubscribe={props.handleSubscribe}
                  isUsingBundledPricing={props.is_using_bundled_pricing}
                  onKnowMore={props.onKnowMore}
                  upsellPackage={up}
                />
              </Grid>
            );
          })}
      </Grid>
    );
  },
);

type Props = {
  onKnowMore: (upsellIdentifier: number) => void;
  handleSubscribe: (upsellPackage: UpsellPackage) => void;
  platformSubscription: PlatformSubscription;
  subscribedUpsellPackages: UpsellPackage[];
  nonSubscribedUpsellPackages: UpsellPackage[];
  hasLimitedAccessToAudience: boolean;
};

export const CompanyPlatformBillinGroupDetail: React.FC<Props> = ({
  onKnowMore,
  handleSubscribe,
  platformSubscription,
  subscribedUpsellPackages,
  nonSubscribedUpsellPackages,
  hasLimitedAccessToAudience,
}) => {
  const classes = useStyles();
  const { t } = useTranslation(['platformBilling']);

  const nonSubscribedUpsellPackagesToShow = useMemo(
    () =>
      (nonSubscribedUpsellPackages ?? []).filter(
        (upsellPackage: UpsellPackage) =>
          !upsellPackage.hidden &&
          ((hasLimitedAccessToAudience &&
            upsellPackage.upsell_identifier === UPSELL_IDENTIFIER_CADENCE) ||
            !BETA_UPSELL_IDS.includes(upsellPackage.upsell_identifier)) &&
          !UNSUBSCRIBABLE_UPSELL_IDS.includes(upsellPackage.upsell_identifier),
      ) ?? [],
    [nonSubscribedUpsellPackages, hasLimitedAccessToAudience],
  );

  if (!platformSubscription) {
    return null;
  }

  const { platformBillingGroup } = platformSubscription;
  if (!platformBillingGroup) {
    return null;
  }

  return (
    <>
      {subscribedUpsellPackages?.length > 0 && (
        <React.Fragment>
          <Typography variant="h5">
            {t('upsellPackage.myAddonTitle')}
          </Typography>
          <Divider className={classes.sectionDivider} />
          <UpsellPackageList
            is_using_bundled_pricing={
              platformSubscription.is_using_bundled_pricing
            }
            upsellPackageList={subscribedUpsellPackages}
          />
        </React.Fragment>
      )}
      {nonSubscribedUpsellPackages?.length > 0 && (
        <React.Fragment>
          <Typography className={classes.upsellSection} variant="h5">
            {t('upsellPackage.otherAddonTitle')}
          </Typography>
          <Divider className={classes.sectionDivider} />
          <UpsellPackageList
            handleSubscribe={handleSubscribe}
            is_using_bundled_pricing={
              platformSubscription.is_using_bundled_pricing
            }
            onKnowMore={onKnowMore}
            upsellPackageList={nonSubscribedUpsellPackagesToShow}
          />
        </React.Fragment>
      )}
      {!platformSubscription.is_using_bundled_pricing && (
        <>
          <Typography className={classes.upsellSection} variant="h5">
            {t('platformBillingGroup.myGroup')}
          </Typography>
          <Divider className={classes.sectionDivider} />
          <PlatformBillingPlanGroupCard
            couponCts={platformSubscription.coupon_cts}
            currentPlatformBillingPlanId={
              platformSubscription &&
              platformSubscription.current_platform_billing_plan &&
              platformSubscription.current_platform_billing_plan.id
            }
            currentPlatformBillingStageId={
              platformSubscription &&
              platformSubscription.current_platform_billing_stage &&
              platformSubscription.current_platform_billing_stage.id
            }
            defaultCurrencyDisplay={
              platformSubscription?.default_currency_display
            }
            platformBillingGroup={platformBillingGroup}
          />
        </>
      )}
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  upsellSection: {
    marginTop: theme.spacing(4),
  },
  sectionDivider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  upsellPackageItemContainer: {
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
}));

export default React.memo(CompanyPlatformBillinGroupDetail);
