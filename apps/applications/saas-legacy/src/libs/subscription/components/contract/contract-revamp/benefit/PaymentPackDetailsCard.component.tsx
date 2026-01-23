import React, { Component } from 'react';
import TypographyMultilineComponent from '#src/components/typo/TypographyMultiline.component';
import {
  getCompatibilityInfo,
  getCreditInfo,
} from '#src/libs/payment-packs/utils';
import ObjectLevelPermissionProviderComponent from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo';
import StarIcon from '@material-ui/icons/Star';
import StyleIcon from '@material-ui/icons/Style';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { withTranslation, WithTranslation } from 'react-i18next';
import { compose } from 'recompose';
import PaymentPackCompatibilityDialog from '#src/libs/payment-packs/components/PaymentPackCompatibilityDialog.component';

import type { SCT } from '#src/libs/category/types';
import type { Establishment } from '#src/libs/establishment/types';
import type { MetaActivity } from '#src/libs/meta-activity/types';
import OffPeakDisplayByDay from '#src/libs/payment-packs/components/OffPeakDisplayByDay.component';
import {
  PENALTY_KIND_BLOCK_CPP,
  PENALTY_KIND_NEGATIVE_ACCOUNT,
} from '#src/libs/payment-packs/constants';
import type {
  PaymentPack,
  PaymentPackCompatibilitiesData,
} from '#src/libs/payment-packs/types';
import CompatibilityFormComponent from '#src/libs/private-service/components/pass/compatibility/CompatibilityForm.component';

type OwnProps = {
  pack: PaymentPack;

  metaActivityList: MetaActivity[];
  availableEstablishmentList: Establishment[];
  SCTList: SCT[];

  updatePaymentPackCompatibilities: (
    data: PaymentPackCompatibilitiesData,
  ) => void;
  openContractForm: (() => void) | undefined;

  isManager?: boolean;
};

type Props = OwnProps & WithStyles & WithTranslation;

type State = {
  compatibilityDialogOpen: boolean;
};

export class PaymentPackDetailsCard extends Component<Props, State> {
  state = {
    compatibilityDialogOpen: false,
  };

  onEditCompatibility = () => {
    if (!this.props.openContractForm) {
      return;
    }
    this.props.openContractForm();
    this.setState({ compatibilityDialogOpen: false });
  };

  renderCardHeader = () => {
    const { pack, t, classes, isManager } = this.props;
    const { description } = pack;

    return (
      <Grid
        container
        alignItems="flex-start"
        direction="row"
        justify="space-between"
      >
        <Grid item sm={7}>
          <div className={classes.header}>
            <div>
              <Typography variant="h4">{t('detailTitles.name')}</Typography>
            </div>

            {description && (
              <TypographyMultilineComponent
                className={classes.description}
                variant="caption"
              >
                {description}
              </TypographyMultilineComponent>
            )}

            <div>
              <div className={isManager ? '' : classes.marginTop}>
                <div className={classes.detailInfo}>
                  <div className={classes.detailCategory}>
                    <StarIcon className={classes.leftIcon} />
                    <Typography variant="subtitle2">
                      {t('detailTitles.credit_quantity')}
                    </Typography>
                  </div>
                  <Typography
                    className={classes.packInfo}
                    color="textSecondary"
                    variant="caption"
                  >
                    {getCreditInfo(pack, t, isManager)}
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
    );
  };

  getVODAccessType = () => {
    const { only_vod_access, full_vod_access } = this.props.pack;
    if (full_vod_access && !only_vod_access) {
      return 'full_vod';
    }

    if (only_vod_access) {
      return 'only_vod_access';
    }

    return null;
  };

  renderPenalty = () => {
    const { pack, t, classes } = this.props;
    const {
      penalty_kind,
      penalty_nb_late_cancellations,
      penalty_nb_days,
      penalty_days_blocked,
      penalty_account_value,
    } = pack;
    return (
      <>
        {penalty_kind === PENALTY_KIND_BLOCK_CPP && (
          <p className={classes.detailContent}>
            {t('penalty.block', {
              nb_cancellations: penalty_nb_late_cancellations,
              nb_days: penalty_nb_days,
              days_blocked: penalty_days_blocked,
            })}
          </p>
        )}
        {penalty_kind === PENALTY_KIND_NEGATIVE_ACCOUNT && (
          <p className={classes.detailContent}>
            {t('penalty.account', {
              nb_cancellations: penalty_nb_late_cancellations,
              nb_days: penalty_nb_days,
              account_value: getCurrencyDisplayWithPrice(penalty_account_value),
            })}
          </p>
        )}
      </>
    );
  };

