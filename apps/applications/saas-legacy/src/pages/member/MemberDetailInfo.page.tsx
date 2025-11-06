import React from 'react';

import Grid from '@material-ui/core/Grid';
import { push as routerPush } from 'connected-react-router';
import { connect, ConnectedProps } from 'react-redux';
import { compose, withHandlers, withProps } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';

import { TAG_KIND_MEMBER } from '@bsport/common/lib/master-data/tag.js';
import { buildMemberReferralLink } from '@bsport/common/lib/referrals/utils.js';
import { PAYMENT_GROUP_METHOD_IDENTIFIER_DEBT } from '@bsport/common/lib/master-data/payment-group.js';

import LinearProgress from '#src/components/navigation/BackofficeLinearProgress.component';
// @ts-expect-error
import TaskList from '#src/libs/reminder/components/TaskList.component';
import { getUsersWithRole } from '#src/libs/role/selectors';

import { snackbarWarning, snackbarSuccess } from '#src/libs/snackbar/actions';
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
  fetchMemberBulkById as fetchMemberBulkByIdAction,
  fetchMemberEventList as fetchMemberEventListAction,
  updateSpiviPrivacySettings as updateSpiviPrivacySettingsAction,
} from '#src/libs/member/actions';
import { getResolvedGenericTags } from '#src/libs/notification-rule/selectors';
import {
  getSearchedMembers,
  getMemberDetail,
  getFilteredSearchedMembers,
  getMemberEventState,
} from '#src/libs/member/selectors';
import MemberSummaryCard from '#src/libs/member/components/MemberSummaryCard.component';
// @ts-expect-error
import TagDeleteDialog from '#src/libs/tag/components/TagDeleteDialog.component';
// @ts-expect-error
import TagGroupDeleteDialog from '#src/libs/tag/components/TagGroupDeleteDialog.component';
import MemberCRM from '#src/libs/member/components/MemberCRM.component';
import ModalDeleteFile from '#src/components/ModalConfirm.component';
import MemberSearchModal from '#src/libs/member/components/MemberSearchModal.component';
// @ts-expect-error
import FileUploadDialog from '#src/components/FileUploadDialog';
import MemberBillingProblemCard from '#src/libs/member/components/MemberBillingProblemCard.component';
import { getMemberTagGroups } from '#src/libs/tag/selectors';
import {
  fetchTags,
  createOrUpdateTag,
  createOrUpdateTagGroup,
  deleteTagGroup,
  deleteTag,
} from '#src/libs/tag/actions';
import { getStripeReaders } from '#src/libs/terminal/selectors';

import {
  fetchPaymentMethodList,
  detachPaymentMethod,
} from '#src/libs/payment/actions';
import { requestSetupIntentSecret as requestSetupIntentSecretAPI } from '#src/libs/payment/api';
import {
  fetchTaskListByMember as fetchTaskListByMemberAction,
  createOrUpdateTask as createOrUpdateTaskAction,
  updateTaskStatus,
  // @ts-expect-error
} from '#src/libs/reminder/actions';
// @ts-expect-error
import { memberTaskListSelector } from '#src/libs/reminder/selectors';
import { fetchCompanyUserRoles } from '#src/libs/role/actions';

import {
  // fetchInvoiceItemList as fetchInvoiceItemListAction,
  fetchInvoiceList as fetchInvoiceListAction,
  applyBalanceToUnpaid,
  applyGiftcardOnInvoice as applyGiftcardOnInvoiceAction,
} from '#src/libs/invoice/actions';

import { withInvoiceItem, getInvoiceList } from '#src/libs/invoice/selectors';

