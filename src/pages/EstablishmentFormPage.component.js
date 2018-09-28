// @flow

import React, { Component } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import EstablishmentForm from '../components/form/EstablishmentForm.component';

import api from '../api';

type Props = {
  easyAccesses: EasyAccessType[],
  history: Object,
};
type State = {
  open: boolean,
  processing: boolean,
};

export class EstablishmentFormPage extends Component<Props, State> {
  state = { processing: false, open: false };

  createEstablishment = async (data: *) => {
    this.setState({ processing: true });
    try {
      await api.establishment.addEstablishment(data);

      this.setState({
        open: true,
        processing: false,
      });
      this.props.history.goBack();
    } catch (e) {
      console.log(e);
      this.setState({
        processing: false,
      });
      throw e;
    }
  };

  render() {
    return (
      <div>
        <EstablishmentForm
          easyAccesses={this.props.easyAccesses}
          onSubmit={this.createEstablishment}
          processing={this.state.processing}
        />
        ;<Snackbar open={this.state.open} message="Etablissement créé" />
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
