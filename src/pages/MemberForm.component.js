// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { createOrUpdateMember } from '../actions/member.actions';
import MemberForm from '../components/form/MemberForm.component';

import { mapFormData } from './form.utils';

type Props = {
  createOrUpdateMember: (*) => void,
  pending: boolean,
  errors: *,
  update: *,
};

export class MemberFormPage extends Component<Props, State> {
  createMember = async (data: *) => {
    const formData = mapFormData(data, {
      lastname: 'last_name',
      firstname: 'first_name',
      email: 'email',
      phone: 'phone.phone_number',
      sex: 'gender',
      avatar: 'photo',
    });

    if (this.props.update) {
      formData.append('id', this.props.update.id);
    }

    this.props.createOrUpdateMember(formData);
  };

  render() {
    const { update } = this.props;
    return (
      <MemberForm
        onSubmit={this.createMember}
        error={this.props.errors}
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
    pending: state.member.createOrUpdatePending,
    errors: state.member.createOrUpdateErrors,
    update: id !== null ? state.member.all.find((m) => m.id === id) : null,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    createOrUpdateMember(data) {
      dispatch(createOrUpdateMember(data));
    },
  };
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(MemberFormPage),
);