import { fetchResolvedGenericTags as fetchResolvedGenericTagsAction } from '#src/libs/notification-rule/actions';
import {
  fetchEstablishments,
  fetchAllEstablishmentGroup,
  fetchAllEstablishmentBillingGroup as fetchAllEstablishmentBillingGroupAction,
} from '#src/libs/establishment/actions';
import {
  getAvailableEstablishmentList,
  getEnabledEstablishmentBillingGroups,
} from '#src/libs/establishment/selectors';
import themeSelectors, {
  getStripeRegion,
  getCompanyCountry,
} from '#src/libs/theme/selectors';
import { fetchModelBasedAnswer } from '#src/libs/custom-form/actions';
import {
  CUSTOM_FORM_DATATYPE_ESTABLISHMENT_GROUP,
  MODEL_BASED_QUESTION_FAVORITE,
} from '#src/libs/custom-form/utils';
import { getFavoriteEstablishmentGroupList } from '#src/libs/custom-form/selectors';
import { Tag } from '#src/libs/tag/types';
import { MemberUploadedFile } from '#src/libs/member/types';
import {
  getConsumerGiftcardReceivedList,
  withGiftcard,
  withSender,
  withReceiver,
  onlyUsable,
} from '#src/libs/giftcard/selectors';
import {
  fetchGiftcardBulk as fetchGiftcardBulkAction,
  fetchConsumerGiftcardReceivedList as fetchConsumerGiftcardReceivedListAction,
} from '#src/libs/giftcard/actions';
import type { ConsumerGiftcard } from '#src/libs/giftcard/types';
import AddPaymentMethod from '#src/libs/payment/components/AddPaymentMethod.component';
import PaymentModal from '#src/libs/payment/components/PaymentModal.component';
import MemberResetPasswordDialog from '#src/libs/member/components/MemberResetPasswordDialog.component';
import { getBackofficeBillingPlanEnabledPaymentMethods } from '#src/libs/payment/utils';
import { getMemberEventPath } from '#src/libs/member/events.utils';
import MemberEventPanel from '#src/libs/member/components/MemberEventPanel.component';
import { GenericEvent, MemberEvent } from '#src/libs/event/types';
import {
  retrieveReferralProgram as retrieveReferralProgramAction,
  retrieveReferralMemberStatus as retrieveReferralMemberStatusAction,
} from '#src/libs/referral/actions';
import {
  getReferralMemberStatusWithMemberId,
  getTheReferralProgram,
} from '#src/libs/referral/selectors';
import { getLocaleCountry } from '#src/utils/language';
// @ts-expect-error
import { resetPassword } from '../../actions/auth.actions';
import { WithHandlerType } from '../../utils/types';
import { RootState } from '../../reducers';
import type { OptionCallback } from '../../state/types';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
// @ts-expect-error
import withQueryParams from '../../hocs/with-query-params.hoc';
import Config from '../../config';

type Props = RouterParamsProps &
  ConnectProps &
  HandlerProps1 &
  HandlerProps2 &
  WithTranslation &
  HandlerProps3 &
  QueryParamsProps;

type State = {
  searchModalOpen: boolean;
  tagToDelete: number;
  tagGroupToDelete: number;
  fileToUpload: number;
  fileToDelete: number;
  paymentMethodType: string;
  isResetPasswordEmailSent: boolean;
  isResetPasswordDialogOpen: boolean;
  isResetPasswordError: boolean;
};

