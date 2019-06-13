// @flow

import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import { push as routerPush } from 'react-router-redux';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { TAG_KIND_MEMBER } from '@bsport/common/lib/master-data/tag';
import LinearProgress from '@material-ui/core/LinearProgress';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import {
  createOrUpdateNote as createOrUpdateMemberNote,
  deleteNote,
  fetchMember,
  tag as tagMember,
  search as searchMembers,
} from '../../libs/member/actions';
import memberSelectors from '../../libs/member/selectors';
import type { Member } from '../../libs/member/types';
import MemberSummaryCard from '../../libs/member/components/MemberSummaryCard.component';
import TagDeleteDialog from '../../libs/tag/components/TagDeleteDialog.component';
import TagGroupDeleteDialog from '../../libs/tag/components/TagGroupDeleteDialog.component';
import MemberCRM from '../../libs/member/components/MemberCRM.component';
import MemberSearchModal from '../../libs/member/components/MemberSearchModal.component';

import type { TagGroup } from '../../libs/tag/types';
import tagSelectors from '../../libs/tag/selectors';
import {
  fetchTags,
  createOrUpdateTag,
  createOrUpdateTagGroup,
  deleteTagGroup,
  deleteTag,
} from '../../libs/tag/actions';

type Props = {
  // GENERAL
  // -------
  id: number,
  memberLoading: boolean,
  member: Member,

  editMember: (id: number) => void,
  fetchMember: (id: number) => void,
  searchMembers: (text: string) => void,
  searchedMembers: Array<Member>,
  mergeInto: (src: number, dst: number) => void,

  // NOTES
  // -----
  createOrUpdateNote: ({
    id: ?number,
    text: string,
    memberId: number,
    highlighted: boolean,
  }) => void,
  deleteNote: ({ memberId: number, noteId: number }) => void,

  // TAGS
  // ----
  tagGroups: Array<TagGroup>,
  tagGroupsLoading: boolean,

  fetchTags: () => void,
  createTag: (data: *, memberId?: number) => void,
  updateTag: (data: *) => void,
  updateTagGroup: (data: *) => void,
  deleteTag: (id: number) => void,
  deleteTagGroup: (id: number) => void,
  createTagGroup: ({ name: string, group: number }) => void,
  tagMember: (memberId: number, tagId: number) => void,
};

type State = {
  searchModalOpen: boolean,
};

export class MemberDetailPage extends Component<Props, State> {
  state = {
    searchModalOpen: false,
    tagToDelete: null,
    tagGroupToDelete: null,
  };

  componentDidMount() {
    this.props.fetchMember(this.props.id);
    this.props.fetchTags();
  }

  deleteTag = (id: number) => this.setState({ tagToDelete: id });

  deleteTagGroup = (id: number) => this.setState({ tagGroupToDelete: id });

  render() {
    const { memberLoading, member } = this.props;
    if (!member || (memberLoading && member.id !== this.props.id)) {
      return <LinearProgress />;
    }

    return (
      <Grid container direction="row" spacing={16}>
        <Grid item md={6} xs={12}>
          <MemberSummaryCard
            memberId={this.props.id}
            member={this.props.member}
            editMember={() => this.props.editMember(this.props.id)}
            mergeMember={() => this.setState({ searchModalOpen: true })}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <MemberCRM
            credit_account_balance={member.credit_account_balance}
            notes={member.notes || []}
            createOrUpdateNote={this.props.createOrUpdateNote}
            memberId={this.props.id}
            deleteNote={this.props.deleteNote}
            memberTags={member.tags || []}
            tagGroups={this.props.tagGroups}
            createTag={(data) =>
              this.props.createTag(data, (tagId: number) =>
                this.props.tagMember(this.props.id, tagId),
              )
            }
            createTagGroup={this.props.createTagGroup}
            updateTag={this.props.updateTag}
            updateTagGroup={this.props.updateTagGroup}
            attributeTag={(tagId) => this.props.tagMember(this.props.id, tagId)}
            deleteTag={this.deleteTag}
            deleteTagGroup={this.deleteTagGroup}
            tagGroupsLoading={this.props.tagGroupsLoading}
          />
        </Grid>
        <MemberSearchModal
          searchMembers={this.props.searchMembers}
          searchedMembers={this.props.searchedMembers.filter(
            (m) => m.id !== this.props.id,
          )}
          open={!!this.state.searchModalOpen}
          onClose={() => this.setState({ searchModalOpen: false })}
          handlMemberSelected={(id: number) =>
            this.props.mergeInto(this.props.id, id)
          }
        />
        <TagDeleteDialog
          open={!!this.state.tagToDelete}
          onClose={() => this.setState({ tagToDelete: null })}
          onSubmit={() => this.props.deleteTag(this.state.tagToDelete)}
        />
        <TagGroupDeleteDialog
          open={!!this.state.tagGroupToDelete}
          onClose={() => this.setState({ tagGroupToDelete: null })}
          onSubmit={() =>
            this.props.deleteTagGroup(this.state.tagGroupToDelete)
          }
        />
      </Grid>
    );
  }
}

export default compose(
  routerParamsToProps({ id: 'id:number' }),
  connect(
    (state) => ({
      memberLoading: state.member.loading,
      member: state.member.member,
      searchedMembers: memberSelectors.getSearched(state),
      tagGroups: tagSelectors.getMemberTagGroups(state),
      tagGroupsLoading: state.tag.group.loading,
    }),
    {
      fetchMember,
      searchMembers,
      tagMember,
      fetchTags,
      mergeInto: (src: number, dst: number) =>
        routerPush(`/member/merge/${src}/into/${dst}`),
      editMember: (id) => routerPush(`/member/edit/${id}`),
      createOrUpdateNote: ({ id, text, memberId, highlighted }) =>
        createOrUpdateMemberNote(id, text, memberId, highlighted),
      deleteNote,
      createTag: createOrUpdateTag,
      createTagGroup: (data) =>
        createOrUpdateTagGroup({ ...data, kind: TAG_KIND_MEMBER.id }),
      updateTag: createOrUpdateTag,
      updateTagGroup: createOrUpdateTagGroup,
      deleteTagGroup,
      deleteTag,
    },
  ),
)(MemberDetailPage);
