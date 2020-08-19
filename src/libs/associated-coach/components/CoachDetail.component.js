// @flow
import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import EuroSymbolIcon from '@material-ui/icons/EuroSymbol';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import CoachSummaryBanner from './coach-detail/CoachSummaryBanner.component';
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

  render() {
    const { coach, classes, paymentRules, setCoachPaymentRule, t } = this.props;
    return (
      <Grid container direction="column" spacing={2} alignItems="center">
        <Grid item xs={12} lg={8} className={classes.fullWidth}>
          <Paper className={classes.paperContainer}>
            <CoachSummaryBanner
              coach={coach}
              togglePaymentRulePopover={this.togglePaymentRulePopover}
              paymentRulePopoverOpen={this.state.paymentRulePopoverOpen}
              paymentRules={paymentRules}
              setCoachPaymentRule={setCoachPaymentRule}
            />
            <Button
              color="primary"
              variant="contained"
              onClick={this.remunerateCoach}
              id="button_teacher_remunerate"
            >
              <EuroSymbolIcon className={classes.leftIcon} />
              {t('showPerformance')}
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} lg={8} className={classes.fullWidth}>
          <Typography
            variant="h6"
            align="right"
            className={classes.expansionTitle}
          >
            {t('description')}
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
  fullWidth: { width: '100%' },
  paperContainer: {
    padding: theme.spacing(2),
    width: '100%',
  },
  expansionTitle: {
    marginBottom: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
});

export default withStyles(styles)(withTranslation(['coach'])(CoachDetail));
