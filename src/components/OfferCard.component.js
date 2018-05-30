import React, { Component } from 'react';

import {
  Card,
  Divider,
  Typography,
  Grid,
  Paper,
  withStyles,
} from '@material-ui/core';
import * as d3 from 'd3';
import { translate } from 'react-i18next';

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
});

type Props = {
  offer: Object,
};

export class OfferCard extends Component<Props> {
  componentDidMount() {
    this.renderBookingBar();
  }

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
    const { etablissement } = offer;
    return (
      <Grid
        container
        flexGrow={1}
        direction="column"
        className={classes.container}
      >
        <Grid item container xs={12}>
          <Paper className={classes.innerElement}>
            <Grid container className={classes.header}>
              <Grid item>
                <Typography
                  style={{ 'border-color': 'red', 'border-width': 2 }}
                  variant="title"
                  color="secondary"
                >
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
                  {t(humanizeDate(offer.date_start).datetime)}
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
      </Grid>
    );
  }
}

export default withStyles(styles)(translate()(OfferCard));
