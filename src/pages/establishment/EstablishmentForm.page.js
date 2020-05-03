// @flow

import React, { Component } from 'react';

import { compose } from 'recompose';

import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { push } from 'connected-react-router';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import Button from '@material-ui/core/Button';

import mapRouterParamsToProps from '../../hocs/router-params-to-props.hoc';
import {
  createOrUpdateEstablishment,
  addImageToEstablishment,
  removeImageFromEstablishment,
  fetchEstablishments,
} from '../../libs/establishment/actions';
import { getEstablishment } from '../../libs/establishment/selectors';
import EstablishmentForm from '../../libs/establishment/components/EstablishmentForm.component';

import { mapFormData } from '../form.utils';
import withTitle from '../../hocs/with-title.hoc';

type Props = {
  upsertEstablishment: (*) => void,
  goToEstablishmentList: () => void,
  addImage: (number, File) => void,
  removeImage: (number, number) => void,
  fetchEstablishments: () => void,
  establishmentId: number,
  pending: boolean,
  update: *,
  t: TFunction,
  isNew: boolean,
};

export class EstablishmentFormPage extends Component<Props> {
  componentDidMount() {
    if (!this.props.isNew) {
      this.props.fetchEstablishments();
    }
  }

  createEstablishment = async (data: *) => {
    const formData = mapFormData(data, {
      title: 'title',
      specific_info: 'specific_info',
      practical_info: 'practical_info',
      x: 'location.geometry.x',
      y: 'location.geometry.y',
      address: 'location.address',
      cover: 'cover',
      capacity: 'capacity',
    });

    if (this.props.update) {
      formData.append('id', this.props.update.id);
    }

    this.props.upsertEstablishment(formData);
  };

  render() {
    const {
      update,
      t,
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
      <div>
        <Button onClick={this.props.goToEstablishmentList}>
          {t('establishment:goBackToList')}
        </Button>
        <EstablishmentForm
          onSubmit={this.createEstablishment}
          processing={this.props.pending}
          initial={update}
          update={this.props.update}
          imageUploader={imageUploader}
        />
      </div>
    );
  }
}

export default compose(
  withNamespaces(['establishment']),
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
      upsertEstablishment: createOrUpdateEstablishment,
      addImage: addImageToEstablishment,
      removeImage: removeImageFromEstablishment,
      goToEstablishmentList: () => push('/establishment'),
    },
  ),
  withTitle(({ t }: { t: TFunction }) =>
    t('titles:establishment.establishmentFormPage'),
  ),
)(EstablishmentFormPage);
