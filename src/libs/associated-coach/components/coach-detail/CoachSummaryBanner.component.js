// @flow
import React from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Icon from '@material-ui/core/Icon';
import ListItemText from '@material-ui/core/ListItemText';
import withStyles from '@material-ui/core/styles/withStyles';
import Avatar from '@material-ui/core/Avatar';
import Popover from '@material-ui/core/Popover';
import { compose } from 'recompose';
import { withTranslation, TFunction } from 'react-i18next';
import {
  COACH_PERFORMANCE_FOR_SESSION,
  COACH_PERFORMANCE_FOR_APPOINTMENT,
} from '@bsport/common/lib/master-data/coach_payment_rule';
import CoachPaymentRuleSelector from '../../../coach-payment-rules/components/CoachPaymentRuleSelector.component';
import type { CoachPaymentRule } from '../../../coach-payment-rules/types';

import FACEBOOK_PNG from '../../../../public/images/facebook.png';
import INSTAGRAM_PNG from '../../../../public/images/instagram.png';

import type { CoachDetailed } from '../../../../api/types';

import EmailItem from '../../../communication/components/EmailItem.component';
import PhoneItem from '../../../communication/components/PhoneItem.component';

type Props = {
  coach: CoachDetailed,
  t: TFunction,
  classes: Object,
  coachPaymentRulesByKind: Object<CoachPaymentRule[]>,
  togglePaymentRulePopover: (x: boolean) => void,
  setCoachPaymentRule: (id: number, ruleId: number) => void,
  setCoachPrivatePaymentRule: (id: number, ruleId: number) => void,
  paymentRulePopoverOpen: boolean,
};

class CoachSummaryCard extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.refPaymentRuleSelector = React.createRef();
  }

  renderPaymentRules = () => {
    const {
      t,
      classes,
      coach,
      setCoachPaymentRule,
      setCoachPrivatePaymentRule,
      coachPaymentRulesByKind,
    } = this.props;
    return (
      <Grid
        container
        direction="row"
        justify="flex-end"
        className={classes.ruleContainer}
      >
        <div
          ref={this.refPaymentRuleSelector}
          id="button_teacher_paymentconfig"
        >
          <Typography variant="subtitle2">
            {t('paymentRules:paymentRules')}
          </Typography>
          {[
            COACH_PERFORMANCE_FOR_SESSION,
            COACH_PERFORMANCE_FOR_APPOINTMENT,
          ].map((pay_rule_kind) => (
            <div className={classes.flexPaymentSelector}>
              <CoachPaymentRuleSelector
                coachPaymentRulesList={coachPaymentRulesByKind[pay_rule_kind]}
                selected={
                  pay_rule_kind === COACH_PERFORMANCE_FOR_SESSION
                    ? coach.coach_payment_rule_id
                    : coach.private_coach_payment_rule_id
                }
                onChange={({ value }) => {
                  return (
                    (pay_rule_kind === COACH_PERFORMANCE_FOR_SESSION &&
                      setCoachPaymentRule(coach.id, value)) ||
                    (pay_rule_kind === COACH_PERFORMANCE_FOR_APPOINTMENT &&
                      setCoachPrivatePaymentRule(coach.id, value))
                  );
                }}
              />
              <Typography>
                {pay_rule_kind === COACH_PERFORMANCE_FOR_SESSION
                  ? t('paymentRules:select.coachPaymentRuleForSessions')
                  : t('paymentRules:select.coachPaymentRuleForPrivateService')}
              </Typography>
            </div>
          ))}
        </div>
        <Popover
          open={this.props.paymentRulePopoverOpen}
          anchorEl={this.refPaymentRuleSelector.current}
          onClose={() => this.props.togglePaymentRulePopover(false)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Typography className={classes.popoverNoPaymentRule}>
            {t('paymentRules:setPaymentRuleSetForCoachFirst')}
          </Typography>
        </Popover>
      </Grid>
    );
  };

  renderPersonnalInfo = () => (
    <List dense>
      <ListItem>
        <Icon color="primary">
          <img
            style={{ height: 24, width: 24 }}
            src={FACEBOOK_PNG}
            alt="Facebook"
          />
        </Icon>
        <ListItemText primary={this.props.coach.facebook_url || '  -  '} />
      </ListItem>
      <ListItem>
        <Icon color="primary">
          <img
            style={{ height: 24, width: 24 }}
            src={INSTAGRAM_PNG}
            alt="Instagram"
          />
        </Icon>
        <ListItemText primary={this.props.coach.instagram_url || '  -  '} />
      </ListItem>
    </List>
  );

  renderContact = () => {
    return (
      <List dense>
        <PhoneItem phoneNumber={this.props.coach.phone} accept_contact />
        <EmailItem
          email={this.props.coach.email}
          accept_email
          openMailDialog={() => {
            window.location.href = 'mailto:'.concat(this.props.coach.email);
          }}
        />
      </List>
    );
  };

  renderAvatarNameAndPaymentRule = () => {
    const { coach, classes, t } = this.props;
    return (
      <Grid container direction="column" spacing={3}>
        <Grid container direction="row" spacing={2} alignItems="center">
          <Grid item>
            <Avatar src={coach.photo} className={classes.bigAvatar} />
          </Grid>
          <Grid item>
            <Grid
              container
              direction="column"
              alignItems="flex-start"
              justify="space-around"
              spacing={1}
            >
              <Grid item>
                <Typography>{coach.name.trim() || t('common.NA')}</Typography>
              </Grid>
              <Grid ietm xs="12">
                {this.renderPaymentRules()}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  render() {
    const { coach, classes } = this.props;
    if (coach) {
      return (
        <div>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
            spacing={3}
            className={classes.firstRow}
          >
            <Grid item>
              <Grid
                container
                item
                direction="row"
                alignItems="center"
                spacing={2}
              >
                {this.renderAvatarNameAndPaymentRule()}
              </Grid>
            </Grid>
            <Grid item>{this.renderPersonnalInfo()}</Grid>
            <Grid item>{this.renderContact()}</Grid>
          </Grid>
        </div>
      );
    }
    return null;
  }
}
const styles = (theme) => ({
  firstRow: {
    padding: theme.spacing(2),
  },
  bigAvatar: {
    margin: 10,
    width: 60,
    height: 60,
  },
  popoverNoPaymentRule: {
    margin: theme.spacing(2),
  },
  flexPaymentSelector: {
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center',
  },
});

export default compose(
  withTranslation(['translation', 'paymentRules']),
  withStyles(styles),
)(CoachSummaryCard);
