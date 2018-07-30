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

import { ActivityMinimalSummary } from '../components';

const styles = (theme) => ({
  emptyMessage: {
    margin: theme.spacing.unit * 3,
  },
});

function getOffersToday(date, offers) {
  return offers.filter((o) => Moment(o.date_start).isSame(date, 'day'));
}

function filterOffers(offers, metaActivityId, establishmentId) {
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
  date: Object,
  offers: Array,
  onOfferSelected: () => void,
  metaActivityId: Number,
  establishmentId: Number,
};

export class TimeTable extends Component<Props> {
  constructor(props) {
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
    onOfferSelected: () => {},
    metaActivityId: null,
    establishmentId: null,
  };

  componentWillReceiveProps(nextProps) {
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

  renderActivity = (offer) => {
    const { activities, metaActivityId, establishmentId } = this.props;
    const activityF = activities.filter((a) => a.id === offer.activity_id);
    if (activityF.length) {
      const activity = activityF[0];
      return (
        <ActivityMinimalSummary
          showCoach
          date={offer.date_start}
          key={activity.id}
          overrideClickAction={() => {
            this.props.onOfferSelected(offer);
          }}
          additionalInfo={`${offer.nb_validated}/${offer.effectif} (+${
            offer.nb_pending
          })`}
          additionalInfoTypoProps={{
            color:
              offer.nb_validated + offer.nb_pending < offer.effectif
                ? 'error'
                : 'primary',
          }}
          additionalInfoSecondary={`${parseInt(
            offer.nb_validated / offer.effectif * 100,
            10,
          )}%`}
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
      return <CircularProgress />;
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

function mapStateToProps(state) {
  return {
    offers: state.offer.calendar,
    activities: state.activity.all,
    loading: state.activity.loading,
  };
}

export default withStyles(styles)(
  translate()(connect(mapStateToProps)(TimeTable)),
);
