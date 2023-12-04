// @ts-nocheck
import React from 'react';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import TypographyMultiline from '#components/typo/TypographyMultiline.component';
import { getCustomCurrencyDisplayWithPrice } from '#libs/theme/utils';
import type {
  PlatformBillingGroup,
  PlatformBillingPlan,
  PlatformBillingStage,
} from '#libs/platform-billing/type';

const PlatformBillingStageCard = React.memo(
  (props: {
    platformBillingStage: PlatformBillingStage;
    couponCts: number;
    defaultCurrencyDisplay: string;
  }) => {
    const { price_cts, max_booking_per_month } = props.platformBillingStage;
    const { t } = useTranslation('platformBilling');
    const classes = useStyles();
    return (
      <Paper className={classes.stageCard}>
        {!!props.couponCts && (
          <Typography
            noWrap
            color="error"
            style={{ textDecoration: 'line-through' }}
            variant="h6"
          >
            {t('platformBillingStage.monthlyPrice', {
              price: getCustomCurrencyDisplayWithPrice(
                price_cts / 100,
                props.defaultCurrencyDisplay,
              ),
            })}
          </Typography>
        )}
        <Typography noWrap variant="h6">
          {t('platformBillingStage.monthlyPrice', {
            price: getCustomCurrencyDisplayWithPrice(
              (price_cts - props.couponCts) / 100,
              props.defaultCurrencyDisplay,
            ),
          })}
        </Typography>
        <Typography
          noWrap
          className={classes.stageFooterBooking}
          variant="subtitle2"
        >
          {t('platformBillingStage.maxBooking', { max_booking_per_month })}
        </Typography>
      </Paper>
    );
  },
);

const PlatformBillingPlanCard = React.memo(
  (props: {
    platformBillingPlan: PlatformBillingPlan;
    currentPlatformBillingStageId: number;
    couponCts: number;
    defaultCurrencyDisplay: string;
  }) => {
    const { platformBillingPlan } = props;
    const classes = useStyles();
    if (!platformBillingPlan) return <CircularProgress />;
    return (
      <Paper className={classes.planInner}>
        <Typography className={classes.planTitle} variant="h4">
          {platformBillingPlan.name}
        </Typography>
        <Divider />
        <div className={classes.planDescription}>
          {platformBillingPlan.description_html ? (
            <iframe
              className={classes.iframe}
              frameBorder="0"
              srcDoc={platformBillingPlan.description_html}
              title="platform-billing-plan-card-iframe"
            />
          ) : (
            <TypographyMultiline>
              {platformBillingPlan.description}
            </TypographyMultiline>
          )}
        </div>
        <div className={classes.billingStageContainer}>
          {platformBillingPlan.platform_billing_stages
            .filter((ps: PlatformBillingStage) => !!ps)
            .map((ps: PlatformBillingStage) => (
              <div key={ps.id}>
                <PlatformBillingStageCard
                  couponCts={props.couponCts}
                  defaultCurrencyDisplay={props.defaultCurrencyDisplay}
                  isSelected={props.currentPlatformBillingStageId === ps.id}
                  platformBillingStage={ps}
                />
              </div>
            ))}
        </div>
      </Paper>
    );
  },
);

const PlatformBillingPlanGroupCard = (props: {
  platformBillingGroup: PlatformBillingGroup;
  currentPlatformBillingPlanId: number;
  currentPlatformBillingStageId: number;
  couponCts: number;
  defaultCurrencyDisplay: string;
}) => {
  const classes = useStyles();
  return (
    <div className={classes.planContainer}>
      {props.platformBillingGroup.platform_billing_plans
        .filter((plan: PlatformBillingPlan) => !!plan)
        .map((plan: PlatformBillingPlan) => (
          <div className={classes.planCard}>
            <PlatformBillingPlanCard
              couponCts={props.couponCts}
              currentPlatformBillingStageId={
                props.currentPlatformBillingStageId
              }
              defaultCurrencyDisplay={props.defaultCurrencyDisplay}
              isSelected={plan.id === props.currentPlatformBillingPlanId}
              platformBillingPlan={plan}
            />
          </div>
        ))}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  billingStageContainer: {
    display: 'flex',
    flexDirection: 'row',
    overflowX: 'auto',
    '-ms-overflow-style': 'none' /* for Internet Explorer, Edge */,
    scrollbarWidth: 'none' /* for Firefox */,
    '&::-webkit-scrollbar': {
      display: 'none' /* for Chrome, Safari, and Opera */,
    },
    paddingLeft: theme.spacing(0.5),
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(0.5),
    marginTop: theme.spacing(3),
    '&>*': {
      marginRight: theme.spacing(2),
    },
  },
  planContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    width: '100%',
    overflowX: 'auto',
    marginTop: theme.spacing(3),
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
    paddingBottom: theme.spacing(5),
  },
  planCard: {
    flex: 1,
    [theme.breakpoints.up('lg')]: {
      maxWidth: '32%',
    },
    [theme.breakpoints.down('lg')]: {
      width: '100%',
    },
    height: '100%',
    marginRight: theme.spacing(2),
  },
  planInner: {
    padding: theme.spacing(2),
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
  stageCard: {
    padding: theme.spacing(3),
    paddingRight: theme.spacing(5),
  },
  stageFooterBooking: {
    marginTop: theme.spacing(2),
  },
}));

export default React.memo(PlatformBillingPlanGroupCard);
