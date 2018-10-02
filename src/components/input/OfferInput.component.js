// @flow
import React, { Component } from 'react';

import { Grid } from '@material-ui/core';
import { translate } from 'react-i18next';

import ActivityInput from './ActivityInput.component';
import BaseOfferInput from './BaseOfferInput.component';

import type { Offer, Activity } from '../../api/types';
import type { Event } from '../../types';

type Props = {
  offers: Array<Offer>,
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
    const { offers } = this.props;
    this.setState({
      activityId,
      offersMatchingActivityId: offers.filter(
        (o) => o.activity_id === activityId,
      ),
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
            offers={offersMatchingActivityId}
            onChange={this.onSelectOffer}
          />
        </Grid>
      </Grid>
    );
  }
}

export default translate()(OfferInput);
