// @flow

import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import { push as routerPush } from 'connected-react-router';
import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import { TAG_KIND_MEMBER } from '@bsport/common/lib/master-data/tag';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';

import TaskList from '../../libs/reminder/components/TaskList.component';
import { getUsersWithRole } from '../../libs/role/selectors';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import {
  createOrUpdateNote as createOrUpdateMemberNote,
  deleteNote,
  fetchMember,
  tag as tagMember,
  untag as untagMember,
  search as searchMembers,
  addFileToMember,
  removeFileFromMember,
} from '../../libs/member/actions';
import {
  getSearchedMembers,
  getMemberDetail,
} from '../../libs/member/selectors';
import type { Member } from '../../libs/member/types';
import MemberSummaryCard from '../../libs/member/components/MemberSummaryCard.component';
import TagDeleteDialog from '../../libs/tag/components/TagDeleteDialog.component';
import TagGroupDeleteDialog from '../../libs/tag/components/TagGroupDeleteDialog.component';
import MemberCRM from '../../libs/member/components/MemberCRM.component';
import ModalDeleteFile from '../../components/ModalConfirm.component';
import MemberSearchModal from '../../libs/member/components/MemberSearchModal.component';
import FileUploadDialog from '../../components/FileUploadDialog';
import type { TagGroup } from '../../libs/tag/types';
import tagSelectors from '../../libs/tag/selectors';
import {
  fetchTags,
  createOrUpdateTag,
  createOrUpdateTagGroup,
  deleteTagGroup,
  deleteTag,
} from '../../libs/tag/actions';
import {
  fetchTaskListByMember as fetchTaskListByMemberAction,
  createOrUpdateTask as createOrUpdateTaskAction,
  updateTaskStatus,
} from '../../libs/reminder/actions';
import type { Task } from '../../libs/reminder/types';
import type { OptionCallback } from '../../state/types';
import { memberTaskListSelector } from '../../libs/reminder/selectors';
import { fetchCompanyRoles } from '../../libs/role/actions';

import { sendCommunication } from '../../libs/communication/actions';
import {
  emailTemplateDetail,
  emailTemplatesSummaries as fetchEmailTemplatesSummaries,
} from '../../libs/email-editor/actions';

import {
  getAllEmailTemplatesSummaries,
  getEmailTemplatesDetail,
} from '../../libs/email-editor/selectors';

type Props = {
  // GENERAL
  // -------
  id: number,
  memberLoading: boolean,
  member: Member,
  t: TFunction,
  editMember: (id: number) => void,
  fetchMember: (id: number) => void,
  searchMembers: (text: string) => void,
  searchedMembers: Array<Member>,
  mergeInto: (src: number, dst: number) => void,

  // FILES
  addFile: (file: any) => void,
  removeFile: (id: number) => void,

  // NOTES
  // -----
  createOrUpdateNote: ({
    id: ?number,
    text: string,
    memberId: number,
    highlighted: boolean,
    is_medical: boolean,
  }) => void,
  deleteNote: ({ memberId: number, noteId: number }) => void,

  // MAIL
  fetchEmailTemplatesSummaries: () => void,
  fetchEmailTemplateDetail: (id: number) => void,
  emailListLoading: boolean,
  emailDetailLoading: boolean,
  email_templates_list: Array<any>,
  email_templates_details: Array<any>,
  sendCommunication: (any) => void,

  // TASK
  taskList: Array<Task>,
  taskLoading: ?boolean,
  fetchRoles: () => void,
  staffList: Array<User>,
  createOrUpdateTask: (data: any, options: OptionCallback) => void,
  updateTaskStatus: (
    id: number,
    status: number,
    options: OptionCallback,
  ) => void,
  fetchTaskListByMember: () => void,

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
  untagMember: (memberId: number, tagId: number) => void,

  goToCreditRegularization: (memberId: number, balance: number) => void,
};

type State = {
  searchModalOpen: boolean,
};

export class MemberDetailPage extends Component<Props, State> {
  state = {
    searchModalOpen: false,
    tagToDelete: null,
    tagGroupToDelete: null,
    fileToUpload: null,
    fileToDelete: null,
  };

