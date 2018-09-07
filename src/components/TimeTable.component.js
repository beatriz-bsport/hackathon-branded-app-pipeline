// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  CircularProgress,
  List,
  Grid,
  Typography,
  withStyles,
} from '@material-ui/core';
import { translate } from 'react-i18next';
import { Moment } from '../i18n';
import { formatAsTime } from '../datetime';
import { Offer } from '../api/types';

import ActivityMinimalSummary from './activity/ActivityMinimalSummary.component';

function getOffersToday(date: Object, offers: Array<Offer>): Array<Offer> {
  return offers.filter((o) => Moment(o.date_start).isSame(date, 'day'));
}

function filterOffers(
  offers: Array<Offer>,
  metaActivityId: ?number,
  establishmentId: ?number,
): Array<Offer> {
  let offersFiltered = offers;

  if (metaActivityId) {
    offersFiltered = offersFiltered.filter(
      (o) => parseInt(o.meta_activity_id, 10) === parseInt(metaActivityId, 10),
    );
  }
  if (establishmentId) {
    offersFiltered = offersFiltered.filter(
      (o) => parseInt(o.etablissement.id, 10) === parseInt(establishmentId, 10),
    );
  }
  return offersFiltered;
}

type Props = {
  loading: boolean,
  activities: Array<Object>,
  date: Object,
  offers: Array<Offer>,
  onOfferSelected: (offer: Offer) => void,
  metaActivityId: ?number,
  establishmentId: number,
  classes: Object,
  t: (x: string) => string,
};

type State = {
  offersToday: Array<Offer>,
};

export class TimeTable extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const offersTodayUnfiltered = getOffersToday(props.date, props.offers);
    const offersToday = filterOffers(
      offersTodayUnfiltered,
      props.metaActivityId,
      props.establishmentId,
    );

    this.state = {
      offersToday,
    };
  }

  static defaultProps = {
    date: Moment().startOf('day'),
  };

  componentWillReceiveProps(nextProps: Props) {
    const offersToday = filterOffers(
      getOffersToday(
        nextProps.date || this.props.date,
        nextProps.offers || this.props.offers,
      ),
      nextProps.metaActivityId,
      nextProps.establishmentId,
    );

    this.setState({
      offersToday,
    });
  }

  renderActivity = (offer: Offer) => {
    const { activities } = this.props;
    const activityF = activities.filter((a) => a.id === offer.activity_id);
    if (activityF.length) {
      const activity = activityF[0];
      const fillingInfo = `${offer.nb_validated}/${
        offer.effectif
      } (+${offer.nb_pending + offer.nb_option})`;
      const fillingInfoProps = {
        color: offer.nb_validated < offer.effectif ? 'error' : 'primary',
      };
      const formattedFillingRate = `${parseInt(
        (offer.nb_validated / offer.effectif) * 100,
        10,
      )}%`;
      return (
        <ActivityMinimalSummary
          showCoach
          date={formatAsTime(offer.date_start)}
          key={activity.id}
          overrideClickAction={() => {
            this.props.onOfferSelected(offer);
          }}
          additionalInfo={fillingInfo}
          additionalInfoTypoProps={fillingInfoProps}
          additionalInfoSecondary={formattedFillingRate}
          activity={activity}
        />
      );
    }
    return null;
  };

  render() {
    const { offersToday } = this.state;
    const { loading, t, classes } = this.props;
    if (loading) {
      return (
        <Grid
          container
          direction="column"
          spacing={16}
          className={classes.loadingContainer}
          alignItems="center"
          justify="center"
        >
          <Grid item>
            <CircularProgress />
          </Grid>
        </Grid>
      );
    }
    return offersToday.length ? (
      <List>{offersToday.map((o) => this.renderActivity(o))}</List>
    ) : (
      <div className={classes.emptyMessage}>
        <Typography variant="caption">
          {t('activity.noOfferThisDay')}
        </Typography>
      </div>
    );
  }
}

const styles = (theme) => ({
  emptyMessage: {
    margin: theme.spacing.unit * 3,
  },
  loadingContainer: {
    marginLeft: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 2,
  },
});

export default withStyles(styles)(translate()(TimeTable));
