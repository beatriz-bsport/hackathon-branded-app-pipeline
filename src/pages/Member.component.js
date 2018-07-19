import React, { Component } from 'react';

import {
  Grid,
  Typography,
  Paper,
  withStyles,
  IconButton,
  ExpandMore,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Button,
} from '@material-ui/core';
import EmailIcon from '@material-ui/icons/Email';
import CallIcon from '@material-ui/icons/Call';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';

import { CoachThumbnail, CustomerBookingTable } from '../components';

const styles = (theme) => ({
  backButton: {
    marginBottom: theme.spacing.unit,
  },
  paperContainer: {
    padding: theme.spacing.unit * 2,
    width: '100%',
  },
});

export class Member extends Component<{}> {
  getFirstRow = (data) => {
    const { t } = this.props;
    return (
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={24}
      >
        <Grid item>
          <Grid container direction="row" alignItems="center" spacing={16}>
            <Grid item>
              <CoachThumbnail coach={data} variant="mediumNoname" />
            </Grid>
            <Grid item>
              <Grid
                container
                direction="column"
                alignItems="flex-start"
                justifyContent="space-around"
                spacing={8}
              >
                <Grid item>
                  <Typography>{data.name}</Typography>
                </Grid>
                <Grid item>
                  <Typography>
                    {t('member.memberSince') + data.date_joined}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container direction="column" spacing={8}>
            <Grid item>
              <IconButton>
                <CallIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton>
                <EmailIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  getFutureBookings = (data) => {
    const { t } = this.props;
    return (
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{t('booking.seeCustomers')}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <CustomerBookingTable future offerId={1} />
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  };
  render() {
    const { t, classes } = this.props;
    const data = {
      name: 'Jean Jacques',
      date_joined: Date.now(),
      phone: '56789',
      email: 'fghjk@hj.fr',
    };

    return (
      <div>
        <Link to="/member" style={{ textDecoration: 'none' }}>
          <Button size="large" color="primary" className={classes.backButton}>
            {t('navigation.goBack')}
          </Button>
        </Link>
        <Paper className={classes.paperContainer}>
          {this.getFirstRow(data)}
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(translate()(Member));
