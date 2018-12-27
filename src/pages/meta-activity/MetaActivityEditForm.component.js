// @flow

import React, { Component } from 'react';

import { compose } from 'recompose';

import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Grid, CircularProgress } from '@material-ui/core';

import Snackbar from '@material-ui/core/Snackbar';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import MetaActivityForm from '../../components/form/MetaActivityForm.component';
import api from '../../api';
import { metaActivity as metaActivityActions } from '../../actions';

type Props = {
  associatedCoaches: *[],
  establishments: *[],
  SCTs: *[],
  fetchAllActivities: () => void,
  fetchMetaActivityDetails: (id: number) => void,
  id: number,
  push: (path: string) => void,
  loading: ?boolean,
  metaActivity: MetaActivity,
  removeImage: (number, number) => void,
  addImage: (number, File) => void,
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
      loading,
      id,
      addImage,
      removeImage,
    } = this.props;
    if (id === null || loading) {
      return (
        <Grid container item justify="center" alignItems="center">
          <CircularProgress />
        </Grid>
      );
    }

    const imageUploader = {
      onAddImage: (file: File) => addImage(id, file),
      onRemoveImage: (imageId: number) => removeImage(id, imageId),
    };
    return (
      <div>
        <MetaActivityForm
          coaches={associatedCoaches}
          establishments={establishments}
          SCTs={SCTs}
          onSubmit={this.updateMetaActivity}
          metaActivityNames={[]}
          initial={this.props.metaActivity}
          imageUploader={imageUploader}
        />
        <Snackbar open={this.state.open} message="Activité créée" />
      </div>
    );
  }
}

function mapStateToProps(state, { id }) {
  return {
    id,
    loading: state.metaActivity.loading,
    metaActivity: state.metaActivity.metaActivity,
    associatedCoaches: state.coach.companyAssociated,
    establishments: state.establishment.all,
    SCTs: state.category.SCTs,
  };
}

export default compose(
  routerParamsToProps({ id: 'id:number' }),
  connect(
    mapStateToProps,
    {
      fetchAllActivities: metaActivityActions.fetchAllActivities,
      fetchMetaActivityDetails: metaActivityActions.fetchMetaActivityDetails,
      addImage: metaActivityActions.addImageToMetaActivity,
      removeImage: metaActivityActions.removeImageFromMetaActivity,
      push,
    },
  ),
)(MetaActivityFormPage);
