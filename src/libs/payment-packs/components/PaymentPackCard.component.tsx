// @flow
import React, { Component } from 'react';
import { compose, withStateHandlers } from 'recompose';
import { withStyles, WithStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import LinkIcon from '@material-ui/icons/Link';
import StarIcon from '@material-ui/icons/Star';
import DateRangeIcon from '@material-ui/icons/DateRange';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo';
import { withTranslation, WithTranslation, TFunction } from 'react-i18next';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import ButtonBase from '@material-ui/core/ButtonBase';

import RedButton from '../../../components/button/RedButton.component';
import type { MetaActivity, Establishment } from '../../../api/types';
import {
  getValidityInfo,
  getCompatibilityInfo,
  getTagInfo,
  getCreditInfo,
} from '../utils';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';

import PaymentPackScaleCreditDialog from './PaymentPackScaleCreditDialog.component';
import PaymentPackCompatibilityDialog from './PaymentPackCompatibilityDialog.component';
import PaymentPackTagsDialog from './PaymentPackTagsDialog.component';

import type { PaymentPack, PaymentPackCategory } from '../types';

const PENALTY_KIND_BLOCK_CPP = 0;
const PENALTY_KIND_NEGATIVE_ACCOUNT = 1;

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

  renderLinkToPaymentPage = () => {
    const { pack, t } = this.props;
    return !this.props.onlyPublic && pack.id && pack.company ? (
      <CopyToClipboard
        text={`${window.location.origin}/customer/payment/pass/${pack.id}/?membership=${pack.company}&force=true`}
      >
        <ButtonBase
          id="button_pass_copy"
          className={this.props.classes.link}
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

  renderEditDeleteButtons = () => {
    const { pack, classes, t } = this.props;
    if (pack.disabled) {
      return (
        <Grid container item justify="center" alignItems="center">
          <Typography color="error" variant="h6">
            {t('disabled')}
          </Typography>
        </Grid>
      );
    }
    return (
      <div className={classes.buttonContainer}>
        {!!this.props.onScaleCredit && (
          <Button
            id="button_pass_multdiv"
            color="primary"
            onClick={this.props.toogleScaleMenuOpen}
            className={`${classes.multiDivButton} ${classes.buttonAlign}`}
          >
            <Hidden xsDown>{t('actions.scaleCredit')}</Hidden>
          </Button>
        )}
        <Button
          id="button_pass_modify"
          color="primary"
          onClick={this.props.onEditButtonClick}
          className={`${classes.buttonWidth} ${classes.buttonAlign}`}
        >
          <Hidden xsDown>{t('actions.edit')}</Hidden>
        </Button>
        {!!this.props.onDeleteButtonClick && (
          <RedButton
            id="button_pass_delete"
            onClick={this.props.onDeleteButtonClick}
            className={`${classes.buttonWidth} ${classes.buttonAlign}`}
          >
            <Hidden xsDown>{t('actions.delete')}</Hidden>
          </RedButton>
        )}
      </div>
    );
  };

  renderCardHeader = () => {
    const { pack, t, onlyPublic, classes, paymentPackCategory, isManager } =
      this.props;
    const { name } = pack;

    return (
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="flex-start"
      >
        <Grid item xs={8}>
          <div className={classes.header}>
            <div>
              <Typography className={classes.title} variant="h4">
                {name}
              </Typography>
              {paymentPackCategory && (
                <Typography className={classes.category} variant="h6">
                  {paymentPackCategory}
                </Typography>
              )}
            </div>
            <div>
              {!onlyPublic && (
                <div className={classes.copyButton}>
                  {this.renderLinkToPaymentPage()}
                </div>
              )}

              <div className={isManager ? '' : classes.marginTop}>
                <div className={classes.detailInfo}>
                  <div className={classes.detailCategory}>
                    <StarIcon className={classes.leftIcon} />
                    <Typography className={classes.categoryTitle} variant="h6">
                      {t('detailTitles.credit_quantity')}
                    </Typography>
                  </div>
                  <Typography variant="body1" className={classes.packInfo}>
                    {getCreditInfo(pack, t, isManager)}
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </Grid>

        <Grid item xs={4}>
          <div className={classes.columnLeft}>
            <Typography variant="h3" color="primary" className={classes.price}>
              {getCurrencyDisplayWithPrice(
                pack.price,
                this.props.isExcludingTax,
                pack.tax,
              )}
            </Typography>
            {onlyPublic ? null : (
              <Typography variant="caption" className={classes.priceWithoutTax}>
                {getCurrencyDisplayWithPrice(pack.price, true, pack.tax)}
                {t('ht')}
              </Typography>
            )}
            {!onlyPublic && (
              <div className={classes.buttonBlock}>
                {this.renderEditDeleteButtons()}
              </div>
            )}
          </div>
        </Grid>
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

  renderVODInfo = () => {
    const { t, pack, classes } = this.props;
    const { only_vod_access, full_vod_access } = pack;
    if (only_vod_access || full_vod_access) {
      return (
        <>
          {full_vod_access && !only_vod_access && (
            <p className={classes.detailContent}>{t('full_vod')}</p>
          )}
          {only_vod_access && (
            <p className={classes.detailContent}>{t('only_vod_access')}</p>
          )}
        </>
      );
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

  renderRestrictions = () => {
    const { t, pack, classes } = this.props;
    const {
      max_bookings_per_day,
      max_bookings_per_week,
      max_bookings_per_month,
      max_purchase_per_member,
      penalty_active,
    } = pack;
    if (
      max_bookings_per_day ||
      max_bookings_per_week ||
      max_bookings_per_month ||
      max_purchase_per_member ||
      penalty_active
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
        </>
      );
    }
    return null;
  };

  getPackInfo = () => {
    const { pack, t, classes, isManager } = this.props;
    const { categories, establishments, metaActivities } = pack;
    const accessibility = this.renderAccessibilityInfo();
    const restrictions = this.renderRestrictions();
    const tags = getTagInfo(pack, t);
    const VOD = this.renderVODInfo();

    return (
      <div>
        {pack.disabled ? (
          <div className={classes.disabledLabel}>
            <Typography color="error" variant="h6">
              {t('disabled')}
            </Typography>
          </div>
        ) : null}

        {this.renderCardHeader()}

        <div>
          <div className={classes.detailInfo}>
            <div className={classes.detailCategory}>
              <DateRangeIcon className={classes.leftIcon} />
              <Typography className={classes.categoryTitle} variant="h6">
                {t('detailTitles.validity')}
              </Typography>
            </div>
            <Typography variant="body1" className={classes.packInfo}>
              {getValidityInfo(pack, t, true)}
            </Typography>
          </div>

          <div className={classes.detailInfo}>
            <div className={classes.titleWithSeeAll}>
              <div className={classes.detailCategory}>
                <DoneAllIcon className={classes.leftIcon} />
                <Typography className={classes.categoryTitle} variant="h6">
                  {t('detailTitles.compatibility')}
                </Typography>
              </div>
              {categories.length ||
              establishments.length ||
              metaActivities.length ? (
                <Button
                  id="button_pass_seeAll"
                  color="primary"
                  onClick={() =>
                    this.setState({ compatibilityDialogOpen: true })
                  }
                  className={classes.seeAllCompatibility}
                >
                  {t('seeAll')}
                </Button>
              ) : null}
            </div>
            <Typography variant="body1" className={classes.packInfo}>
              {getCompatibilityInfo(pack, t)}
            </Typography>
          </div>

          {accessibility && (
            <div className={classes.detailInfo}>
              <div className={classes.detailCategory}>
                <VisibilityIcon className={classes.leftIcon} />
                <Typography className={classes.categoryTitle} variant="h6">
                  {t('detailTitles.accessibility')}
                </Typography>
              </div>
              <Typography variant="body1" className={classes.packInfo}>
                {accessibility}
              </Typography>
            </div>
          )}

          {VOD && (
            <div className={classes.detailInfo}>
              <div className={classes.detailCategory}>
                <OndemandVideoIcon className={classes.leftIcon} />
                <Typography className={classes.categoryTitle} variant="h6">
                  {t('detailTitles.vod')}
                </Typography>
              </div>
              <Typography variant="body1" className={classes.packInfo}>
                {VOD}
              </Typography>
            </div>
          )}

          {isManager && tags && (
            <div className={classes.detailInfo}>
              <div className={classes.titleWithSeeAll}>
                <div className={classes.detailCategory}>
                  <LocalOfferIcon className={classes.leftIcon} />
                  <Typography className={classes.categoryTitle} variant="h6">
                    {t('detailTitles.tags')}
                  </Typography>
                  <Button
                    id="button_pass_seeAll"
                    color="primary"
                    onClick={() => this.setState({ tagsDialogOpen: true })}
                    className={classes.seeAllTags}
                  >
                    {t('seeAll')}
                  </Button>
                </div>
              </div>
              <Typography variant="body1" className={classes.packInfo}>
                {tags}
              </Typography>
            </div>
          )}

          {restrictions && (
            <div className={classes.detailInfo}>
              <div className={classes.detailCategory}>
                <NotInterestedIcon className={classes.leftIcon} />
                <Typography className={classes.categoryTitle} variant="h6">
                  {t('detailTitles.restrictions')}
                </Typography>
              </div>
              <Typography variant="body1" className={classes.packInfo}>
                {restrictions}
              </Typography>
            </div>
          )}
        </div>
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
      <Paper
        className={[
          classes.paper,
          pack.disabled ? classes.disabled : null,
        ].join(' ')}
      >
        <div className={classes.horizontalBlock}>{this.getPackInfo()}</div>

        <PaymentPackScaleCreditDialog
          open={this.props.scaleMenuOpen}
          loading={this.props.scaleCreditLoading}
          onClose={this.props.toogleScaleMenuOpen}
          onSubmit={(data) =>
            this.props.onScaleCredit(this.props.pack.id, data)
          }
        />
        <PaymentPackCompatibilityDialog
          activities={metaActivities}
          categories={categories}
          establishments={establishments}
          open={this.state.compatibilityDialogOpen}
          onClose={() => this.setState({ compatibilityDialogOpen: false })}
          onModify={this.props.onEditButtonClick}
          isManager={isManager}
        />
        <PaymentPackTagsDialog
          blacklistTags={blacklist_tags}
          whitelistTags={whitelist_tags}
          open={this.state.tagsDialogOpen}
          onClose={() => this.setState({ tagsDialogOpen: false })}
          onModify={this.props.onEditButtonClick}
        />
      </Paper>
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
  title: {
    fontWeight: 300,
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
    marginBottom: theme.spacing(2),
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
    color: 'rgba(0, 0, 0, 0.6)',
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
  penaltyTitle: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  disabled: {
    backgroundColor: '#F8F8F8',
  },
  horizontalBlock: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  noRestriction: {
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
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
  priceWithoutTax: {
    color: 'rgba(0, 0, 0, 0.38)',
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
  restrictionBlock: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
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
    marginTop: theme.spacing(2),
    '&:hover': {
      backgroundColor: '#EFEFEF',
      borderRadius: 5,
    },
  },
  linkTypo: {
    paddingLeft: theme.spacing(2),
    textAlign: 'left',
  },
  seeAllTags: {
    marginBottom: -theme.spacing(0.4),
  },
  seeAllCompatibility: {
    marginBottom: -theme.spacing(0.2),
  },
  marginTop: {
    marginTop: theme.spacing(3),
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['paymentPack']),
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
