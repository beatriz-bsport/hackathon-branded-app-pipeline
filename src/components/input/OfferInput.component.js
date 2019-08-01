// @flow
import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import { withNamespaces } from 'react-i18next';

import ActivityInput from './ActivityInput.component';
import BaseOfferInput from './BaseOfferInput.component';

import type { Event, Activity } from '../../api/types';

type Props = {
  events: Array<Event>,
  activities: Array<Activity>,
  onChange: (number) => void,
  t: (x: string) => string,
  activityHelperText: ?string,
  offerHelperText: ?string,
};

type State = {
  activityId: ?number,
  offersMatchingActivityId: Array<Offer>,
  offerId: ?number,
};

export class OfferInput extends Component<Props, State> {
  state = {
    activityId: null,
    offerId: null,
    offersMatchingActivityId: [],
  };

  onSelectActivity = (activityId: ?number) => {
    const { events } = this.props;
    this.setState({
      activityId,
      offersMatchingActivityId: events.filter((e) => e.activity === activityId),
    });
  };

  onSelectOffer = (offerId: ?number) => {
    this.setState({ offerId });
    this.props.onChange(offerId);
  };

  render() {
    const { activities, t, activityHelperText, offerHelperText } = this.props;
    const { activityId, offerId, offersMatchingActivityId } = this.state;
    return (
      <Grid container direction="row" spacing={16}>
        <Grid item>
          <ActivityInput
            label={t('common.activity')}
            helperText={activityHelperText}
            value={activityId}
            activities={activities}
            onChange={this.onSelectActivity}
          />
        </Grid>
        <Grid item>
          <BaseOfferInput
            label={t('common.datetime')}
            helperText={offerHelperText}
            value={offerId}
            disabled={!activityId}
            events={offersMatchingActivityId}
            onChange={this.onSelectOffer}
          />
        </Grid>
      </Grid>
    );
  }
}

export default withNamespaces()(OfferInput);
