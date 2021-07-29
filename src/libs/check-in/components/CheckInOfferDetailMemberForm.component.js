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
  managerFormConfig: SignUpFormConfigDict,
  waiver: string,
  generalTermsAndConditions: string,
};
export const CheckInOfferDetailMemberForm = (props: Props) => {
  return (
    <MemberForm
      onCancel={props.onClose}
      onSubmit={props.onSubmit}
      goToMember={props.onAlreadyLinkMember}
      goToMemberList={props.onLinkMember}
      snackbarSuccess={props.snackbarSuccess}
      fromConsumerAccess
      managerFormConfig={props.managerFormConfig}
      waiver={props.waiver}
      generalTermsAndConditions={props.generalTermsAndConditions}
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
