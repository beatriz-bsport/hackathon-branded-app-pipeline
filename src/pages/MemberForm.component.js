// @flow

import React, { Component } from 'react';

import api from '../api';

import MemberForm from '../components/MemberForm.component';

type Props = {};
type State = {};

export class MemberFormPage extends Component<Props, State> {
  createMember = (data) => {
    api.member.addMember(data);
  };

  render() {
    return <MemberForm onSubmit={this.createMember} />;
  }
}

export default MemberFormPage;
