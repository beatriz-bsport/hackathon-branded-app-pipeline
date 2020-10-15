// @flow
import React from 'react';
import { compose, withProps } from 'recompose';
import { connect } from 'react-redux';

import { goBack as goBackAction } from 'connected-react-router';
import { snackbar } from '../../actions/snackbar.actions';
import MemberForm from '../../libs/member/MemberForm.component';
import { createOrUpdateMember } from '../../libs/member/actions';
import { MemberMap } from '../../libs/member/utils';

import { mapFormData } from '../form.utils';

type Props = {
  snackbarSuccess: (msg: string) => void,
  onSubmit: (*) => void,
  goBack: () => void,
  country: string,
};
export const CompanyExternalAddMember = (props: Props) => {
  const initialData = {
    birthday: null,
    rgpd: ['accept_email', 'accept_sms'],
  };
  return (
    <MemberForm
      onCancel={props.goBack}
      onSubmit={props.onSubmit}
      initial={initialData}
      goToMember={props.goBack}
      goToMemberList={props.goBack}
      snackbarSuccess={props.snackbarSuccess}
      fromConsumerAccess
      country={props.country}
    />
  );
};

export default compose(
  connect(
    (state) => ({
      errors: state.member.upsert.error,
      country: state.theme.theme.locale.split('_')[1],
    }),
    {
      goBack: goBackAction,
      snackbarSuccess: (msg) => snackbar.success(msg),
      upsertMember: createOrUpdateMember,
    },
  ),
  withProps(({ upsertMember, goBack }) => ({
    onSubmit: (values, options) => {
      if (!values.birthday) {
        // eslint-disable-next-line
        delete values.birthday;
      }
      const formData = mapFormData(values, MemberMap);

      upsertMember(values.id, formData, {
        ...options,
        onSuccess: () => {
          options.onSuccess();
          goBack();
        },
      });
    },
  })),
)(CompanyExternalAddMember);
