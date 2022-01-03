import React, { Component } from 'react';
import { replace, push as pushRouter, goBack } from 'connected-react-router';
import { connect, ConnectedProps } from 'react-redux';
import { compose, withHandlers, withStateHandlers } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import moment from 'moment-timezone';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import type { OptionCallback } from 'src/state/types';
import type { RootState } from '../../reducers';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { snackbar } from '#libs/snackbar/actions';
import MemberForm from '#libs/member/MemberForm.component';
import {
  createOrUpdateMember,
  fetchMember,
  createChangeEmailRequest,
  mergeMembers as mergeMembersAction,
  retrieveMemberPendingEmail,
} from '#libs/member/actions';
import { getMember } from '#libs/member/selectors';
import { getLatest as getLatestMember } from '#libs/member/api';
import { MemberMap } from '#libs/member/utils';
import themeSelectors from '#libs/theme/selectors';

import { mapFormData, unmap } from '../form.utils';
import withTitle from '../../hocs/with-title.hoc';
import { withMemberBannerHOC } from '../../hocs/banner.hoc';
import { getAuth, API_URI } from '../../http';
import MemberChangeEmailDialog from '#libs/member/components/MemberChangeEmailDialog.component';
import { getCompanyCountry } from '#libs/company/selectors';
import type { WithHandlerType } from '../../utils/types';
import type { Member } from '#libs/member/types';

type OwnProps = {
  id: number;
};
type StateHandlerInit = {
  emailExistsStatus: {
    exists: boolean;
    status_code: number | null;
    member_pk: number | null;
    old_email: string | null;
    updated_email: string | null;
    error: boolean;
  };
  values: Member | null;
};
type StateHandlerType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;
type OwnAndConnectedProps = OwnProps &
  ConnectedProps<typeof connector> &
  StateHandlerType;

type Props = OwnAndConnectedProps &
  WithTranslation &
  WithHandlerType<typeof mapWithHandlers>;

export class MemberFormPage extends Component<Props> {
  componentDidMount() {
    if (this.props.id) {
      this.props.fetchMemberInitial(this.props.id, {
        onSuccess: () => this.props.retrieveMemberPendingEmail(this.props.id),
      });
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.id !== this.props.id) {
      this.props.fetchMemberInitial(this.props.id, {
        onSuccess: () => this.props.retrieveMemberPendingEmail(this.props.id),
      });
    }
  }

  onSubmit = async (values: Member, options: OptionCallback) => {
    this.props.setValues(values);
    if (
      this.props.initial?.email &&
      this.props.initial?.email !== values.email
    ) {
      const emailExistsData = await this.props.checkEmailExists(
        this.props.initial.email,
        values.email,
      );
      if (options && options.onSuccess) options.onSuccess();
      return this.props.setEmailExistsStatus(emailExistsData);
    }
    return this.props.upsertMember(values, options);
  };

  sendChangeEmailRequestAndUpsert = () => {
    if (
      this.props.emailExistsStatus?.exists &&
      this.props.emailExistsStatus?.member_pk
    ) {
      return this.props.simpleUpsertMember(this.props.values, {
        onSuccess: () =>
          this.props.createChangeEmailRequest(
            {
              member: this.props.initial.id,
              new_email: this.props.emailExistsStatus.updated_email,
            },
            {
              onSuccess: () =>
                this.props.mergeMembers(
                  this.props.initial?.id,
                  this.props.emailExistsStatus.member_pk,
                  {
                    onSuccess: () =>
                      this.props.goToMember(
                        this.props.emailExistsStatus.member_pk,
                      ),
                  },
                ),
            },
          ),
      });
    }
    return this.props.upsertMember(this.props.values, {
      onSuccess: () =>
        this.props.createChangeEmailRequest(
          {
            member: this.props.initial.id,
            new_email: this.props.emailExistsStatus.updated_email,
          },
          {
            onSuccess: () => this.props.goToMember(this.props.initial.id),
          },
        ),
    });
  };

  resetEmailExists = () => {
    this.props.setEmailExistsStatus({
      exists: false,
      status_code: null,
      old_email: null,
      updated_email: null,
      member_pk: null,
      error: false,
    });
  };

  render() {
    const { initial, id, onCancel } = this.props;
    if (id && !initial) {
      return <CircularProgress />;
    }
    const initialData = initial
      ? {
          ...unmap(initial, MemberMap),
          date_joined: moment(initial.date_joined),
          waiver: !!initial.waiver_accepted,
          pending_email: initial?.pending_email,
        }
      : null;

    if (initialData && initial) {
      if (initial.phone_number) {
        initialData.phone = initial.phone_number;
      }
      delete initialData.address;
    }
    return (
      <>
        <Paper>
          <MemberForm
            onCancel={onCancel}
            memberId={id}
            theme={this.props.theme}
            onSubmit={this.onSubmit}
            asManager
            initial={initialData}
            goToMember={this.props.goToMember}
            goToMerge={this.props.goToMerge}
            goToMemberList={this.props.goToMemberList}
            snackbarSuccess={this.props.snackbarSuccess}
            country={this.props.country}
            waiver={this.props.theme.waiver}
            generalTermsAndConditions={
              this.props.theme.general_terms_and_conditions
            }
          />
        </Paper>
        <MemberChangeEmailDialog
          open={this.props.emailExistsStatus?.exists}
          data={this.props.emailExistsStatus}
          onConfirm={this.sendChangeEmailRequestAndUpsert}
          onCancel={this.resetEmailExists}
        />
      </>
    );
  }
}