  renderNoShowPenalty = () => {
    const { pack, t, classes } = this.props;
    const {
      no_show_penalty_kind,
      no_show_penalty_threshold,
      no_show_penalty_time_window_days,
      no_show_penalty_days_blocked,
      no_show_penalty_amount,
    } = pack;
    return (
      <>
        {no_show_penalty_kind === PENALTY_KIND_BLOCK_CPP && (
          <p className={classes.detailContent}>
            {t('noShowPenalty.block', {
              treshold: no_show_penalty_threshold,
              time_window_days: no_show_penalty_time_window_days,
              days_blocked: no_show_penalty_days_blocked,
            })}
          </p>
        )}
        {no_show_penalty_kind === PENALTY_KIND_NEGATIVE_ACCOUNT && (
          <p className={classes.detailContent}>
            {t('noShowPenalty.account', {
              treshold: no_show_penalty_threshold,
              time_window_days: no_show_penalty_time_window_days,
              amount: getCurrencyDisplayWithPrice(no_show_penalty_amount),
            })}
          </p>
        )}
      </>
    );
  };

  renderRestrictions = () => {
    const { t, pack, classes } = this.props;
    const {
      max_bookings_per_day,
      max_bookings_per_week,
      max_bookings_per_month,
      max_purchase_per_member,
      penalty_active,
      no_show_penalty_active,
    } = pack;
    if (
      max_bookings_per_day ||
      max_bookings_per_week ||
      max_bookings_per_month ||
      max_purchase_per_member ||
      penalty_active ||
      no_show_penalty_active
    ) {
      return (
        <>
          {max_bookings_per_day && (
            <p className={classes.detailContent}>
              {t('cardDetails.maxBookingPerDay')}
              {max_bookings_per_day}
            </p>
          )}
          {max_bookings_per_week && (
            <p className={classes.detailContent}>
              {t('cardDetails.maxBookingPerWeek')}
              {max_bookings_per_week}
            </p>
          )}
          {max_bookings_per_month && (
            <p className={classes.detailContent}>
              {t('cardDetails.maxBookingPerMonth')}
              {max_bookings_per_month}
            </p>
          )}
          {max_purchase_per_member && (
            <p className={classes.detailContent}>
              {t('cardDetails.maxPurchasePerMember')}
              {max_purchase_per_member}
            </p>
          )}
          {penalty_active && this.renderPenalty()}
          {no_show_penalty_active && this.renderNoShowPenalty()}
        </>
      );
    }
    return null;
  };

