// @flow

import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import { push as routerPush } from 'connected-react-router';
import { connect, ConnectedProps } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';

import { TAG_KIND_MEMBER } from '@bsport/common/lib/master-data/tag';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';

import TaskList from '../../libs/reminder/components/TaskList.component';
import { getUsersWithRole } from '../../libs/role/selectors';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { snackbarWarning, snackbarSuccess } from '../../libs/snackbar/actions';
import {
  createOrUpdateNote as createOrUpdateMemberNote,
  deleteNote,
  fetchMember,
  tag as tagMember,
  untag as untagMember,
  search as searchMembers,
  addFileToMember,
  removeFileFromMember,
  updateMemberFile,
  adjustCreditWithoutPaymentNote,
  retrieveMemberPendingEmail,
  fetchMemberBulk as fetchMemberBulkAction,
} from '../../libs/member/actions';
import {
  getSearchedMembers,
  getMemberDetail,
} from '../../libs/member/selectors';
import MemberSummaryCard from '../../libs/member/components/MemberSummaryCard.component';
import TagDeleteDialog from '../../libs/tag/components/TagDeleteDialog.component';
import TagGroupDeleteDialog from '../../libs/tag/components/TagGroupDeleteDialog.component';
import MemberCRM from '../../libs/member/components/MemberCRM.component';
import ModalDeleteFile from '../../components/ModalConfirm.component';
import MemberSearchModal from '../../libs/member/components/MemberSearchModal.component';
import FileUploadDialog from '../../components/FileUploadDialog';
import MemberBillingProblemCard from '../../libs/member/components/MemberBillingProblemCard.component';
import tagSelectors from '../../libs/tag/selectors';
import {
  fetchTags,
  createOrUpdateTag,
  createOrUpdateTagGroup,
  deleteTagGroup,
  deleteTag,
} from '../../libs/tag/actions';

import {
  fetchPaymentMethodList,
  detachPaymentMethod,
} from '../../libs/payment/actions';
import {
  fetchTaskListByMember as fetchTaskListByMemberAction,
  createOrUpdateTask as createOrUpdateTaskAction,
  updateTaskStatus,
} from '../../libs/reminder/actions';
import type { OptionCallback } from '../../state/types';
import { memberTaskListSelector } from '../../libs/reminder/selectors';
import { fetchCompanyUserRoles } from '../../libs/role/actions';

import {
  // fetchInvoiceItemList as fetchInvoiceItemListAction,
  fetchInvoiceList as fetchInvoiceListAction,
  applyBalanceToUnpaid,
  applyGiftcardOnInvoice as applyGiftcardOnInvoiceAction,
} from '../../libs/invoice/actions';

import { withInvoiceItem, getInvoiceList } from '../../libs/invoice/selectors';

import { sendCommunication } from '../../libs/communication/actions';
import {
  emailTemplateDetail,
  emailTemplatesSummaries as fetchEmailTemplatesSummaries,
} from '../../libs/email-editor/actions';

import {
  getAllEmailTemplatesSummaries,
  getEmailTemplatesDetail,
} from '../../libs/email-editor/selectors';
import {
  fetchEstablishments,
  fetchAllEstablishmentGroup,
} from '../../libs/establishment/actions';
import { getAvailableEstablishmentList } from '../../libs/establishment/selectors';
import themeSelectors from '../../libs/theme/selectors';
import { RootState } from '../../reducers';
import { WithHandlerType } from '../../utils/types';
import { fetchModelBasedAnswer } from '../../libs/custom-form/actions';
import {
  CUSTOM_FORM_DATATYPE_ESTABLISHMENT_GROUP,
  MODEL_BASED_QUESTION_FAVORITE,
} from '../../libs/custom-form/utils';
import {
  getFavoriteEstablishmentGroupList,
  showVaccinationStatus,
} from '../../libs/custom-form/selectors';
import { Tag } from '#libs/tag/types';
import { MemberUploadedFile } from '#libs/member/types';
import {
  getConsumerGiftcardReceivedList,
  withGiftcard,
  withSender,
  withReceiver,
  onlyUsable,
} from '#libs/giftcard/selectors';
import {
  fetchGiftcardBulk as fetchGiftcardBulkAction,
  fetchConsumerGiftcardReceivedList as fetchConsumerGiftcardReceivedListAction,
} from '../../libs/giftcard/actions';
import type { ConsumerGiftcard } from '#libs/giftcard/types';

