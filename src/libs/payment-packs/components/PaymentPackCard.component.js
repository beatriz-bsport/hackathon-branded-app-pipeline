// @flow
import React, { Component } from 'react';
import { compose, withStateHandlers } from 'recompose';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import HeightIcon from '@material-ui/icons/Height';
import Hidden from '@material-ui/core/Hidden';
import DeleteIcon from '@material-ui/icons/Delete';
import LinkIcon from '@material-ui/icons/Link';
import EditIcon from '@material-ui/icons/Edit';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import ButtonBase from '@material-ui/core/ButtonBase';

import RedButton from '../../../components/button/RedButton.component';
import MetaActivityMinimalSummary from '../../../components/activity/MetaActivityMinimalSummary.component';
import EstablishmentSummary from '../../establishment/components/EstablishmentSummary.component';
import Sport from '../../category/components/SCT.component';
import type { MetaActivity } from '../../../api/types';
import { getValidityInfo } from '../utils';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';

import PaymentPackScaleCreditDialog from './PaymentPackScaleCreditDialog.component';

import type { PaymentPack } from '../types';
import TagChip from '../../tag/components/TagChip.component';

const PENALTY_KIND_BLOCK_CPP = 0;
const PENALTY_KIND_NEGATIVE_ACCOUNT = 1;

type Props = {
  onlyPublic: ?boolean,

  pack: PaymentPack,

  metaActivities: Array<MetaActivity>,
  establishments: Array<Establishment>,

  onEditButtonClick: () => void,
  onDeleteButtonClick: () => void,
  snackbarSuccess: (string) => void,

  t: TFunction,
  classes: Object,
  scaleMenuOpen: boolean,
  scaleCreditLoading: boolean,
  toogleScaleMenuOpen: () => void,
  onScaleCredit: (paymentPackId: number, data: any) => void,
  pack: PaymentPack,
  isManager?: boolean,
};

export class PaymentPackCard extends Component<Props> {
  getSportScope = () => {
    const { pack, t, classes } = this.props;
    const { categories } = pack;
    if (categories.length === 0) {
      return null;
    }
    return (
      <div>
        <Typography variant="subtitle1">
          {t('availableOnFollowingSports')}
        </Typography>
        <List className={classes.tabList}>
          {categories.length ? (
            categories.map((c) => (
              <ListItem key={c.id} dense divider>
                <Sport SCTName={c.name} parentCategory={c.SCS.id} />
              </ListItem>
            ))
          ) : (
            <Typography variant="body2">{t('anySport')}</Typography>
          )}
        </List>
      </div>
    );
  };

  getActivityScope = () => {
    const { pack, t, classes } = this.props;
    const packMetaActivities = pack.metaActivities;
    if (packMetaActivities.length === 0) {
      return null;
    }
    return (
      <div>
        <Typography variant="subtitle1">
          {t('availableOnFollowingActivities')}
        </Typography>
        <List className={classes.tabList}>
          {packMetaActivities.length ? (
            packMetaActivities.map((ma) => {
              if (!ma) {
                return (
                  <div>
                    <CircularProgress />
                  </div>
                );
              }
              return (
                <MetaActivityMinimalSummary key={ma.id} metaActivity={ma} />
              );
            })
          ) : (
            <Typography variant="body2">{t('anyActivity')}</Typography>
          )}
        </List>
      </div>
    );
  };

  getEstablishmentScope = () => {
    const { pack, t, classes } = this.props;
    const packEstablishments = pack.establishments;
    if (packEstablishments.length === 0) {
      return null;
    }
    return (
      <div>
        <Typography variant="subtitle1">
          {t('availableOnFollowingEstablishments')}
        </Typography>
        <List className={classes.tabList}>
          {packEstablishments.length ? (
            packEstablishments.map((eee) => {
              if (!eee) return <CircularProgress />;
              return <EstablishmentSummary key={eee.id} establishment={eee} />;
            })
          ) : (
            <Typography variant="body2">{t('anyEstablishment')}</Typography>
          )}
        </List>
      </div>
    );
  };

  getWhiteListTagScope = () => {
    const { pack, t, classes } = this.props;
    if (!pack || pack?.whitelist_tags?.length === 0) {
      return null;
    }
    return (
      <div>
        <Typography variant="subtitle1">
          {t('form.paymentPack.advancedOptions.tag.allowedFor')}
        </Typography>
        <div className={classes.tagListSection}>
          {pack?.whitelist_tags.map((tag) => {
            return <TagChip key={tag.id} tag={tag} size="small" />;
          })}
        </div>
      </div>
    );
  };

  getBlackListTagScope = () => {
    const { pack, t, classes } = this.props;
    if (!pack || pack?.blacklist_tags?.length === 0) {
      return null;
    }
    return (
      <div>
        <Typography variant="subtitle1">
          {t('form.paymentPack.advancedOptions.tag.notAllowedFor')}
        </Typography>
        <div className={classes.tagListSection}>
          {pack?.blacklist_tags.map((tag) => {
            return <TagChip key={tag.id} tag={tag} size="small" />;
          })}
        </div>
      </div>
    );
  };

