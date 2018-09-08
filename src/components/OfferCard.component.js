// @flow

import React, { Component } from 'react';

import {
  Typography,
  Grid,
  Paper,
  withStyles,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
} from '@material-ui/core';
import { LocationOn, AccessTime } from '@material-ui/icons';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { translate } from 'react-i18next';
import Level from './Level.component';
import Sport from './Sport.component';
import Avatar from './Avatar.component';
import BookingTable from './booking/BookingTable.component';

import { formatAsTime } from '../datetime';
import type { Offer } from '../api/types';

type Props = {
  t: (x: string) => string,
  classes: Object,
  offer: Offer,
  bookingLoading: boolean,
  noHeader: ?boolean,
  validatedBookings: Array<Object>,
  pendingBookings: Array<Object>,
  bookingOptions: Array<Object>,
  discardOption: (id: number) => void,
  bookingUpdaters: {
    discardBooking: (id: number) => void,
    discardBookingAttendance: (id: number) => void,
    confirmBooking: (id: number) => void,
    confirmBookingAttendance: (id: number) => void,
  },
};

export class OfferCard extends Component<Props> {
  getHeader = () => {
    const { classes, offer } = this.props;
    const { title, level_id, category, parent_category, date_start } = offer;
    return (
      <Grid container direction="row">
        <Grid item xs={8} className={classes.paddedBlock}>
          <Grid container spacing={8} direction="column">
            <Grid item>
              <Typography variant="title">{title}</Typography>
            </Grid>
            <Grid item>
              <Sport category={category} parentCategory={parent_category} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4} className={classes.paddedBlock}>
          <Level levelId={level_id} />
        </Grid>
      </Grid>
    );
  };

  getStatsBody = () => {
    const { classes, t } = this.props;
    const { nb_pending, nb_validated, nb_option, effectif } = this.props.offer;
    return (
      <Grid container direction="row" justify="center" alignItems="center">
        <Grid item xs={4} style={{ borderRight: '1px solid #EEEEEE' }}>
          <Grid
            container
            justify="center"
            alignItems="center"
            direction="column"
            spacing={8}
            className={classes.stat}
          >
            <Grid item>
              <Typography variant="display2" color="primary">
                {nb_validated}
              </Typography>
            </Grid>
            <Grid item>
              <Typography> {t('booking.confirmed')}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4} style={{ borderRight: '1px solid #EEEEEE' }}>
          <Grid
            container
            justify="center"
            alignItems="center"
            direction="column"
            spacing={8}
            className={classes.stat}
          >
            <Grid item>
              <Typography variant="display2" color="secondary">
                {parseInt((nb_validated / effectif) * 100, 10)} %
              </Typography>
            </Grid>
            <Grid item>
              <Typography>{t('booking.fillRate')}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <Grid
            container
            justify="center"
            alignItems="center"
            direction="column"
            spacing={8}
            className={classes.stat}
          >
            <Grid item>
              <Typography
                variant="display2"
                color={nb_pending + nb_option ? 'error' : 'secondary'}
              >
                {nb_pending + nb_option}
              </Typography>
            </Grid>
            <Grid item>
              <Typography> {t('booking.waiting')}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  getFooter = () => {
    const { offer, classes } = this.props;
    const { etablissement, date_start, coach } = offer;
    return (
      <Grid
        container
        justify="center"
        alignItems="center"
        direction="row"
        className={classes.footer}
      >
        <Grid
          item
          xs={4}
          style={{ borderRight: '1px solid #EEEEEE' }}
          className={classes.stat}
        >
          <Avatar user={coach} />
        </Grid>
        <Grid item xs={8} className={classes.stat}>
          <Grid
            container
            spacing={8}
            justify="center"
            alignItems="flex-start"
            direction="column"
            className={classes.info}
          >
            <Grid item>
              <Grid container direction="column" spacing={8}>
                <Grid item>
                  <Grid
                    container
                    spacing={16}
                    direction="row"
                    alignItems="center"
                  >
                    <Grid item>
                      <AccessTime />
                    </Grid>
                    <Grid item>
                      <Typography variant="subheading">
                        {formatAsTime(date_start)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid
                    container
                    spacing={16}
                    direction="row"
                    alignItems="center"
                  >
                    <Grid item>
                      <LocationOn />
                    </Grid>
                    <Grid item>
                      <Grid container direction="column">
                        <Grid item>
                          <Typography>{etablissement.title}</Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="caption">
                            {etablissement.location.address}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  getCustomer = () => {
    const {
      t,
      pendingBookings,
      validatedBookings,
      bookingOptions,
      bookingLoading,
      discardOption,
      bookingUpdaters,
    } = this.props;

    return (
      <Grid container>
        <Grid item xs={12}>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{t('booking.seeCustomers')}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <BookingTable
                loading={bookingLoading}
                validatedBookings={validatedBookings}
                pendingBookings={pendingBookings}
                bookingOptions={bookingOptions}
                discardOption={discardOption}
                bookingUpdaters={bookingUpdaters}
              />
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Grid>
      </Grid>
    );
  };

  render() {
    const { noHeader, offer } = this.props;
    if (offer) {
      return (
        <Grid container direction="column">
          <Grid item>
            <Paper square>
              <Grid container direction="column">
                {noHeader ? null : <Grid item>{this.getHeader()}</Grid>}
                <Grid item>{this.getStatsBody()}</Grid>
                <Grid item>{this.getFooter()}</Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            {this.getCustomer()}
          </Grid>
        </Grid>
      );
    }
    return null;
  }
}

const styles = (theme) => ({
  paddedBlock: {
    padding: theme.spacing.unit * 4,
  },
  footer: {
    borderTop: 'solid 1px #EEEEEE',
  },
  stat: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  info: {
    paddingLeft: theme.spacing.unit * 3,
  },
});

export default withStyles(styles)(translate()(OfferCard));
