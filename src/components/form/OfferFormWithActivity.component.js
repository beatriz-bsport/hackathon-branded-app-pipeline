// @flow
import React, { Component } from 'react';

import { Button, Grid, Typography, List } from '@material-ui/core';
import { withNamespaces } from 'react-i18next';

import type { TFunction } from 'react-i18next';
import OfferForm from './OfferForm.component';
import MetaActivityMinimalSummary from '../activity/MetaActivityMinimalSummary.component';

const STEP_META_ACTIVITY_CHOSER = 0;
const STEP_OFFER_FORM = 1;

type Props = {
  metaActivities: Array<MetaActivity>,
  establishments: Array<Establishment>,
  coaches: Array<Coach>,
  onCancel: () => void,
  processing: boolean,
  onSubmit: (data: [*]) => void,
  t: TFunction,
};

type State = {
  step: number,
  selectedMetaActivity: MetaActivity,
};

export class OfferFormWithActivity extends Component<Props, State> {
  state = { step: STEP_META_ACTIVITY_CHOSER, selectedMetaActivity: null };

  onSelectMetaActivity = (selectedMetaActivity) => {
    this.setState({
      selectedMetaActivity,
      step: STEP_OFFER_FORM,
    });
  };

  onSubmit = (data) => {
    this.props.onSubmit(this.state.selectedMetaActivity.id, data);
  };

  render() {
    const {
      coaches,
      metaActivities,
      onCancel,
      processing,
      establishments,
      t,
    } = this.props;
    const { step, selectedMetaActivity } = this.state;
    if (step === STEP_META_ACTIVITY_CHOSER || selectedMetaActivity === null) {
      return (
        <Grid container direction="column" spacing={24}>
          <Grid item>
            <Typography variant="h3">{t('common.activity')}</Typography>
          </Grid>
          <Grid item>
            <List>
              {metaActivities.map((ma) => (
                <MetaActivityMinimalSummary
                  metaActivity={ma}
                  onClick={() => this.onSelectMetaActivity(ma)}
                />
              ))}
            </List>
          </Grid>
          <Grid item>
            <Grid container item justify="center">
              <Button color="secondary" onClick={onCancel}>
                {t('common.cancel')}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      );
    }
    return (
      <OfferForm
        coaches={coaches}
        establishments={establishments}
        metaActivity={selectedMetaActivity}
        onSubmit={this.onSubmit}
        onCancel={onCancel}
        processing={processing}
      />
    );
  }
}

export default withNamespaces()(OfferFormWithActivity);
