import React, { Component } from 'react';

import {
  List,
  ListItem,
  ListItemText,
  Grid,
  Typography,
  Paper,
  withStyles,
} from '@material-ui/core';
import EmailIcon from '@material-ui/icons/Email';
import PhoneIcon from '@material-ui/icons/Call';

import { translate } from 'react-i18next';

import { Avatar } from '../../components';

const styles = (theme) => ({
  paperContainer: {
    padding: theme.spacing.unit * 6,
  },
});

type Props = {};

export class MyProfile extends Component<Props> {
  static defaultProps = {
    profile: {
      photo: null,
      firstname: 'Rayane',
      lastname: 'Mange du caca',
      phone: '+33 6 99 23 18 11',
      email: 'lol@mdr.com',
    },
  };

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
          <ListItemText primary={profile.phone || '   - NA -     '} />
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
              <Typography variant="subheading">{profile.firstname}</Typography>
            </Grid>
            <Grid item>
              <Typography variant="subheading">{profile.lastname}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  render() {
    const { classes } = this.props;
    return (
      <Grid container direction="column" spacing={16}>
        <Grid item xs={12} lg={6}>
          <Paper className={classes.paperContainer}>
            <Grid container direction="column" spacing={16}>
              {this.getAvatarAndName()}
              {this.getContactInfo()}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(translate()(MyProfile));
