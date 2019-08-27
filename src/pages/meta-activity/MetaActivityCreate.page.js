// @flow

import { withNamespaces } from 'react-i18next';

import { push } from 'connected-react-router';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withProps, compose, withState } from 'recompose';
import Grid from '@material-ui/core/Grid';

import type { TFunction } from 'react-i18next';
import Stepper from '@material-ui/core/Stepper';
import Paper from '@material-ui/core/Paper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import { offer as offerActions } from '../../actions';
import { mapFormData } from '../form.utils';
import { upsert } from '../../libs/meta-activity/actions/meta-activity.actions';
import { associatedCoachSelector } from '../../libs/associated-coach/selectors';
import { createOffers as createOffersAPI } from '../../libs/meta-activity/api/meta-activity';

import withDrawer from '../../hocs/with-drawer.hoc';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import MetaActivityForm from '../../libs/meta-activity/components/MetaActivityForm.component';
import OfferForm from '../../libs/offer/OfferForm.component';
import {
  getEnabledMetaActivities,
  getEnabledWorkshops,
} from '../../libs/meta-activity/selectors';
import { fetchEstablishments } from '../../libs/establishment/actions';
import { getAllEstablishments } from '../../libs/establishment/selectors';
import type { Establishment } from '../../libs/establishment/types';

type StepType = {
  id: number,
  label: string,
};

const STEP_ACTIVITY: StepType = { id: 0, label: 'activity_form' };
const STEP_OFFER: StepType = { id: 1, label: 'offer_form' };
const STEPS: Array<StepType> = [STEP_ACTIVITY, STEP_OFFER];
type Props = {
  loading: ?boolean,

  establishments: Array<Establishment>,
  fetchEstablishments: () => void,
  SCTs: *[],

  onSubmitMetaActivity: (*) => void,
  coaches: Array<Coach>,

  step: StepType,
  upsertedMetaActivity: ?MetaActivity,

  offerHadError: ?Error,
  createOffers: (*) => void,
  offerIsProcessing: boolean,
  goToMetaActivity: (id: number) => void,
  t: TFunction,
};

const MetaActivityMap = {
  cover_main: 'cover_main',
  description: 'description',
  name: 'name',
  last_booking_minutes: 'last_booking_minutes',
  last_discard_minutes: 'last_discard_minutes',
  is_workshop: 'is_workshop',
  category: 'category',
};

const StepperForm = withNamespaces(['metaActivity'])(
  (props: { t: TFunction, activeStep: { id: number, label: string } }) => (
    <Stepper activeStep={props.activeStep.id} alternativeLabel>
      {STEPS.map((step) => (
        <Step key={step.id}>
          <StepLabel>{props.t(`forms.create.steps.${step.label}`)}</StepLabel>
        </Step>
      ))}
    </Stepper>
  ),
);

export class MetaActivityFormPage extends Component<Props> {
  componentDidMount() {
    this.props.fetchEstablishments();
  }

  renderActivityStep = () => (
    <MetaActivityForm
      coaches={this.props.coaches}
      establishments={this.props.establishments}
      SCTs={this.props.SCTs}
      onSubmit={this.props.onSubmitMetaActivity}
      metaActivityNames={[]}
      initial={{ images: [] }}
    />
  );

  renderOfferStep = () => (
    <OfferForm
      onSubmit={this.props.createOffers}
      metaActivity={this.props.upsertedMetaActivity}
      coaches={this.props.coaches}
      establishments={this.props.establishments}
      error={this.props.offerHadError}
      processing={this.props.offerIsProcessing}
      discardButtonText={this.props.t('common.skip')}
      onCancel={() =>
        this.props.goToMetaActivity(this.props.upsertedMetaActivity.id)
      }
    />
  );

  render() {
    if (this.props.loading) {
      return <LinearProgress />;
    }

    let content = null;
    switch (this.props.step.id) {
      case STEP_ACTIVITY.id:
        content = this.renderActivityStep();
        break;
      case STEP_OFFER.id:
        content = this.renderOfferStep();
        break;
      default:
        break;
    }
    return (
      <Grid container justify="center" alignItems="center">
        <Grid item md={12} lg={9}>
          <Paper>
            <StepperForm activeStep={this.props.step} />
            {content}
            <StepperForm activeStep={this.props.step} />
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default compose(
  withNamespaces([]),
  routerParamsToProps({ id: 'id:number' }),
  withState('step', 'setStep', STEP_ACTIVITY),
  connect(
    (state) => ({
      establishments: getAllEstablishments(state),
      SCTs: state.category.SCTs,
      loading: state.metaActivity.loading,
      metaActivityNames: [
        ...getEnabledMetaActivities(state),
        ...getEnabledWorkshops(state),
      ].map((ma) => ma.name),
      coaches: associatedCoachSelector.getActive(state),
      upsertedMetaActivity: state.metaActivity.upsert.data,
    }),
    {
      fetchEstablishments,
      upsertMetaActivity: upsert,
      goToMetaActivity: (id: number) => push(`/activity/${id}`),
      fetchAllOffers: offerActions.fetchAllOffers,
    },
  ),
  //
  withProps(({ upsertMetaActivity, setStep }) => ({
    onSubmitMetaActivity: (values, options) => {
      const formData = mapFormData(values, MetaActivityMap);
      formData.append('is_workshop', false);
      upsertMetaActivity(formData, {
        ...options,
        onSuccess: () => {
          if (options.onSuccess) options.onSuccess();
          setStep(STEP_OFFER);
          window.scrollTo(0, 0);
        },
      });
    },
  })),
  withState('offerIsProcessing', 'setOfferIsProcessing', false),
  withState('offerHadError', 'setOfferHadError', null),
  withProps(
    ({
      upsertedMetaActivity,
      fetchAllOffers,
      goToMetaActivity,
      setOfferIsProcessing,
      setOfferHadError,
    }) => ({
      createOffers: async (data: *) => {
        setOfferIsProcessing(true);
        setOfferHadError(null);
        createOffersAPI(upsertedMetaActivity.id, data)
          .then(() => {
            fetchAllOffers();
            goToMetaActivity(upsertedMetaActivity.id);
          })
          .catch((err) => {
            console.error(err);
            setOfferIsProcessing(false);
            setOfferHadError(err);
          });
      },
    }),
  ),
  withDrawer(({ t }: { t: TFunction }) =>
    t('appbar.title.metaActivityFormPage'),
  ),
)(MetaActivityFormPage);
