// @flow
// TODO: deprecated
import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import Typography from '@material-ui/core/Typography';
import WarningIcon from '@material-ui/icons/Warning';

import { withTranslation, TFunction } from 'react-i18next';
import { COACH_PAYMENT_RULE_FOR_SESSION } from '@bsport/common/lib/master-data/coach_payment_rule';
import CoachSelector from '../../associated-coach/components/coach-selector/CoachSelectorWithCard.component';
import CoachPaymentRuleSelectorStyled from '../../coach-payment-rules/components/coach-payment-rule-selector/CoachPaymentRuleSelectorStyled.component';
import type { CoachPaymentRule } from '../../coach-payment-rules/types';

type Props = {
  coach: Coach,
  coaches: Array<Coach>,
  coach_override: ?Coach,
  t: TFunction,
  classes: Object,
  coachs_override: Array,
  onChangeCoachOverride: (Coach) => void,
  onChangeCoach: (Coach) => void,
  coachPaymentRulesByKind: { [kind: number]: Array<CoachPaymentRule> },
  onChangeCoachPaymentRule: (ruleId: number) => void,
  coach_payment_rule: number,
};

export class CoachSubForm extends Component<Props> {
  renderModifyCoach = () => (
    <div className={this.props.classes.selector}>
      <Typography className={this.props.classes.caption} variant="caption">
        {this.props.t('coach:baseCoach')}
      </Typography>
      <CoachSelector
        coaches={this.props.coaches}
        onChange={this.props.onChangeCoach}
        placeholder={this.props.t('coach:coach')}
        value={this.props.coach}
      />
      <Typography className={this.props.classes.caption} variant="caption">
        {this.props.t('paymentRules:paymentRules')}
      </Typography>
      {this.props.coach && (
        <CoachPaymentRuleSelectorStyled
          isClearable
          noMulti
          coachPaymentRulesList={
            this.props.coachPaymentRulesByKind[COACH_PAYMENT_RULE_FOR_SESSION]
          }
          disabled={!this.props.coach}
          onChange={(item: { value: number, label: string }) => {
            this.props.onChangeCoachPaymentRule(item ? item.value : null);
          }}
          placeholder={this.props.t('paymentRules:search')}
          selectedRules={[
            this.props.coachPaymentRulesByKind[
              COACH_PAYMENT_RULE_FOR_SESSION
            ]?.find((rule) => rule.id === this.props.coach_payment_rule) &&
              this.props.coachPaymentRulesByKind[
                COACH_PAYMENT_RULE_FOR_SESSION
              ]?.find((rule) => rule.id === this.props.coach_payment_rule).id,
          ]}
        />
      )}
    </div>
  );

  renderModifySubstituteCoach = () => (
    <div className={this.props.classes.selector}>
      <Typography className={this.props.classes.caption} variant="caption">
        {this.props.t('coach:overrider')}
      </Typography>
      <CoachSelector
        coaches={this.props.coachs_override}
        onChange={this.props.onChangeCoachOverride}
        placeholder={this.props.t('coach:coach_override')}
        value={this.props.coach_override}
      />
    </div>
  );

  render() {
    return (
      <div className={this.props.classes.selector}>
        {this.renderModifyCoach()}
        {this.props.coach ? null : (
          <div className={this.props.classes.warningContainer}>
            <WarningIcon size={20} />
            <Typography
              className={this.props.classes.caption}
              variant="caption"
            >
              {this.props.t('coach:pleaseFill')}
            </Typography>
          </div>
        )}
        {this.renderModifySubstituteCoach()}
      </div>
    );
  }
}

const styles = (theme) => ({
  warningContainer: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(1),
  },
  caption: {
    paddingLeft: theme.spacing(1),
  },
  selector: {
    width: '100%',
  },
});
export default compose(withStyles(styles), withTranslation())(CoachSubForm);
