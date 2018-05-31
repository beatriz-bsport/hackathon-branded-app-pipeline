import React, { Component } from 'react';

import {
  Card,
  Divider,
  Typography,
  Grid,
  Paper,
  withStyles,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import * as d3 from 'd3';
import { translate } from 'react-i18next';
import { Level, Sport, CoachThumbnail } from '../components';

import { humanizeDate } from '../datetime';

const styles = (theme) => ({
  paper: {
    flexGrow: 1,
    padding: theme.spacing.unit * 4,
    color: theme.palette.text.secondary,
  },
  header: {
    flexGrow: 1,
    direction: 'row',
    justify: 'space-between',
    alignItems: 'center',
  },
  innerElement: {
    flexGrow: 1,
    padding: theme.spacing.unit * 4,
  },
  paddedBlock: {
    padding: theme.spacing.unit * 4,
  },
  footer: {
    padding: theme.spacing.unit * 2,
    borderTop: 'solid 1px #EEEEEE',
  },
  location: {
    paddingRight: theme.spacing.unit * 2,
  },
});

type Props = {
  offer: Object,
};

export class OfferCard extends Component<Props> {
  componentDidMount() {
    this.renderBookingBar();
  }

  getHeader = () => {
    const { classes, offer } = this.props;
    const { title, levelId, category, parent_category, date_start } = offer;
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
          <Grid
            container
            direction="column"
            justify="space-between"
            alignItems="flex-end"
            spacing={8}
          >
            <Grid item>
              <Level levelId={levelId} />
            </Grid>
            <Grid item>
              <Typography variant="subheading">
                {humanizeDate(date_start).time}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  getStatsBody = () => {
    const { classes, t } = this.props;
    const { pending_bookings, validated_bookings, effectif } = this.props.offer;
    return (
      <Grid container direction="row" justify="center" alignItems="center">
        <Grid item xs={4} style={{ borderRight: '1px solid #EEEEEE' }}>
          <Grid
            container
            justify="center"
            alignItems="center"
            direction="column"
          >
            <Grid item>
              <Typography variant="display2" color="primary">
                {validated_bookings.length}
              </Typography>
            </Grid>
            <Grid item>
              <Typography> {t('booking.confirmed')}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <Grid
            container
            justify="center"
            alignItems="center"
            direction="column"
            style={{ borderRight: '1px solid #EEEEEE' }}
          >
            <Grid item>
              <Typography
                variant="display2"
                color={pending_bookings.length ? 'error' : 'secondary'}
              >
                {pending_bookings.length}
              </Typography>
            </Grid>
            <Grid item>
              <Typography> {t('booking.waiting')}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <Grid
            container
            justify="center"
            alignItems="center"
            direction="column"
          >
            <Grid item>
              <Typography variant="display2" color="secondary">
                {effectif - validated_bookings.length}
              </Typography>
            </Grid>
            <Grid item>
              <Typography>{t('booking.free')}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  getFooter = () => {
    const { offer, classes } = this.props;
    const { etablissement, coach } = offer;
    return (
      <Grid
        container
        justify="center"
        alignItems="center"
        direction="row"
        className={classes.footer}
      >
        <Grid item xs={4} style={{ borderRight: '1px solid #EEEEEE' }}>
          <CoachThumbnail coach={coach} />
        </Grid>
        <Grid item xs={8}>
          <Grid
            container
            spacing={8}
            justify="center"
            alignItems="flex-end"
            direction="column"
            className={classes.location}
          >
            <Grid item>
              <Typography>{etablissement.title}</Typography>
            </Grid>
            <Grid item>
              <Typography>{etablissement.location.address}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  getCustomer = () => {
    const { t } = this.props;
    return (
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subheading">
            {t('booking.seeCustomers')}
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  };

  renderBookingBar = () => {
    const data = [4, 1, 8];
    const x = d3
      .scaleLinear()
      .domain([0, d3.sum(data)])
      .range([0, 200]);

    d3
      .selectAll('svg')
      .filter('.bla')
      .data(data)
      .enter()
      .append('rect')
      .style('fill', '#76545A')
      .attr('width', function(d) {
        return d * 20;
      })
      .attr('height', 60);
  };

  render() {
    const { classes, offer, t } = this.props;
    if (offer) {
      return (
        <Paper>
          <Grid container direction="column" className={classes.root}>
            <Grid item>{this.getHeader()}</Grid>
            <Grid item>{this.getStatsBody()}</Grid>
            <Grid item>{this.getFooter()}</Grid>
            <Grid item>{this.getCustomer()}</Grid>
          </Grid>
        </Paper>
      );
    }
    return null;
  }
}

export default withStyles(styles)(translate()(OfferCard));

/*
        <Grid item container xs={12}>
          <Paper className={classes.innerElement}>
            <Grid container className={classes.header}>
              <Grid item>
                <Typography variant="title" color="secondary">
                  {offer.title}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="subheading" color="secondary">
                  {offer.category}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Grid container direction="row" spacing={0}>
            <Grid item xs={6}>
              <Paper className={classes.innerElement}>
                <Typography>
                  {t(humanizedDate.weekDay)} {humanizedDate.day}{' '}
                  {t(humanizedDate.month)} {humanizedDate.time}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper className={classes.innerElement}>
                <Typography>
                  {etablissement ? etablissement.location.address : ''}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
*/
