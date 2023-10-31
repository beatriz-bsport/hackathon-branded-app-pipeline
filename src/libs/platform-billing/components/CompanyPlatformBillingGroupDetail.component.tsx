import React, { useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import getUpsellPackageComponent from './UpsellPackage.component';

import { type UpsellPackage } from '#libs/company/types';

import { PlatformSubscription } from '../type';

import PlatformBillingPlanGroupCard from './PlatformBillingPlanGroupCard.component';

const UpsellPackageList = (props: {
  upsellPackageList: UpsellPackage[];
  onKnowMore: (upsellIdentifier: number) => void;
  handleSubscribe?: (upsellPackage: UpsellPackage) => void;
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
                onKnowMore={props.onKnowMore}
                upsellPackage={up}
              />
            </Grid>
          );
        })}
    </Grid>
  );
};

type Props = {
  onKnowMore: (upsellIdentifier: number) => void;
  handleSubscribe: (upsellPackage: UpsellPackage) => void;
  platformSubscription: PlatformSubscription;
  subscribedUpsellPackages: UpsellPackage[];
  nonSubscribedUpsellPackages: UpsellPackage[];
};

export const CompanyPlatformBillinGroupDetail = ({
  onKnowMore,
  handleSubscribe,
  platformSubscription,
  subscribedUpsellPackages,
  nonSubscribedUpsellPackages,
}: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['platformBilling']);

  const nonSubscribedUpsellPackagesToShow = useMemo(
    () => nonSubscribedUpsellPackages.filter((ups) => !ups.hidden),
    [nonSubscribedUpsellPackages],
  );

  if (!platformSubscription) {
    return null;
  }
  const { platformBillingGroup } = platformSubscription;
  if (!platformBillingGroup) {
    return null;
  }
  return (
    <div className={classes.container}>
      {subscribedUpsellPackages?.length > 0 && (
        <React.Fragment>
          <Typography variant="h5">
            {t('upsellPackage.myAddonTitle')}
          </Typography>
          <Divider className={classes.sectionDivider} />
          <UpsellPackageList
            onKnowMore={onKnowMore}
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
            onKnowMore={onKnowMore}
            upsellPackageList={nonSubscribedUpsellPackagesToShow}
          />
        </React.Fragment>
      )}
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
        defaultCurrencyDisplay={platformSubscription?.default_currency_display}
        platformBillingGroup={platformBillingGroup}
      />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(4),
  },
  upsellSection: {
    marginTop: theme.spacing(4),
  },
  sectionDivider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  planContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: theme.spacing(3),
  },
  planCard: {
    flex: 1,
    marginRight: '-20%',
    paddingRight: '20%',
  },
  planInner: {
    padding: theme.spacing(2),
    maxWidth: 800,
  },
  planTitle: {
    marginBottom: theme.spacing(2),
  },
  planDescription: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(3),
  },
  planMaxRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  },
  planRowLeft: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  iconLeft: {
    marginRight: theme.spacing(1),
  },
  iconRight: {
    marginLeft: theme.spacing(2),
  },
  upsellPackageItemContainer: {
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}));

export default CompanyPlatformBillinGroupDetail;
