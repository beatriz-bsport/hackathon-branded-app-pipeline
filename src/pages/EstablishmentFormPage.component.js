// @flow

import React, { Component } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import EstablishmentForm from '../components/form/EstablishmentForm.component';

import api from '../api';

type Props = {
  easyAccesses: EasyAccessType[],
};
type State = {
  open: boolean,
};

export class EstablishmentFormPage extends Component<Props, State> {
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
        <EstablishmentForm
          easyAccesses={this.props.easyAccesses}
          onSubmit={this.createEstablishment}
        />;
        <Snackbar open={this.state.open} message="Etablissement créé" />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    easyAccesses: state.category.easyAccesses || [],
  };
}

export default connect(mapStateToProps)(withRouter(EstablishmentFormPage));
