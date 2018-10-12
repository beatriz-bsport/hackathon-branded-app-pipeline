// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { createOrUpdateEstablishment } from '../actions/establishment.actions';
import EstablishmentForm from '../components/form/EstablishmentForm.component';

import { mapFormData } from './form.utils';

type Props = {
  createOrUpdateEstablishment: (*) => void,
  pending: boolean,
  errors: *,
  update: *,
};

export class EstablishmentFormPage extends Component<Props, State> {
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

    this.props.createOrUpdateEstablishment(formData);
  };

  render() {
    const { update } = this.props;
    return (
      <EstablishmentForm
        onSubmit={this.createEstablishment}
        processing={this.props.pending}
        initial={update}
        update={this.props.update}
      />
    );
  }
}

function mapStateToProps(state, nextProps) {
  const { match } = nextProps;
  const id = (match && match.params && +match.params.id) || null;
  return {
    pending: state.establishment.createOrUpdatePending,
    errors: state.establishment.createOrUpdateError,
    update:
      id !== null ? state.establishment.all.find((e) => e.id === id) : null,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createOrUpdateEstablishment(data) {
      dispatch(createOrUpdateEstablishment(data));
    },
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(EstablishmentFormPage),
);
