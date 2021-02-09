// @flow
import React from 'react';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { makeStyles } from '@material-ui/core/styles';
import PersonIcon from '@material-ui/icons/Person';
import Tooltip from '../../../components/Tooltip.component';
import TypographyMultiline from '../../../components/TypographyMultiline.component';

const PlatformBillingStageCard = (props: {
  platformBillingStage: PlatformBillingStage,
  couponCts: number,
}) => {
  const { price_cts, max_booking_per_month } = props.platformBillingStage;
  const { t } = useTranslation(['platformBilling']);
  const classes = useStyles();
  return (
    <Paper className={classes.stageCard}>
      {!!props.couponCts && (
        <Typography
          style={{ textDecoration: 'line-through' }}
          color="error"
          noWrap
          variant="h6"
        >
          {t('platformBillingStage.monthlyPrice', {
            price: (price_cts / 100).toFixed(2),
          })}
        </Typography>
      )}
      <Typography className={classes.stageHeaderPrice} noWrap variant="h6">
        {t('platformBillingStage.monthlyPrice', {
          price: ((price_cts - props.couponCts) / 100).toFixed(2),
        })}
      </Typography>
      <Typography
        className={classes.stageFooterBooking}
        noWrap
        variant="subtitle2"
      >
        {t('platformBillingStage.maxBooking', { max_booking_per_month })}
      </Typography>
    </Paper>
  );
};

const PlatformBillingPlanCard = (props: {
  platformBillingPlan: PlatformBillingPlan,
  currentPlatformBillingStageId: number,
  couponCts: number,
}) => {
  const { platformBillingPlan } = props;
  const { t } = useTranslation(['platformBilling']);
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
          <div
            dangerouslySetInnerHTML={{
              __html: platformBillingPlan.description_html,
            }}
          />
        ) : (
          <TypographyMultiline>
            {platformBillingPlan.description}
          </TypographyMultiline>
        )}
      </div>

      {false && !!platformBillingPlan.max_coach && (
        <div className={classes.planMaxRow}>
          <div className={classes.planRowLeft}>
            <PersonIcon fontSize="large" className={classes.iconLeft} />
            <Typography>
              {t('platformBillingPlan.max_coach.label', {
                max_coach: platformBillingPlan.max_coach,
              })}
            </Typography>
          </div>
          <Tooltip title={t('platformBillingPlan.max_coach.help')}>
            <InfoOutlinedIcon className={classes.iconRight} />
          </Tooltip>
        </div>
      )}
      {false && !!platformBillingPlan.max_establishment && (
        <div className={classes.planMaxRow}>
          <LocationOnIcon fontSize="large" className={classes.iconLeft} />
          <Typography>
            {t('platformBillingPlan.max_establishment.label', {
              max_establishment: platformBillingPlan.max_establishment,
            })}
          </Typography>
          <Tooltip title={t('platformBillingPlan.max_establishment.help')}>
            <InfoOutlinedIcon className={classes.iconRight} />
          </Tooltip>
        </div>
      )}
      <div className={classes.billingStageContainer}>
        {platformBillingPlan.platform_billing_stages
          .filter((ps) => !!ps)
          .map((ps) => (
            <div key={ps.id} className={classes.billingStageCardContainer}>
              <PlatformBillingStageCard
                isSelected={props.currentPlatformBillingStageId === ps.id}
                platformBillingStage={ps}
                couponCts={props.couponCts}
              />
            </div>
          ))}
      </div>
    </Paper>
  );
};

const PlatformBillingPlanGroup = (props: {
  platformBillingGroup: PlatformBillingPlanGroup,
  currentPlatformBillingPlanId: number,
  currentPlatformBillingStageId: number,
  couponCts: number,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.planContainer}>
      {props.platformBillingGroup.platform_billing_plans
        .filter((plan) => !!plan)
        .map((plan) => (
          <div className={classes.planCard}>
            <PlatformBillingPlanCard
              isSelected={plan.id === props.currentPlatformBillingPlanId}
              currentPlatformBillingStageId={
                props.currentPlatformBillingStageId
              }
              platformBillingPlan={plan}
              couponCts={props.couponCts}
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
    overflowX: 'scroll',
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
    marginTop: theme.spacing(3),
    paddingLeft: theme.spacing(0.5),
    overflowX: 'auto',
    paddingBottom: theme.spacing(5),
  },
  planCard: {
    flex: 1,
    maxWidth: '30%',
    height: '100%',
    marginRight: theme.spacing(2),
  },
  planInner: {
    padding: theme.spacing(2),
    paddingRight: 0,
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
  stageCard: {
    padding: theme.spacing(3),
    paddingRight: theme.spacing(5),
  },
  stageFooterBooking: {
    marginTop: theme.spacing(2),
  },
}));

export default PlatformBillingPlanGroup;
