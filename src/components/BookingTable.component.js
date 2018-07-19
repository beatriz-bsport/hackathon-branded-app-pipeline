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

import { colors } from 'bsport-commons/lib/colors';

import { ActionButton } from '../components';

type Props = {
  pendingBookings: Array<Object>,
  validatedBookings: Array<Object>,
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
    loading: true,
    pendingBookings: [],
    validatedBookings: [],
  };

  handleClick = (event, booking) => {
    const { status, id } = booking;

    // not selectable if booking already validated
    if (status) {
      return;
    }
  };

  render() {
    const { t, classes } = this.props;
    const { validatedBookings, pendingBookings } = this.props;
    const all_bookings = [...pendingBookings, ...validatedBookings];
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

export default withStyles(styles)(translate()(BookingTable));

function contains(array, element) {
  return array.findIndex((i) => i === element) >= 0;
}