  componentDidMount() {
    this.props.fetchMember(this.props.id);
    this.props.fetchTags();
    this.props.fetchTaskListByMember();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      this.props.fetchMember(this.props.id);
      this.props.fetchTaskListByMember();
    }
  }

  deleteTag = (id: number) => this.setState({ tagToDelete: id });

  deleteTagGroup = (id: number) => this.setState({ tagGroupToDelete: id });

  goToCreditRegularization = () =>
    this.props.goToCreditRegularization(
      this.props.id,
      this.props.member.credit_account_balance,
    );

  render() {
    const { memberLoading, member, t } = this.props;
    const fileUploader = {
      onAddFile: (file: File) => this.props.addFile(this.props.id, file),
      onRemoveFile: (fileId: number) =>
        this.props.removeFile(this.props.id, fileId),
    };

    if (!member || (memberLoading && member.id !== this.props.id)) {
      return <LinearProgress />;
    }

    return (
      <Grid container direction="row" spacing={2}>
        <Grid item md={6} xs={12}>
          <MemberSummaryCard
            memberId={this.props.id}
            member={this.props.member}
            editMember={() => this.props.editMember(this.props.id)}
            mergeMember={() => this.setState({ searchModalOpen: true })}
            goToCreditRegularization={this.goToCreditRegularization}
            getEmails={this.props.fetchEmailTemplatesSummaries}
            emails={this.props.email_templates_list}
            getEmailDetail={this.props.fetchEmailTemplateDetail}
            emailDetails={this.props.email_templates_details}
            emailListLoading={this.props.emailListLoading}
            emailDetailLoading={this.props.emailDetailLoading}
            sendCommunication={this.props.sendCommunication}
          />
          <TaskList
            taskList={this.props.taskList}
            updateTaskStatus={this.props.updateTaskStatus}
            createOrUpdateTask={this.props.createOrUpdateTask}
            fetchRoles={this.props.fetchRoles}
            staffList={this.props.staffList}
            loading={this.props.taskLoading}
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
            untag={(tagId) => this.props.untagMember(this.props.id, tagId)}
            deleteTag={this.deleteTag}
            deleteTagGroup={this.deleteTagGroup}
            tagGroupsLoading={this.props.tagGroupsLoading}
            openFileUploadDialog={() => this.setState({ fileToUpload: true })}
            uploadedFiles={member.files || []}
            deleteFile={(fileId) => this.setState({ fileToDelete: fileId })}
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
        <FileUploadDialog
          open={!!this.state.fileToUpload}
          onCancel={() => this.setState({ fileToUpload: null })}
          onSubmit={(data: any, name: string) => {
            this.props.addFile({ data, member_id: this.props.id, name });
          }}
          fileUploader={fileUploader}
        />
        <ModalDeleteFile
          open={this.state.fileToDelete}
          options={{
            title: 'member:file.deletion',
            Content: () => t('member:file.deleteFileMessage'),
            cancel: 'member:file.cancel',
            confirm: 'member:file.confirm',
          }}
          handleCancel={() => this.setState({ fileToDelete: null })}
          handleConfirm={() => {
            this.props.removeFile(this.props.id, this.state.fileToDelete);
            this.setState({ fileToDelete: null });
          }}
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
  withTranslation(['member']),
  connect(
    (state, { id }) => ({
      memberLoading: state.member.loading,
      member: getMemberDetail(state, id),
      searchedMembers: getSearchedMembers(state),
      tagGroups: tagSelectors.getMemberTagGroups(state),
      tagGroupsLoading: state.tag.group.loading,
      taskList: memberTaskListSelector(state),
      staffList: getUsersWithRole(state),
      // email emailTemplatesSummaries
      email_templates_list: getAllEmailTemplatesSummaries(state),
      email_templates_details: getEmailTemplatesDetail(state),
      emailListLoading: state.emailTemplate.isLoading,
      emailDetailLoading: state.emailTemplate.detail.isLoading,
    }),
    {
      sendCommunication,
      fetchRoles: fetchCompanyRoles,
      fetchMember,
      searchMembers,
      tagMember,
      untagMember,
      fetchTags,
      fetchEmailTemplateDetail: (id) => emailTemplateDetail(id),
      fetchEmailTemplatesSummaries,
      mergeInto: (src: number, dst: number) =>
        routerPush(`/member/merge/${src}/into/${dst}`),
      editMember: (id) => routerPush(`/member/edit/${id}`),
      createOrUpdateNote: ({ id, text, memberId, highlighted, is_medical }) =>
        createOrUpdateMemberNote(id, text, memberId, highlighted, is_medical),
      goToCreditRegularization: (memberId, credit_account_balance) =>
        routerPush(
          `/invoice/add/member/${memberId}?withCredit=${-credit_account_balance}`,
        ),
      deleteNote,
      createTag: createOrUpdateTag,
      createTagGroup: (data) =>
        createOrUpdateTagGroup({ ...data, kind: TAG_KIND_MEMBER.id }),
      updateTag: createOrUpdateTag,
      updateTagGroup: createOrUpdateTagGroup,
      deleteTagGroup,
      deleteTag,
      addFile: (data) => addFileToMember(data),
      removeFile: removeFileFromMember,
      fetchTaskListByMember: fetchTaskListByMemberAction,
      createOrUpdateTask: createOrUpdateTaskAction,
      updateTaskStatus,
    },
  ),
  withProps(({ fetchTaskListByMember, id }) => ({
    fetchTaskListByMember: () => fetchTaskListByMember(id),
  })),
  withProps(({ fetchTaskListByMember, createOrUpdateTask, id }) => ({
    createOrUpdateTask: (data, options) => {
      createOrUpdateTask(
        { ...data, member_id: id },
        {
          onSuccess: (...args) => {
            options.onSuccess(...args);
            fetchTaskListByMember();
          },
          onError: options.onError,
        },
      );
    },
  })),
)(MemberDetailPage);
