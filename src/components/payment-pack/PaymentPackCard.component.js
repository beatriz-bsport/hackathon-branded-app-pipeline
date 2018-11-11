// @flow

import React, { Component } from 'react';

import {
  Paper,
  Grid,
  Divider,
  Typography,
  List,
  ListItem,
  withStyles,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { translate } from 'react-i18next';

import MetaActivityMinimalSummary from '../activity/MetaActivityMinimalSummary.component';
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
  t: (x: string) => string,
  classes: Object,
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
              <ListItem key={c.id}>
                <Sport parentCategory={c.id} />
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

  renderMaxWeekBookings = () => {
    const { t, pack } = this.props;
    return (
      <Typography>
        {t('paymentPack.maxNBookingsByWeek1')}
        <b>{pack.max_bookings_per_week}</b>
        {t('paymentPack.maxNBookingsByWeek2')}
      </Typography>
    );
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
          pack.validity_daterange.lower,
        )}${t('paymentPack.validTo')}${formatAsDate(
          pack.validity_daterange.upper,
        )}`}
      </Typography>
    );
  };

  getPackHeadingInfo = () => {
    const { pack, t } = this.props;
    const { unlimited, base_price, name, credits } = pack;
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
              <Typography variant="display1" color="primary">
                {base_price} €
              </Typography>
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
    const { metaActivities, categories } = this.props.pack;
    if (metaActivities.length === 0 && categories.length === 0) {
      return (
        <div className={classes.noRestriction}>
          <Typography>{t('paymentPack.noRestrictionOnActivityType')}</Typography>
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
      </Grid>
    );
  };

  render() {
    const { classes, onlyPublic } = this.props;
    return (
      <Paper className={classes.paper}>
        <Grid container direction="column">
          <Grid item className={classes.horizontalBlock}>
            {this.getPackHeadingInfo()}
          </Grid>
          <Grid item>{this.renderScope()}</Grid>
          {onlyPublic ? null : (
            <Grid item>{this.getConsumerPaymentPacks()}</Grid>
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
});

export default withStyles(styles)(translate()(PaymentPackCard));