type Props = RouterParamsProps &
  ConnectProps &
  HandlerProps1 &
  HandlerProps2 &
  WithTranslation &
  HandlerProps3;

type State = {
  searchModalOpen: boolean;
  tagToDelete: number;
  tagGroupToDelete: number;
  fileToUpload: number;
  fileToDelete: number;
};

export class MemberDetailPage extends Component<Props> {
  state: State = {
    searchModalOpen: false,
    tagToDelete: null,
    tagGroupToDelete: null,
    fileToUpload: null,
    fileToDelete: null,
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.id !== this.props.id) {
      this.fetchData();
    }
  }

  fetchData = () => {
    this.props.fetchMember(this.props.id, {
      onSuccess: () => this.props.retrieveMemberPendingEmail(this.props.id),
    });
    this.props.fetchTags();
    this.props.fetchTaskListByMember();
    this.props.fetchInvoiceListUnpaid();
    this.props.fetchEstablishments();
    this.props.fetchAllEstablishmentGroup();
    this.props.fetchModelBasedAnswer({
      memberId: this.props.id,
      datatype: CUSTOM_FORM_DATATYPE_ESTABLISHMENT_GROUP,
      kind: MODEL_BASED_QUESTION_FAVORITE,
    });
    this.props.fetchConsumerGiftcardReceivedList();
  };

  fetchInvoiceListUnpaid = () => {
    this.props.fetchInvoiceListUnpaid();
    this.props.fetchMember(this.props.id);
  };

  tagMember = (tagId: number) => {
    this.props.tagMember(this.props.id, tagId);
  };

  unTagMember = (tagId: number) => {
    this.props.untagMember(this.props.id, tagId);
  };

  handleCreateTag = (tag: Tag) => {
    this.props.createTag(tag, (tagId: number) =>
      this.props.tagMember(this.props.id, tagId),
    );
  };

  deleteTag = (id: number) => this.setState({ tagToDelete: id });

  deleteTagGroup = (id: number) => this.setState({ tagGroupToDelete: id });

  handleOpenFileUpload = () => {
    this.setState({ fileToUpload: true });
  };

  updateFileVisibility = (file: MemberUploadedFile) => () => {
    this.props.updateFile({
      ...file,
      coach_has_access: !file.coach_has_access,
    });
  };

  handleDeleteFile = (fileId: number) => {
    this.setState({ fileToDelete: fileId });
  };

  applyBalanceToUnpaidInvoices = () => {
    this.props.applyBalanceToUnpaid(this.props.id, {
      onSuccess: () => {
        this.props.fetchMember(this.props.id);
        this.props.fetchInvoiceListUnpaid();
      },
    });
  };

  adjustCreditWithoutPaymentNote = (amount: number) => {
    this.props.adjustCreditWithoutPaymentNote(this.props.id, amount, {
      onSuccess: () => this.props.fetchMember(this.props.id),
    });
  };

  applyGiftcardOnInvoice = (
    invoice_uuid: string,
    consumerGiftCardId: number,
    amount: number,
    options?: OptionCallback,
  ) => {
    this.props.applyGiftcardOnInvoice(
      invoice_uuid,
      consumerGiftCardId,
      amount,
      {
        onSuccess: () => {
          if (options && options.onSuccess) options.onSuccess();
          this.props.fetchConsumerGiftcardReceivedList();
        },
        onError: () => {
          if (options && options.onError) options.onError();
          this.props.fetchConsumerGiftcardReceivedList();
        },
      },
    );
  };

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
            member={this.props.member}
            favoriteEstablishmentGroupList={
              this.props.favoriteEstablishmentGroupList
            }
            editMember={() => this.props.editMember(this.props.id)}
            mergeMember={() => this.setState({ searchModalOpen: true })}
            getEmails={this.props.fetchEmailTemplatesSummaries}
            emails={this.props.email_templates_list}
            getEmailDetail={this.props.fetchEmailTemplateDetail}
            emailDetails={this.props.email_templates_details}
            emailListLoading={this.props.emailListLoading}
            emailDetailLoading={this.props.emailDetailLoading}
            sendCommunication={this.props.sendCommunication}
            showVaccinationStatus={this.props.showVaccinationStatus}
          />
          <MemberBillingProblemCard
            invoiceLoading={this.props.invoiceLoading}
            member={this.props.member}
            memberId={this.props.id}
            memberLoading={this.props.memberLoading}
            unpaidInvoiceList={this.props.unpaidInvoiceList}
            onClickInvoice={this.props.goToInvoice}
            asConsumer={false}
            balance={this.props.member.credit_account_balance}
            applyBalanceToUnpaidInvoices={this.applyBalanceToUnpaidInvoices}
            adjustCreditWithoutPaymentNote={this.adjustCreditWithoutPaymentNote}
            fetchInvoiceListUnpaid={this.fetchInvoiceListUnpaid}
            availablePaymentMethodList={
              this.props.payment_method_available_manager
            }
            detachPaymentMethodLoading={this.props.detachPaymentMethodLoading}
            snackbarErrorMsg={this.props.snackbarErrorMsg}
            snackbarSuccessMsg={this.props.snackbarSuccessMsg}
            detachPaymentMethod={this.props.detachPaymentMethod}
            establishments={this.props.establishmentList}
            enableMultiLocalization={
              this.props.companyTheme.enable_multi_localization
            }
            companyId={this.props.companyId}
            applyGiftcardOnInvoice={this.applyGiftcardOnInvoice}
            consumerGiftcardList={this.props.consumerGiftcardList}
          />
          <TaskList
            taskList={this.props.taskList}
            updateTaskStatus={this.props.updateTaskStatus}
            createOrUpdateTask={this.props.createOrUpdateTask}
            fetchCompanyUserRoles={this.props.fetchCompanyUserRoles}
            staffList={this.props.staffList}
            loading={this.props.taskLoading}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <MemberCRM
            memberId={this.props.id}
            member={this.props.member}
            credit_account_balance={member.credit_account_balance}
            // notes
            notes={member.notes || []}
            createOrUpdateNote={this.props.createOrUpdateNote}
            deleteNote={this.props.deleteNote}
            // Tag
            memberTags={member.tags || []}
            tagGroups={this.props.tagGroups}
            createTag={this.handleCreateTag}
            createTagGroup={this.props.createTagGroup}
            updateTag={this.props.updateTag}
            updateTagGroup={this.props.updateTagGroup}
            attributeTag={this.tagMember}
            untag={this.unTagMember}
            deleteTag={this.deleteTag}
            deleteTagGroup={this.deleteTagGroup}
            tagGroupsLoading={this.props.tagGroupsLoading}
            // Files
            openFileUploadDialog={this.handleOpenFileUpload}
            uploadedFiles={member.files || []}
            deleteFile={this.handleDeleteFile}
            updateVisibility={this.updateFileVisibility}
            // Payment
            paymentMethod={this.props.paymentMethod}
            paymentMethodLoading={this.props.paymentMethodLoading}
            detachPaymentMethod={this.props.detachPaymentMethod}
            detachPaymentMethodLoading={this.props.detachPaymentMethodLoading}
            snackbarErrorMsg={this.props.snackbarErrorMsg}
            snackbarSuccessMsg={this.props.snackbarSuccessMsg}
          />
        </Grid>
        <MemberSearchModal
          asManager
          searchMembers={this.props.searchMembers}
          searchedMembers={this.props.searchedMembers.filter(
            (m) => m.id !== this.props.id,
          )}
          open={!!this.state.searchModalOpen}
          onClose={() => this.setState({ searchModalOpen: false })}
          handlMemberSelected={(id: number) =>
            this.props.mergeInto(this.props.id, id)
          }
          country={this.props.country}
        />
        <TagDeleteDialog
          open={!!this.state.tagToDelete}
          onClose={() => this.setState({ tagToDelete: null })}
          onSubmit={() => {
            this.props.deleteTag(this.state.tagToDelete);
            this.setState({ tagToDelete: null });
          }}
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
          onSubmit={() => {
            this.props.deleteTagGroup(this.state.tagGroupToDelete);
            this.setState({ tagGroupToDelete: null });
          }}
        />
      </Grid>
    );
  }
}
type RouterParamsProps = {
  id: number;
};

