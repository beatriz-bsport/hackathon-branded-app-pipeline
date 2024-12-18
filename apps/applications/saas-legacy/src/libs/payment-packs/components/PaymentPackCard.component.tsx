import React, { Component } from 'react';
import memoize from 'memoize-one';
import { compose, withStateHandlers } from 'recompose';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
import LinkIcon from '@material-ui/icons/Link';
import StarIcon from '@material-ui/icons/Star';
import DateRangeIcon from '@material-ui/icons/DateRange';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import StyleIcon from '@material-ui/icons/Style';
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo';
import { withTranslation, WithTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ButtonBase from '@material-ui/core/ButtonBase';
import ObjectLevelPermissionWrapper from '#src/libs/role/permission-utils/ObjectLevelPermissionWrapper.component';
import TypographyMultilineComponent from '#src/components/typo/TypographyMultiline.component';
import ObjectLevelPermissionProviderComponent from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import RedButton from '../../../components/button/RedButton.component';
import type { MetaActivity, Establishment } from '../../../api/types';
import {
  getValidityInfo,
  getCompatibilityInfo,
  getTagInfo,
  getCreditInfo,
} from '../utils';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
// @ts-expect-error
import PaymentPackScaleCreditDialog from './PaymentPackScaleCreditDialog.component';
import PaymentPackCompatibilityDialog from './PaymentPackCompatibilityDialog.component';
import PaymentPackTagsDialog from './PaymentPackTagsDialog.component';

import type { PaymentPack, PaymentPackCategory } from '../types';
import {
  PENALTY_KIND_BLOCK_CPP,
  PENALTY_KIND_NEGATIVE_ACCOUNT,
} from '../constants';
import OffPeakDisplayByDay from './OffPeakDisplayByDay.component';

type OwnProps = {
  onlyPublic?: boolean;

  pack: PaymentPack;

  metaActivities: Array<MetaActivity>;
  establishments: Array<Establishment>;
  paymentPackCategory: PaymentPackCategory;

  onEditButtonClick: () => void;
  onDeleteButtonClick: () => void;
  snackbarSuccess: (text: string) => void;

  t: TFunction;
  classes: Object;
  scaleMenuOpen: boolean;
  scaleCreditLoading: boolean;
  toogleScaleMenuOpen: () => void;
  onScaleCredit: (paymentPackId: number, data: any) => void;
  isManager?: boolean;
  isExcludingTax?: boolean;
};

type Props = OwnProps & WithStyles & WithTranslation;

type State = {
  compatibilityDialogOpen: boolean;
  tagsDialogOpen: Boolean;
};
export class PaymentPackCard extends Component<Props, State> {
  state = {
    compatibilityDialogOpen: false,
    tagsDialogOpen: false,
  };

  onEditPaymentPack = () => {
    this.props.onEditButtonClick();
    this.setState({ compatibilityDialogOpen: false, tagsDialogOpen: false });
  };

  renderLinkToPaymentPage = () => {
    const { pack, t } = this.props;
    return !this.props.onlyPublic && pack.id && pack.company ? (
      <CopyToClipboard
        text={`${window.location.origin}/customer/payment/pass/${pack.id}/?membership=${pack.company}&force=true`}
      >
        <ButtonBase
          className={this.props.classes.link}
          id="button_pass_copy"
          onClick={() => this.props.snackbarSuccess('paymentPack:link.copied')}
        >
          <LinkIcon />
          <Typography className={this.props.classes.linkTypo}>
            {t('link.copyLink')}
          </Typography>
        </ButtonBase>
      </CopyToClipboard>
    ) : (
      <CircularProgress />
    );
  };

  renderEditDeleteButtons = (
    hasEditPermission: boolean,
    hasDeletePermission: boolean,
    hasManageCreditPermission: boolean,
  ) => {
    const { pack, classes, t } = this.props;
    if (pack.disabled) {
      return (
        <Grid container item alignItems="center" justify="center">
          <Typography color="error" variant="subtitle2">
            {t('disabled')}
          </Typography>
        </Grid>
      );
    }
    return (
      <div className={classes.buttonContainer}>
        {!!this.props.onScaleCredit &&
          !pack.linked_private_pass &&
          hasEditPermission &&
          hasManageCreditPermission && (
            <Button
              className={`${classes.multiDivButton} ${classes.buttonAlign}`}
              color="primary"
              disabled={!!pack.linked_private_pass || pack.unlimited}
              id="button_pass_multdiv"
              onClick={this.props.toogleScaleMenuOpen}
            >
              <Hidden xsDown>{t('actions.scaleCredit')}</Hidden>
            </Button>
          )}
        {hasEditPermission && (
          <Button
            className={`${classes.buttonWidth} ${classes.buttonAlign}`}
            color="primary"
            id="button_pass_modify"
            onClick={this.onEditPaymentPack}
          >
            <Hidden xsDown>{t('actions.edit')}</Hidden>
          </Button>
        )}
        {hasDeletePermission && !!this.props.onDeleteButtonClick && (
          <RedButton
            className={`${classes.buttonWidth} ${classes.buttonAlign}`}
            id="button_pass_delete"
            onClick={this.props.onDeleteButtonClick}
          >
            <Hidden xsDown>{t('actions.delete')}</Hidden>
          </RedButton>
        )}
      </div>
    );
  };

  renderTitleAndPrice = (
    hasEditPermission: boolean,
    hasDeletePermission: boolean,
    hasManageCreditPermission: boolean,
  ) => {
    const { pack, t, onlyPublic, classes } = this.props;

    return (
      <React.Fragment>
        <Typography className={classes.price} color="primary" variant="h3">
          {getCurrencyDisplayWithPrice(
            pack.price,
            this.props.isExcludingTax,
            pack.tax,
          )}
        </Typography>
        {onlyPublic ? null : (
          <Typography color="textSecondary" variant="caption">
            {getCurrencyDisplayWithPrice(pack.price, true, pack.tax)}
            {t('ht')}
          </Typography>
        )}
        {!onlyPublic && (
          <div className={classes.buttonBlock}>
            {this.renderEditDeleteButtons(
              hasEditPermission,
              hasDeletePermission,
              hasManageCreditPermission,
            )}
          </div>
        )}
      </React.Fragment>
    );
  };

  renderCardHeader = (
    hasEditPermission: boolean,
    hasDeletePermission: boolean,
    hasManageCreditPermission: boolean,
  ) => {
    const { pack, t, onlyPublic, classes, paymentPackCategory, isManager } =
      this.props;
    const { name, description } = pack;

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
              <Typography variant="h4">{name}</Typography>
              {paymentPackCategory && (
                <Typography className={classes.category} variant="h6">
                  {paymentPackCategory}
                </Typography>
              )}
            </div>

            {description && (
              <TypographyMultilineComponent
                className={classes.description}
                variant="caption"
              >
                {description}
              </TypographyMultilineComponent>
            )}

            <Hidden smUp>
              <Grid item>
                <div className={classes.marginTop}>
                  {this.renderTitleAndPrice(
                    hasEditPermission,
                    hasDeletePermission,
                    hasManageCreditPermission,
                  )}
                </div>
              </Grid>
            </Hidden>

            <div>
              {!onlyPublic && (
                <ObjectLevelPermissionWrapper
                  forcedBehavior="hidden"
                  requiredPermission="billing.allowed_actions.readPaymentLink"
                >
                  <div className={classes.copyButton}>
                    {this.renderLinkToPaymentPage()}
                  </div>
                </ObjectLevelPermissionWrapper>
              )}

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

        <Hidden xsDown>
          <Grid item sm={5}>
            <div className={classes.columnLeft}>
              {this.renderTitleAndPrice(
                hasEditPermission,
                hasDeletePermission,
                hasManageCreditPermission,
              )}
            </div>
          </Grid>
        </Hidden>
      </Grid>
    );
  };

  renderAccessibilityInfo = () => {
    const { t, pack, classes } = this.props;
    const { new_member_only, onsite_payment_available, manager_only } = pack;
    if (new_member_only || onsite_payment_available || manager_only) {
      return (
        <>
          {new_member_only && !manager_only && (
            <p className={classes.detailContent}>
              {t('accessibility.newMembers')}
            </p>
          )}
          {manager_only && (
            <p className={classes.detailContent}>
              {t('accessibility.managerOnly')}
            </p>
          )}
          {onsite_payment_available && !manager_only && (
            <p className={classes.detailContent}>
              {t('accessibility.onsitePayment')}
            </p>
          )}
        </>
      );
    }
    return null;
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

  getPackInfo = (
    hasEditPermission: boolean,
    hasDeletePermission: boolean,
    hasManageCreditPermission: boolean,
  ) => {
    const { pack, t, classes, isManager } = this.props;
    const { categories, establishments, metaActivities } = pack;
    const accessibility = this.renderAccessibilityInfo();
    const restrictions = this.renderRestrictions();
    const tags = getTagInfo(pack, t);
    const VOD = this.getVODAccessType();
    const off_peak_schedule = JSON.parse(
      JSON.stringify(pack?.off_peak_schedule ?? {}),
    );

    const getOffPeakScheduleMapped = memoize(
      (offPeakSchedule: Record<string, string[][]>): [string, string[][]][] => {
        return Object.entries(offPeakSchedule);
      },
    );

    const offPeakScheduleMapped = getOffPeakScheduleMapped(off_peak_schedule);

    return (
      <div>
        {pack.disabled ? (
          <div className={classes.disabledLabel}>
            <Typography color="error" variant="subtitle2">
              {t('disabled')}
            </Typography>
          </div>
        ) : null}

        {this.renderCardHeader(
          hasEditPermission,
          hasDeletePermission,
          hasManageCreditPermission,
        )}
        <div className={classes.detailInfo}>
          <div className={classes.detailCategory}>
            <DateRangeIcon className={classes.leftIcon} />
            <Typography variant="subtitle2">
              {t('detailTitles.validity')}
            </Typography>
          </div>
          <Typography
            className={classes.packInfo}
            color="textSecondary"
            variant="caption"
          >
            {getValidityInfo(pack, t, true)}
          </Typography>
        </div>

        <div className={classes.detailInfo}>
          <div className={classes.titleWithSeeAll}>
            <div className={classes.detailCategory}>
              <DoneAllIcon className={classes.leftIcon} />
              <Typography variant="subtitle2">
                {t('detailTitles.compatibility')}
              </Typography>
            </div>
            {categories.length ||
            establishments.length ||
            metaActivities.length ? (
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

        {accessibility && (
          <div className={classes.detailInfo}>
            <div className={classes.detailCategory}>
              <VisibilityIcon className={classes.leftIcon} />
              <Typography variant="subtitle2">
                {t('detailTitles.accessibility')}
              </Typography>
            </div>
            <div className={classes.packInfo}>
              <Typography color="textSecondary" variant="caption">
                {accessibility}
              </Typography>
            </div>
          </div>
        )}
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

        {isManager && tags && (
          <div className={classes.detailInfo}>
            <div className={classes.titleWithSeeAll}>
              <div className={classes.detailCategory}>
                <LocalOfferIcon className={classes.leftIcon} />
                <Typography variant="subtitle2">
                  {t('detailTitles.tags')}
                </Typography>
                <IconButton
                  color="primary"
                  onClick={() => this.setState({ tagsDialogOpen: true })}
                >
                  <VisibilityIcon fontSize="small" />
                </IconButton>
              </div>
            </div>
            <Typography
              className={classes.packInfo}
              color="textSecondary"
              variant="caption"
            >
              {tags}
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
    const { classes, pack, isManager } = this.props;
    const {
      categories,
      establishments,
      metaActivities,
      whitelist_tags,
      blacklist_tags,
    } = pack;
    return (
      <ObjectLevelPermissionProviderComponent
        requiredPermission={[
          'product.paymentPack.allowed_actions.edit',
          'product.paymentPack.allowed_actions.delete',
          'product.paymentPack.allowed_actions.manageCredit',
        ]}
      >
        {([
          hasEditPermission,
          hasDeletePermission,
          hasManageCreditPermission,
        ]: boolean[]) => (
          <Paper
            className={[
              classes.paper,
              pack.disabled ? classes.disabled : null,
            ].join(' ')}
          >
            <div className={classes.horizontalBlock}>
              {this.getPackInfo(
                hasEditPermission,
                hasDeletePermission,
                hasManageCreditPermission,
              )}
            </div>

            <PaymentPackScaleCreditDialog
              loading={this.props.scaleCreditLoading}
              onClose={this.props.toogleScaleMenuOpen}
              // @ts-expect-error
              onSubmit={(data) =>
                this.props.onScaleCredit(this.props.pack.id, data)
              }
              open={this.props.scaleMenuOpen}
            />
            <PaymentPackCompatibilityDialog
              // @ts-expect-error
              activities={metaActivities}
              // @ts-expect-error
              categories={categories}
              // @ts-expect-error
              establishments={establishments}
              isManager={isManager}
              onClose={() => this.setState({ compatibilityDialogOpen: false })}
              onModify={this.onEditPaymentPack}
              open={this.state.compatibilityDialogOpen}
            />
            <PaymentPackTagsDialog
              // @ts-expect-error
              blacklistTags={blacklist_tags}
              onClose={() => this.setState({ tagsDialogOpen: false })}
              onModify={this.onEditPaymentPack}
              open={this.state.tagsDialogOpen}
              // @ts-expect-error
              whitelistTags={whitelist_tags}
            />
          </Paper>
        )}
      </ObjectLevelPermissionProviderComponent>
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
});

export default compose(
  // @ts-expect-error
  withStyles(styles),
  withTranslation(['paymentPack', 'datetime']),
  withStateHandlers(
    { scaleMenuOpen: false },
    {
      toogleScaleMenuOpen:
        ({ scaleMenuOpen }) =>
        () => ({
          scaleMenuOpen: !scaleMenuOpen,
        }),
    },
  ),
)(PaymentPackCard);
