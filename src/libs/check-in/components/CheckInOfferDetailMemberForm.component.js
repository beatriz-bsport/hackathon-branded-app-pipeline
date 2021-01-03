// @flow
import React from 'react';
import { compose, withProps } from 'recompose';
import { connect } from 'react-redux';

import { snackbar } from '../../../actions/snackbar.actions';
import MemberForm from '../../member/MemberForm.component';
import { MemberMap } from '../../member/utils';

import { mapFormData } from '../../../pages/form.utils';

type Props = {
  snackbarSuccess: (msg: string) => void,
  onSubmit: (*) => void,
  onClose: () => void,
  onAlreadyLinkMember: (memberId: number) => void,
  onLinkMember: () => void,
  initial: any,
};
export const CheckInOfferDetailMemberForm = (props: Props) => {
  const initialData = {
    ...(props.initial || {}),
    birthday: null,
    rgpd: ['accept_email', 'accept_sms'],
  };
  return (
    <MemberForm
      onCancel={props.onClose}
      onSubmit={props.onSubmit}
      initial={initialData}
      goToMember={props.onAlreadyLinkMember}
      goToMemberList={props.onLinkMember}
      snackbarSuccess={props.snackbarSuccess}
      fromConsumerAccess
    />
  );
};

export default compose(
  connect(null, {
    snackbarSuccess: (msg) => snackbar.success(msg),
  }),
  withProps(({ onSubmit }) => ({
    onSubmit: (values, options) => {
      if (!values.birthday) {
        // eslint-disable-next-line
        delete values.birthday;
      }
      const formData = mapFormData(values, MemberMap);
      onSubmit(values.id, formData, options);
    },
  })),
)(CheckInOfferDetailMemberForm);
