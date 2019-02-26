// @flow
import React from 'react';

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

import { Avatar } from '../../../components';
import { Moment } from '../../../i18n';
import type { Member } from '../../../api/types';

type Props = {
  member: Member,
  t: TFunction,
  classes: Object,
};
export function MemberSummaryCard(props: Props) {
  const { t, member, classes } = props;
  const { consumer } = member;
  const { address } = consumer;
  // ugly FIXME: because loading should never be set to true
  // if member=={}
  if (consumer) {
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
              <Grid item>
                <Grid container direction="column" spacing={24}>
                  <Grid
                    container
                    direction="row"
                    spacing={16}
                    alignItems="center"
                  >
                    <Grid item>
                      <Avatar user={consumer} variant="mediumNoname" noname />
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
                            {consumer.first_name} {consumer.last_name}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography>
                            {t('member.memberSince') + member.date_joined}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          {address ? (
            <Grid item>
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
            </Grid>
          ) : null}
          <Grid item>
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
          </Grid>
          <Grid item>
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
          </Grid>
        </Grid>
      </div>
    );
  }
  return null;
}

const styles = (theme) => ({
  firstRow: {
    padding: theme.spacing.unit * 2,
  },
});

export default withStyles(styles)(withNamespaces()(MemberSummaryCard));
