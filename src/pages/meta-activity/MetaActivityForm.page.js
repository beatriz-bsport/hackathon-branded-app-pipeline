// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { CircularProgress } from '@material-ui/core';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { compose } from 'recompose';

import { push } from 'react-router-redux';
import { snackbarSuccess } from '../../actions/snackbar.actions';
import MetaActivityForm from '../../libs/meta-activity/MetaActivityForm.component';
import api from '../../api';
import { metaActivity as metaActivityActions } from '../../actions';

import withDrawer from '../../hocs/with-drawer.hoc';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

type Props = {
  associatedCoaches: *[],
  establishments: *[],
  SCTs: *[],
  metaActivityNames: Array<string>,
  fetchAllActivities: () => void,
  history: Object,
  t: TFunction,
  snackbarSuccess: (msg: string) => void,
  fetchMetaActivityDetails: (id: number) => void,
  id: ?number,
  push: (path: string) => void,
  loading: ?boolean,
  metaActivity: MetaActivity,
  removeImage: (number, number) => void,
  addImage: (number, File) => void,
};
type State = { processing: boolean };

export class MetaActivityFormPage extends Component<Props, State> {
  state = { processing: false };

  componentWillMount() {
    if (this.props.id) {
      this.props.fetchMetaActivityDetails(this.props.id);
    }
  }

  updateMetaActivity = async (metaActivityData: *) => {
    this.setState({ processing: true });
    try {
      const response = await api.activity.updateMetaActivity(
        metaActivityData,
        this.props.id,
      );

      if (response.status === 200) {
        this.props.snackbarSuccess(this.props.t('activityUpdated'));
        this.props.fetchAllActivities();
        this.props.push(`/activity/${this.props.id}`);
      }
    } catch (e) {
      this.setState({ processing: false });
      throw e;
    }
    this.setState({ processing: false });
  };

  createMetaActivity = async (metaActivityData: *) => {
    this.setState({ processing: true });
    try {
      await api.activity.addMetaActivity(metaActivityData);

      this.props.snackbarSuccess(this.props.t('activityCreated'));
      this.props.fetchAllActivities();
      this.props.history.goBack();
      this.setState({ processing: false });
    } catch (e) {
      this.setState({ processing: false });
      throw e;
    }
    this.setState({ processing: false });
  };

  upsertMetaActivity = (data: *) => {
    if (this.props.id) {
      return this.updateMetaActivity(data);
    }
    return this.createMetaActivity(data);
  };

  render() {
    const {
      SCTs,
      associatedCoaches,
      establishments,
      metaActivityNames,
      loading,
      id,
      addImage,
      removeImage,
    } = this.props;
    if (loading) {
      return <CircularProgress />;
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
          onSubmit={this.upsertMetaActivity}
          metaActivityNames={metaActivityNames}
          loading={this.state.processing}
          initial={id ? this.props.metaActivity : null}
          imageUploader={imageUploader}
        />
      </div>
    );
  }
}

function mapStateToProps(state, { id }) {
  return {
    associatedCoaches: state.coach.companyAssociated,
    establishments: state.establishment.all,
    SCTs: state.category.SCTs,
    metaActivityNames: state.metaActivity.all.map((ma) => ma.name),
    id,
    loading: state.metaActivity.loading,
    metaActivity: state.metaActivity.metaActivity,
  };
}

export default compose(
  withNamespaces([]),
  routerParamsToProps({ id: 'id:number' }),
  connect(
    mapStateToProps,
    {
      fetchAllActivities: metaActivityActions.fetchAllActivities,
      snackbarSuccess,
      fetchMetaActivityDetails: metaActivityActions.fetchMetaActivityDetails,
      addImage: metaActivityActions.addImageToMetaActivity,
      removeImage: metaActivityActions.removeImageFromMetaActivity,
      push,
    },
  ),
  withRouter,
  withDrawer(({ t }: { t: TFunction }) =>
    t('appbar.title.metaActivityFormPage'),
  ),
)(MetaActivityFormPage);
