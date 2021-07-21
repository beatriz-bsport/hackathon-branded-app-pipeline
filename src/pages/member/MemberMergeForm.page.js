// @flow
//
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';
import { withTranslation } from 'react-i18next';
import {
  replace as replaceRouter,
  push as pushRouter,
} from 'connected-react-router';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import withTitle from '../../hocs/with-title.hoc';
import { getMember } from '../../libs/member/selectors';
import MemberMergeForm from '../../libs/member/components/MemberMergeForm.component';
import MemberConfirmMergeDialog from '../../libs/member/components/MemberConfirmMergeDialog.component';
import { MemberMap } from '../../libs/member/utils';
import type { Member } from '../../libs/member/types';
import {
  fetchMember,
  mergeMembers as mergeMembersAction,
  createOrUpdateMember,
} from '../../libs/member/actions';
import { mapFormData } from '../form.utils';
import { fetchSignFormUpConfiguration } from '../../libs/sign-up-form/actions';
import { getSignUpFormConfigurationDict } from '../../libs/sign-up-form/selectors';
import type { SignUpFormConfigDict } from '../../libs/sign-up-form/types';

type Props = {
  src: number,
  dst: number,
  srcMember: ?Member,
  dstMember: ?Member,
  goToMember: (id: number) => void,
  fetchMember: (id: number) => void,
  onSubmit: (data: *, options: any) => void,
  replace: (path: string) => void,
  country: string,
  fetchSignFormUpConfiguration: () => void,
  managerFormConfigLoading: boolean,
  managerFormConfig: SignUpFormConfigDict,
};

type State = {
  showConfirmDialog: boolean,
  data: *,
};

export class MemberMergeFormPage extends Component<Props, State> {
  state = {
    showConfirmDialog: false,
    data: null,
  };

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    this.props.fetchMember(this.props.src);
    this.props.fetchMember(this.props.dst);
    this.props.fetchSignFormUpConfiguration();
  };

  componentDidUpdate(prevProps: Props) {
    if (prevProps.src !== this.props.src || prevProps.dst !== this.props.dst) {
      this.fetchData();
    }
  }

  preSubmit = (data: *, options: any) =>
    this.setState({ data, showConfirmDialog: true, options });

  mergeMembers = () => {
    this.props.onSubmit(this.state.data, this.state.options);
    this.setState({ showConfirmDialog: false, data: null, options: null });
  };

  closeDialog = () => {
    this.state.options.onSuccess();
    this.setState({
      showConfirmDialog: false,
    });
  };

  switchSrcDst = () => {
    const { dst, src } = this.props;
    this.props.replace(`/member/merge/${dst}/into/${src}/`);
  };

  render() {
    return (
      <div>
        {!this.props.managerFormConfigLoading && (
          <MemberMergeForm
            srcMember={this.props.srcMember}
            dstMember={this.props.dstMember}
            switchSrcDst={this.switchSrcDst}
            goToMember={this.props.goToMember}
            onSubmit={this.preSubmit}
            country={this.props.country}
            managerFormConfig={this.props.managerFormConfig?.poll_fields}
          />
        )}

        <MemberConfirmMergeDialog
          open={this.state.showConfirmDialog}
          onClose={this.closeDialog}
          onSubmit={this.mergeMembers}
        />
      </div>
    );
  }
}

export default compose(
  routerParamsToProps({ src: 'src:number', dst: 'dst:number' }),
  connect(
    (state, { dst, src }) => ({
      srcMember: getMember(state, src),
      dstMember: getMember(state, dst),
      country: state.theme.theme.locale.split('_')[1],
      managerFormConfig: getSignUpFormConfigurationDict(state),
      managerFormConfigLoading: state.poll.signUpForm.loading,
    }),
    {
      fetchMember,
      replace: replaceRouter,
      goToMember: (id: number) => pushRouter(`/member/${id}/`),
      switchMerge: (src: number, dst: number) =>
        pushRouter(`/member/merge/${dst}/into/${src}`),
      mergeMembers: mergeMembersAction,
      upsertMember: createOrUpdateMember,
      fetchSignFormUpConfiguration,
    },
  ),
  withProps(({ goToMember, mergeMembers, upsertMember, dst, src }) => ({
    onSubmit: (values, options) => {
      if (!values.birthday) {
        // eslint-disable-next-line
        delete values.birthday;
      }
      const formData = mapFormData(values, MemberMap);

      formData.append('id', dst);

      upsertMember(dst, formData, {
        ...options,
        onSuccess: () => {
          mergeMembers(src, dst, {
            onSuccess: () => {
              options.onSuccess();
              goToMember(dst);
            },
          });
        },
      });
    },
  })),
  withTranslation(),
  withTitle(({ t }) => t('titles:member.mergeMember')),
)(MemberMergeFormPage);
