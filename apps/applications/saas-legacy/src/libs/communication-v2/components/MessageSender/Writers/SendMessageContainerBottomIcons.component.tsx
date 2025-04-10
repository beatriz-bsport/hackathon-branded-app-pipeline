import React, { useCallback, useMemo } from 'react';

import { ChatThreadKinds } from '@bsport/common/lib/master-data/communication-inbox.js';

import type { Member, MemberMinimal } from '#src/libs/member/types';

import {
  getAvailableTagsFromContext,
  getAvailableTagsFromThread,
} from '#src/libs/communication-v2/utils';
import {
  WRITE_EMAIL,
  WRITE_SMS,
  WRITE_PUSH_NOTIFICATION,
} from '#src/libs/communication-v2/constants';
import BottomBarIcons from '#src/libs/communication-v2/components/MessageSender/CommunicationSendMessageBottomBarIcons.component';

type SendMessageContainerBottomIconsProps = {
  communicationKind: number;
  communicationIdentifier: number;
  directMember?: Member;
  isMessageSchedulingOpen?: boolean;
  relatedObjectKind?: ChatThreadKinds;
  tagCategories: { [tag_name: string]: string[] };
  setCommunicationKind: (kind: number) => void;
  validity: number;
  selectedMemberDetailListAllKinds: {
    email: MemberMinimal[];
    phone: MemberMinimal[];
    notification: MemberMinimal[];
  };
  selectedMemberDetailListLoading: boolean;
  onBaliseItemClick: (selectedItem: string) => void;
  openResendConfigDialog: () => void;
  openMessageSchedulingModal: () => void;
  sendMessage: () => void;
  getSelectedRecipientsCount: () => number;
  setOpenTemplateSelector: (open: boolean) => void;
  setOpenRecipientSelector: (open: boolean) => void;
  checkAndSetValidity: () => void;
};

const SendMessageContainerBottomIcons: React.FC<
  SendMessageContainerBottomIconsProps
> = ({
  communicationKind,
  communicationIdentifier,
  directMember,
  isMessageSchedulingOpen,
  relatedObjectKind,
  tagCategories,
  setCommunicationKind,
  validity,
  selectedMemberDetailListAllKinds,
  selectedMemberDetailListLoading,
  onBaliseItemClick,
  openResendConfigDialog,
  openMessageSchedulingModal,
  sendMessage,
  getSelectedRecipientsCount,
  setOpenTemplateSelector,
  setOpenRecipientSelector,
  checkAndSetValidity,
}) => {
  const onSelectTemplate = useCallback(() => {
    setOpenTemplateSelector(true);
  }, [setOpenTemplateSelector]);

  const onSelectRecipients = useCallback(() => {
    setOpenRecipientSelector(true);
  }, [setOpenRecipientSelector]);

  const setActionType = useCallback(
    (kind: number) => {
      setCommunicationKind(kind);
      checkAndSetValidity();
    },
    [setCommunicationKind, checkAndSetValidity],
  );

  const tags = useMemo(() => {
    return relatedObjectKind
      ? getAvailableTagsFromThread(tagCategories)
      : getAvailableTagsFromContext(communicationIdentifier, tagCategories);
  }, [relatedObjectKind, tagCategories, communicationIdentifier]);

  const selectedRecipientsCount = useMemo(() => {
    const count = getSelectedRecipientsCount();
    return count;
  }, [getSelectedRecipientsCount]);

  const selectedMemberDetailList = useMemo(() => {
    switch (communicationKind) {
      case WRITE_EMAIL:
        return selectedMemberDetailListAllKinds.email;
      case WRITE_SMS:
        return selectedMemberDetailListAllKinds.phone;
      case WRITE_PUSH_NOTIFICATION:
        return selectedMemberDetailListAllKinds.notification;
      default:
        return [];
    }
  }, [communicationKind, selectedMemberDetailListAllKinds]);

  return (
    <BottomBarIcons
      actionType={communicationKind}
      communicationIdentifier={communicationIdentifier}
      directMember={directMember}
      handleSelectRecipients={onSelectRecipients}
      handleSelectTemplate={onSelectTemplate}
      isInboxContext={!!relatedObjectKind}
      isMessageSchedulingOpen={isMessageSchedulingOpen}
      memberList={selectedMemberDetailList}
      memberListLoading={selectedMemberDetailListLoading}
      onBaliseItemClick={onBaliseItemClick}
      openMessageSchedulingModal={openMessageSchedulingModal}
      openResendConfigDialog={openResendConfigDialog}
      selectedRecipientsCount={selectedRecipientsCount}
      sendMessage={sendMessage}
      setActionType={setActionType}
      tags={tags}
      validity={validity}
    />
  );
};

export default React.memo(SendMessageContainerBottomIcons);
