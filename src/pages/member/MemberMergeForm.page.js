// @flow
//
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';
import { withNamespaces } from 'react-i18next';
import {
  replace as replaceRouter,
  push as pushRouter,
  goBack,
} from 'react-router-redux';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import withTitle from '../../hocs/with-title.hoc';
import memberSelectors from '../../libs/member/selectors';
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

type Props = {
  src: number,
  dst: number,
  srcMember: ?Member,
  dstMember: ?Member,
  fetchMember: (id: number) => void,
  onCancel: () => void,
  onSubmit: (data: *, options: any) => void,
  replace: (path: string) => void,
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
        <MemberMergeForm
          srcMember={this.props.srcMember}
          dstMember={this.props.dstMember}
          switchSrcDst={this.switchSrcDst}
          onCancel={this.props.onCancel}
          onSubmit={this.preSubmit}
        />
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
      srcMember: memberSelectors.get(state, src),
      dstMember: memberSelectors.get(state, dst),
    }),
    {
      fetchMember,
      replace: replaceRouter,
      goToMember: (id: number) => pushRouter(`/member/${id}/`),
      mergeMembers: mergeMembersAction,
      upsertMember: createOrUpdateMember,
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

      upsertMember(formData, {
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
    onCancel: goBack,
  })),
  withNamespaces(),
  withTitle(({ t }) => t('titles:member.mergeMember')),
)(MemberMergeFormPage);
