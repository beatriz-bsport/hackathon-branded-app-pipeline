// @flow

import React, { Component } from 'react';

import { compose, withState } from 'recompose';
import { withNamespaces } from 'react-i18next';

import Popover from '@material-ui/core/Popover';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core';
import CallIcon from '@material-ui/icons/Call';
import EmailIcon from '@material-ui/icons/Email';

import { PaymentRuleSelector } from '../../libs/payment-rules';
import type { PaymentRule } from '../../libs/payment-rules';

import Avatar from '../Avatar.component';
import ActivityMinimalSummary from '../activity/ActivityMinimalSummary.component';
import type { CoachDetailed, AssociatedCoach } from '../../api/types';

const OVERFLOW = 100;

type Props = {
  onClickUpdate: (coach: AssociatedCoach) => void,
  t: (x: string) => string,
  classes: Object,
  paymentRulePopoverOpen: boolean,
  coach: CoachDetailed,
  paymentRules: PaymentRule[],
  togglePaymentRulePopover: (boolean) => void,
  setCoachPaymentRule: (number, number) => void,
  goToCoachPerformance: () => void,
};

export class CoachCard extends Component<Props> {
  constructor(props) {
    super(props);
    this.refPaymentRuleSelector = React.createRef();
  }

  getActivityList = () => {
    const { t } = this.props;
    const { coach } = this.props;

    if (!coach || !coach.activities.length) {
      return <Typography variant="body1">{t('coach.noActivity')}</Typography>;
    }
    return (
      <Grid container direction="column" alignItems="stretch">
        {coach.activities.map((a) => (
          <ActivityMinimalSummary key={a.id} activity={a} />
        ))}
      </Grid>
    );
  };

  render() {
    const {
      coach,
      classes,
      t,
      onClickUpdate,
      paymentRules,
      setCoachPaymentRule,
    } = this.props;
    return (
      <Paper className={classes.paper}>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="flex-start"
        >
          <Grid item>
            <Tooltip
              title={coach.phone || t('common.NA')}
              classes={{ tooltip: classes.lightTooltip }}
            >
              <IconButton>
                <CallIcon />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item>
            <div style={{ marginTop: -OVERFLOW }}>
              {coach ? <Avatar user={coach} variant="large" /> : null}
            </div>
          </Grid>
          <Grid item>
            <Tooltip
              title={coach.email || t('common.NA')}
              classes={{ tooltip: classes.lightTooltip }}
            >
              <IconButton>
                <EmailIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
        {true ? null : (
          <React.Fragment>
            <Typography variant="subtitle">
              {t('paymentRules:label')}
            </Typography>
            <div ref={this.refPaymentRuleSelector}>
              <PaymentRuleSelector
                paymentRules={paymentRules}
                selected={coach.default_payment_rule_id}
                onChange={({ value }) => setCoachPaymentRule(coach.id, value)}
              />
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
          </React.Fragment>
        )}
        <Grid container direction="column" justify="flex-start">
          <Grid item>
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
            >
              <Grid item>
                <Typography variant="title">
                  {t('common.activities')}
                </Typography>
              </Grid>
              <Grid item>
                <Button onClick={onClickUpdate}>
                  {t('coach.card.update')}
                </Button>
                {true ? null : (
                  <Button
                    color="primary"
                    onClick={() => {
                      if (
                        paymentRules.find(
                          (p) => p.id === coach.default_payment_rule_id,
                        )
                      ) {
                        this.props.goToCoachPerformance();
                      } else {
                        this.props.togglePaymentRulePopover(true);
                      }
                    }}
                  >
                    {t('coach.showPerformance')}
                  </Button>
                )}
              </Grid>
            </Grid>
          </Grid>
          <Grid item>{this.getActivityList()}</Grid>
        </Grid>
      </Paper>
    );
  }
}

const styles = (theme) => ({
  paper: {
    padding: theme.spacing.unit * 3,
    paddingBottom: theme.spacing.unit,
    marginTop: OVERFLOW,
  },
  lightTooltip: {
    background: theme.palette.common.white,
    color: theme.palette.text.primary,
    boxShadow: theme.shadows[1],
    fontSize: 14,
  },
  popoverNoPaymentRule: {
    margin: theme.spacing.unit * 2,
  },
});
export default compose(
  withStyles(styles),
  withNamespaces(['translation', 'paymentRules']),
  withState('paymentRulePopoverOpen', 'togglePaymentRulePopover', false),
)(CoachCard);
