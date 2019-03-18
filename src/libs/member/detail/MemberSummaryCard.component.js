// @flow
import React, { Component } from 'react';

import {
  Grid,
  Typography,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  withStyles,
} from '@material-ui/core';
import EmailIcon from '@material-ui/icons/Email';
import TodayIcon from '@material-ui/icons/Today';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import CallIcon from '@material-ui/icons/Call';
import PlaceIcon from '@material-ui/icons/Place';
import { withNamespaces } from 'react-i18next';
import NotificationActiveIcon from '@material-ui/icons/NotificationsActive';
import NotificationOffIcon from '@material-ui/icons/NotificationsOff';

import type { TFunction } from 'react-i18next';

import { formatAsDate } from '../../../datetime';
import { Avatar } from '../../../components';
import { Moment } from '../../../i18n';
import type { Member } from '../../../api/types';

type Props = {
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
            primary={`
              ${t('member.bornIn')} 
              ${
                member.consumer.birthday
                  ? Moment(member.consumer.birthday).year()
                  : '  NA  '
              }`}
          />
        </ListItem>
        <ListItem>
          <PersonOutlineIcon />
          <ListItemText primary={`N°${member.membership_ID}`} />
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
          />
          <ListItemSecondaryAction>
            {member.accept_sms ? (
              <NotificationActiveIcon />
            ) : (
              <NotificationOffIcon />
            )}
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <EmailIcon />
          <ListItemText primary={member.consumer.email || ' - '} />
          <ListItemSecondaryAction>
            {member.accept_email ? (
              <NotificationActiveIcon />
            ) : (
              <NotificationOffIcon />
            )}
          </ListItemSecondaryAction>
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
            primary={`${address.address_line_1}`}
            secondary={`${address.city} - ${(
              address.country || ''
            ).toUpperCase()}`}
          />
        </ListItem>
      </List>
    );
  };

  renderAvatarAndName = () => {
    const { t, member } = this.props;
    return (
      <Grid container direction="row" spacing={16} alignItems="center">
        <Grid item>
          <Avatar user={member.consumer} variant="mediumNoname" noname />
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
              <Typography>
                {member.consumer.first_name} {member.consumer.last_name}
              </Typography>
            </Grid>
            <Grid item>
              <Typography>
                {t('member.memberSince') + formatAsDate(member.date_joined)}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  render() {
    const { member, classes } = this.props;
    // ugly FIXME: because loading should never be set to true
    // if member=={}
    if (member.consumer) {
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
              <Grid container direction="row" alignItems="center" spacing={16}>
                <Grid item>{this.renderAvatarAndName()}</Grid>
              </Grid>
            </Grid>
            {member.consumer.address ? (
              <Grid item>{this.renderAddress()}</Grid>
            ) : null}
            <Grid item>{this.renderMembershipAndBirthday()}</Grid>
            <Grid item>{this.renderNotificationSettings()}</Grid>
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
});

export default withStyles(styles)(withNamespaces()(MemberSummaryCard));
