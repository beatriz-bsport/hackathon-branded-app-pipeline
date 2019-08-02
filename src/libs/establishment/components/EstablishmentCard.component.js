// @flow

import React, { Component } from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import { withNamespaces } from 'react-i18next';
import { Link } from 'react-router-dom';

import SPORTS from '@bsport/common/lib/master-data/sports';
import ActivityMinimalSummary from '../../../components/activity/ActivityMinimalSummary.component';
import type { Activity, Establishment } from '../../../api/types';
import EasyAccessStack from '../../category/components/EasyAccessStack.component';

const DEFAULT_SPORT = 7;

type Props = {
  establishment: Establishment,
  classes: Object,
  onClickUpdate: (*) => void,
  t: (x: string) => string,
};

const styles = (theme) => ({
  noMoreOffersMessage: {
    margin: theme.spacing.unit * 2,
  },
  horizontalBlock: {
    margin: theme.spacing.unit * 2,
  },
  subHorizontalBlock: {
    marginTop: theme.spacing.unit,
  },
  imgStyle: {
    backgroundColor: 'rgba(50,50,50,.5)',
    minHeight: '200px',
    width: '100%',
    objectFit: 'cover',
  },
});

export class EstablishmentCard extends Component<Props> {
  getCover = () => {
    const { classes, establishment } = this.props;
    const { cover } = establishment;
    const sport = SPORTS.filter((s) => DEFAULT_SPORT === s.id)[0];

    if (!cover) {
      // TODO clean this shit
      return (
        <div style={{ position: 'relative' }}>
          <Grid
            container
            alignItems="center"
            justify="center"
            className={classes.imgStyle}
          >
            <Grid item>
              <img style={{ margin: 'auto' }} src={sport.icon} alt="sport" />
            </Grid>
          </Grid>
        </div>
      );
    }
    return (
      <div style={{ position: 'relative' }}>
        <img
          className={classes.imgStyle}
          src={cover}
          alt="establishment-cover"
        />
      </div>
    );
  };

  render() {
    const { classes, t, establishment, onClickUpdate } = this.props;
    const { title, specific_info, location, easy_access } = establishment;
    return (
      <Paper className={classes.container}>
        {this.getCover()}
        <div className={classes.horizontalBlock}>
          <Grid
            container
            direction="row"
            alignItems="center"
            justify="space-between"
          >
            <Grid item>
              <Typography variant="h6">{title}</Typography>
            </Grid>
            <Grid item>
              <Button onClick={onClickUpdate}>
                {t('establishment.card.update')}
              </Button>
            </Grid>
          </Grid>
          <EasyAccessStack
            name={easy_access.name}
            lines={easy_access.lines}
            size="xs"
          />
          <Typography variant="caption" className={classes.subHorizontalBlock}>
            {location.address}
          </Typography>
        </div>
        {specific_info ? (
          <div className={classes.horizontalBlock}>
            <Typography variant="body2">{specific_info}</Typography>
          </div>
        ) : null}
        <Divider />
      </Paper>
    );
  }
}

export default withStyles(styles)(withNamespaces()(EstablishmentCard));
