import React, { Component } from 'react';
import {
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Button,
  Grid,
  withStyles,
  Checkbox,
  Typography,
} from '@material-ui/core';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';

import { colors } from 'bsport-commons/lib/colors';

import { booking as bookingActions } from '../actions';
import { ActionButton } from '../components';

type Props = {
  offerId: Number,
  pending_bookings: Array<Object>,
  validated_bookings: Array<Object>,
};

const styles = (theme) => ({
  root: {
    width: '100%',
  },
  table: {
    overflowX: 'auto',
  },
});

function getStatusStyle(status) {
  if (status) {
    return { color: colors.primary };
  }
  return { color: colors.orange };
}
export class BookingTable extends Component<Props> {
  static defaultProps = {
    pending_bookings: [],
    validated_bookings: [],
  };
  constructor(props) {
    super(props);
    this.state = {
      offer: { id: 0 }, //cf getDerivedStateFromProps
      selected: props.validated_bookings.map((b) => b.id),
    };
  }

  componentDidMount() {
    this.props.fetchBookings(this.props.offerId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.offerId !== this.props.offerId) {
      this.props.fetchBookings(nextProps.offerId);
    }
  }

  handleClick = (event, booking) => {
    const { status, id } = booking;

    // not selectable if booking already validated
    if (status) {
      return;
    }
  };

  render() {
    const { t, offer, classes } = this.props;
    const { validated_bookings, pending_bookings } = this.props;
    const all_bookings = [...pending_bookings, ...validated_bookings];
    return (
      <Grid container spacing={16} className={classes.root}>
        <Grid item>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>{t('common.name')}</TableCell>
                <TableCell>{t('booking.source')}</TableCell>
                <TableCell numeric>{t('booking.nb_booking')}</TableCell>
                <TableCell>{t('common.status')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {all_bookings.map((b) => {
                return (
                  <TableRow
                    key={b.id}
                    hover
                    onClick={(event) => this.handleClick(event, b)}
                    role="checkbox"
                  >
                    <TableCell component="th" scope="row">
                      {b.user.name}
                    </TableCell>
                    <TableCell>{t(`booking.sources.${b.source}`)}</TableCell>
                    <TableCell numeric>{b.nb_booking}</TableCell>
                    <TableCell style={getStatusStyle(b.status)}>
                      {t(`booking.status.${b.status}`)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchBookings(offerId) {
      dispatch(bookingActions.fetchBookingsByOffer(offerId));
    },
  };
}

function mapStateToProps(state) {
  return {
    loading: state.booking.loading,
    validated_bookings: state.booking.validated,
    pending_bookings: state.booking.pending,
  };
}

export default withStyles(styles)(
  translate()(connect(mapStateToProps, mapDispatchToProps)(BookingTable)),
);

function contains(array, element) {
  return array.findIndex((i) => i === element) >= 0;
}
