import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import getUpsellPackageComponent from './UpsellPackage.component';

import { UpsellPackage as UpsellPackageType } from '#libs/company/types';

import { PlatformSubscription } from '../type';

import PlatformBillingPlanGroupCard from './PlatformBillingPlanGroupCard.component';

const UpsellPackageList = (props: {
  upsellPackageList: Array<UpsellPackageType>;
  onKnowMore: (upsellIdentifier: number) => void;
  onRequestUpsell?: (upsellIdentifier: number) => void;
  defaultCurrencyDisplay: string;
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
                defaultCurrencyDisplay={props.defaultCurrencyDisplay}
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
  onKnowMore: (upsellIdentifier: number) => void;
  onRequestUpsell: (upsellIdentifier: number) => void;
  platformSubscription: PlatformSubscription;
};

export const CompanyPlatformBillinGroupDetail = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['platformBilling']);
  if (!props.platformSubscription) return null;
  const { platformBillingGroup, default_currency_display } =
    props.platformSubscription;
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
            defaultCurrencyDisplay={default_currency_display}
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
            defaultCurrencyDisplay={default_currency_display}
            onKnowMore={props.onKnowMore}
            onRequestUpsell={props.onRequestUpsell}
            upsellPackageList={otherUpsellPackageList.filter(
              (ups) => !ups.hidden,
            )}
          />
        </React.Fragment>
      )}
      <Typography className={classes.upsellSection} variant="h5">
        {t('platformBillingGroup.myGroup')}
      </Typography>
      <Divider className={classes.sectionDivider} />
      <PlatformBillingPlanGroupCard
        couponCts={props.platformSubscription.coupon_cts}
        currentPlatformBillingPlanId={
          props.platformSubscription &&
          props.platformSubscription.current_platform_billing_plan &&
          props.platformSubscription.current_platform_billing_plan.id
        }
        currentPlatformBillingStageId={
          props.platformSubscription &&
          props.platformSubscription.current_platform_billing_stage &&
          props.platformSubscription.current_platform_billing_stage.id
        }
        defaultCurrencyDisplay={
          props.platformSubscription?.default_currency_display
        }
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