type ConnectProps = ConnectedProps<typeof connector>;

const connector = connect(
  (state: RootState, props: RouterParamsProps) => ({
    memberLoading: state.member.loading,
    member: getMemberDetail(state, props.id),
    favoriteEstablishmentGroupList: getFavoriteEstablishmentGroupList(
      state,
      props.id,
    ),
    searchedMembers: getSearchedMembers(state),
    tagGroups: tagSelectors.getMemberTagGroups(state),
    tagGroupsLoading: state.tag.group.loading,
    taskList: memberTaskListSelector(state),
    taskLoading: state.reminder.task.byMember.loading,
    staffList: getUsersWithRole(state),
    // email emailTemplatesSummaries
    email_templates_list: getAllEmailTemplatesSummaries(state),
    email_templates_details: getEmailTemplatesDetail(state),
    emailListLoading: state.emailTemplate.isLoading,
    emailDetailLoading: state.emailTemplate.detail.isLoading,
    country: state.theme.theme.locale.split('_')[1],
    companyId: state.theme.theme.company,
    unpaidInvoiceList: withInvoiceItem(getInvoiceList)(state),
    invoiceLoading: state.invoice.list.loading,
    payment_method_available_manager:
      state.theme.theme.payment_method_available_manager,
    paymentMethod: state.paymentBackend.paymentMethod.items,
    paymentMethodLoading: state.paymentBackend.paymentMethod.loading,
    detachPaymentMethodLoading:
      state.paymentBackend.detachPaymentMethod.loading,
    establishmentList: getAvailableEstablishmentList(state),
    companyTheme: themeSelectors.getTheme(state),
    showVaccinationStatus: showVaccinationStatus(state),
    consumerGiftcardList: withSender(
      withReceiver(onlyUsable(withGiftcard(getConsumerGiftcardReceivedList))),
    )(state),
  }),
  {
    fetchInvoiceList: fetchInvoiceListAction,
    fetchPaymentMethodListActions: fetchPaymentMethodList,
    detachPaymentMethodAction: detachPaymentMethod,
    // fetchInvoiceItemList: fetchInvoiceItemListAction,
    sendCommunication,
    fetchCompanyUserRoles,
    fetchMember,
    searchMembers: (text: string) =>
      searchMembers(text, { hide_archived: true }),
    tagMember,
    untagMember,
    fetchTags,
    fetchEmailTemplateDetail: emailTemplateDetail,
    fetchEmailTemplatesSummaries,
    mergeInto: (src: number, dst: number) =>
      routerPush(`/member/merge/${src}/into/${dst}`),
    editMember: (id: number) => routerPush(`/member/edit/${id}`),
    createOrUpdateNote: ({
      id,
      text,
      memberId,
      highlighted,
      is_medical,
    }: {
      id: number;
      text: string;
      memberId: number;
      highlighted: boolean;
      is_medical: boolean;
    }) => createOrUpdateMemberNote(id, text, memberId, highlighted, is_medical),
    deleteNote,
    createTag: createOrUpdateTag,
    applyBalanceToUnpaid,
    adjustCreditWithoutPaymentNote,
    createTagGroup: (data: any) =>
      createOrUpdateTagGroup({ ...data, kind: TAG_KIND_MEMBER.id }),
    updateTag: createOrUpdateTag,
    updateTagGroup: createOrUpdateTagGroup,
    deleteTagGroup,
    deleteTag,
    addFile: addFileToMember,
    updateFile: updateMemberFile,
    removeFile: removeFileFromMember,
    fetchTaskListByMember: fetchTaskListByMemberAction,
    createOrUpdateTask: createOrUpdateTaskAction,
    updateTaskStatus,
    goToInvoice: (uuid: number) => routerPush(`/invoice/${uuid}/`),
    snackbarErrorMsg: snackbarWarning,
    snackbarSuccessMsg: snackbarSuccess,
    fetchEstablishments,
    fetchAllEstablishmentGroup,
    fetchModelBasedAnswer,
    retrieveMemberPendingEmail,
    fetchConsumerGiftcardReceivedList: fetchConsumerGiftcardReceivedListAction,
    fetchGiftcardBulk: fetchGiftcardBulkAction,
    applyGiftcardOnInvoice: applyGiftcardOnInvoiceAction,
    fetchMemberBulk: fetchMemberBulkAction,
  },
);

