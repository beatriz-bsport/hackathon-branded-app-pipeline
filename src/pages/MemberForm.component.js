// @flow

import React, { Component } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import { withRouter } from 'react-router';

import api from '../api';

import MemberForm from '../components/form/MemberForm.component';

type Props = {
  history: Object,
};
type State = {
  open: boolean,
  error: boolean,
};

export class MemberFormPage extends Component<Props, State> {
  state = {
    open: false,
    error: false,
  };

  createMember = async (data: *) => {
    try {
      await api.member.addMember(data);

      this.setState({ open: true, error: false });
      this.props.history.goBack();
    } catch (e) {
      this.setState({ error: true });
      throw e;
    }
  };

  render() {
    return (
      <div>
        <MemberForm onSubmit={this.createMember} error={this.state.error} />
        <Snackbar open={this.state.open} message="Membre créé" />
      </div>
    );
  }
}

export default withRouter(MemberFormPage);
