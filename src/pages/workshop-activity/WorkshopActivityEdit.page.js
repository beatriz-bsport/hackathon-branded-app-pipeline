// @flow

import React from 'react';
import { connect } from 'react-redux';

import { withNamespaces } from 'react-i18next';
import { withProps, compose } from 'recompose';

import { goBack, push as routerPush } from 'react-router-redux';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { mapFormData, unmap } from '../form.utils';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import {
  upsert,
  addImageToWorkshop,
  removeImageFromWorkshop,
  fetchAll as fetchAllWorkshops,
} from '../../libs/meta-activity/actions/workshop-activity.actions';
import { getWorkshop } from '../../libs/meta-activity/selectors';
import { associatedCoachSelector } from '../../libs/associated-coach/selectors';

import withDrawer from '../../hocs/with-drawer.hoc';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import MetaActivityForm from '../../libs/meta-activity/components/MetaActivityForm.component';

import { fetchEstablishments } from '../../libs/establishment/actions';
import { getAllEstablishments } from '../../libs/establishment/selectors';
import type { Establishment } from '../../libs/establishment/types';

type Props = {
  id: ?number,
  loading: ?boolean,
  initial: ?MetaActivity,

  associatedCoaches: *[],
  establishments: Array<Establishment>,
  SCTs: *[],

  fetchEstablishments: () => void,
  fetchAllWorkshops: () => void,
  removeImage: () => void,
  addImage: () => void,
  onSubmit: (*) => void,

  goToPreviousPage: () => void,
};
const WorkshopActivityMap = {
  cover_main: 'cover_main',
  description: 'description',
  name: 'name',
  last_booking_minutes: 'last_booking_minutes',
  last_discard_minutes: 'last_discard_minutes',
  is_workshop: 'is_workshop',
  category: 'category',
};

export class WorkshopActivityEditPage extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchEstablishments();
    this.props.fetchAllWorkshops();
  }

  render() {
    const {
      SCTs,
      associatedCoaches,
      establishments,
      loading,
      id,
      addImage,
      removeImage,
      initial,
    } = this.props;
    const initialData = initial
      ? {
          ...unmap(initial, WorkshopActivityMap),
          category: initial.category_id,
        }
      : null;
    if (loading || !this.props.initial) {
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
              coaches={associatedCoaches}
              variant="workshop"
              establishments={establishments}
              SCTs={SCTs}
              onSubmit={this.props.onSubmit}
              onCancel={this.props.goToPreviousPage}
              metaActivityNames={[]}
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
      initial: getWorkshop(state, id),
      associatedCoaches: associatedCoachSelector.getActive(state),
      establishments: getAllEstablishments(state),
      SCTs: state.category.SCTs,
      loading: state.workshopActivity.loading,
    }),
    {
      upsertWorkshopActivity: upsert,
      fetchEstablishments,
      goToPreviousPage: goBack,
      addImage: addImageToWorkshop,
      removeImage: removeImageFromWorkshop,
      goToWorkshop: (id: number) => routerPush(`/workshop-activity/${id}`),
      fetchAllWorkshops,
    },
  ),
  withProps(({ upsertWorkshopActivity, initial, id, goToWorkshop }) => ({
    onSubmit: (values, options) => {
      const formData = mapFormData(values, WorkshopActivityMap);
      if (initial) {
        formData.append('id', initial.id);
      }
      formData.append('is_workshop', true);
      upsertWorkshopActivity(formData, {
        ...options,
        onSuccess: () => {
          if (options.onSuccess) options.onSuccess();
          goToWorkshop(id);
        },
      });
    },
  })),
  withDrawer(({ t }) => t('appbar.title.WorkshopActivityFormPage')),
)(WorkshopActivityEditPage);
