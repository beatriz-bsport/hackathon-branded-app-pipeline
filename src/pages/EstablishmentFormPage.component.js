// @flow

import React, { Component } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import { withRouter } from 'react-router';

import EstablishmentForm from '../components/form/EstablishmentForm.component';

import api from '../api';

type Props = {};
type State = {
  open: boolean,
};

export class CoachFormPage extends Component<Props, State> {
  state = { open: false };

  createEstablishment = async (data) => {
    try {
      await api.establishment.addEstablishment(data);

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
        <EstablishmentForm onSubmit={this.createEstablishment} />;
        <Snackbar open={this.state.open} message="Etablissement créé" />
      </div>
    );
  }
}

export default withRouter(CoachFormPage);
