// @flow

import { withNamespaces } from 'react-i18next';

import { goBack } from 'connected-react-router';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withProps, compose } from 'recompose';

import type { TFunction } from 'react-i18next';
import { mapFormData, unmap } from '../form.utils';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import {
  fetchMetaActivityDetails,
  upsert,
  addImageToMetaActivity,
  removeImageFromMetaActivity,
} from '../../libs/meta-activity/actions/meta-activity.actions';

import withDrawer from '../../hocs/with-drawer.hoc';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import MetaActivityForm from '../../libs/meta-activity/components/MetaActivityForm.component';

type Props = {
  id: number,
  loading: ?boolean,
  initial: ?MetaActivity,

  associatedCoaches: *[],
  establishments: *[],
  SCTs: *[],

  fetchMetaActivity: (id: number) => void,
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
  category: 'category',
};

export class MetaActivityFormPage extends Component<Props> {
  componentDidMount() {
    if (this.props.id) {
      this.props.fetchMetaActivity(this.props.id);
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.id && this.props.id !== prevProps.id) {
      this.props.fetchMetaActivity(this.props.id);
    }
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
          ...unmap(initial, MetaActivityMap),
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
      <div>
        <MetaActivityForm
          coaches={associatedCoaches}
          establishments={establishments}
          SCTs={SCTs}
          onSubmit={this.props.onSubmit}
          onCancel={this.props.goToPreviousPage}
          metaActivityNames={[]}
          initial={{ ...initialData, images: (initial || {}).images || [] }}
          imageUploader={id ? imageUploader : null}
        />
      </div>
    );
  }
}

export default compose(
  withNamespaces([]),
  routerParamsToProps({ id: 'id:number' }),
  connect(
    (state, { id }) => ({
      initial: id ? state.metaActivity.metaActivity : null,
      associatedCoaches: state.coach.companyAssociated,
      establishments: state.establishment.all,
      SCTs: state.category.SCTs,
      loading: state.metaActivity.loading,
      metaActivityNames: state.metaActivity.all.map((ma) => ma.name),
    }),
    {
      fetchMetaActivity: fetchMetaActivityDetails,
      upsertMetaActivity: upsert,
      goToPreviousPage: goBack,
      addImage: addImageToMetaActivity,
      removeImage: removeImageFromMetaActivity,
    },
  ),
  withProps(({ upsertMetaActivity, initial }) => ({
    onSubmit: (values, options) => {
      const formData = mapFormData(values, MetaActivityMap);
      if (initial) {
        formData.append('id', initial.id);
      }
      formData.append('is_workshop', false);
      upsertMetaActivity(formData, options);
    },
  })),
  withDrawer(({ t }: { t: TFunction }) =>
    t('appbar.title.metaActivityFormPage'),
  ),
)(MetaActivityFormPage);
