import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import moment from 'moment-timezone';
import Dialog from '@material-ui/core/Dialog';
import { push as pushRouter } from 'connected-react-router';
import { fetchSignFormUpConfiguration } from '../../libs/sign-up-form/actions';
import { getSignUpFormConfigurationDict } from '../../libs/sign-up-form/selectors';
import { fetchCurrentBasket as fetchCurrentBasketAction } from '../../libs/checkout/actions';
import MemberForm from '../../libs/member/MemberForm.component';
import {
  snackbarWarning,
  snackbarSuccess,
} from '../../actions/snackbar.actions';
import {
  createOrUpdateMember,
  fetchMember as fetchMemberAction,
  fetchMyUserProfile,
} from '../../libs/member/actions';
import {
  linkMeToCompany as linkMeToCompanyAction,
  requestMembershipValidation as requestMembershipValidationAction,
} from '../../libs/membership/actions';
import {
  getMemberThroughMembership,
  getMemberDetailData,
} from '../../libs/member/selectors';
import { MemberMap } from '../../libs/member/utils';
import { mapFormData, unmap } from '../form.utils';
import { RootState } from '../../reducers';
import type { Membership } from '../../libs/membership/types';
import { getMembership } from '../../libs/membership/selectors';
import { disconnect } from '../../actions/auth.actions';

type OwnProps = {
  companyId: number;
  membership: Membership;
  disconnect: () => void;
  onUpdateMember: (values: MemberMap, options?: any) => void;
  authenticated: boolean;
};

type Props = OwnProps &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;
export class MemberShipValidationWrapper extends React.Component<Props> {
  componentDidMount() {
    if (this.props.companyId) {
      this.props.fetchSignFormUpConfiguration({
        membership: this.props.companyId,
      });
      if (this.props.authenticated) {
        this.props.requestMembershipValidation({
          company: this.props.companyId,
        });
      }
    }

    if (this.props.membership) {
      this.props.fetchMember(
        typeof this.props.membership === 'number'
          ? this.props.membership
          : this.props.membership.id,
      );
      this.props.fetchCurrentBasket(this.props.companyId);
    } else {
      this.props.fetchMyUserProfile();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.authenticated && !prevProps.authenticated) {
      this.props.requestMembershipValidation({
        company: this.props.companyId,
      });
    }
    if (
      prevProps.membership &&
      prevProps.membership !== this.props.membership
    ) {
      this.props.fetchMember(
        typeof this.props.membership === 'number'
          ? this.props.membership
          : this.props.membership.id,
      );
      this.props.fetchCurrentBasket(this.props.companyId);
    }
  }

  render() {
    const initial = this.props.member || this.props.userProfile;
    const initialData = initial
      ? {
          ...unmap(initial, MemberMap),
          date_joined: moment(initial.date_joined),
          waiver: !!initial.waiver_accepted,
        }
      : {
          birthday: null,
          gender: 'F',
        };

    if (initialData && initial) {
      if (initial.phone_number) {
        initialData.phone = initial.phone_number;
      }
      delete initialData.address;
    }
    return (
      <>
        <Dialog
          open={
            !this.props.managerFormConfigLoading &&
            this.props.authenticated &&
            !this.props.isValidated
          }
        >
          {initialData && !this.props.managerFormConfigLoading && (
            <MemberForm
              hideManagerStuff
              managerFormConfig={this.props.managerFormConfig?.poll_fields}
              onCancel={() => this.props.disconnect()}
              memberId={this.props.member && this.props.member.id}
              theme={this.props.theme}
              onSubmit={this.props.onUpdateMember}
              initial={initialData}
              snackbarSuccess={this.props.snackbarSuccessMsg}
              country={this.props.country}
              missingInformation={this.props.missingInformation}
              userStatus={this.props.userStatus}
            />
          )}
        </Dialog>
        {this.props.children}
      </>
    );
  }
}

const mapStateToProps = (state: RootState, { companyId }) => ({
  authenticated: state.auth.authenticated,
  isValidated:
    state.membership.memberShipValidation.missingInformation.validated,
  missingInformation:
    state.membership.memberShipValidation.missingInformation.fields,
  userStatus: state.membership.memberShipValidation.missingInformation.status,
  managerFormConfig: getSignUpFormConfigurationDict(state),
  managerFormConfigLoading: state.poll.signUpForm.loading,
  member: getMemberThroughMembership(getMemberDetailData)(state, companyId),
  membership: getMembership(state, companyId),
  userProfile: state.member.userProfile.profile,
  memberLoading: state.member.loading,
});

const mapDispatchToProps = {
  fetchMember: fetchMemberAction,
  push: pushRouter,
  upsertMember: (id: number, data, options) =>
    createOrUpdateMember(id, data, options),
  fetchSignFormUpConfiguration,
  snackbarErrorMsg: snackbarWarning,
  snackbarSuccessMsg: snackbarSuccess,
  fetchMyUserProfile,
  linkMeToCompany: linkMeToCompanyAction,
  requestMembershipValidation: requestMembershipValidationAction,
  fetchCurrentBasket: fetchCurrentBasketAction,
  disconnectAction: disconnect,
};
export default compose<any, OwnProps>(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    disconnect: ({ disconnectAction }) => () => {
      disconnectAction();
    },
  }),
  withHandlers({
    onUpdateMember: ({
      upsertMember,
      membership,
      fetchMember,
      requestMembershipValidation,
      companyId,
      linkMeToCompany,
      fetchCurrentBasket,
    }) => (values: MemberMap, options?: any) => {
      if (!values.birthday) {
        // eslint-disable-next-line
          delete values.birthday;
      }
      const formData = mapFormData(values, MemberMap);
      if (!membership) {
        linkMeToCompany(
          { company: companyId },
          {
            onSuccess: (payload) => {
              formData.append('id', payload.id);
              upsertMember(payload.id, formData, {
                ...options,
                onSuccess: () => {
                  fetchMember(payload.id);
                  options.onSuccess();
                  requestMembershipValidation({ company: companyId });
                  fetchCurrentBasket(companyId);
                },
              });
            },
          },
        );
      } else {
        formData.append('id', membership.id);
        upsertMember(membership.id, formData, {
          ...(options || {}),
          onSuccess: () => {
            fetchMember(membership.id);
            if (options && options.onSuccess) options.onSuccess();
            requestMembershipValidation({ company: companyId });
            fetchCurrentBasket(companyId);
          },
        });
      }
    },
  }),
)(MemberShipValidationWrapper);
