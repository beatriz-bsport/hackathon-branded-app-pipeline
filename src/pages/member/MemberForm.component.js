// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Paper } from '@material-ui/core';

import { push as routerPush, goBack } from 'react-router-redux';
import { createOrUpdateMember } from '../../actions/member.actions';
import MemberForm from '../../components/form/MemberForm.component';

import { mapFormData } from '../form.utils';

type Props = {
  createOrUpdateMember: (*) => void,
  routerPush: (path: string) => void,
  goBack: () => void,
  pending: boolean,
  errors: *,
  update: *,
};

export class MemberFormPage extends Component<Props> {
  createMember = async (data: *) => {
    const formData = mapFormData(data, {
      lastname: 'last_name',
      firstname: 'first_name',
      email: 'email',
      phone: 'phone.phone_number',
      gender: 'gender',
      avatar: 'photo',
      birthdayYear: 'birthday',
      membership_ID: 'membership_ID',
      accept_email: 'accept_email',
      accept_sms: 'accept_sms',
      date_joined: 'date_joined',
      address: 'address',
    });

    if (this.props.update) {
      formData.append('id', this.props.update.id);
    }

    this.props.createOrUpdateMember(formData);
  };

  render() {
    const { goBack, update, pushToMemberList } = this.props;
    return (
      <Paper>
        <MemberForm
          onCancel={goBack}
          onSubmit={this.createMember}
          error={this.props.errors}
          processing={this.props.pending}
          initial={update}
          update={!!update}
        />
      </Paper>
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
    goBack() {
      dispatch(goBack());
    },
    routerPush(path) {
      dispatch(routerPush(path));
    },
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(MemberFormPage),
);
