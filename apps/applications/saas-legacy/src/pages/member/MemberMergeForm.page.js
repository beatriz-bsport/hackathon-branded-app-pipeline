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
import { getMemberDetail } from '../../libs/member/selectors';
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
import type { OptionCallback } from '../../state/types';
import { getLocaleCountry } from '#src/utils/language';

type Props = {
  theme: Theme,
  src: number,
  dst: number,
  srcMember?: Member,
  dstMember?: Member,
  goToMember: (id: number) => void,
  fetchMember: (id: number) => void,
  onSubmit: (data: any, options: any) => void,
  replace: (path: string) => void,
  country: string,
};

type State = {
  showConfirmDialog: boolean,
  data: any,
  options: OptionCallback,
};

export class MemberMergeFormPage extends Component<Props, State> {
  state = {
    showConfirmDialog: false,
    data: null,
    options: null,
  };

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    this.props.fetchMember(this.props.src);
    this.props.fetchMember(this.props.dst);
  };

  componentDidUpdate(prevProps: Props) {
    if (prevProps.src !== this.props.src || prevProps.dst !== this.props.dst) {
      this.fetchData();
    }
  }

  preSubmit = (data: any, options: any) =>
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
        <MemberMergeForm
          country={this.props.country}
          dstMember={this.props.dstMember}
          generalTermsAndConditions={
            this.props.theme.general_terms_and_conditions
          }
          goToMember={this.props.goToMember}
          onSubmit={this.preSubmit}
          srcMember={this.props.srcMember}
          switchSrcDst={this.switchSrcDst}
          waiver={this.props.theme.waiver}
        />

        <MemberConfirmMergeDialog
          onClose={this.closeDialog}
          onSubmit={this.mergeMembers}
          open={this.state.showConfirmDialog}
        />
      </div>
    );
  }
}

export default compose(
  routerParamsToProps({ src: 'src:number', dst: 'dst:number' }),
  connect(
    (state, { dst, src }) => ({
      theme: state.theme.theme,
      srcMember: getMemberDetail(state, src),
      dstMember: getMemberDetail(state, dst),
      country: getLocaleCountry(state.theme.theme.locale),
    }),
    {
      fetchMember,
      replace: replaceRouter,
      goToMember: (id: number) => pushRouter(`/member/${id}/`),
      switchMerge: (src: number, dst: number) =>
        pushRouter(`/member/merge/${dst}/into/${src}`),
      mergeMembers: mergeMembersAction,
      upsertMember: createOrUpdateMember,
    },
  ),
  withProps(({ mergeMembers, upsertMember, dst, src }) => ({
    onSubmit: (values, options) => {
      if (!values.birthday) {
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
            },
          });
        },
      });
    },
  })),
  withTranslation(),
  withTitle(({ t }) => t('titles:member.mergeMember')),
)(MemberMergeFormPage);
