// @flow
import React, { Component } from 'react';
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
import CoachSpaceConfiguration from './coach-detail/CoachSpaceConfiguration.component';

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
  editAccessToCoachSpace: (arg: boolean) => void,
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
      <div className={classes.column}>
        <div className={classes.row}>
          <Paper className={classes.paperContainer}>
            <CoachSummaryBanner
              coach={coach}
              coachPaymentRulesByKind={coachPaymentRulesByKind}
              setCoachPaymentRule={setCoachPaymentRule}
              setCoachPrivatePaymentRule={setCoachPrivatePaymentRule}
            />
          </Paper>
          <div className={classes.right}>
            <CoachSpaceConfiguration
              editAccessToCoachSpace={this.props.editAccessToCoachSpace}
              hasAccessToCoachSpace={coach?.has_access_to_coach_space}
            />
          </div>
        </div>
        <div className={classes.row}>
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
          <div className={classes.right}>
            <Description
              coach={coach}
              startUpdateCoach={this.props.startUpdateCoach}
            />
          </div>
        </div>
      </div>
    );
  }
}
const styles = (theme) => ({
  row: { display: 'flex', gap: theme.spacing(2) },
  fullWidth: { width: '100%' },
  paperContainer: {
    padding: theme.spacing(2),
    flex: '5',
  },
  right: {
    flex: '3',
  },
  leftButton: {
    paddingTop: theme.spacing(1),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  column: { display: 'flex', flexDirection: 'column', gap: theme.spacing(2) },
});

export default withStyles(styles)(withTranslation(['coach'])(CoachDetail));
