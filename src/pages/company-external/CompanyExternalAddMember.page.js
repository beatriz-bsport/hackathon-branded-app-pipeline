// @flow
import React from 'react';
import { compose, withProps } from 'recompose';
import { connect } from 'react-redux';

import { goBack as goBackAction } from 'connected-react-router';
import { snackbar } from '../../libs/snackbar/actions';
import MemberForm from '../../libs/member/MemberForm.component';
import { createOrUpdateMember } from '../../libs/member/actions';
import { MemberMap } from '../../libs/member/utils';

import { mapFormData } from '../form.utils';
import { getSignUpFormConfigurationDict } from '../../libs/sign-up-form/selectors';
import { fetchSignFormUpConfiguration } from '../../libs/sign-up-form/actions';

type Props = {
  theme: Theme,
  snackbarSuccess: (msg: string) => void,
  onSubmit: (*) => void,
  goBack: () => void,
  country: string,
  managerFormConfig: SignUpFormConfigDict,
  fetchSignFormUpConfiguration: () => void,
};
export const CompanyExternalAddMember = (props: Props) => {
  React.useEffect(() => {
    props.fetchSignFormUpConfiguration();
  }, []);
  return (
    <MemberForm
      onCancel={props.goBack}
      onSubmit={props.onSubmit}
      goToMember={props.goBack}
      goToMemberList={props.goBack}
      snackbarSuccess={props.snackbarSuccess}
      fromConsumerAccess
      country={props.country}
      managerFormConfig={props.managerFormConfig?.poll_fields}
      waiver={props.theme.waiver}
      generalTermsAndConditions={props.theme.generalTermsAndConditions}
    />
  );
};

export default compose(
  connect(
    (state) => ({
      theme: state.theme.theme,
      errors: state.member.upsert.error,
      country: state.theme.theme.locale.split('_')[1],
      companyId: state.theme.companyId,
      managerFormConfig: getSignUpFormConfigurationDict(state),
    }),
    {
      goBack: goBackAction,
      snackbarSuccess: (msg) => snackbar.success(msg),
      upsertMember: createOrUpdateMember,
      fetchSignFormUpConfiguration,
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
