// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import { withRouter } from 'react-router';

import MetaActivityForm from '../components/form/MetaActivityForm.component';
import api from '../api';

type Props = {
  associatedCoaches: *[],
  establishments: *[],
  SCTs: *[],
  history: Object,
};
type State = { open: boolean };

export class MetaActivityFormPage extends Component<Props, State> {
  state = { open: false };

  createMetaActivity = async (metaActivityData: *) => {
    try {
      await api.activity.addMetaActivity(metaActivityData);

      this.setState({ open: true });
      this.props.history.goBack();
    } catch (e) {
      throw e;
    }
  };

  render() {
    const { SCTs, associatedCoaches, establishments } = this.props;
    return (
      <div>
        <MetaActivityForm
          coaches={associatedCoaches}
          establishments={establishments}
          SCTs={SCTs}
          onSubmit={this.createMetaActivity}
        />
        <Snackbar open={this.state.open} message="Template d'activité créé" />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    associatedCoaches: state.coach.companyAssociated,
    establishments: state.establishment.all,
    SCTs: state.category.SCTs,
  };
}
export default connect(mapStateToProps)(withRouter(MetaActivityFormPage));