  getPackInfo = () => {
    const { pack, t, classes } = this.props;
    const { categories, establishments, metaActivities } = pack;
    const restrictions = this.renderRestrictions();
    const VOD = this.getVODAccessType();
    const off_peak_schedule = JSON.parse(
      JSON.stringify(pack?.off_peak_schedule ?? {}),
    );

    const offPeakScheduleMapped: [string, string[][]][] =
      Object.entries(off_peak_schedule);

    return (
      <div>
        {pack.disabled ? (
          <div className={classes.disabledLabel}>
            <Typography color="error" variant="subtitle2">
              {t('disabled')}
            </Typography>
          </div>
        ) : null}

        {this.renderCardHeader()}

        <div className={classes.detailInfo}>
          <div className={classes.titleWithSeeAll}>
            <div className={classes.detailCategory}>
              <DoneAllIcon className={classes.leftIcon} />
              <Typography variant="subtitle2">
                {t('detailTitles.compatibility')}
              </Typography>
            </div>
            {(categories.length ||
              establishments.length ||
              metaActivities.length) &&
            !!this.props.openContractForm ? (
              <IconButton
                color="primary"
                onClick={() => this.setState({ compatibilityDialogOpen: true })}
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            ) : null}
          </div>
          <Typography
            className={classes.packInfo}
            color="textSecondary"
            variant="caption"
          >
            {getCompatibilityInfo(pack, t)}
          </Typography>
        </div>

        {!!pack?.linked_private_pass && (
          <div className={classes.detailInfo}>
            <div className={classes.detailCategory}>
              <StyleIcon className={classes.leftIcon} />
              <Typography variant="subtitle2">
                {t('detailTitles.universalPass')}
              </Typography>
            </div>
            <Typography
              className={classes.packInfo}
              color="textSecondary"
              variant="caption"
            >
              {t('cardDetails.universalPass')}
            </Typography>
          </div>
        )}
        {VOD && (
          <div className={classes.detailInfo}>
            <div className={classes.detailCategory}>
              <OndemandVideoIcon className={classes.leftIcon} />
              <Typography variant="subtitle2">
                {t('detailTitles.vod')}
              </Typography>
            </div>
            <Typography
              className={classes.packInfo}
              color="textSecondary"
              variant="caption"
            >
              {t(VOD)}
            </Typography>
          </div>
        )}

        {restrictions && (
          <div className={classes.detailInfo}>
            <div className={classes.detailCategory}>
              <NotInterestedIcon className={classes.leftIcon} />
              <Typography variant="subtitle2">
                {t('detailTitles.restrictions')}
              </Typography>
            </div>
            <div className={classes.packInfo}>
              <Typography color="textSecondary" variant="caption">
                {restrictions}
              </Typography>
            </div>
          </div>
        )}

        {!!offPeakScheduleMapped.length && (
          <div className={classes.detailInfo}>
            <div className={classes.detailCategory}>
              <AccessTimeIcon className={classes.leftIcon} />
              <Typography variant="subtitle2">
                {t('detailTitles.offPeak')}
              </Typography>
            </div>
            <div className={classes.allSchedule}>
              {offPeakScheduleMapped.map(([isoWeekday, timeSlots], index) => {
                return (
                  <OffPeakDisplayByDay
                    key={`${isoWeekday}-${index}`}
                    isoWeekday={isoWeekday}
                    timeSlots={timeSlots}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  render() {
    const {
      classes,
      pack,
      availableEstablishmentList,
      metaActivityList,
      SCTList,
      updatePaymentPackCompatibilities,
    } = this.props;
    const { categories, establishments, metaActivities } = pack;

    return (
      <div className={classes.paymentPackContainer}>
        <ObjectLevelPermissionProviderComponent
          requiredPermission={[
            'product.paymentPack.allowed_actions.edit',
            'product.paymentPack.allowed_actions.delete',
            'product.paymentPack.allowed_actions.manageCredit',
          ]}
        >
          {() => (
            <Paper
              className={[
                classes.paper,
                pack.disabled ? classes.disabled : null,
              ].join(' ')}
            >
              <div className={classes.horizontalBlock}>
                {this.getPackInfo()}
              </div>

              <PaymentPackCompatibilityDialog
                isManager
                // @ts-expect-error
                activities={metaActivities}
                // @ts-expect-error
                categories={categories}
                // @ts-expect-error
                establishments={establishments}
                onClose={() =>
                  this.setState({ compatibilityDialogOpen: false })
                }
                onModify={this.onEditCompatibility}
                open={this.state.compatibilityDialogOpen}
              />
            </Paper>
          )}
        </ObjectLevelPermissionProviderComponent>
        {!(pack?.linked_private_pass || pack?.is_universal_pass) && (
          <>
            <div className={classes.spacerVertical} />
            <CompatibilityFormComponent
              availableEstablishmentList={availableEstablishmentList}
              metaActivityList={metaActivityList}
              paymentPackValues={{
                // @ts-expect-error
                metaActivities: pack.metaActivities,
                // @ts-expect-error
                SCTs: pack.categories,
                // @ts-expect-error
                establishments: pack.establishments,
              }}
              SCTList={SCTList}
              updatePassCompatibility={updatePaymentPackCompatibilities}
            />
          </>
        )}
      </div>
    );
  }
}

const styles = (theme: any) => ({
  paper: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
  },
  category: {
    fontStyle: 'italic',
    color: 'rgba(0, 0, 0, 0.6)',
    fontWeight: 400,
  },
  copyButton: {
    marginLeft: -theme.spacing(1),
  },
  detailInfo: {
    marginBottom: theme.spacing(1),
  },
  detailCategory: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftIcon: {
    marginRight: theme.spacing(2),
  },
  packInfo: {
    marginLeft: theme.spacing(5),
  },
  titleWithSeeAll: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailContent: {
    marginTop: 0,
    marginBottom: theme.spacing(1),
  },
  disabled: {
    backgroundColor: '#F8F8F8',
  },
  horizontalBlock: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  buttonBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  multiDivButton: {
    textAlign: 'right',
  },
  price: {
    fontWeight: 700,
  },
  buttonAlign: {
    marginRight: -theme.spacing(1),
  },
  buttonContainer: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },
  buttonWidth: {
    width: 'min-content',
    marginLeft: 'auto',
  },
  columnLeft: {
    paddingLeft: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  disabledLabel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: theme.spacing(2),
  },
  link: {
    padding: theme.spacing(1),
    marginBottom: theme.spacing(1),
    '&:hover': {
      backgroundColor: '#EFEFEF',
      borderRadius: 5,
    },
  },
  linkTypo: {
    paddingLeft: theme.spacing(2),
    textAlign: 'left',
  },
  marginTop: {
    marginTop: theme.spacing(3),
  },
  description: {
    color: theme.palette.text.secondary,
    wordBreak: 'break-word',
  },
  allSchedule: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(1),
  },
  paymentPackContainer: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(4),
  },
  spacerVertical: {
    height: theme.spacing(2),
  },
});

export default compose<Props, OwnProps>(
  withTranslation(['paymentPack', 'datetime']),
  // @ts-expect-error
  withStyles(styles),
)(PaymentPackDetailsCard);
