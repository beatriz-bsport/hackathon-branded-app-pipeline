// @flow
import React, { Component } from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import EmailIcon from '@material-ui/icons/Email';
import PhoneIcon from '@material-ui/icons/Call';

import { withNamespaces } from 'react-i18next';

import Avatar from '../Avatar.component';
import type { Profile } from '../../api/types';

const styles = (theme) => ({
  paperContainer: {
    padding: theme.spacing.unit * 6,
  },
});

type Props = {
  classes: Object,
  profile: Profile,
};

export class MyProfile extends Component<Props> {
  getContactInfo = () => {
    const { profile } = this.props;
    return (
      <List>
        <ListItem>
          <EmailIcon />
          <ListItemText primary={profile.email || '   - NA -    '} />
        </ListItem>
        <ListItem>
          <PhoneIcon />
          <ListItemText
            primary={
              (profile.phonenumber || { phone_number: '   - NA -     ' })
                .phone_number
            }
          />
        </ListItem>
      </List>
    );
  };

  getAvatarAndName = () => {
    const { profile } = this.props;
    return (
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="center"
        spacing={32}
      >
        <Grid item>
          <Avatar variant="large" noname user={profile} />
        </Grid>

        <Grid item>
          <Grid
            container
            direction="column"
            alignItems="flex-start"
            spacing={16}
          >
            <Grid item>
              <Typography variant="subtitle1">{profile.first_name}</Typography>
            </Grid>
            <Grid item>
              <Typography variant="subtitle1">{profile.last_name}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.paperContainer}>
        <Grid container direction="column" spacing={16}>
          {this.getAvatarAndName()}
          {this.getContactInfo()}
        </Grid>
      </Paper>
    );
  }
}

export default withStyles(styles)(withNamespaces()(MyProfile));
