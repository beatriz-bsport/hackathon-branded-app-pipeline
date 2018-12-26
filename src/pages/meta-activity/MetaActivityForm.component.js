// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { snackbarSuccess } from '../../actions/snackbar.actions';
import MetaActivityForm from '../../components/form/MetaActivityForm.component';
import api from '../../api';
import { metaActivity as metaActivityActions } from '../../actions';

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
  createMetaActivity = async (metaActivityData: *) => {
    try {
      await api.activity.addMetaActivity(metaActivityData);

      this.props.snackbarSuccess('Activité créée');
      this.props.fetchAllActivities();
      this.props.history.goBack();
    } catch (e) {
      throw e;
    }
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
)(withRouter(MetaActivityFormPage));
