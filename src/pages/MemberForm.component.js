// @flow

import React, { Component } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import { withRouter } from 'react-router';

import api from '../api';

import MemberForm from '../components/form/MemberForm.component';

type Props = {};
type State = {
  open: boolean,
};

export class MemberFormPage extends Component<Props, State> {
  state = {
    open: false,
  };

  createMember = async (data) => {
    try {
      await api.member.addMember(data);

      this.setState({ open: true });
      this.props.history.goBack();
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  render() {
    return (
      <div>
        <MemberForm onSubmit={this.createMember} />
        <Snackbar open={this.state.open} message="Membre créé" />
      </div>
    );
  }
}

export default withRouter(MemberFormPage);
