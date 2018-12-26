// @flow
import React from 'react';

import {
  Grid,
  Typography,
  Button,
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
import EditIcon from '@material-ui/icons/Edit';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import { translate } from 'react-i18next';
import NotificationActiveIcon from '@material-ui/icons/NotificationsActive';
import NotificationOffIcon from '@material-ui/icons/NotificationsOff';

import type { TFunction } from 'react-i18next';

import { Avatar } from '../../../components';
import { Moment } from '../../../i18n';
import { Member } from '../../../api/types';

type Props = {
  member: Member,
  billMember: () => void,
  editMember: () => void,
  t: TFunction,
  classes: Object,
};
export function MemberSummaryCard(props: Props) {
  const { t, member, classes, billMember, editMember } = props;
  const { consumer } = member;
  // ugly FIXME: because loading should never be set to true
  // if member=={}
  if (consumer) {
    return (
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
                <Grid item>
                  <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    spacing={16}
                  >
                    <Grid item>
                      <Button onClick={billMember}>
                        <AttachMoneyIcon
                          className={classes.leftIcon}
                          color="primary"
                        />
                        {t('payment.toBill')}
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button onClick={editMember}>
                        <EditIcon
                          className={classes.leftIcon}
                          color="primary"
                        />
                        {t('common.edit')}
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
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
    );
  }
  return null;
}

const styles = (theme) => ({
  firstRow: {
    padding: theme.spacing.unit * 2,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
});

export default withStyles(styles)(translate()(MemberSummaryCard));
