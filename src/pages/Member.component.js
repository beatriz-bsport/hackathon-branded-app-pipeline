import React, { Component } from 'react';

import {
  Grid,
  Typography,
  Paper,
  withStyles,
  IconButton,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import EmailIcon from '@material-ui/icons/Email';
import CallIcon from '@material-ui/icons/Call';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { member as memberActions } from '../actions';

import { MemberBookingGraph, Avatar, BookingTable } from '../components';

const styles = (theme) => ({
  backButton: {
    marginBottom: theme.spacing.unit,
  },
  paperContainer: {
    padding: theme.spacing.unit * 2,
  },
  root: {},
  firstRow: {
    padding: theme.spacing.unit * 2,
  },
  headingExpansionPanel: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeadingExpansionPanel: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
});

export class Member extends Component<{}> {
  componentWillMount() {
    this.props.fetchMember(this.props.match.params.id);
  }

  getFirstRow = () => {
    const { t, member, classes } = this.props;
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
          <Grid item>
            <List>
              <ListItem>
                <IconButton>
                  <CallIcon />
                </IconButton>
                <ListItemText
                  primary={member.consumer.phonenumber.phone_number}
                />
              </ListItem>
              <ListItem>
                <IconButton>
                  <EmailIcon />
                </IconButton>
                <ListItemText primary={member.consumer.email || ' - '} />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      );
    }
    return null;
  };

  getFutureBookings = () => {
    const { t, member, classes } = this.props;
    const { next_bookings } = member;
    if (next_bookings) {
      const validatedBookings = next_bookings.filter((b) => b.status === true);
      const pendingBookings = next_bookings.filter((b) => b.status !== true);
      const nextBookingDate = next_bookings.length
        ? `${next_bookings[0].date_start}`
        : t('common.nothing');
      return (
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.headingExpansionPanel}>
              {t('member.showNextBooking')}
            </Typography>
            <Typography className={classes.secondaryHeadingExpansionPanel}>
              {nextBookingDate}
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <BookingTable
              heading="date_start"
              validatedBookings={validatedBookings}
              pendingBookings={pendingBookings}
            />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      );
    }
    return null;
  };

  getPastBookings = () => {
    const { t, member, classes } = this.props;
    const { previous_bookings } = member;
    if (previous_bookings) {
      const validatedBookings = previous_bookings.filter(
        (b) => b.status === true,
      );
      const pendingBookings = previous_bookings.filter(
        (b) => b.status !== true,
      );
      const previousBookingDate = previous_bookings.length
        ? `${previous_bookings[0].date_start}`
        : t('common.nothing');
      return (
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.headingExpansionPanel}>
              {t('member.showPreviousBooking')}
            </Typography>
            <Typography className={classes.secondaryHeadingExpansionPanel}>
              {previousBookingDate}
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <BookingTable
              heading="date_start"
              validatedBookings={validatedBookings}
              pendingBookings={pendingBookings}
            />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      );
    }
    return null;
  };

  getBookingsGraph = () => (
    <MemberBookingGraph
      bookings={this.props.member.previous_bookings}
      graphId="memberBookingsGraph"
    />
  );

  render() {
    const { loading, t, classes } = this.props;
    return (
      <div>
        <div>
          <Link to="/member" style={{ textDecoration: 'none' }}>
            <Button size="large" color="primary" className={classes.backButton}>
              {t('navigation.goBack')}
            </Button>
          </Link>
        </div>
        <div>
          {loading ? (
            <CircularProgress />
          ) : this.props.member.consumer ? (
            <div>
              <Paper className={classes.paperContainer}>
                {this.getFirstRow()}
              </Paper>
              {this.getFutureBookings()}
              {this.getPastBookings()}
              <Paper className={classes.paperContainer}>
                {this.getBookingsGraph()}
              </Paper>
            </div>
          ) : (
            <CircularProgress />
          )}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.member.loading,
    member: state.member.member,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    fetchMember(memberId) {
      dispatch(memberActions.fetchMember(memberId));
    },
  };
}

export default withStyles(styles)(
  translate()(connect(mapStateToProps, mapDispatchToProps)(Member)),
);
