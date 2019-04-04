// @flow

import React from 'react';
import { connect } from 'react-redux';

import { withNamespaces } from 'react-i18next';
import { withProps, compose } from 'recompose';

import { goBack } from 'react-router-redux';
import { mapFormData, unmap } from '../form.utils';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import { workshopActivity as workshopActivityActions } from '../../actions';

import withDrawer from '../../hocs/with-drawer.hoc';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import MetaActivityForm from '../../libs/meta-activity/MetaActivityForm.component';

type Props = {
  id: ?number,
  loading: ?boolean,
  initial: ?MetaActivity,

  associatedCoaches: *[],
  establishments: *[],
  SCTs: *[],

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

export function WorkshopActivityFormPage(props: Props) {
  const {
    SCTs,
    associatedCoaches,
    establishments,
    loading,
    id,
    addImage,
    removeImage,
    initial,
  } = props;
  const initialData = initial
    ? {
        ...unmap(initial, WorkshopActivityMap),
        category: initial.category_id,
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
    <MetaActivityForm
      coaches={associatedCoaches}
      variant="workshop"
      establishments={establishments}
      SCTs={SCTs}
      onSubmit={props.onSubmit}
      onCancel={props.goToPreviousPage}
      metaActivityNames={[]}
      initial={{ ...initialData, images: (initial || {}).images || [] }}
      imageUploader={id ? imageUploader : null}
    />
  );
}

function mapStateToProps(state, { id }) {
  const id_ = id || null;
  return {
    id: id_,
    initial: id_
      ? state.workshopActivity.all.find((oa) => oa.id === id_)
      : null,
    associatedCoaches: state.coach.companyAssociated,
    establishments: state.establishment.all,
    SCTs: state.category.SCTs,
    loading: state.workshopActivity.loading,
  };
}

export default compose(
  withNamespaces([]),
  routerParamsToProps({ id: 'id:number' }),
  connect(
    mapStateToProps,
    {
      upsertWorkshopActivity: workshopActivityActions.upsert,
      goToPreviousPage: goBack,
      addImage: workshopActivityActions.addImageToWorkshop,
      removeImage: workshopActivityActions.removeImageFromWorkshop,
    },
  ),
  withProps(({ upsertWorkshopActivity, initial }) => ({
    onSubmit: (values, options) => {
      const formData = mapFormData(values, WorkshopActivityMap);
      if (initial) {
        formData.append('id', initial.id);
      }
      formData.append('is_workshop', true);
      upsertWorkshopActivity(formData, options);
    },
  })),
  withDrawer(({ t }) => t('appbar.title.WorkshopActivityFormPage')),
)(WorkshopActivityFormPage);
