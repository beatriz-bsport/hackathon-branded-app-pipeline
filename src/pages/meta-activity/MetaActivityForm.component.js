// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { snackbarSuccess } from '../../actions/snackbar.actions';
import MetaActivityForm from '../../components/form/MetaActivityForm.component';
import api from '../../api';
import { metaActivity as metaActivityActions } from '../../actions';
import withDrawer from '../../hocs/with-drawer.hoc';
type Props = {
  associatedCoaches: *[],
  establishments: *[],
  SCTs: *[],
  metaActivityNames: Array<string>,
  fetchAllActivities: () => void,
  history: Object,
};
type State = {};

export class MetaActivityFormPage extends Component<Props, State> {
  state = {
    processing: false,
  };
  createMetaActivity = async (metaActivityData: *) => {
    this.setState({ processing: true });
    try {
      await api.activity.addMetaActivity(metaActivityData);

      this.props.snackbarSuccess('Activité créée');
      this.props.fetchAllActivities();
      this.props.history.goBack();
      this.setState({ processing: false });
    } catch (e) {
      this.setState({ processing: false });
      throw e;
    }
    this.setState({ processing: false });
  };

  render() {
    const {
      SCTs,
      associatedCoaches,
      establishments,
      metaActivityNames,
    } = this.props;
    return (
      <div>
        <MetaActivityForm
          coaches={associatedCoaches}
          establishments={establishments}
          SCTs={SCTs}
          onSubmit={this.createMetaActivity}
          metaActivityNames={metaActivityNames}
          loading={this.state.processing}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    associatedCoaches: state.coach.companyAssociated,
    establishments: state.establishment.all,
    SCTs: state.category.SCTs,
    metaActivityNames: state.metaActivity.all.map((ma) => ma.name),
  };
}

export default connect(
  mapStateToProps,
  {
    fetchAllActivities: metaActivityActions.fetchAllActivities,
    snackbarSuccess,
  },
)(withRouter(withDrawer('metaActivityFormPage')(MetaActivityFormPage)));
