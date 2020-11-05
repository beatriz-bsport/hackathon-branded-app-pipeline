// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import getUpsellPackageComponent from './UpsellPackage.component';

import PlatformBillingPlanGroupCard from './PlatformBillingPlanGroupCard.component';

const UpsellPackageList = (props: {
  upsellPackageList: Array<UpsellPackage>,
  onKnowMore: (number) => void,
  onRequestUpsell: (number) => void,
}) => {
  const classes = useStyles();
  return (
    <Grid container alignItems="stretch">
      {props.upsellPackageList
        .filter((up) => !!up)
        .map((up) => {
          const UpsellPackage = getUpsellPackageComponent(up.upsell_identifier);
          return (
            <Grid
              key={up.id}
              className={classes.upsellPackageItemContainer}
              item
              sm={12}
              md={6}
              lg={4}
            >
              <UpsellPackage
                onKnowMore={props.onKnowMore}
                onRequestUpsell={props.onRequestUpsell}
                upsellPackage={up}
              />
            </Grid>
          );
        })}
    </Grid>
  );
};

type Props = {
  onKnowMore: (id: number) => void,
  onRequestUpsell: (id: number) => void,
  platformSubscription: PlatformSubscription,
};

export const CompanyPlatformBillinGroupDetail = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['platformBilling']);
  if (!props.platformSubscription) return null;
  const { platformBillingGroup } = props.platformSubscription;
  if (!platformBillingGroup) return null;
  const myUpsellPackageList = platformBillingGroup.upsell_packages.filter(
    (up) => !!up.subscribed,
  );
  const otherUpsellPackageList = platformBillingGroup.upsell_packages.filter(
    (up) => !up.subscribed,
  );
  return (
    <div className={classes.container}>
      {!!myUpsellPackageList.length && (
        <React.Fragment>
          <Typography variant="h5">
            {t('upsellPackage.myAddonTitle')}
          </Typography>
          <Divider className={classes.sectionDivider} />
          <UpsellPackageList
            onKnowMore={props.onKnowMore}
            upsellPackageList={myUpsellPackageList}
          />
        </React.Fragment>
      )}
      {!!otherUpsellPackageList.length && (
        <React.Fragment>
          <Typography className={classes.upsellSection} variant="h5">
            {t('upsellPackage.otherAddonTitle')}
          </Typography>
          <Divider className={classes.sectionDivider} />
          <UpsellPackageList
            onKnowMore={props.onKnowMore}
            onRequestUpsell={props.onRequestUpsell}
            upsellPackageList={otherUpsellPackageList}
          />
        </React.Fragment>
      )}
      <Typography className={classes.upsellSection} variant="h5">
        {t('platformBillingGroup.myGroup')}
      </Typography>
      <Divider className={classes.sectionDivider} />
      <PlatformBillingPlanGroupCard
        platformBillingGroup={platformBillingGroup}
        couponCts={props.platformSubscription.coupon_cts}
        currentPlatformBillingStageId={
          props.platformSubscription &&
          props.platformSubscription.current_platform_billing_stage &&
          props.platformSubscription.current_platform_billing_stage.id
        }
        currentPlatformBillingPlanId={
          props.platformSubscription &&
          props.platformSubscription.current_platform_billing_plan &&
          props.platformSubscription.current_platform_billing_plan.id
        }
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
