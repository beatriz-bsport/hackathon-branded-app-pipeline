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
import EmailIcon from '@material-ui/icons/Email';
import CallIcon from '@material-ui/icons/Call';
import { translate, withNamespaces, TFunction } from 'react-i18next';

import { PaymentRuleSelector } from '../../../payment-rules';
import type { PaymentRule } from '../../../payment-rules';

import FACEBOOK_PNG from '../../../../public/images/facebook.png';
import INSTAGRAM_PNG from '../../../../public/images/instagram.png';

import type { CoachDetailed } from '../../../../api/types';

type Props = {
  coach: CoachDetailed,
  t: TFunction,
  classes: Object,
  paymentRules: PaymentRule[],
  togglePaymentRulePopover: (x: boolean) => void,
  setCoachPaymentRule: (id: number, ruleId: number) => void,
  paymentRulePopoverOpen: boolean,
};

class CoachSummaryCard extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.refPaymentRuleSelector = React.createRef();
  }

  renderPaymentRules = () => {
    const { t, paymentRules, classes, coach, setCoachPaymentRule } = this.props;
    return (
      <Grid
        container
        direction="row"
        justify="flex-end"
        className={classes.ruleContainer}
      >
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
        <ListItem
          button={!!this.props.coach.phone}
          onClick={(e) => {
            e.stopPropagation();
            if (this.props.coach.phone) {
              window.location.href = 'tel:'.concat(this.props.coach.phone);
            }
          }}
        >
          <CallIcon />
          <ListItemText
            primary={this.props.coach.phone ? this.props.coach.phone : ' - '}
          />
        </ListItem>
        <ListItem
          button={!!this.props.coach.email}
          onClick={(e) => {
            e.stopPropagation();
            if (this.props.coach.email) {
              window.location.href = 'mailto:'.concat(this.props.coach.email);
            }
          }}
        >
          <EmailIcon />
          <ListItemText
            primary={this.props.coach.email ? this.props.coach.email : ' - '}
          />
        </ListItem>
      </List>
    );
  };

  renderAvatarNameAndPaymentRule = () => {
    const { coach, classes, t } = this.props;
    return (
      <Grid container direction="column" spacing={24}>
        <Grid container direction="row" spacing={16} alignItems="center">
          <Grid item>
            <Avatar src={coach.photo} className={classes.bigAvatar} />
          </Grid>
          <Grid item>
            <Grid
              container
              direction="column"
              alignItems="flex-start"
              justify="space-around"
              spacing={8}
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
            spacing={24}
            className={classes.firstRow}
          >
            <Grid item>
              <Grid
                container
                item
                direction="row"
                alignItems="center"
                spacing={16}
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
    padding: theme.spacing.unit * 2,
  },
  bigAvatar: {
    margin: 10,
    width: 60,
    height: 60,
  },
  popoverNoPaymentRule: {
    margin: theme.spacing.unit * 2,
  },
});

export default compose(
  withNamespaces(['translation', 'paymentRules']),
  translate(),
  withStyles(styles),
)(CoachSummaryCard);
