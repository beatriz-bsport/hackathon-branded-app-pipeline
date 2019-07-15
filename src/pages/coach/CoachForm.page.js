// @flow

import React from 'react';
import { compose, withProps } from 'recompose';

import { goBack } from 'connected-react-router';

import { connect } from 'react-redux';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import mapRouterParamsToProps from '../../hocs/router-params-to-props.hoc';

import { createOrUpdateCoach } from '../../libs/associated-coach/actions';
import CoachForm from '../../libs/associated-coach/components/CoachForm.component';

import { mapFormData, unmap } from '../form.utils';

import withDrawer from '../../hocs/with-drawer.hoc';

type Props = {
  initial: *,
  onSubmit: (*) => void,
  onCancel: (*) => void,
};

const CoachMap = {
  avatar: 'photo',
  firstname: 'first_name',
  lastname: 'last_name',
  gender: 'gender',
  birthday: 'birthday',
  email: 'email',
  description: 'description',
  phone: 'phone.phone_number',
  facebook_url: 'facebook_url',
  instagram_url: 'instagram_url',
};

export function CoachFormPage(props: Props) {
  const { initial, onSubmit, onCancel } = props;
  const initialData = initial
    ? {
        ...unmap(initial, CoachMap),
      }
    : null;
  return (
    <CoachForm onSubmit={onSubmit} onCancel={onCancel} initial={initialData} />
  );
}

export default compose(
  withNamespaces(),
  mapRouterParamsToProps({ id: 'coachId:number' }),
  connect(
    (state, { coachId }) => ({
      pending: state.coach.upsert.loading,
      errors: state.coach.upsert.error,
      initial:
        coachId !== null
          ? state.coach.companyAssociated.find((c) => c.id === coachId)
          : null,
    }),
    {
      onCancel: goBack,
      upsertCoach: createOrUpdateCoach,
    },
  ),
  withProps(({ upsertCoach, initial }) => ({
    onSubmit: (values, options) => {
      if (!values.birthday) {
        // eslint-disable-next-line
        delete values.birthday;
      }
      const formData = mapFormData(values, CoachMap);

      if (initial) {
        formData.append('id', initial.id);
      }

      upsertCoach(formData, options);
    },
  })),
  withDrawer(({ t }: { t: TFunction }) => t('appbar.title.coachFormPage')),
)(CoachFormPage);
