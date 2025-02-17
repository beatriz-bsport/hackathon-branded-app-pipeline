import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';

import InfoGenericBox from '#src/components/box/InfoGenericBox.component';
import type {
  CommunicationMessage,
  FilteringMemberIdsByGenericCategories,
} from '#src/libs/communication-v2/types';
import type { Member } from '#src/libs/member/types';
import HTMLPreviewDialog from '#src/components/html/HTMLPreviewDialog.component';
import CommunicationMessageScrollableView from '#src/libs/communication-v2/components/MessageList/CommunicationMessageScrollableView.component';
import CommunicationInformationModal from '#src/libs/communication-v2/components/MessageList/ModalInformation/CommunicationInformationModal.component';
import AlertSmsProviderSmsNotVerified from '#src/libs/communication-v2/components/AlertSmsProviderNotVerified.component';
import './styles.css';

export type Props = {
  allMemberCategoryList?: FilteringMemberIdsByGenericCategories;
  consentWarning?: string;
  contextMember?: Member;
  currentPage: number;
  messageList: CommunicationMessage[];
  fetchMoreCommunicationMessages: () => void;
  fullScreen?: boolean;
  hasActiveFilters: boolean;
  loadingCommunicationMessageDataList: boolean;
  paginationSize: number;
  scrollToBottomFlag: boolean;
  showMailProviderWarningContent: boolean;
  showCommunicationSmsProviderNotVerifiedWarning: boolean;
};

const CommunicationMessageListContainer: React.FC<Props> = ({
  consentWarning,
  contextMember,
  messageList,
  fetchMoreCommunicationMessages,
  fullScreen,
  hasActiveFilters,
  loadingCommunicationMessageDataList,
  paginationSize,
  showMailProviderWarningContent,
  currentPage,
  scrollToBottomFlag,
  showCommunicationSmsProviderNotVerifiedWarning,
  allMemberCategoryList,
}: Props) => {
  const [openEmailView, setOpenEmailView] = useState(false);
  const [openInformationModal, setOpenInformationModal] = useState(false);
  const [selectedCommunication, setSelectedCommunication] =
    useState<CommunicationMessage | null>(null);
  const [selectedMailBody, setSelectedMailBody] = useState<string | null>(null);
  const [selectedMailTitle, setSelectedMailTitle] = useState<string | null>(
    null,
  );
  const { t } = useTranslation('communication');
  const classes = useStyles();

  const closeEmailView = useCallback(() => {
    setOpenEmailView(false);
  }, []);

  const closeInformationModal = useCallback(() => {
    setOpenInformationModal(false);
  }, []);

  const showCommunicationInformation = useCallback(
    (message: CommunicationMessage) => {
      setSelectedCommunication(message);
      setOpenInformationModal(true);
    },
    [],
  );

  const showEmailTemplate = useCallback((title: string, html: string) => {
    setSelectedMailTitle(title);
    setSelectedMailBody(html);
    setOpenEmailView(true);
  }, []);

  const { modalContextTitle, modalContextInformation } = useMemo(() => {
    if (!contextMember) {
      return {
        modalContextTitle: '',
        modalContextInformation: '',
      };
    }

    return {
      modalContextTitle: selectedCommunication?.channel
        ? t(`filter.choicesLabels.${selectedCommunication.channel}`)
        : '',
      modalContextInformation:
        selectedCommunication?.communication?.data?.subject || '',
    };
  }, [contextMember, selectedCommunication, t]);

  return (
    <div
      className={clsx(
        classes.messageContainer,
        'bs-communication__message__list__container',
      )}
    >
      {consentWarning && (
        <div className={classes.consentContainer}>
          <InfoGenericBox
            withCollapse
            alignItems="flex-start"
            content={consentWarning}
            type="error"
            variant="contained"
            variantIcon="outlined"
          />
        </div>
      )}
      {showMailProviderWarningContent && (
        <div className={classes.consentContainer}>
          <InfoGenericBox
            withCollapse
            alignItems="flex-start"
            content={t('mail.warningProvider')}
            type="warning"
            variant="contained"
            variantIcon="outlined"
          />
        </div>
      )}
      {showCommunicationSmsProviderNotVerifiedWarning && (
        <div className={classes.consentContainer}>
          <AlertSmsProviderSmsNotVerified />
        </div>
      )}
      <CommunicationMessageScrollableView
        currentPage={currentPage}
        fetchOnEndScroll={fetchMoreCommunicationMessages}
        hasActiveFilters={hasActiveFilters}
        loadingCommunicationMessageDataList={
          loadingCommunicationMessageDataList
        }
        messageList={messageList}
        oneToOneMessageMember={contextMember}
        scrollToBottomFlag={scrollToBottomFlag}
        showCommunicationInformation={showCommunicationInformation}
        showEmailTemplate={showEmailTemplate}
      />
      {openEmailView && (
        <HTMLPreviewDialog
          html={selectedMailBody}
          onClose={closeEmailView}
          open={openEmailView}
          title={selectedMailTitle}
        />
      )}
      {openInformationModal && (
        <CommunicationInformationModal
          allMemberCategoryList={allMemberCategoryList}
          contextInformation={modalContextInformation}
          contextMember={contextMember}
          contextTitle={modalContextTitle}
          fullScreen={fullScreen}
          handleCloseDialog={closeInformationModal}
          open={openInformationModal}
          paginationSize={paginationSize}
          selectedCommunication={selectedCommunication}
        />
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  consentContainer: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      marginLeft: theme.spacing(3),
      marginRight: theme.spacing(3),
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  },
  messageContainer: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
}));

export default React.memo(CommunicationMessageListContainer);