export class MemberDetailPage extends React.PureComponent<Props> {
  state: State = {
    searchModalOpen: false,
    tagToDelete: null,
    tagGroupToDelete: null,
    fileToUpload: null,
    fileToDelete: null,
    paymentMethodType:
      this.props.companyTheme.currency === 'eur' ? 'sepa_debit' : 'card',
    isResetPasswordEmailSent: false,
    isResetPasswordDialogOpen: false,
    isResetPasswordError: false,
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
    if (this.props.id) {
      this.props.fetchMember(this.props.id, {
        onSuccess: () => this.props.retrieveMemberPendingEmail(this.props.id),
      });
      this.props.fetchTags();
      this.props.fetchResolvedGenericTags();
      this.props.fetchTaskListByMember();
      this.props.fetchInvoiceListUnpaid();
      this.props.fetchEstablishments();
      if (this.props.companyTheme.enable_multi_localization) {
        this.props.fetchAllEstablishmentBillingGroup({
          params: {
            company: this.props.companyId,
          },
        });
      }
      this.props.fetchAllEstablishmentGroup();
      this.props.fetchModelBasedAnswer({
        memberId: this.props.id,
        datatype: CUSTOM_FORM_DATATYPE_ESTABLISHMENT_GROUP,
        kind: MODEL_BASED_QUESTION_FAVORITE,
      });
      this.props.fetchConsumerGiftcardReceivedList();
      this.props.fetchReferralInformation();
    }
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

  openAddPaymentMethodDialog = (open?: boolean) => {
    this.props.setQueryParams('isAddPaymentMethodDialogOpen')(
      open ? true : null,
    );
  };

  requestSetupIntentSecret = () => {
    return requestSetupIntentSecretAPI(this.props.member.id, null);
  };

  changePaymentMethodType = (value: string) => {
    this.setState({ paymentMethodType: value });
  };

  handleEditMember = () => {
    this.props.editMember(this.props.id);
  };

  handleMergeMember = () => {
    this.setState({ searchModalOpen: true });
  };

  handleOpenAddPaymentMethodDialog = () => {
    this.openAddPaymentMethodDialog(false);
  };

  handleCloseSearchModal = () => {
    this.setState({ searchModalOpen: false });
  };

  handleCloseTagDeleteDialog = () => {
    this.setState({ tagToDelete: null });
  };

  handleCancelFileUpload = () => {
    this.setState({ fileToUpload: null });
  };

  handleSubmitTagDelete = () => {
    this.props.deleteTag(this.state.tagToDelete);
    this.setState({ tagToDelete: null });
  };

  handleCancelDeleteFile = () => {
    this.setState({ fileToDelete: null });
  };

  handleSubmitDeleteFile = () => {
    this.props.removeFile(this.props.id, this.state.fileToDelete);
    this.setState({ fileToDelete: null });
  };

  handleCloseTagGroupDialog = () => {
    this.setState({ tagGroupToDelete: null });
  };

  handleSubmitTagGroupDialog = () => {
    this.props.deleteTagGroup(this.state.tagGroupToDelete);
    this.setState({ tagGroupToDelete: null });
  };

  handleSubmitFileUpload = (data: any, name: string) => {
    this.props.addFile({ data, member_id: this.props.id, name });
  };

  deleteFileOptions = {
    title: 'member:file.deletion',
    Content: this.props.t('member:file.deleteFileMessage'),
    cancel: 'member:file.cancel',
    confirm: 'member:file.confirm',
  };

  handleMemberSelected = (id: number) =>
    this.props.mergeInto(this.props.id, id);

  handleOpenResetPasswordDialog = () => {
    this.setState({ isResetPasswordDialogOpen: true });
  };

  handleCloseResetPasswordDialog = () => {
    this.setState(
      {
        isResetPasswordDialogOpen: false,
      },
      () =>
        this.setState({
          isResetPasswordEmailSent: false,
          isResetPasswordError: false,
        }),
    );
  };

  handleResetPassword = () => {
    if (this.props.member?.email) {
      this.props.resetPassword(
        this.props.member.email,
        this.props.companyId,
        null,
        {
          onSuccess: () => {
            this.setState({ isResetPasswordEmailSent: true });
          },
          onError: () => {
            this.setState({ isResetPasswordError: true });
          },
        },
      );
    }
  };

  handleRedirectToReferringMember = () => {
    if (this.props.referralMemberStatus?.referring_member_id) {
      this.props.routerPushURL(
        `/member/${this.props.referralMemberStatus.referring_member_id}/info`,
      );
    }
  };

  onMemberEventClick = (event: GenericEvent<MemberEvent>) => {
    const eventDetailPath = getMemberEventPath(event, this.props.id);
    this.props.goToEventDetail(eventDetailPath);
  };

  render() {
    const stripeRegion = getStripeRegion();
    const companyCountry = getCompanyCountry();

    const { memberLoading, member } = this.props;

    const fileUploaderOptions = {
      // @ts-expect-error
      onAddFile: (file: File) => this.props.addFile(this.props.id, file),
      onRemoveFile: (fileId: number) =>
        this.props.removeFile(this.props.id, fileId),
    };

    const referralLink = this.props.theme?.is_referral_program_activated
      ? `${Config.PUBLIC_URL}${buildMemberReferralLink(
          this.props.companyId,
          member?.referral_uuid,
        )}`
      : null;

    if (!member || (memberLoading && member.id !== this.props.id)) {
      return <LinearProgress />;
    }

    return (
      <Grid container direction="row" spacing={2}>
        <Grid item lg={6} xs={12}>
          <MemberSummaryCard
            companyCountry={this.props.companyCountry}
            editMember={this.handleEditMember}
            favoriteEstablishmentGroupList={
              this.props.favoriteEstablishmentGroupList
            }
            handleOpenResetPasswordDialog={this.handleOpenResetPasswordDialog}
            handleRedirectToReferringMember={
              this.handleRedirectToReferringMember
            }
            member={this.props.member}
            mergeMember={this.handleMergeMember}
            // @ts-expect-error
            referringMemberId={
              this.props.referralMemberStatus?.referring_member_id
            }
            referringMemberName={
              this.props.referralMemberStatus?.referring_member_name
            }
            resolvedGenericTags={this.props.resolvedGenericTags}
          />
          {member && !member.is_pos && (
            <>
              <MemberBillingProblemCard
                adjustCreditWithoutPaymentNote={
                  this.adjustCreditWithoutPaymentNote
                }
                applyBalanceToUnpaidInvoices={this.applyBalanceToUnpaidInvoices}
                applyGiftcardOnInvoice={this.applyGiftcardOnInvoice}
                asConsumer={false}
                availablePaymentMethodList={
                  this.props.payment_method_available_manager
                }
                balance={this.props.member.credit_account_balance}
                bsportPaymentMethodsToDisable={[
                  PAYMENT_GROUP_METHOD_IDENTIFIER_DEBT,
                ]}
                cardBillingDetailsMandatory={
                  this.props.companyTheme.force_billing_details_on_cards
                }
                companyId={this.props.companyId}
                consumerGiftcardList={this.props.consumerGiftcardList}
                // @ts-expect-error
                detachPaymentMethod={this.props.detachPaymentMethod}
                detachPaymentMethodLoading={
                  this.props.detachPaymentMethodLoading
                }
                enableMultiLocalization={
                  this.props.companyTheme.enable_multi_localization
                }
                establishmentBillingGroups={
                  this.props.establishmentBillingGroups
                }
                establishments={this.props.establishmentList}
                fetchInvoiceListUnpaid={this.fetchInvoiceListUnpaid}
                forceOnlyInternal={this.props.onlinePaymentEnabled === false}
                invoiceLoading={this.props.invoiceLoading}
                member={this.props.member}
                memberId={this.props.id}
                memberLoading={this.props.memberLoading}
                onClickInvoice={this.props.goToInvoice}
                onlinePaymentEnabled={this.props.onlinePaymentEnabled}
                snackbarErrorMsg={this.props.snackbarErrorMsg}
                snackbarSuccessMsg={this.props.snackbarSuccessMsg}
                stripePaymentElementConfig={{
                  isDefaultForRegion:
                    this.props.companyTheme.is_default_for_region,
                  stripeId: this.props.companyTheme.stripe_id,
                }}
                stripeReaders={this.props.stripeReaders || []}
                unpaidInvoiceList={this.props.unpaidInvoiceList}
              />
              <TaskList
                createOrUpdateTask={this.props.createOrUpdateTask}
                fetchCompanyUserRoles={this.props.fetchCompanyUserRoles}
                loading={this.props.taskLoading}
                staffList={this.props.staffList}
                taskList={this.props.taskList}
                updateTaskStatus={this.props.updateTaskStatus}
              />
            </>
          )}
        </Grid>
        <Grid item lg={6} xs={12}>
          <MemberCRM
            attributeTag={this.tagMember}
            companyId={this.props.companyTheme.company}
            createOrUpdateNote={this.props.createOrUpdateNote}
            createTag={this.handleCreateTag}
            // notes
            createTagGroup={this.props.createTagGroup}
            credit_account_balance={member.credit_account_balance}
            deleteFile={this.handleDeleteFile}
            // Tag
            deleteNote={this.props.deleteNote}
            deleteTag={this.deleteTag}
            deleteTagGroup={this.deleteTagGroup}
            // @ts-expect-error
            detachPaymentMethod={this.props.detachPaymentMethod}
            detachPaymentMethodLoading={this.props.detachPaymentMethodLoading}
            is_referral_program_activated={
              this.props.theme.is_referral_program_activated
            }
            maxReferralUses={this.props.referralProgram?.maximum_referral_uses}
            member={this.props.member}
            memberId={this.props.id}
            memberTags={this.props.member?.tags || []}
            nbRemainingReferralUses={
              this.props.referralMemberStatus?.nb_remaining_referral_uses
            }
            notes={this.props.member?.notes || []}
            openAddPaymentMethodDialog={this.openAddPaymentMethodDialog}
            // Files
            openFileUploadDialog={this.handleOpenFileUpload}
            paymentMethod={this.props.paymentMethod}
            paymentMethodLoading={this.props.paymentMethodLoading}
            referralLink={referralLink}
            snackbarErrorMsg={this.props.snackbarErrorMsg}
            // Payment
            // @ts-expect-error
            snackbarSuccess={this.props.snackbarSuccess}
            snackbarSuccessMsg={this.props.snackbarSuccessMsg}
            spiviPrivacySettingsLoading={this.props.spiviPrivacySettingsLoading}
            tagGroups={this.props.tagGroups}
            tagGroupsLoading={this.props.tagGroupsLoading}
            untag={this.unTagMember}
            updateSpiviPrivacySettings={this.props.updateSpiviPrivacySettings}
            updateTag={this.props.updateTag}
            updateTagGroup={this.props.updateTagGroup}
            updateVisibility={this.updateFileVisibility}
            uploadedFiles={this.props.member?.files || []}
          />
          <MemberEventPanel
            // @ts-expect-error
            eventList={this.props.eventList}
            eventListLoading={this.props.eventListLoading}
            eventListPage={this.props.eventListPage}
            fetchEventList={this.props.fetchMemberEventList}
            memberId={this.props.id}
            onEventClick={this.onMemberEventClick}
          />
        </Grid>
        {this.props.member?.id && !!companyCountry && !!stripeRegion && (
          <PaymentModal isOpen={this.props.isAddPaymentMethodDialogOpen}>
            <AddPaymentMethod
              addViaTerminal
              cardBillingDetailsMandatory={
                this.props.companyTheme.force_billing_details_on_cards
              }
              companyId={this.props.companyTheme.company}
              disabled={false}
              enabledPaymentMethods={getBackofficeBillingPlanEnabledPaymentMethods(
                {
                  currency: this.props.companyTheme.currency,
                  companyCountry,
                  stripeRegion,
                },
              )}
              onCancel={this.handleOpenAddPaymentMethodDialog}
              onChange={this.changePaymentMethodType}
              paymentMethodType={this.state.paymentMethodType}
              refreshSavedPaymentMethodList={
                this.props.fetchMemberPaymentMethod
              }
              requestSetupIntentSecret={this.requestSetupIntentSecret}
              sepaDefaultEmail={
                this.props.member ? this.props.member.email : ''
              }
              sepaDefaultName={this.props.member ? this.props.member.name : ''}
              stripeReaders={this.props.stripeReaders || []}
            />
          </PaymentModal>
        )}
        <MemberSearchModal
          asManager
          // @ts-expect-error
          companyCountry={this.props.companyCountry}
          handlMemberSelected={this.handleMemberSelected}
          onClose={this.handleCloseSearchModal}
          open={!!this.state.searchModalOpen}
          searchedMembers={this.props.filteredSearchedMembers}
          searchMembers={this.props.searchMembers}
        />
        <TagDeleteDialog
          onClose={this.handleCloseTagDeleteDialog}
          onSubmit={this.handleSubmitTagDelete}
          open={!!this.state.tagToDelete}
        />
        <FileUploadDialog
          fileUploader={fileUploaderOptions}
          onCancel={this.handleCancelFileUpload}
          onSubmit={this.handleSubmitFileUpload}
          open={!!this.state.fileToUpload}
        />
        <ModalDeleteFile
          handleCancel={this.handleCancelDeleteFile}
          handleConfirm={this.handleSubmitDeleteFile}
          // @ts-expect-error
          open={this.state.fileToDelete}
          options={this.deleteFileOptions}
        />
        <TagGroupDeleteDialog
          onClose={this.handleCloseTagGroupDialog}
          onSubmit={this.handleSubmitTagGroupDialog}
          open={!!this.state.tagGroupToDelete}
        />
        <MemberResetPasswordDialog
          email={this.props.member?.email}
          emailSent={this.state.isResetPasswordEmailSent}
          error={this.state.isResetPasswordError}
          loading={this.props.resetLoading}
          onClose={this.handleCloseResetPasswordDialog}
          onResetPassword={this.handleResetPassword}
          open={this.state.isResetPasswordDialogOpen}
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
    filteredSearchedMembers: getFilteredSearchedMembers(state, props.id),
    tagGroups: getMemberTagGroups(state),
    tagGroupsLoading: state.tag.group.loading,
    taskList: memberTaskListSelector(state),
    taskLoading: state.reminder.task.byMember.loading,
    staffList: getUsersWithRole(state),
    theme: state.theme.theme,
    companyCountry: getLocaleCountry(state.theme.theme.locale),
    onlinePaymentEnabled: state.theme.theme.online_payment_enabled,
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
    consumerGiftcardList: withSender(
      withReceiver(onlyUsable(withGiftcard(getConsumerGiftcardReceivedList))),
    )(state),
    stripeReaders: getStripeReaders(state),
    resolvedGenericTags: getResolvedGenericTags(state),
    resetLoading: state.auth.resetPassword.loading,
    // Events
    eventList: getMemberEventState(state).items,
    eventListLoading: getMemberEventState(state).loading,
    eventListPage: getMemberEventState(state).page,
    spiviPrivacySettingsLoading: state.member.spivi_privacy_settings.loading,
    // Referral
    referralProgram: getTheReferralProgram(state),
    referralMemberStatus: getReferralMemberStatusWithMemberId(state, props.id),
    establishmentBillingGroups: getEnabledEstablishmentBillingGroups(state),
  }),
  {
    fetchInvoiceList: fetchInvoiceListAction,
    fetchPaymentMethodListActions: fetchPaymentMethodList,
    detachPaymentMethodAction: detachPaymentMethod,
    // fetchInvoiceItemList: fetchInvoiceItemListAction,
    fetchCompanyUserRoles,
    fetchMember,
    searchMembers: (text: string) =>
      searchMembers(text, { hide_archived: true }),
    tagMember,
    untagMember,
    fetchTags,
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
    fetchAllEstablishmentBillingGroup: fetchAllEstablishmentBillingGroupAction,
    fetchAllEstablishmentGroup,
    fetchModelBasedAnswer,
    retrieveMemberPendingEmail,
    fetchConsumerGiftcardReceivedList: fetchConsumerGiftcardReceivedListAction,
    fetchGiftcardBulk: fetchGiftcardBulkAction,
    applyGiftcardOnInvoice: applyGiftcardOnInvoiceAction,
    fetchMemberBulkById: fetchMemberBulkByIdAction,
    fetchResolvedGenericTags: fetchResolvedGenericTagsAction,
    resetPassword,
    fetchMemberEventList: fetchMemberEventListAction,
    goToEventDetail: (eventDetailPath: string) => routerPush(eventDetailPath),
    updateSpiviPrivacySettings: updateSpiviPrivacySettingsAction,
    retrieveReferralProgram: retrieveReferralProgramAction,
    retrieveReferralMemberStatus: retrieveReferralMemberStatusAction,
    routerPushURL: routerPush,
  },
);

type HandlerProps1 = WithHandlerType<typeof mapWithHandler1>;

const mapWithHandler1 = {
  fetchTaskListByMember:
    ({ fetchTaskListByMember, id }: RouterParamsProps & ConnectProps) =>
    () => {
      fetchTaskListByMember(id);
    },
  fetchReferralInformation:
    ({
      retrieveReferralMemberStatus,
      retrieveReferralProgram,
      theme,
      id,
    }: RouterParamsProps & ConnectProps) =>
    () => {
      retrieveReferralMemberStatus(id);
      if (theme?.is_referral_program_activated) {
        retrieveReferralProgram();
      }
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
      id,
    }: RouterParamsProps &
      ConnectProps &
      HandlerProps1 &
      HandlerProps2 &
      WithTranslation) =>
    (pm_id: number, options?: OptionCallback) => {
      detachPaymentMethodAction(
        // @ts-expect-error
        { member: id, payment_method_id: pm_id },
        {
          onSuccess: () => {
            // @ts-expect-error
            fetchMemberPaymentMethod({ member: id });
            if (options && options.onSuccess) options.onSuccess();
          },
          onError: options && options.onError,
        },
      );
    },
  fetchConsumerGiftcardReceivedList:
    ({
      fetchConsumerGiftcardReceivedList,
      fetchGiftcardBulk,
      fetchMemberBulkById,
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
          in_timeframe: true,
        },
        {
          onSuccess: (consumerGiftcardList: Array<ConsumerGiftcard>) => {
            fetchGiftcardBulk(consumerGiftcardList.map((cg) => cg.giftcard));
            fetchMemberBulkById([
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

type QueryParamsProps = {
  isAddPaymentMethodDialogOpen: boolean;
  setQueryParams: (queryParam: string) => (value: boolean | null) => void;
};

export default compose(
  routerParamsToProps({ id: 'id:number' }),
  withTranslation(['member', 'invoice']),
  connector,
  withHandlers(mapWithHandler1),
  withHandlers(mapWithHandler2),
  withHandlers(mapWithHandler3),
  withQueryParams([
    ['isAddPaymentMethodDialogOpen'],
    'queryParams',
    'setQueryParams',
  ]),
  withProps(
    (props: { queryParams: { isAddPaymentMethodDialogOpen: string } }) => {
      return {
        isAddPaymentMethodDialogOpen:
          props.queryParams?.isAddPaymentMethodDialogOpen === 'true',
      };
    },
  ),
)(MemberDetailPage);
