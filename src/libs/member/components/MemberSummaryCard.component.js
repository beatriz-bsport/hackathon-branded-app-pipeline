// @flow
import React, { Component } from 'react';

import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import MergeTypeIcon from '@material-ui/icons/MergeType';
import Button from '@material-ui/core/Button';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Hidden from '@material-ui/core/Hidden';
import withStyles from '@material-ui/core/styles/withStyles';
import EmailIcon from '@material-ui/icons/Email';
import TodayIcon from '@material-ui/icons/Today';
import EditIcon from '@material-ui/icons/Edit';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import CallIcon from '@material-ui/icons/Call';
import SMSIcon from '@material-ui/icons/Sms';
import PlaceIcon from '@material-ui/icons/Place';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import PhoneForwardedIcon from '@material-ui/icons/PhoneForwarded';
import { withNamespaces } from 'react-i18next';
import NotificationActiveIcon from '@material-ui/icons/NotificationsActive';
import NotificationOffIcon from '@material-ui/icons/NotificationsOff';

import { compose } from 'recompose';
import type { TFunction } from 'react-i18next';
import CreditMemberBadge from './CreditMemberBadge.component';

import { formatAsDate } from '../../../datetime';
import { Avatar } from '../../../components';
import type { Member } from '../../../api/types';

type Props = {
  editMember: () => void,
  mergeMember: () => void,
  goToMember: () => void,
  member: Member,
  t: TFunction,
  classes: Object,
};
export class MemberSummaryCard extends Component<Props> {
  renderMembershipAndBirthday = () => {
    const { member, t } = this.props;
    return (
      <List dense>
        <ListItem>
          <TodayIcon />
          <ListItemText
            className={this.props.classes.listItemText}
            primary={`
              ${t('member.bornIn')} 
              ${
                member.consumer.birthday
                  ? formatAsDate(member.consumer.birthday)
                  : '  -  '
              }`}
          />
        </ListItem>
        <ListItem>
          <PersonOutlineIcon />
          <ListItemText
            className={this.props.classes.listItemText}
            primary={`N°${member.membership_ID}`}
          />
        </ListItem>
      </List>
    );
  };

  renderNotificationSettings = () => {
    const { member } = this.props;
    return (
      <List dense>
        <ListItem>
          <CallIcon />
          <ListItemText
            primary={
              // prettier-ignore
              (member.consumer.phonenumber || { phone_number: ' - ' }).phone_number
            }
            className={this.props.classes.listItemText}
          />
          <Button
            onClick={(e) => {
              e.stopPropagation();
              if (member.consumer.phonenumber) {
                window.location.href = 'tel:'.concat(
                  member.consumer.phonenumber.phone_number,
                );
              }
            }}
            color="primary"
          >
            <PhoneForwardedIcon />
          </Button>
          {member.consumer.phonenumber ? (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                if (member.consumer.phonenumber) {
                  window.location.href = 'sms:'.concat(
                    member.consumer.phonenumber.phone_number,
                  );
                }
              }}
              color="primary"
            >
              <SMSIcon />
            </Button>
          ) : null}
          {member.accept_sms ? (
            <NotificationActiveIcon />
          ) : (
            <NotificationOffIcon />
          )}
        </ListItem>
        <ListItem>
          <AlternateEmailIcon />
          <ListItemText
            primary={member.consumer.email || ' - '}
            className={this.props.classes.listItemText}
          />
          <Button
            onClick={(e) => {
              e.stopPropagation();
              if (member.consumer.email) {
                window.location.href = 'mailto:'.concat(member.consumer.email);
              }
            }}
            color="primary"
          >
            <EmailIcon />
          </Button>
          {member.accept_email ? (
            <NotificationActiveIcon />
          ) : (
            <NotificationOffIcon />
          )}
        </ListItem>
      </List>
    );
  };

  renderAddress = () => {
    const { address } = this.props.member.consumer;
    return (
      <List>
        <ListItem>
          <PlaceIcon />
          <ListItemText
            className={this.props.classes.listItemText}
            primary={`${(address && address.address_line_1) || ''}`}
            secondary={`${(address && address.city) || ''} - ${(
              (address && address.country) ||
              ''
            ).toUpperCase()}`}
          />
        </ListItem>
      </List>
    );
  };

  renderAvatarAndName = () => {
    const { t, member } = this.props;
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <CreditMemberBadge credit={member.credit_account_balance}>
            <Avatar user={member.consumer} variant="mediumNoname" noname />
          </CreditMemberBadge>
          <div className={this.props.classes.consumerName}>
            <Typography noWrap>
              {member.consumer.first_name} {member.consumer.last_name}
            </Typography>
            <Typography noWrap>
              {t('member.memberSince') + formatAsDate(member.date_joined)}
            </Typography>
          </div>
        </div>
        <div
          style={{
            flexDirection: 'column',
            display: 'flex',
            alignItems: 'flex-end',
          }}
        >
          {this.props.mergeMember ? (
            <Button onClick={this.props.mergeMember} color="secondary">
              <Hidden xsDown>{t('common.merge')}</Hidden>
              <MergeTypeIcon className={this.props.classes.rightIcon} />
            </Button>
          ) : null}
          {this.props.editMember ? (
            <Button onClick={this.props.editMember} color="primary">
              <Hidden xsDown>{t('common.edit')}</Hidden>
              <EditIcon className={this.props.classes.rightIcon} />
            </Button>
          ) : null}
          {this.props.goToMember ? (
            <Button onClick={this.props.goToMember} color="primary">
              <Hidden xsDown>{t('common.show')}</Hidden>
              <ArrowForwardIcon className={this.props.classes.rightIcon} />
            </Button>
          ) : null}
        </div>
      </div>
    );
  };

  renderAccount = () => {
    let color = 'secondary';

    if (parseFloat(this.props.member.credit_account_balance) > 0) {
      color = 'primary';
    }
    if (parseFloat(this.props.member.credit_account_balance) < 0) {
      color = 'error';
    }
    return (
      <div className={this.props.classes.accountBalance}>
        <Typography variant="subtitle2" inline>
          {this.props.t('payment.creditAccountBalance')}
        </Typography>
        <Typography inline variant="h6" component="span" color={color}>
          {` ${this.props.member.credit_account_balance} €`}
        </Typography>
      </div>
    );
  };

  render() {
    const { member, classes } = this.props;
    // ugly FIXME: because loading should never be set to true
    // if member=={}
    if (member.consumer) {
      return (
        <Paper>
          <div className={classes.infoContainer}>
            {this.renderAvatarAndName()}
            {this.renderMembershipAndBirthday()}
            {this.renderAddress()}
            {this.renderNotificationSettings()}
          </div>
          {this.renderAccount()}
        </Paper>
      );
    }
    return null;
  }
}

const styles = (theme) => ({
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  rowInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  listItemText: {
    marginLeft: theme.spacing.unit * 2,
  },
  infoContainer: {
    padding: theme.spacing.unit * 2,
  },
  consumerName: {
    marginLeft: theme.spacing.unit * 2,
    display: 'flew',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountBalance: {
    backgroundColor: '#F8F8F8',
    padding: theme.spacing.unit * 2,
    border: '2px solid #E8E8E8',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emailMargin: {
    marginLeft: theme.spacing.unit * 9,
  },
});

export default compose(
  withStyles(styles),
  withNamespaces(),
)(MemberSummaryCard);
