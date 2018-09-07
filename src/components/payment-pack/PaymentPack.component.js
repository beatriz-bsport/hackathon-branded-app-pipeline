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

import ActivityMinimalSummary from '../activity/ActivityMinimalSummary.component';
import Sport from '../Sport.component';
import ConsumersPackSummaryTable from './ConsumersPackSummaryTable.component';

const styles = (theme) => ({
  paper: {
    paddingTop: theme.spacing.unit * 3,
  },
  horizontalBlock: {
    marginBottom: theme.spacing.unit * 2,
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
});

type Props = {
  incrementCredit: (id: Number) => void,
  decrementCredit: (id: Number) => void,
  updatingConsumerPacks: Array<Number>,
};

export class PaymentPack extends Component<Props> {
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
              <ListItem>
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
    const { pack, t, classes } = this.props;
    const { activities } = pack;
    return (
      <div>
        <Typography variant="subheading">
          {t('paymentPack.availableOnFollowingActivities')}
        </Typography>
        <List className={classes.tabList}>
          {activities.length ? (
            activities.map((a) => <ActivityMinimalSummary activity={a} />)
          ) : (
            <Typography variant="body2">
              {t('paymentPack.anyActivity')}
            </Typography>
          )}
        </List>
      </div>
    );
  };

  getPackHeadingInfo = () => {
    const { pack, t } = this.props;
    const { unlimited, base_price, name, credits } = pack;
    let creditsFormatted = t('paymentPack.unlimitedCredits');
    if (!unlimited) {
      creditsFormatted = `${credits} ${t('paymentPack.credits').toLowerCase()}`;
    }
    return (
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Grid item xs={8}>
          <Typography variant="title">{name}</Typography>
        </Grid>
        <Grid item xs={4}>
          <Grid
            container
            direction="column"
            alignItems="center"
            justify="center"
          >
            <Grid item>
              <Typography variant="title" color="primary">
                {base_price} €
              </Typography>
            </Grid>
            <Grid item>-</Grid>
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

  render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.paper}>
        <Grid container direction="column">
          <Grid item className={classes.horizontalBlock}>
            {this.getPackHeadingInfo()}
          </Grid>
          <Divider className={classes.horizontalDivider} />
          <Grid item>
            <Grid container="row">
              <Grid item className={classes.horizontalBlock} xs={12}>
                {this.getSportScope()}
              </Grid>
              <Divider className={classes.horizontalDivider} />
              <Grid item className={classes.horizontalBlock} xs={12}>
                {this.getActivityScope()}
              </Grid>
            </Grid>
          </Grid>
          <Grid item>{this.getConsumerPaymentPacks()}</Grid>
        </Grid>
      </Paper>
    );
  }
}

export default withStyles(styles)(translate()(PaymentPack));
