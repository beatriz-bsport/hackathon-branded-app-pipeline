// @flow

import React from 'react';
import { compose, withProps, withState } from 'recompose';

import { goBack, push } from 'connected-react-router';

import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import mapRouterParamsToProps from '../../hocs/router-params-to-props.hoc';

import {
  createOrUpdateCoach,
  linkByEmail as linkCoachViaEmail,
} from '../../libs/associated-coach/actions';
import CoachForm from '../../libs/associated-coach/components/CoachForm.component';
import CoachEmailCheckDialog from '../../libs/associated-coach/components/CoachEmailCheckDialog.component';

import { mapFormData, unmap } from '../form.utils';

import withDrawer from '../../hocs/with-drawer.hoc';

type Props = {
  initial: *,
  onSubmit: (*) => void,
  onCancel: (*) => void,

  initialEmail: ?string,
  setInitialEmail: (email: string) => void,

  push: (path: string) => void,
  linkCoachViaEmail: (
    email: string,
    options: { onSuccess: () => void, onError: () => void },
  ) => void,
  setIsEmailChecking: (boolean) => void,
  isEmailChecking: boolean,
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
  const { initial, isEmailChecking, onSubmit, onCancel } = props;
  const initialData = initial
    ? {
        ...unmap(initial, CoachMap),
      }
    : null;

  return (
    <div>
      <Dialog open={!initial && isEmailChecking}>
        <CoachEmailCheckDialog
          onCancel={props.onCancel}
          submit={(email) => {
            props.linkCoachViaEmail(email, {
              onSuccess: () => {
                props.push('/coach');
                props.setIsEmailChecking(false);
              },
              onError: () => {
                props.setInitialEmail(email);
                props.setIsEmailChecking(false);
              },
            });
          }}
        />
      </Dialog>
      <CoachForm
        onSubmit={onSubmit}
        onCancel={onCancel}
        initial={initialData}
        defaultEmail={props.initialEmail}
      />
    </div>
  );
}

export default compose(
  withNamespaces(),
  mapRouterParamsToProps({ id: 'coachId:number' }),
  withState('isEmailChecking', 'setIsEmailChecking', true),
  withState('initialEmail', 'setInitialEmail', null),
  connect(
    (state, { coachId, initialEmail }) => ({
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
      linkCoachViaEmail,
      push,
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
