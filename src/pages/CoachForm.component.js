// @flow

import React, { Component } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import { withRouter } from 'react-router';

import CoachForm from '../components/form/CoachForm.component';

import api from '../api';

type Props = {};
type State = {
  open: boolean,
};

export class CoachFormPage extends Component<Props, State> {
  state = { open: false };

  createCoach = async (data) => {
    try {
      await api.coach.addCoach(data);

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
        <CoachForm onSubmit={this.createCoach} />;
        <Snackbar open={this.state.open} message="Coach créé" />
      </div>
    );
  }
}

export default withRouter(CoachFormPage);
