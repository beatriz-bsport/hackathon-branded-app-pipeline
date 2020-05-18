// @flow

import React from 'react';
import { connect } from 'react-redux';

import { withNamespaces } from 'react-i18next';
import { withProps, compose } from 'recompose';

import { goBack, push as routerPush } from 'connected-react-router';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { mapFormData, unmap } from '../form.utils';
import themeSelectors from '../../libs/theme/selectors';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import {
  upsert,
  addImageToMetaActivity as addImageToWorkshop,
  removeImageFromWorkshop,
  fetchAll as fetchAllWorkshops,
} from '../../libs/meta-activity/actions';
import { getWorkshop } from '../../libs/meta-activity/selectors';

import withTitle from '../../hocs/with-title.hoc';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import MetaActivityForm from '../../libs/meta-activity/components/MetaActivityForm.component';

type Props = {
  id: ?number,
  loading: ?boolean,
  initial: ?MetaActivity,

  SCTs: *[],

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
  SCT: 'SCT',
  color: 'color',
  is_broadcast: 'is_broadcast',
};

export class WorkshopActivityEditPage extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchAllWorkshops();
  }

  render() {
    const { SCTs, loading, id, addImage, removeImage, initial } = this.props;
    const initialData = initial
      ? {
          ...unmap(initial, WorkshopActivityMap),
          SCT: initial.SCT,
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
              variant="workshop"
              SCTs={SCTs}
              is_broadcast_enabled
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
      companyTheme: themeSelectors.getTheme(state),
      SCTs: state.category.SCTs,
      loading: state.metaActivity.loading,
    }),
    {
      upsertWorkshopActivity: upsert,
      goToPreviousPage: goBack,
      addImage: addImageToWorkshop,
      removeImage: removeImageFromWorkshop,
      goToWorkshop: (id: number) =>
        routerPush(`/workshop-activity/${id}/general`),
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
  withTitle(({ t }) => t('titles:workshopActivity.workshopActivityFormPage')),
)(WorkshopActivityEditPage);