type HandlerProps1 = WithHandlerType<typeof mapWithHandler1>;

const mapWithHandler1 = {
  fetchTaskListByMember:
    ({ fetchTaskListByMember, id }: RouterParamsProps & ConnectProps) =>
    () => {
      fetchTaskListByMember(id);
    },
};

type HandlerProps2 = WithHandlerType<typeof mapWithHandler2>;

const mapWithHandler2 = {
  createOrUpdateTask:
    ({
      fetchTaskListByMember,
      createOrUpdateTask,
      id,
    }: RouterParamsProps & ConnectProps & HandlerProps1) =>
    (data: any, options: OptionCallback) => {
      createOrUpdateTask(
        { ...data, member_id: id },
        {
          onSuccess: (...args: any) => {
            options.onSuccess(...args);
            fetchTaskListByMember();
          },
          onError: options.onError,
        },
      );
    },
  fetchInvoiceListUnpaid:
    ({
      fetchInvoiceList,
      // fetchInvoiceItemList,
      id,
    }: RouterParamsProps & ConnectProps) =>
    () => {
      fetchInvoiceList({
        is_v2: true,
        is_draft: false,
        unpaid: true,
        member: id,
      });
    },
  fetchMemberPaymentMethod:
    ({ fetchPaymentMethodListActions, id }: RouterParamsProps & ConnectProps) =>
    () => {
      fetchPaymentMethodListActions({ member: id });
    },
};

