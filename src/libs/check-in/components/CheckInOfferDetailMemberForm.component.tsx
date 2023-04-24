// @ts-nocheck
import React from 'react';
import { compose, withProps } from 'recompose';
// eslint-disable-next-line bsport/no-redux-in-component
import { connect } from 'react-redux';

import { snackbar } from '../../snackbar/actions';
import MemberForm from '../../member/MemberForm.component';
import { MemberMap } from '../../member/utils';

import { mapFormData } from '../../../pages/form.utils';
import { OptionCallback } from '../../../state/types';

type Props = {
  snackbarSuccess: (msg: string) => void;
  onSubmit: () => void;
  onClose: () => void;
  onAlreadyLinkMember: (memberId: number) => void;
  onLinkMember: () => void;
  waiver: string;
  generalTermsAndConditions: string;
  companyCountry: string;
};

export const CheckInOfferDetailMemberForm: React.FC<Props> = ({
  snackbarSuccess,
  onSubmit,
  onClose,
  onAlreadyLinkMember,
  onLinkMember,
  waiver,
  generalTermsAndConditions,
  companyCountry,
}) => {
  return (
    <MemberForm
      onCancel={onClose}
      onSubmit={onSubmit}
      goToMember={onAlreadyLinkMember}
      goToMemberList={onLinkMember}
      snackbarSuccess={snackbarSuccess}
      fromConsumerAccess
      waiver={waiver}
      generalTermsAndConditions={generalTermsAndConditions}
      companyCountry={companyCountry}
    />
  );
};

export default compose(
  connect(null, {
    snackbarSuccess: (msg: string) => snackbar.success(msg),
  }),
  withProps(({ onSubmit }) => ({
    onSubmit: (values: any, options: OptionCallback) => {
      if (!values.birthday) {
        // eslint-disable-next-line
        delete values.birthday;
      }
      const formData = mapFormData(values, MemberMap);
      onSubmit(values.id, formData, options);
    },
  })),
)(CheckInOfferDetailMemberForm);
