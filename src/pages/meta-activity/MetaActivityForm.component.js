// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import { withRouter } from 'react-router';

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
type State = { open: boolean };

export class MetaActivityFormPage extends Component<Props, State> {
  state = { open: false };

  createMetaActivity = async (metaActivityData: *) => {
    try {
      await api.activity.addMetaActivity(metaActivityData);

      this.setState({ open: true });
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
        <Snackbar open={this.state.open} message="Activité créée" />
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

function mapDispatchToProps(dispatch) {
  return {
    fetchAllActivities() {
      dispatch(metaActivityActions.fetchAllActivities());
    },
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(MetaActivityFormPage));
