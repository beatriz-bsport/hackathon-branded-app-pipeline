// @flow

import { withNamespaces } from 'react-i18next';

import { goBack, push } from 'connected-react-router';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withProps, compose } from 'recompose';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import type { TFunction } from 'react-i18next';
import { mapFormData, unmap } from '../form.utils';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import {
  upsert,
  addImageToMetaActivity,
  removeImageFromMetaActivity,
  fetchMetaActivityDetails,
} from '../../libs/meta-activity/actions/meta-activity.actions';
import { getMetaActivity } from '../../libs/meta-activity/selectors';

import withTitle from '../../hocs/with-title.hoc';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { fetchEstablishments } from '../../libs/establishment/actions';
import { getAllEstablishments } from '../../libs/establishment/selectors';
import type { Establishment } from '../../libs/establishment/types';

import MetaActivityForm from '../../libs/meta-activity/components/MetaActivityForm.component';

type Props = {
  id: number,
  loading: ?boolean,
  initial: ?MetaActivity,

  establishments: Array<Establishment>,
  fetchEstablishments: () => void,
  fetchMetaActivityDetails: (id: number) => void,
  SCTs: *[],

  removeImage: (id: number, imageId: number) => void,
  addImage: (id: number, File) => void,
  onSubmit: (*) => void,

  goToPreviousPage: () => void,
};
const MetaActivityMap = {
  cover_main: 'cover_main',
  description: 'description',
  name: 'name',
  last_booking_minutes: 'last_booking_minutes',
  last_discard_minutes: 'last_discard_minutes',
  is_workshop: 'is_workshop',
  SCT: 'SCT',
  color: 'color',
};

export class MetaActivityFormPage extends Component<Props> {
  componentDidMount() {
    this.props.fetchMetaActivityDetails(this.props.id);
    this.props.fetchEstablishments();
  }

  render() {
    const {
      SCTs,
      establishments,
      loading,
      id,
      addImage,
      removeImage,
      initial,
    } = this.props;
    const initialData = initial
      ? {
          ...unmap(initial, MetaActivityMap),
          SCT: initial.SCT,
        }
      : null;
    if (loading) {
      return <LinearProgress />;
    }
    const imageUploader = {
      onAddImage: (file: File) => addImage(id, file),
      onRemoveImage: (imageId: number) => removeImage(id, imageId),
    };
    return (
      <Grid container justify="center" alignItems="center">
        <Grid item xs={12} lg={9}>
          <Paper>
            <MetaActivityForm
              establishments={establishments}
              SCTs={SCTs}
              onSubmit={this.props.onSubmit}
              onCancel={this.props.goToPreviousPage}
              initial={{ ...initialData, images: (initial || {}).images || [] }}
              imageUploader={id ? imageUploader : null}
            />
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default compose(
  withNamespaces([]),
  routerParamsToProps({ id: 'id:number' }),
  connect(
    (state, { id }) => ({
      initial: getMetaActivity(state, id),
      establishments: getAllEstablishments(state),
      SCTs: state.category.SCTs,
      loading: state.metaActivity.loading,
    }),
    {
      fetchEstablishments,
      fetchMetaActivityDetails,
      upsertMetaActivity: upsert,
      goToPreviousPage: goBack,
      addImage: addImageToMetaActivity,
      removeImage: removeImageFromMetaActivity,
      goToMetaActivity: (id: number) => push(`/activity/${id}`),
    },
  ),
  withProps(({ upsertMetaActivity, goToMetaActivity, id, initial }) => ({
    onSubmit: (values, options) => {
      const formData = mapFormData(values, MetaActivityMap);
      if (initial) {
        formData.append('id', initial.id);
      }
      formData.append('is_workshop', false);
      upsertMetaActivity(formData, {
        ...options,
        onSuccess: () => {
          if (options.onSuccess) options.onSuccess();
          goToMetaActivity(id);
        },
      });
    },
  })),
  withTitle(({ t }: { t: TFunction }) =>
    t('titles:metaActivity.metaActivityFormPage'),
  ),
)(MetaActivityFormPage);