const connector = connect(
  (state: RootState, { id }: { id: number }) => ({
    id,
    errors: state.member.upsert.error,
    initial: id !== null ? getMember(state, id) : null,
    theme: themeSelectors.getTheme(state),
    country: getCompanyCountry(state),
  }),
  {
    replace,
    fetchMemberInitial: fetchMember,
    upsertMemberAction: createOrUpdateMember,
    onCancel: goBack,
    goToMember: (pk: number) => pushRouter(`/member/${pk}/`),
    goToMerge: (memberPk: number, existingMemberPk: number) =>
      pushRouter(`/member/merge/${memberPk}/into/${existingMemberPk}`),
    goToMemberList: () => pushRouter('/member'),
    snackbarSuccess: snackbar.success,
    mergeMembers: mergeMembersAction,
    createChangeEmailRequest,
    retrieveMemberPendingEmail,
  },
);

const mapWithHandlers = {
  upsertMember:
    (props: OwnAndConnectedProps) =>
    (values: Member, options: OptionCallback) => {
      delete values.pending_email; // eslint-disable-line no-param-reassign
      if (!values.birthday) {
        delete values.birthday; // eslint-disable-line no-param-reassign
      }
      if (props.emailExistsStatus?.exists) {
        values.email = props.initial.email; // eslint-disable-line no-param-reassign
      }
      const formData = mapFormData(values, MemberMap);
      if (props.initial) {
        formData.append('id', props.initial?.id);
      }
      props.upsertMemberAction(props.initial?.id, formData, {
        ...options,
        onSuccess: () => {
          if (props.initial && props.initial.id) {
            props.goToMember(props.initial.id);
          } else {
            getLatestMember()
              .then((res) => props.goToMember(res.data))
              .catch((err) => {
                console.error(err);
                props.goToMemberList();
              });
          }
          options.onSuccess();
        },
      });
    },
  simpleUpsertMember:
    (props: OwnAndConnectedProps) =>
    (values: Member, options: OptionCallback) => {
      if (!values.birthday) {
        delete values.birthday; // eslint-disable-line no-param-reassign
      }
      values.email = props.initial.email; // eslint-disable-line no-param-reassign
      delete values.pending_email; // eslint-disable-line no-param-reassign
      const formData = mapFormData(values, MemberMap);
      if (props.initial) {
        formData.append('id', props.initial?.id);
      }
      props.upsertMemberAction(props.initial.id, formData, {
        onSuccess: () => options.onSuccess(),
      });
    },
  checkEmailExists:
    () => async (old_email: string, updated_email: string | null) => {
      if (updated_email) {
        const q = `email=${updated_email}`;
        try {
          await getAuth(`${API_URI}/saas/members/members/exists/?${q}`);
        } catch (error) {
          const { status, data } = error.response || {};
          if (status !== 404) {
            if (status === 302 && data.member_pk) {
              return {
                exists: true,
                status_code: status,
                old_email,
                updated_email,
                member_pk: data.member_pk,
                error: false,
              };
            }
            return {
              exists: true,
              status_code: status,
              old_email,
              updated_email,
              member_pk: data.member_pk,
              error: false,
            };
          }
          if (status === 404) {
            return {
              exists: true,
              status_code: status,
              old_email,
              updated_email,
              member_pk: null,
              error: true,
            };
          }
        }
      }
      return {
        exists: true,
        status_code: null,
        old_email,
        updated_email,
        member_pk: null,
        error: true,
      };
    },
};

const withStateHandlersInit: StateHandlerInit = {
  emailExistsStatus: {
    exists: false,
    status_code: null,
    old_email: null,
    updated_email: null,
    member_pk: null,
    error: null,
  },
  values: null,
};
const withStateHandlersSetter = {
  setEmailExistsStatus:
    () =>
    (emailExistsStatus: {
      exists: boolean;
      status_code: number | null;
      old_email: string | null;
      updated_email: string | null;
      member_pk: number | null;
      error: boolean;
    }) => {
      return { emailExistsStatus };
    },
  setValues: () => (values: Member | null) => {
    return { values };
  },
};
export default compose(
  routerParamsToProps({ id: 'id:number' }),
  withTranslation(['member']),
  withTitle(({ t }: { t: TFunction }) => t('titles:member.memberFormPage')),
  withMemberBannerHOC(({ initial }) => initial),
  connector,
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
  withHandlers(mapWithHandlers),
)(MemberFormPage);
