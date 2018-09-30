// @flow
import React, { Component } from 'react';

import {
  List,
  ListItem,
  ListItemText,
  Divider,
  Grid,
  IconButton,
  Typography,
  CircularProgress,
  withStyles,
} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import { translate } from 'react-i18next';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import { formatAsDate } from '../../datetime';

import type { PerformanceCalculationRule } from '../form/types';
import type { Performance, Coach } from '../../api/types';

type Props = {
  rule: PerformanceCalculationRule,
  performance: Performance,
  loading: boolean,
  coach: ?Coach,
  t: (x: string) => string,
  classes: Object,
};

export class CoachPerformanceSummary extends Component<Props> {
  calculatePerformance = () => {
    const { rule, performance } = this.props;
    if (!rule) {
      return { moneyDue: ' - ', nbBookingsTotal: ' - ', nbOffersTotal: ' - ' };
    }
    const {
      includeBonusOnOversizing,
      bookingThreshold,
      pricePerAdditionalBooking,
    } = rule;

    let moneyDue = 0;
    let nbBookingsTotal = 0;
    let nbOffersTotal = 0;
    let nbBookingsOverThreshold = 0;

    for (const offerSummary of performance) {
      const { nb_bookings } = offerSummary;
      if (nb_bookings) {
        nbOffersTotal += 1;
        nbBookingsTotal += nb_bookings;
        moneyDue += rule.pricePerOffer;
        if (includeBonusOnOversizing && pricePerAdditionalBooking) {
          const differentialBookings = nb_bookings - bookingThreshold;
          if (differentialBookings > 0) {
            moneyDue += differentialBookings * pricePerAdditionalBooking;
            nbBookingsOverThreshold += differentialBookings;
          }
        }
      }
    }
    return {
      moneyDue,
      nbBookingsTotal,
      nbBookingsOverThreshold,
      nbOffersTotal,
    };
  };

  printDocument() {
    const input = document.getElementById('divToPrint');
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'JPEG', 0, 0);
      pdf.save('download.pdf');
    });
  }

  /*
  pdfToHTML() {
    const pdf = new jsPDF('p', 'pt', 'letter');
    const source = document.getElementById('divToPrint');
    const specialElementHandlers = {
      '#bypassme': function(element, renderer) {
        return true;
      },
    };

    const margins = {
      top: 50,
      left: 60,
      width: 545,
    };

    pdf.fromHTML(
      source, // HTML string or DOM elem ref.
      margins.left, // x coord
      margins.top, // y coord
      {
        width: margins.width, // max width of content on PDF
        elementHandlers: specialElementHandlers,
      },
      (dispose) => {
        // dispose: object with X, Y of the last line add to the PDF
        // this allow the insertion of new lines after html
        pdf.save('html2pdf.pdf');
      },
    );
  }
  */

  renderMoneyDue = (moneyDue: number | string) => (
    <Grid
      container
      item
      justify="center"
      alignItems="center"
      className={this.props.classes.moneyDueContainer}
    >
      <Typography variant="display2" color="primary">
        {moneyDue}€
      </Typography>
    </Grid>
  );

  renderDetails = ({
    nbBookingsOverThreshold,
    nbBookingsTotal,
    nbOffersTotal,
  }) => {
    const { t, rule } = this.props;
    if (rule) {
      const {
        pricePerOffer,
        pricePerAdditionalBooking,
        includeBonusOnOversizing,
      } = rule;
      return (
        <List>
          <Divider />
          <ListItem>
            <ListItemText primary={t('coach.performance.nbBookings')} />
            <Typography variant="title">{nbBookingsTotal}</Typography>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary={t('coach.performance.nbOffersTotal')}
              secondary={`${t(
                'coach.performance.pricePerOffer',
              )}: ${pricePerOffer}€`}
            />
            <Typography variant="title">
              {`${nbOffersTotal} (${nbOffersTotal * pricePerOffer}€)`}
            </Typography>
          </ListItem>
          <Divider />
          {includeBonusOnOversizing ? (
            <ListItem>
              <ListItemText
                primary={t('coach.performance.nbBookingsOverThreshold')}
                secondary={`${t(
                  'coach.performance.pricePerAdditionalBooking',
                )}: ${pricePerAdditionalBooking}€`}
              />
              <Typography variant="title">
                {`${nbBookingsOverThreshold} (${nbBookingsOverThreshold *
                  pricePerAdditionalBooking}€)`}
              </Typography>
            </ListItem>
          ) : null}
        </List>
      );
    }
  };

  renderHeader = () => {
    const { coach, rule, classes } = this.props;
    if (coach && rule) {
      const { dateStart, dateEnd } = rule;
      return (
        <Grid
          container
          direction="row"
          justify="space-between"
          className={classes.header}
        >
          <Grid item>
            <Grid container direction="column" spacing={8}>
              <Grid item>
                <Typography variant="title">{coach.name}</Typography>
              </Grid>
              <Grid item>
                <Typography variant="subheading">
                  {formatAsDate(dateStart)} - {formatAsDate(dateEnd)}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <IconButton onClick={this.printDocument} color="primary">
              <SaveIcon />
            </IconButton>
          </Grid>
        </Grid>
      );
    }
    return null;
  };

  render() {
    const { loading, classes } = this.props;
    if (loading) {
      return (
        <Grid
          container
          item
          justify="center"
          alignItems="center"
          className={classes.loadingContainer}
        >
          <CircularProgress />
        </Grid>
      );
    }

    const {
      nbBookingsTotal,
      nbOffersTotal,
      moneyDue,
      nbBookingsOverThreshold,
    } = this.calculatePerformance();
    return (
      <div id="divToPrint">
        <Grid container direction="column">
          <Grid item>{this.renderHeader()}</Grid>
          <Grid item>{this.renderMoneyDue(moneyDue)}</Grid>
          <Grid item>
            {this.renderDetails({
              nbOffersTotal,
              nbBookingsTotal,
              nbBookingsOverThreshold,
            })}
          </Grid>
        </Grid>
      </div>
    );
  }
}

const styles = (theme) => ({
  moneyDueContainer: {
    padding: theme.spacing.unit * 5,
  },
  loadingContainer: {
    padding: theme.spacing.unit * 5,
  },
  header: {
    padding: theme.spacing.unit * 3,
  },
});

export default translate()(withStyles(styles)(CoachPerformanceSummary));
