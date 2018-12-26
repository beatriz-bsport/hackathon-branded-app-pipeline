// @flow

import React, { Component } from 'react';

import {
  Paper,
  Grid,
  Typography,
  List,
  ListItem,
  Button,
  withStyles,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Hidden,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import { translate } from 'react-i18next';

import RedButton from '../button/RedButton.component';
import MetaActivityMinimalSummary from '../activity/MetaActivityMinimalSummary.component';
import EstablishmentSummary from '../establishment/EstablishmentSummary.component';
import { Sport } from '../category';
import ConsumersPackSummaryTable from './ConsumersPackSummaryTable.component';
import type { PaymentPackManagerView, MetaActivity } from '../../api/types';
import { formatAsDate } from '../../datetime';

type Props = {
  incrementCredit: (id: number) => void,
  decrementCredit: (id: number) => void,
  updatingConsumerPacks: Array<number>,
  pack: PaymentPackManagerView,
  metaActivities: Array<MetaActivity>,
  establishments: Array<Establishment>,
  onDeleteButtonClick: () => void,
  onEditButtonClick: () => void,
  t: (x: string) => string,
  classes: Object,
  onlyPublic: ?boolean,
};

export class PaymentPackCard extends Component<Props> {
  getSportScope = () => {
    const { pack, t, classes } = this.props;
    const { categories } = pack;
    return (
      <div>
        <Typography variant="subheading">
          {t('paymentPack.availableOnFollowingSports')}
        </Typography>
        <List className={classes.tabList}>
          {categories.length ? (
            categories.map((c) => (
              <ListItem key={c.id} dense divider>
                <Sport SCTName={c.name} parentCategory={c.SCS.id} />
              </ListItem>
            ))
          ) : (
            <Typography variant="body2">{t('paymentPack.anySport')}</Typography>
          )}
        </List>
      </div>
    );
  };

  getActivityScope = () => {
    const { pack, t, classes, metaActivities } = this.props;
    const packMetaActivities = pack.metaActivities;
    return (
      <div>
        <Typography variant="subheading">
          {t('paymentPack.availableOnFollowingActivities')}
        </Typography>
        <List className={classes.tabList}>
          {packMetaActivities.length ? (
            packMetaActivities.map((ma) => (
              <MetaActivityMinimalSummary
                key={ma.id}
                metaActivity={metaActivities.find((m) => m.id === ma)}
              />
            ))
          ) : (
            <Typography variant="body2">
              {t('paymentPack.anyActivity')}
            </Typography>
          )}
        </List>
      </div>
    );
  };

  getEstablishmentScope = () => {
    const { pack, t, classes, establishments } = this.props;
    const packEstablishments = pack.establishments;
    return (
      <div>
        <Typography variant="subheading">
          {t('paymentPack.availableOnFollowingEstablishments')}
        </Typography>
        <List className={classes.tabList}>
          {packEstablishments.length ? (
            packEstablishments.map((eee) => (
              <EstablishmentSummary
                key={eee.id}
                establishment={establishments.find((e) => e.id === eee)}
              />
            ))
          ) : (
            <Typography variant="body2">
              {t('paymentPack.anyEstablishment')}
            </Typography>
          )}
        </List>
      </div>
    );
  };

  renderMaxWeekBookings = () => {
    const { t, pack } = this.props;
    const { max_bookings_per_week } = pack;
    if (max_bookings_per_week) {
      return (
        <Typography>
          {t('paymentPack.maxNBookingsByWeek1')}
          <b>{max_bookings_per_week}</b>
          {t('paymentPack.maxNBookingsByWeek2')}
        </Typography>
      );
    }
    return null;
  };

  renderTimeInfo = () => {
    const { pack, t } = this.props;
    if (pack.duration_days) {
      return (
        <Typography>
          {t('paymentPack.validForNdays1')}
          <b>{pack.duration_days}</b>
          {t('paymentPack.validForNdays2')}
        </Typography>
      );
    }
    return (
      <Typography>
        {`${t('paymentPack.validFrom')}${formatAsDate(
          JSON.parse(pack.validity_daterange).lower,
        )}${t('paymentPack.validTo')}${formatAsDate(
          JSON.parse(pack.validity_daterange).upper,
        )}`}
      </Typography>
    );
  };

  getPackHeadingInfo = () => {
    const { pack, t, classes, onlyPublic } = this.props;
    const { unlimited, new_member_only, base_price, name, credits, tax } = pack;
    let creditsFormatted = t('paymentPack.unlimitedCredits');
    if (!unlimited) {
      creditsFormatted = (
        <div>
          <b>{credits}</b> {t('paymentPack.credits').toLowerCase()}
        </div>
      );
    }
    return (
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="flex-start"
      >
        <Grid item xs={8}>
          <Grid container direction="column" spacing={16}>
            <Grid item>
              <Typography variant="title">{name}</Typography>
            </Grid>
            {new_member_only && !onlyPublic ? (
              <Grid item>
                <Grid
                  container
                  direction="row"
                  alignItems="center"
                  className={classes.newMemberOnlyContainer}
                >
                  <Grid item>
                    <VisibilityOffIcon className={classes.iconLeft} />
                  </Grid>
                  <Grid item>
                    <Typography>{t('paymentPack.newMemberOnly')}</Typography>
                  </Grid>
                </Grid>
              </Grid>
            ) : null}
            <Grid item>
              <Grid container direction="column" spacing={8}>
                <Grid item>{this.renderTimeInfo()}</Grid>
                <Grid item>{this.renderMaxWeekBookings()}</Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <Grid container direction="column" alignItems="flex-end" spacing={8}>
            <Grid item>
              <Grid container direction="column" alignItems="flex-end">
                <Grid item>
                  <Typography variant="display1" color="primary">
                    {base_price} €
                  </Typography>
                </Grid>
                {onlyPublic ? null : (
                  <Grid item>
                    <Typography variant="caption">
                      {(base_price / ((100 + parseInt(tax, 10)) / 100)).toFixed(
                        2,
                      )}
                      € {t('shop.ht')}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Grid>
            <Grid item>
              <Typography variant="subheading">{creditsFormatted}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  getConsumerPaymentPacks = () => {
    const {
      t,
      pack,
      decrementCredit,
      incrementCredit,
      updatingConsumerPacks,
    } = this.props;
    const { consumer_payment_packs } = pack;
    const disabled = consumer_payment_packs.length === 0;
    return (
      <ExpansionPanel disabled={disabled}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="body2">
            {`${t('paymentPack.boughtConsumerPaymentPacks')} (${
              consumer_payment_packs.length
            })`}
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <ConsumersPackSummaryTable
            updatingConsumerPacks={updatingConsumerPacks}
            paymentPack={pack}
            incrementCredit={incrementCredit}
            decrementCredit={decrementCredit}
          />
        </ExpansionPanelDetails>
      </ExpansionPanel>
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
        <div className={classes.noRestriction}>
          <Typography>
            {t('paymentPack.noRestrictionOnActivityType')}
          </Typography>
        </div>
      );
    }
    return (
      <Grid container direction="row">
        {categories.length ? (
          <Grid item className={classes.horizontalBlock} xs={12}>
            {this.getSportScope()}
          </Grid>
        ) : null}
        {metaActivities.length ? (
          <Grid item className={classes.horizontalBlock} xs={12}>
            {this.getActivityScope()}
          </Grid>
        ) : null}
        {establishments.length ? (
          <Grid item className={classes.horizontalBlock} xs={12}>
            {this.getEstablishmentScope()}
          </Grid>
        ) : null}
      </Grid>
    );
  };

  renderEditDeleteButtons = () => {
    const { pack, classes, t } = this.props;
    if (pack.disabled) {
      return (
        <Grid container item justify="center" alignItems="center">
          <Typography color="error" variant="h6">
            {t('paymentPack.disabled')}
          </Typography>
        </Grid>
      );
    }
    return (
      <Grid
        container
        direction="row"
        justify="flex-end"
        spacing={16}
        wrap="nowrap"
      >
        <Grid item>
          <Button color="primary" onClick={this.props.onEditButtonClick}>
            <EditIcon className={classes.iconLeft} />
            <Hidden xsDown>{t('common.edit')}</Hidden>
          </Button>
        </Grid>
        <Grid item>
          <RedButton onClick={this.props.onDeleteButtonClick}>
            <DeleteIcon className={classes.iconLeft} />
            <Hidden xsDown>{t('common.delete')}</Hidden>
          </RedButton>
        </Grid>
      </Grid>
    );
  };

  render() {
    const { classes, onlyPublic, pack } = this.props;
    return (
      <Paper
        className={[classes.paper, pack.disabled ? classes.disabled : null]}
      >
        <Grid container direction="column">
          <Grid item className={classes.horizontalBlock}>
            {this.getPackHeadingInfo()}
          </Grid>
          <Grid item>{this.renderScope()}</Grid>
          {onlyPublic ? null : (
            <React.Fragment>
              <Grid item className={classes.buttonBlock}>
                {this.renderEditDeleteButtons()}
              </Grid>
              <Grid item>{this.getConsumerPaymentPacks()}</Grid>
            </React.Fragment>
          )}
        </Grid>
      </Paper>
    );
  }
}

const styles = (theme) => ({
  paper: {
    paddingTop: theme.spacing.unit * 3,
  },
  disabled: {
    backgroundColor: '#F8F8F8',
  },
  horizontalBlock: {
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
  },
  horizontalDivider: {
    marginBottom: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  verticalDivider: {
    marginLeft: theme.spacing.unit * 2,
    marginRiht: theme.spacing.unit * 2,
  },
  tabList: {
    marginLeft: theme.spacing.unit * 3,
  },
  noRestriction: {
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
  },
  newMemberOnlyContainer: {
    backgroundColor: '#F2F2F2',
    padding: theme.spacing.unit,
  },
  iconLeft: {
    marginRight: theme.spacing.unit,
  },
  buttonBlock: {
    marginBottom: theme.spacing.unit,
  },
});

export default withStyles(styles)(translate()(PaymentPackCard));
