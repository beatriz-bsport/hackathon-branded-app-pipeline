// @flow

import React, { Component } from 'react';

import { compose } from 'recompose';

import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { push } from 'connected-react-router';
import { withTranslation, TFunction } from 'react-i18next';

import { LinearProgress } from '@material-ui/core';
import { SegmentAnalyticsFormObjectIdentifier } from '#src/components/analytics/segment';
import { rudderStackFormTrackingFunctionsRegistry } from '#src/components/analytics/rudderstack/utils';
import mapRouterParamsToProps from '../../hocs/router-params-to-props.hoc';
import {
  createOrUpdateEstablishmentV2,
  addImageToEstablishment,
  removeImageFromEstablishment,
  fetchEstablishments,
} from '../../libs/establishment/actions';
import { getEstablishment } from '../../libs/establishment/selectors';
import EstablishmentForm from '../../libs/establishment/components/EstablishmentForm.component';
import withTitle from '../../hocs/with-title.hoc';
import { mapFormDataWithObject } from '../form.utils';

const { trackFormSuccess, trackFormCancel } =
  rudderStackFormTrackingFunctionsRegistry(
    SegmentAnalyticsFormObjectIdentifier.Establishment,
  );

type Props = {
  upsertEstablishmentV2: () => void,
  goToEstablishmentList: () => void,
  fetchEstablishments: () => void,
  establishmentId: number,
  pending: boolean,
  update: any,
  isNew: boolean,
};
const establishmentMap = {
  id: 'id',
  title: 'title',
  cover: 'cover',
  location: 'location',
  specific_info: 'specific_info',
  associatedestablishment_set: 'associatedestablishment_set',
  tzname: 'tzname',
  practical_info: 'practical_info',
  capacity: 'capacity',
  on_booking_notification: 'on_booking_notification',
  disabled: 'disabled',
  has_next_slots: 'has_next_slots',
  related_company: 'related_company',
  wellhub_gym: 'wellhub_gym',
  usc_location_id: 'usc_location_id',
};

export class EstablishmentFormPage extends Component<Props> {
  componentDidMount() {
    if (!this.props.isNew) {
      this.props.fetchEstablishments();
    }
  }

  createEstablishment = async (data: *) => {
    const updatedData = {
      ...(this.props.update && this.props.update),
      ...data,
    };
    const { cover } = updatedData;
    if (typeof cover !== 'string' && !!updatedData.cover) {
      updatedData.cover = cover;
    } else {
      delete updatedData.cover;
    }
    const {
      loading,
      error,
      establishment_billing_group_id,
      ...updatedDataClean
    } = updatedData;

    const establishmentId = this.props.update ? this.props.update.id : null;
    const establishmentData = mapFormDataWithObject(
      updatedDataClean,
      establishmentMap,
      ['cover', 'easy_access'],
    );
    if (updatedDataClean.cover) {
      establishmentData.append('cover', updatedDataClean.cover);
    }

    this.props.upsertEstablishmentV2(establishmentId, establishmentData, {
      onSuccess: () => {
        trackFormSuccess(this.props.update?.id);
        this.props.fetchEstablishments();
        this.props.goToEstablishmentList();
      },
    });
  };

  cancel = () => {
    trackFormCancel(this.props.update?.id);
    this.props.goToEstablishmentList();
  };

  render() {
    const { update } = this.props;
    if (!this.props.update && this.props.establishmentId) {
      return <LinearProgress />;
    }
    return (
      <EstablishmentForm
        initial={update}
        onCancel={this.cancel}
        onSubmit={this.createEstablishment}
        processing={this.props.pending}
        // imageUploader={imageUploader}
        update={this.props.update}
      />
    );
  }
}

export default compose(
  withTranslation(['establishment']),
  withRouter,
  mapRouterParamsToProps({ id: 'establishmentId:number' }),
  connect(
    (state, { establishmentId }) => ({
      isNew: !establishmentId,
      pending: state.establishment.upsert.loading,
      update: !establishmentId
        ? null
        : getEstablishment(state, establishmentId),
    }),
    {
      fetchEstablishments,
      upsertEstablishmentV2: createOrUpdateEstablishmentV2,
      addImage: addImageToEstablishment,
      removeImage: removeImageFromEstablishment,
      goToEstablishmentList: () => push('/establishment/room'),
    },
  ),
  withTitle(({ t }: { t: TFunction }) =>
    t('titles:establishment.establishmentFormPage'),
  ),
)(EstablishmentFormPage);