type HandlerProps3 = WithHandlerType<typeof mapWithHandler3>;

const mapWithHandler3 = {
  detachPaymentMethod:
    ({
      detachPaymentMethodAction,
      fetchMemberPaymentMethod,
      snackbarErrorMsg,
      snackbarSuccessMsg,
      id,
      t,
    }: RouterParamsProps &
      ConnectProps &
      HandlerProps1 &
      HandlerProps2 &
      WithTranslation) =>
    (pm_id: number, options: OptionCallback) => {
      detachPaymentMethodAction(
        { member: id, payment_method_id: pm_id },
        {
          onSuccess: () => {
            fetchMemberPaymentMethod({ member: id });
            snackbarSuccessMsg(t('invoice:paymentMethod.detach.pm_deleted'));
            if (options && options.onSuccess) options.onSuccess();
          },
          onError: (data: any) => {
            snackbarErrorMsg(t(`invoice:paymentMethod.detach.${data}`));
          },
        },
      );
    },
  fetchConsumerGiftcardReceivedList:
    ({
      fetchConsumerGiftcardReceivedList,
      fetchGiftcardBulk,
      fetchMemberBulk,
      id,
    }: RouterParamsProps & ConnectProps & HandlerProps1 & HandlerProps2) =>
    (options?: OptionCallback) => {
      fetchConsumerGiftcardReceivedList(
        id,
        {
          page: 1,
          page_size: 100,
          active: true,
          reverted: false,
          has_amount_left: true,
        },
        {
          onSuccess: (consumerGiftcardList: Array<ConsumerGiftcard>) => {
            fetchGiftcardBulk(consumerGiftcardList.map((cg) => cg.giftcard));
            fetchMemberBulk([
              ...consumerGiftcardList.map((cg) => cg.src_member),
              ...consumerGiftcardList.map((cg) => cg.dst_member),
            ]);
            if (options && options.onSuccess) options.onSuccess();
          },
          onError: () => {
            if (options && options.onError) options.onError();
          },
        },
      );
    },
  applyGiftcardOnInvoice:
    ({
      applyGiftcardOnInvoice,
      fetchInvoiceListUnpaid,
    }: RouterParamsProps & ConnectProps & HandlerProps1 & HandlerProps2) =>
    (
      invoice_uuid: string,
      consumerGiftCardId: number,
      amount: number,
      options?: OptionCallback,
    ) => {
      applyGiftcardOnInvoice(invoice_uuid, consumerGiftCardId, amount, {
        onSuccess: () => {
          fetchInvoiceListUnpaid();
          if (options && options.onSuccess) options.onSuccess();
        },
        onError: () => {
          if (options && options.onError) options.onError();
        },
      });
    },
};

export default compose(
  routerParamsToProps({ id: 'id:number' }),
  withTranslation(['member', 'invoice']),
  connector,
  withHandlers(mapWithHandler1),
  withHandlers(mapWithHandler2),
  withHandlers(mapWithHandler3),
)(MemberDetailPage);
