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
import * as actions from '../../actions/establishment.actions';
import EstablishmentForm from '../../libs/establishment/EstablishmentForm.component';

import { mapFormData } from '../form.utils';
import withDrawer from '../../hocs/with-drawer.hoc';

type Props = {
  upsertEstablishment: (*) => void,
  goToEstablishmentList: () => void,
  addImage: (number, File) => void,
  removeImage: (number, number) => void,
  establishmentId: number,
  pending: boolean,
  update: *,
  t: TFunction,
  isNew: boolean,
};

export class EstablishmentFormPage extends Component<Props> {
  createEstablishment = async (data: *) => {
    const formData = mapFormData(data, {
      title: 'title',
      specific_info: 'specific_info',
      x: 'location.geometry.x',
      y: 'location.geometry.y',
      address: 'location.address',
      cover: 'cover',
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
          {t('establishment.goBackToList')}
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

function mapStateToProps(state, { establishmentId }) {
  const isNew = !establishmentId;
  const establishments = state.establishment.all;
  return {
    isNew,
    pending: state.establishment.upsert.loading,
    update: isNew ? null : establishments.find((e) => e.id === establishmentId),
  };
}

export default compose(
  withNamespaces([]),
  withRouter,
  mapRouterParamsToProps({ id: 'establishmentId:number' }),
  connect(
    mapStateToProps,
    {
      upsertEstablishment: actions.createOrUpdateEstablishment,
      addImage: actions.addImageToEstablishment,
      removeImage: actions.removeImageFromEstablishment,
      goToEstablishmentList: () => push('/establishment'),
    },
  ),
  withDrawer(({ t }: { t: TFunction }) =>
    t('appbar.title.establishmentFormPage'),
  ),
)(EstablishmentFormPage);
