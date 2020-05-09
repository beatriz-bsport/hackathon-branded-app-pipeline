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
import TodayIcon from '@material-ui/icons/Today';
import EditIcon from '@material-ui/icons/Edit';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import PlaceIcon from '@material-ui/icons/Place';

import { withNamespaces } from 'react-i18next';

import { compose } from 'recompose';
import type { TFunction } from 'react-i18next';
import CreditMemberBadge from './CreditMemberBadge.component';

import { formatAsDate } from '../../../datetime';
import { Avatar } from '../../../components';
import type { Member } from '../../../api/types';

import EmailItem from '../../communication/components/EmailItem.component';
import PhoneItem from '../../communication/components/PhoneItem.component';
import MailDialog from '../../communication/components/MailDialog.component';

type Props = {
  hideCreditAccount?: boolean,
  editMember: () => void,
  mergeMember: () => void,
  goToMember: () => void,
  member: Member,
  t: TFunction,
  classes: Object,
  mailMember: () => void,
  goToCreditRegularization: () => void,
  hideContactButton: ?boolean,
};

export class MemberSummaryCard extends Component<Props> {
  state = {
    displayMailDialog: false,
  };

  renderMembershipAndBirthday = () => {
    const { member, t } = this.props;
    return (
      <List dense>
        <ListItem>
          <TodayIcon />
          <ListItemText
            className={this.props.classes.listItemText}
            primary={`
              ${t('member:bornIn')} 
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
    const { member, mailMember } = this.props;
    return (
      <List dense>
        <PhoneItem
          phoneNumber={
            member.consumer.phonenumber &&
            member.consumer.phonenumber.phone_number
          }
          accept_contact={member.accept_sms}
          notificationIcon
          hideContactButton={this.props.hideContactButton}
        />
        <EmailItem
          email={member.consumer.email}
          accept_email={member.accept_email}
          notificationIcon
          openMailDialog={() => this.setState({ displayMailDialog: true })}
          hideContactButton={this.props.hideContactButton}
        />
        <MailDialog
          open={this.state.displayMailDialog}
          sendMailAction={mailMember}
          fullscreen
          receiverInfo={[
            {
              id: member.id,
              name: `${member.consumer.first_name} ${member.consumer.last_name}`,
              email: member.consumer.email,
            },
          ]}
          onCancel={() => this.setState({ displayMailDialog: false })}
          receiversNotEditable
        />
      </List>
    );
  };

  renderAddress = () => {
    const { address } = this.props.member.consumer;
    let primary = '';
    let secondary = '';
    if (address) {
      primary = `${address.address_line_1 || ''} ${address.address_line_2 ||
        ''}`;
      secondary = `${address.city || ''} - ${address.zipcode || ''} ${(
        address.country || ''
      ).toUpperCase()}`;
    }
    return (
      <List>
        <ListItem>
          <PlaceIcon />
          <ListItemText
            className={this.props.classes.listItemText}
            primary={primary}
            secondary={secondary}
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
              {t('member:memberSince') + formatAsDate(member.date_joined)}
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
    const { member, t, classes } = this.props;
    const parsedBalance = parseFloat(member.credit_account_balance);
    if (parsedBalance > 0) {
      color = 'primary';
    }
    if (parsedBalance < 0) {
      color = 'error';
    }

    return (
      <div className={classes.accountBalanceBloc}>
        <div className={classes.accountBalance}>
          <Typography variant="subtitle2" inline>
            {t('payment.creditAccountBalance')}
          </Typography>
          <Typography inline variant="h6" component="span" color={color}>
            {` ${member.credit_account_balance} €`}
          </Typography>
        </div>
        {parsedBalance !== 0 && !!this.props.goToCreditRegularization ? (
          <Button
            color="primary"
            onClick={this.props.goToCreditRegularization}
            variant="outlined"
            className={classes.regularize}
          >
            {parsedBalance < 0
              ? t('member:regularizeBalance')
              : t('member:cashoutBalance')}
          </Button>
        ) : null}
      </div>
    );
  };

  render() {
    const { member, classes } = this.props;
    // ugly FIXME: because loading should never be set to true
    // if member=={}
    if (member.consumer) {
      return (
        <div>
          <Paper>
            <div className={classes.infoContainer}>
              {this.renderAvatarAndName()}
              {this.renderMembershipAndBirthday()}
              {this.renderAddress()}
              {this.renderNotificationSettings()}
            </div>
            {!this.props.hideCreditAccount && this.renderAccount()}
          </Paper>
        </div>
      );
    }
    return null;
  }
}

const styles = (theme) => ({
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
  rowInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  listItemText: {
    marginLeft: theme.spacing(2),
  },
  infoContainer: {
    padding: theme.spacing(2),
  },
  consumerName: {
    marginLeft: theme.spacing(2),
    display: 'flew',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountBalance: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  regularize: {
    marginTop: theme.spacing(1),
  },
  accountBalanceBloc: {
    backgroundColor: '#F8F8F8',
    padding: theme.spacing(2),
    border: '2px solid #E8E8E8',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    width: '100%',
  },
  emailMargin: {
    marginLeft: theme.spacing(9),
  },
  balance: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
});

export default compose(
  withStyles(styles),
  withNamespaces(),
)(MemberSummaryCard);
