// @flow
import React, { Component } from 'react';
import { Grid, Button, Paper, Typography, withStyles } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import EuroSymbolIcon from '@material-ui/icons/EuroSymbol';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import CoachSummaryBanner from './coach-detail/CoachSummaryBanner.component';
import ActivityList from './coach-detail/ActivityList.component';
import Description from './coach-detail/Description.component';

type State = { paymentRulePopoverOpen: boolean };

type Props = {
  t: TFunction,
  classes: Object,
  coach: CoachDetailed,
  paymentRules: PaymentRule[],
  setCoachPaymentRule: (any) => void,
  startUpdateCoach: (coach: CoachDetailed) => void,
  goToCoachPerformance: (coach: CoachDetailed) => void,
};

export class CoachDetail extends Component<Props, State> {
  state = { paymentRulePopoverOpen: false };

  togglePaymentRulePopover = (status: boolean) => {
    this.setState({ paymentRulePopoverOpen: status });
  };

  remunerateCoach = () => {
    const { coach } = this.props;
    const { paymentRules } = this.props;
    if (paymentRules.find((p) => p.id === coach.default_payment_rule_id)) {
      this.props.goToCoachPerformance(coach);
    } else {
      this.togglePaymentRulePopover(true);
    }
  };

  renderButtons = () => {
    const { classes, t, coach } = this.props;
    return (
      <Grid container direction="row" justify="flex-start" spacing={16}>
        <Grid item>
          <Button
            color="primary"
            variant="contained"
            onClick={this.remunerateCoach}
          >
            <EuroSymbolIcon className={classes.leftIcon} />
            {t('coach.showPerformance')}
          </Button>
        </Grid>
        <Grid item>
          <Button
            onClick={() => this.props.startUpdateCoach(coach)}
            color="secondary"
            variant="outlined"
          >
            <EditIcon className={classes.leftIcon} />
            {t('common.edit')}
          </Button>
        </Grid>
      </Grid>
    );
  };

  render() {
    const { coach, classes, paymentRules, setCoachPaymentRule, t } = this.props;
    return (
      <Grid container direction="row" spacing={16}>
        <Grid item xs={12}>
          <Paper className={classes.paperContainer}>
            <CoachSummaryBanner
              coach={coach}
              togglePaymentRulePopover={this.togglePaymentRulePopover}
              paymentRulePopoverOpen={this.state.paymentRulePopoverOpen}
              paymentRules={paymentRules}
              setCoachPaymentRule={setCoachPaymentRule}
            />
            {this.renderButtons()}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography
            variant="title"
            align="right"
            className={classes.expansionTitle}
          >
            {t('common.activities')}
          </Typography>
          <ActivityList activities={coach.activities} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography
            variant="title"
            align="right"
            className={classes.expansionTitle}
          >
            {t('coach.description')}
          </Typography>
          <Description
            coach={coach}
            startUpdateCoach={this.props.startUpdateCoach}
          />
        </Grid>
      </Grid>
    );
  }
}
const styles = (theme) => ({
  paperContainer: {
    padding: theme.spacing.unit * 2,
  },
  expansionTitle: {
    marginBottom: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
});

export default withStyles(styles)(withNamespaces([])(CoachDetail));
