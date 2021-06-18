// @flow

import React, { Component } from 'react';

import { compose } from 'recompose';

import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { push } from 'connected-react-router';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import mapRouterParamsToProps from '../../hocs/router-params-to-props.hoc';
import {
  createOrUpdateEstablishmentV2,
  addImageToEstablishment,
  removeImageFromEstablishment,
  fetchEstablishments,
} from '../../libs/establishment/actions';
import { getEstablishment } from '../../libs/establishment/selectors';
import EstablishmentForm from '../../libs/establishment/components/EstablishmentForm.component';
// import { mapFormData } from '../form.utils';
import withTitle from '../../hocs/with-title.hoc';

export function mapFormData(base, map) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(base)) {
    if (!(typeof map[key] === 'boolean') && !map[key]) {
      throw new Error(`Mapping for key ${key} does not exist.`);
    }
    if (value !== undefined) {
      if (Array.isArray(value)) {
        formData.append(map[key], JSON.stringify(value));
      } else if (typeof value === 'object' && key !== 'cover') {
        formData.append(map[key], JSON.stringify(value));
      } else {
        formData.append(map[key], value);
      }
    }
  }
  return formData;
}
type Props = {
  upsertEstablishmentV2: (*) => void,
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
    this.props.upsertEstablishmentV2(
      this.props.update ? this.props.update.id : null,
      mapFormData(updatedData, establishmentMap),
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
