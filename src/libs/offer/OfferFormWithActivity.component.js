// @flow
import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withTranslation } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';

import type { TFunction } from 'react-i18next';
import OfferForm from './OfferForm.component';
import MetaActivitySelector from '../meta-activity/components/MetaActivitySelectorWithCard.component';

const STEP_META_ACTIVITY_CHOSER = 0;
const STEP_OFFER_FORM = 1;

type Props = {
  metaActivities: Array<MetaActivity>,
  establishments: Array<Establishment>,
  coaches: Array<Coach>,
  onCancel: () => void,
  processing: boolean,
  activitiesLoading: boolean,
  onSubmit: (data: [*]) => void,
  t: TFunction,
  selectedDate: Object,
  classes: Object,
  is_whereby_integration_enabled: boolean,
};

type State = {
  step: number,
  selectedMetaActivity: MetaActivity,
};

export class OfferFormWithActivity extends Component<Props, State> {
  state = { step: STEP_META_ACTIVITY_CHOSER, selectedMetaActivity: null };

  onSelectMetaActivity = () => {
    this.setState({
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
        <div className={this.props.classes.container}>
          <Typography
            variant="h4"
            align="center"
            className={this.props.classes.title}
          >
            {t('common.activity')}
          </Typography>
          {this.props.activitiesLoading ? (
            <LinearProgress />
          ) : (
            <MetaActivitySelector
              metaActivities={metaActivities}
              placeholder={t('metaActivity:search')}
              value={this.state.selectedMetaActivity}
              onChange={(activity) =>
                this.setState({ selectedMetaActivity: activity })
              }
            />
          )}
          <div className={this.props.classes.buttonContainer}>
            <Button color="secondary" onClick={onCancel}>
              {t('common.cancel')}
            </Button>
            <Button
              color="primary"
              variant="outlined"
              onClick={this.onSelectMetaActivity}
            >
              {t('common.confirm')}
            </Button>
          </div>
        </div>
      );
    }
    return (
      <OfferForm
        selectedDate={this.props.selectedDate}
        coaches={coaches}
        establishments={establishments}
        metaActivity={selectedMetaActivity}
        onSubmit={this.onSubmit}
        onCancel={onCancel}
        processing={processing}
        is_whereby_integration_enabled={
          this.props.is_whereby_integration_enabled
        }
      />
    );
  }
}

const styles = (theme) => ({
  container: { minWidth: '550px' },
  title: {
    paddingBottom: theme.spacing(2),
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: theme.spacing(2),
  },
});

export default compose(
  withStyles(styles),
  withTranslation(),
)(OfferFormWithActivity);
