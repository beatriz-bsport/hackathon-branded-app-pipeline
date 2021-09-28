// @flow

import React, { Component } from 'react';

import { compose } from 'recompose';

import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { push } from 'connected-react-router';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import { LinearProgress } from '@material-ui/core';
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
// ee
type Props = {
  upsertEstablishmentV2: () => void,
  goToEstablishmentList: () => void,
  addImage: (number, File) => void,
  removeImage: (number, number) => void,
  fetchEstablishments: () => void,
  establishmentId: number,
  pending: boolean,
  update: *,
  isNew: boolean,
};
const establishmentMap = {
  id: 'id',
  title: 'title',
  cover: 'cover',
  location: 'location',
  specific_info: 'specific_info',
  easy_access: 'easy_access',
  associatedestablishment_set: 'associatedestablishment_set',
  tzname: 'tzname',
  practical_info: 'practical_info',
  capacity: 'capacity',
  on_booking_notification: 'on_booking_notification',
  disabled: 'disabled',
  has_next_slots: 'has_next_slots',
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

    this.props.upsertEstablishmentV2(
      this.props.update ? this.props.update.id : null,
      mapFormDataWithObject(updatedDataClean, establishmentMap, ['cover']),
      {
        onSuccess: () => {
          this.props.fetchEstablishments();
          this.props.goToEstablishmentList();
        },
      },
    );
  };

  render() {
    const {
      update,
      isNew,
      addImage,
      removeImage,
      establishmentId,
    } = this.props;
    const imageUploader = isNew
      ? null
      : {
          onAddImage: (file: File) => addImage(establishmentId, file),
          onRemoveImage: (id: number) => removeImage(establishmentId, id),
        };

    if (!this.props.update && this.props.establishmentId) {
      return <LinearProgress />;
    }
    return (
      <EstablishmentForm
        onSubmit={this.createEstablishment}
        processing={this.props.pending}
        initial={update}
        update={this.props.update}
        imageUploader={imageUploader}
        onCancel={this.props.goToEstablishmentList}
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
      goToEstablishmentList: () => push('/establishment'),
    },
  ),
  withTitle(({ t }: { t: TFunction }) =>
    t('titles:establishment.establishmentFormPage'),
  ),
)(EstablishmentFormPage);
