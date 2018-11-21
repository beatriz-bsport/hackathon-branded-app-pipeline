// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import { withRouter } from 'react-router';
import { push } from 'react-router-redux';
import { Grid, CircularProgress } from '@material-ui/core';

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

  componentWillMount() {
    this.props.fetchMetaActivityDetails(this.props.id);
  }

  updateMetaActivity = async (metaActivityData: *) => {
    try {
      const response = await api.activity.updateMetaActivity(
        metaActivityData,
        this.props.id,
      );

      if (response.status === 201) {
        this.setState({ open: true });
        this.props.fetchAllActivities();
        this.props.push(`/activity/${this.props.id}`);
      }
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
      loading,
      id,
    } = this.props;
    if (id === null || loading) {
      return (
        <Grid container item justify="center" alignItems="center">
          <CircularProgress />
        </Grid>
      );
    }
    return (
      <div>
        <MetaActivityForm
          coaches={associatedCoaches}
          establishments={establishments}
          SCTs={SCTs}
          onSubmit={this.updateMetaActivity}
          metaActivityNames={[]}
          initial={this.props.metaActivity}
        />
        <Snackbar open={this.state.open} message="Activité créée" />
      </div>
    );
  }
}

function mapStateToProps(state, nextProps) {
  const { match } = nextProps;
  const id = (match && match.params && +match.params.id) || null;
  return {
    id,
    loading: state.metaActivity.loading,
    metaActivity: state.metaActivity.metaActivity,
    associatedCoaches: state.coach.companyAssociated,
    establishments: state.establishment.all,
    SCTs: state.category.SCTs,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchAllActivities() {
      dispatch(metaActivityActions.fetchAllActivities());
    },
    fetchMetaActivityDetails(id) {
      dispatch(metaActivityActions.fetchMetaActivityDetails(id));
    },
    push(path) {
      dispatch(push(path));
    },
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(MetaActivityFormPage));
