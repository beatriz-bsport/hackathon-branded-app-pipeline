// @flow
import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';

import { withTranslation } from 'react-i18next';
import {
  CoachPaymentRule,
  CoachPaymentRuleGroup,
} from '../../coach-payment-rules/types';
import CoachSummaryBanner from './coach-detail/CoachSummaryBanner.component';
import Description from './coach-detail/Description.component';
import CoachPaymentRuleBanner from './coach-detail/CoachPaymentRuleBanner.component';
import {
  PrivateServiceWithSlots,
  PrivateSlot,
} from '../../private-service/types';

type Props = {
  classes: Object,
  coach: CoachDetailed,
  coachPaymentRulesByKind: Object<CoachPaymentRule[]>,
  coachPaymentRuleGroups: Array<CoachPaymentRuleGroup>,
  setCoachPaymentRule: (coachId: number, coach_payment_rule_id: number) => void,
  setCoachWorkshopPaymentRule: (
    coachId: number,
    coach_payment_rule_id: number,
  ) => void,
  setCoachPrivatePaymentRule: (
    coachId: number,
    coach_payment_rule_id: number,
  ) => void,
  setCoachPaymentRuleGroup: (
    coachId: number,
    coach_payment_rule_id: number,
  ) => void,
  startUpdateCoach: (coach: CoachDetailed) => void,
  goToCoachPerformance: (coach: CoachDetailed) => void,
  privateSlots: { [id: number]: PrivateSlot },
  updateCoach: (
    coachId: Number,
    associatedCoachId: Number,
    specificPrivateSlots: Array<{
      private_slot: Number,
      coach_payment_rule: number,
    }>,
  ) => void,
  privateServices: Array<PrivateServiceWithSlots>,
};

export class CoachDetail extends Component<Props> {
  render() {
    const {
      coach,
      classes,
      setCoachPaymentRule,
      setCoachWorkshopPaymentRule,
      setCoachPrivatePaymentRule,
      setCoachPaymentRuleGroup,
      coachPaymentRulesByKind,
      coachPaymentRuleGroups,
      privateSlots,
      privateServices,
    } = this.props;
    return (
      <Grid container direction="row" spacing={2}>
        <Grid item xs={8}>
          <Grid container direction="column" spacing={2}>
            <Grid item xs={12}>
              <Paper className={classes.paperContainer}>
                <CoachSummaryBanner
                  coach={coach}
                  coachPaymentRulesByKind={coachPaymentRulesByKind}
                  setCoachPaymentRule={setCoachPaymentRule}
                  setCoachPrivatePaymentRule={setCoachPrivatePaymentRule}
                />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.paperContainer}>
                <CoachPaymentRuleBanner
                  coach={coach}
                  remunerateCoach={() => this.props.goToCoachPerformance(coach)}
                  coachPaymentRulesByKind={coachPaymentRulesByKind}
                  coachPaymentRuleGroups={coachPaymentRuleGroups}
                  setCoachPaymentRule={setCoachPaymentRule}
                  setCoachWorkshopPaymentRule={setCoachWorkshopPaymentRule}
                  setCoachPrivatePaymentRule={setCoachPrivatePaymentRule}
                  setCoachPaymentRuleGroup={setCoachPaymentRuleGroup}
                  privateSlots={privateSlots}
                  updateCoach={this.props.updateCoach}
                  privateServices={privateServices}
                />
              </Paper>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4}>
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
  leftButton: {
    paddingTop: theme.spacing(1),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
});

export default withStyles(styles)(withTranslation(['coach'])(CoachDetail));
