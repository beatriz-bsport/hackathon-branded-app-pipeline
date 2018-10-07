// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { createOrUpdateCoach } from '../actions/coach.actions';
import CoachForm from '../components/form/CoachForm.component';

import { mapFormData } from './form.utils';

type Props = {
  createOrUpdateCoach: (*) => void,
  pending: boolean,
  errors: *,
  update: *,
};

export class CoachFormPage extends Component<Props, State> {
  createCoach = async (data: *) => {
    const formData = mapFormData(data, {
      avatar: 'photo',
      firstname: 'first_name',
      lastname: 'last_name',
      gender: 'gender',
      birthdayYear: 'birthday',
      email: 'email',
      description: 'description',
      phone: 'phone.phone_number',
    });

    if (this.props.update) {
      formData.append('id', this.props.update.id);
    }

    this.props.createOrUpdateCoach(formData);
  };

  render() {
    const { update } = this.props;
    return (
      <CoachForm
        onSubmit={this.createCoach}
        processing={this.props.pending}
        initial={update}
      />
    );
  }
}

function mapStateToProps(state, nextProps) {
  const { match } = nextProps;
  const id = (match && match.params && +match.params.id) || null;
  return {
    pending: state.coach.createOrUpdatePending,
    errors: state.coach.createOrUpdatePending,
    update:
      id !== null
        ? state.coach.companyAssociated.find((c) => c.id === id)
        : null,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    createOrUpdateCoach(data) {
      dispatch(createOrUpdateCoach(data));
    },
  };
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CoachFormPage),
);