  renderMaxWeekBookings = () => {
    const { t, classes, pack } = this.props;
    const { max_bookings_per_week } = pack;
    if (max_bookings_per_week) {
      return (
        <div className={classes.restrictionBlock}>
          <Typography>
            {t('maxNBookingsByWeek1')}
            <b>{max_bookings_per_week}</b>
            {t('maxNBookingsByWeek2')}
          </Typography>
        </div>
      );
    }
    return null;
  };

  renderMaxMonthBookings = () => {
    const { t, classes, pack } = this.props;
    const { max_bookings_per_month } = pack;
    if (max_bookings_per_month) {
      return (
        <div className={classes.restrictionBlock}>
          <Typography>
            {t('maxNBookingsByWeek1')}
            <b>{max_bookings_per_month}</b>
            {t('maxNBookingsByMonth2')}
          </Typography>
        </div>
      );
    }
    return null;
  };

  renderTimeInfo = () => {
    const { pack, classes, t } = this.props;
    return (
      <div className={classes.restrictionBlock}>
        <Typography>{getValidityInfo(pack, t)}</Typography>
      </div>
    );
  };

  getPackHeadingInfo = () => {
    const { pack, t, classes, onlyPublic } = this.props;
    const {
      unlimited,
      max_bookings_per_week,
      max_bookings_per_month,
      new_member_only,
      only_vod_access,
      base_price,
      name,
      credits,
      tax,
    } = pack;
    let creditsFormatted = t('unlimitedCredits');
    if (!unlimited) {
      creditsFormatted = (
        <div>
          <b>{credits}</b> {t('credits', { count: credits }).toLowerCase()}
        </div>
      );
    }
    if (unlimited && !!max_bookings_per_week) {
      creditsFormatted = this.renderMaxWeekBookings();
    }
    if (unlimited && !max_bookings_per_week && !!max_bookings_per_month) {
      creditsFormatted = this.renderMaxMonthBookings();
    }
    return (
      <div>
        {pack.disabled ? (
          <div className={classes.disabledLabel}>
            <Typography color="rror" variant="h6">
              {t('disabled')}
            </Typography>
          </div>
        ) : null}
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="flex-start"
        >
          <Grid item xs={8}>
            <div>
              <Typography className={classes.title} variant="h6">
                {name}
              </Typography>
              {new_member_only && !onlyPublic ? (
                <div className={classes.newMemberOnlyContainer}>
                  <VisibilityOffIcon className={classes.iconLeft} />
                  <Typography>{t('newMemberOnly')}</Typography>
                </div>
              ) : null}
              {only_vod_access && !onlyPublic ? (
                <div className={classes.newMemberOnlyContainer}>
                  <Typography>{t('only_vod_access')}</Typography>
                </div>
              ) : null}
              <div>
                {this.renderTimeInfo()}
                {!unlimited && this.renderMaxWeekBookings()}
                {!unlimited && this.renderMaxMonthBookings()}
              </div>
            </div>
          </Grid>
          <Grid item xs={4}>
            <div className={classes.columnLeft}>
              <Typography variant="h4" color="primary">
                {getCurrencyDisplayWithPrice(base_price)}
              </Typography>
              {onlyPublic ? null : (
                <Typography variant="caption">
                  {getCurrencyDisplayWithPrice(
                    (base_price / ((100 + parseInt(tax, 10)) / 100)).toFixed(2),
                  )}{' '}
                  {t('ht')}
                </Typography>
              )}
              <Typography variant="subtitle1">{creditsFormatted}</Typography>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  };

  renderScope = () => {
    const { t, classes } = this.props;
    const { metaActivities, establishments, categories } = this.props.pack;
    if (
      metaActivities.length === 0 &&
      categories.length === 0 &&
      establishments.length === 0
    ) {
      return (
        <div className={classes.horizontalBlock}>
          <div className={classes.noRestriction}>
            <Typography>{t('noRestrictionOnActivityType')}</Typography>
          </div>
        </div>
      );
    }
    return (
      <div>
        <div className={classes.horizontalBlock}>{this.getSportScope()}</div>
        <div className={classes.horizontalBlock}>{this.getActivityScope()}</div>
        <div className={classes.horizontalBlock}>
          {this.getEstablishmentScope()}
        </div>
      </div>
    );
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
  /*
  renderAdvancedOptions = () => {
    const { classes, t } = this.props;
    return (
      <div className={classes.advancedContainer}>
        <div className={classes.advancedHeader}>
          <Typography variant="subtitle">
            {this.props.t('options.advanced')}
          </Typography>
          <IconButton onClick={this.props.toogleAdvanceMenu}>
            <ExpandMoreIcon />
          </IconButton>
        </div>
        <Collapse in={this.props.advancedMenuOpen}>
          <div className={classes.advancedContent}>
            <List disablePadding>
              <ListItem densebutton>
                <ListItemText primary={t('options.scaleCredit')} />
                <ListItemSecondaryAction>
                  <IconButton
                    onClick={this.props.toogleScaleMenuOpen}
                    color="primary"
                  >
                    <ArrowForwardIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </div>
        </Collapse>
      </div>
    );
  };
  */

  renderPenalty = () => {
    const { pack, t, classes } = this.props;
    const {
      penalty_active,
      penalty_kind,
      penalty_nb_late_cancellations,
      penalty_nb_days,
      penalty_days_blocked,
      penalty_account_value,
    } = pack;

    return (
      penalty_active && (
        <>
          <Typography variant="h6" className={classes.penaltyTitle}>
            {t('penalty.title')}
          </Typography>
          {penalty_kind === PENALTY_KIND_BLOCK_CPP && (
            <Typography>
              {t('penalty.block', {
                nb_cancellations: penalty_nb_late_cancellations,
                nb_days: penalty_nb_days,
                days_blocked: penalty_days_blocked,
              })}
            </Typography>
          )}
          {penalty_kind === PENALTY_KIND_NEGATIVE_ACCOUNT && (
            <Typography>
              {t('penalty.account', {
                nb_cancellations: penalty_nb_late_cancellations,
                nb_days: penalty_nb_days,
                account_value: penalty_account_value,
              })}
            </Typography>
          )}
        </>
      )
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
        <Button
          id="button_pass_multdiv"
          color="primary"
          onClick={this.props.toogleScaleMenuOpen}
        >
          <HeightIcon className={classes.iconLeft} />
          <Hidden xsDown>{t('actions.scaleCredit')}</Hidden>
        </Button>
        <Button
          id="button_pass_modify"
          color="primary"
          onClick={this.props.onEditButtonClick}
        >
          <EditIcon className={classes.iconLeft} />
          <Hidden xsDown>{t('actions.edit')}</Hidden>
        </Button>
        <RedButton
          id="button_pass_delete"
          onClick={this.props.onDeleteButtonClick}
        >
          <DeleteIcon className={classes.iconLeft} />
          <Hidden xsDown>{t('actions.delete')}</Hidden>
        </RedButton>
      </div>
    );
  };

  render() {
    const { classes, onlyPublic, pack, isManager } = this.props;
    return (
      <Paper
        className={[
          classes.paper,
          pack.disabled ? classes.disabled : null,
        ].join(' ')}
      >
        <div className={classes.horizontalBlock}>
          {this.getPackHeadingInfo()}
        </div>
        <div className={`${classes.horizontalBlock} ${classes.penaltyText}`}>
          {this.renderPenalty()}
        </div>
        {!onlyPublic && (
          <div className={classes.buttonBlock}>
            {this.renderLinkToPaymentPage()}
          </div>
        )}
        {this.renderScope()}
        {isManager && (
          <>
            <div className={classes.horizontalBlock}>
              {this.getWhiteListTagScope()}
            </div>
            <div className={classes.horizontalBlock}>
              {this.getBlackListTagScope()}
            </div>
          </>
        )}

        {!onlyPublic && (
          <div className={classes.buttonBlock}>
            {this.renderEditDeleteButtons()}
          </div>
        )}
        <PaymentPackScaleCreditDialog
          open={this.props.scaleMenuOpen}
          loading={this.props.scaleCreditLoading}
          onClose={this.props.toogleScaleMenuOpen}
          onSubmit={(data) =>
            this.props.onScaleCredit(this.props.pack.id, data)
          }
        />
      </Paper>
    );
  }
}

const styles = (theme) => ({
  paper: {
    paddingTop: theme.spacing(3),
  },
  title: {
    paddingBottom: theme.spacing(2),
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
  tabList: {
    paddingLeft: theme.spacing(3),
  },
  noRestriction: {
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  newMemberOnlyContainer: {
    backgroundColor: '#F2F2F2',
    padding: theme.spacing(1),
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  iconLeft: {
    marginRight: theme.spacing(2),
  },
  buttonBlock: {
    padding: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'nowrap',
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
    '&:hover': {
      backgroundColor: '#EFEFEF',
      borderRadius: 5,
    },
  },
  linkTypo: {
    paddingLeft: theme.spacing(1),
  },
  advancedContainer: {
    width: '100%',
  },
  advancedHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  penaltyText: {
    paddingBottom: theme.spacing(3),
  },
  tagListSection: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2),
    display: 'flex',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['paymentPack']),
  withStateHandlers(
    { scaleMenuOpen: false },
    {
      toogleScaleMenuOpen: ({ scaleMenuOpen }) => () => ({
        scaleMenuOpen: !scaleMenuOpen,
      }),
    },
  ),
)(PaymentPackCard);
